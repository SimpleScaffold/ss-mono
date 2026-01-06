import { readdir } from 'fs/promises';
import {
  getDirname,
  resolvePath,
  readFileSafe,
  writeFileSafe,
  ensurePathExists,
  joinPath,
} from '../../../../scripts/utils/cross-platform.js';

const __dirname = getDirname(import.meta.url);

// Use resolvePath to ensure absolute paths work across platforms
const UI_DIR = resolvePath(__dirname, '../src/lib/shadcn/ui');
const INDEX_FILE = resolvePath(__dirname, '../src/index.ts');
const SRC_DIR = resolvePath(__dirname, '../src');
const PACKAGE_JSON = resolvePath(__dirname, '../package.json');

async function getComponentExports(filePath) {
  try {
    const content = await readFileSafe(filePath);
    const exportMatches = content.match(/export\s+(?:type\s+)?\{([^}]+)\}/g);
    
    if (!exportMatches) return null;
    
    const exports = [];
    for (const match of exportMatches) {
      const items = match.match(/\{([^}]+)\}/)?.[1];
      if (items) {
        const names = items.split(',').map(s => s.trim());
        exports.push(...names);
      }
    }
    
    return exports.length > 0 ? exports : null;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

async function getTypeExports(filePath) {
  try {
    const content = await readFileSafe(filePath);
    const types = [];
    
    // Match: export type { ... }
    const typeExportMatches = content.match(/export\s+type\s+\{([^}]+)\}/g);
    if (typeExportMatches) {
      for (const match of typeExportMatches) {
        const items = match.match(/\{([^}]+)\}/)?.[1];
        if (items) {
          const names = items.split(',').map(s => s.trim().split(/\s+as\s+/)[0]);
          types.push(...names);
        }
      }
    }
    
    // Match: export interface ButtonProps
    const interfaceMatches = content.match(/export\s+interface\s+(\w+)/g);
    if (interfaceMatches) {
      for (const match of interfaceMatches) {
        const name = match.match(/export\s+interface\s+(\w+)/)?.[1];
        if (name) {
          types.push(name);
        }
      }
    }
    
    return types.length > 0 ? types : null;
  } catch (error) {
    return null;
  }
}

async function updateIndexFile() {
  try {
    // Validate paths exist using cross-platform utility
    ensurePathExists(UI_DIR, 'directory');
    ensurePathExists(INDEX_FILE, 'file');
    
    const files = await readdir(UI_DIR);
    const componentFiles = files.filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
    
    console.log(`Found ${componentFiles.length} component files: ${componentFiles.join(', ')}`);
    
    const components = [];
    
    for (const file of componentFiles) {
      const filePath = joinPath(UI_DIR, file);
      const componentName = file.replace(/\.(tsx|ts)$/, '');
      
      const exports = await getComponentExports(filePath);
      const typeExports = await getTypeExports(filePath);
      
      console.log(`Processing ${componentName}: exports=${exports?.length || 0}, types=${typeExports?.length || 0}`);
      
      if (exports && exports.length > 0) {
        components.push({
          name: componentName,
          exports: exports,
          types: typeExports || []
        });
      }
    }
    
    if (components.length === 0) {
      console.warn('No components found to export');
      return;
    }
    
    // Read current index.ts with normalized line endings
    const indexContent = await readFileSafe(INDEX_FILE);
    
    // Find the shadcn components section
    const shadcnStart = indexContent.indexOf('// Common Components');
    const shadcnEnd = indexContent.indexOf('// SS Components');
    
    if (shadcnStart === -1 || shadcnEnd === -1) {
      console.error('Could not find Common Components section in index.ts');
      console.error(`shadcnStart: ${shadcnStart}, shadcnEnd: ${shadcnEnd}`);
      console.error('Make sure index.ts contains "// Common Components" and "// SS Components" markers');
      process.exit(1);
    }
    
    // Generate new exports (always use LF line endings)
    let newExports = '// Common Components\n';
    
    for (const comp of components) {
      // Export components
      if (comp.exports.length === 1) {
        newExports += `export { ${comp.exports[0]} } from './lib/shadcn/ui/${comp.name}';\n`;
      } else {
        newExports += `export {\n  ${comp.exports.join(',\n  ')},\n} from './lib/shadcn/ui/${comp.name}';\n`;
      }
      
      // Export types if any
      if (comp.types.length > 0) {
        for (const type of comp.types) {
          newExports += `export type { ${type} } from './lib/shadcn/ui/${comp.name}';\n`;
        }
      }
    }
    
    // Replace the section (include everything from start to end, including the comment)
    const before = indexContent.substring(0, shadcnStart);
    const after = indexContent.substring(shadcnEnd);
    
    const newContent = before + newExports + '\n' + after;
    
    // Write with normalized line endings (LF)
    await writeFileSafe(INDEX_FILE, newContent);
    console.log('✅ index.ts updated successfully!');
    console.log(`   Exported ${components.length} components`);
    console.log(`   Components: ${components.map(c => c.name).join(', ')}`);
    
    return components;
  } catch (error) {
    console.error('Error updating index.ts:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function createEntryPointFiles(components) {
  try {
    for (const comp of components) {
      const entryPointPath = joinPath(SRC_DIR, `${comp.name}.ts`);
      
      let content = '';
      
      // Export components
      if (comp.exports.length === 1) {
        content += `export { ${comp.exports[0]} } from './lib/shadcn/ui/${comp.name}';\n`;
      } else {
        content += `export {\n  ${comp.exports.join(',\n  ')},\n} from './lib/shadcn/ui/${comp.name}';\n`;
      }
      
      // Export types if any
      if (comp.types.length > 0) {
        content += '\n';
        for (const type of comp.types) {
          content += `export type { ${type} } from './lib/shadcn/ui/${comp.name}';\n`;
        }
      }
      
      await writeFileSafe(entryPointPath, content);
      console.log(`✅ Created entry point: ${comp.name}.ts`);
    }
  } catch (error) {
    console.error('Error creating entry point files:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function updatePackageJson(components) {
  try {
    const packageJsonContent = await readFileSafe(PACKAGE_JSON);
    const packageJson = JSON.parse(packageJsonContent);
    
    // Keep existing exports (styles, etc.)
    const existingExports = { ...packageJson.exports };
    
    // Build new exports object
    const newExports = {
      '.': existingExports['.'] || {
        import: './src/index.ts',
        types: './src/index.ts'
      }
    };
    
    // Add component exports
    for (const comp of components) {
      newExports[`./${comp.name}`] = {
        import: `./src/${comp.name}.ts`,
        types: `./src/${comp.name}.ts`
      };
    }
    
    // Add back style exports
    Object.keys(existingExports).forEach(key => {
      if (key.startsWith('./styles')) {
        newExports[key] = existingExports[key];
      }
    });
    
    packageJson.exports = newExports;
    
    // Write back with proper formatting
    const updatedContent = JSON.stringify(packageJson, null, 2) + '\n';
    await writeFileSafe(PACKAGE_JSON, updatedContent);
    console.log('✅ package.json exports updated successfully!');
  } catch (error) {
    console.error('Error updating package.json:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function main() {
  const components = await updateIndexFile();
  await createEntryPointFiles(components);
  await updatePackageJson(components);
  console.log('\n🎉 All exports updated successfully!');
}

main();


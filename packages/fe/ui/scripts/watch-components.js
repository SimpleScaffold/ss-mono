#!/usr/bin/env node

import { watch } from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  getDirname,
  resolvePath,
} from '../../../../scripts/utils/cross-platform.js';

const __dirname = getDirname(import.meta.url);
const UI_DIR = resolvePath(__dirname, '../src/lib/shadcn/ui');

let updateTimeout = null;
let isUpdating = false;

function runUpdateExports() {
  if (isUpdating) {
    return;
  }
  
  isUpdating = true;
  console.log('\n🔄 Component files changed, running update-exports...');
  
  const updateProcess = spawn('yarn', ['update-exports'], {
    stdio: 'inherit',
    shell: true,
    cwd: resolvePath(__dirname, '..')
  });
  
  updateProcess.on('close', (code) => {
    isUpdating = false;
    if (code === 0) {
      console.log('✅ Exports updated successfully!\n');
    }
  });
}

// Watch the UI directory for changes
console.log(`👀 Watching ${UI_DIR} for component changes...`);
console.log('   (Press Ctrl+C to stop)\n');

watch(UI_DIR, { recursive: false }, (eventType, filename) => {
  // Only react to new files or changes to .tsx/.ts files
  if (filename && (filename.endsWith('.tsx') || filename.endsWith('.ts'))) {
    // Debounce: wait 500ms after last change before running update
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    
    updateTimeout = setTimeout(() => {
      runUpdateExports();
    }, 500);
  }
});

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n👋 Stopping file watcher...');
  process.exit(0);
});


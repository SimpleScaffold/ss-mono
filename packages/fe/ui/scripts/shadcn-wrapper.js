#!/usr/bin/env node

import { spawn } from 'child_process';
import {
  getDirname,
  resolvePath,
} from '../../../../scripts/utils/cross-platform.js';

const __dirname = getDirname(import.meta.url);
const PACKAGE_DIR = resolvePath(__dirname, '..');

// Get all arguments except script name
const args = process.argv.slice(2);

// Check if it's an 'add' command
const isAddCommand = args[0] === 'add';

// Run shadcn command using yarn dlx
const shadcnProcess = spawn('yarn', ['dlx', 'shadcn@latest', ...args], {
  stdio: 'inherit',
  shell: true,
  cwd: PACKAGE_DIR
});

shadcnProcess.on('close', (code) => {
  // Only run update-exports if shadcn command succeeded and it was an 'add' command
  if (code === 0 && isAddCommand) {
    console.log('\n🔄 Running update-exports...');
    const updateProcess = spawn('yarn', ['update-exports'], {
      stdio: 'inherit',
      shell: true,
      cwd: PACKAGE_DIR
    });
    
    updateProcess.on('close', (updateCode) => {
      process.exit(updateCode);
    });
  } else {
    process.exit(code);
  }
});


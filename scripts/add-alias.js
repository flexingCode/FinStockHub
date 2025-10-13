#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get folder name from command line argument
const folderName = process.argv[2];

if (!folderName) {
  console.error('❌ Error: Please provide a folder name');
  console.log('Usage: npm run add-alias <foldername>');
  console.log('Example: npm run add-alias components');
  process.exit(1);
}

// Validate folder name (no special characters except underscore and dash)
if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
  console.error('❌ Error: Folder name can only contain letters, numbers, underscores and dashes');
  process.exit(1);
}

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const folderPath = path.join(srcDir, folderName);

console.log(`\n🚀 Adding alias @${folderName} pointing to src/${folderName}\n`);

// Step 1: Create folder if it doesn't exist
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
  console.log(`✅ Created folder: src/${folderName}`);
} else {
  console.log(`ℹ️  Folder already exists: src/${folderName}`);
}

// Step 2: Update tsconfig.json
const tsconfigPath = path.join(rootDir, 'tsconfig.json');
try {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  
  if (!tsconfig.compilerOptions) {
    tsconfig.compilerOptions = {};
  }
  if (!tsconfig.compilerOptions.paths) {
    tsconfig.compilerOptions.paths = {};
  }
  
  const aliasKey = `@${folderName}/*`;
  const aliasValue = [`src/${folderName}/*`];
  
  if (!tsconfig.compilerOptions.paths[aliasKey]) {
    tsconfig.compilerOptions.paths[aliasKey] = aliasValue;
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + '\n');
    console.log(`✅ Updated tsconfig.json with alias @${folderName}/*`);
  } else {
    console.log(`ℹ️  tsconfig.json already has @${folderName}/* alias`);
  }
} catch (error) {
  console.error('❌ Error updating tsconfig.json:', error.message);
  process.exit(1);
}

// Step 3: Update metro.config.js
const metroConfigPath = path.join(rootDir, 'metro.config.js');
try {
  let metroConfig = fs.readFileSync(metroConfigPath, 'utf8');
  
  // Check if alias already exists
  const aliasPattern = new RegExp(`['"]@${folderName}['"]\\s*:`);
  if (!aliasPattern.test(metroConfig)) {
    // Find the closing brace of the alias object and add before it
    const aliasRegex = /(alias:\s*\{[\s\S]*?)(\s+)(}\s*,)/;
    if (aliasRegex.test(metroConfig)) {
      // Get the indentation from the existing aliases
      const indentMatch = metroConfig.match(/alias:\s*\{[\s\S]*?(\s+)['"]@/);
      const indent = indentMatch ? indentMatch[1] : '      ';
      
      metroConfig = metroConfig.replace(
        aliasRegex,
        `$1${indent}'@${folderName}': path.resolve(__dirname, 'src/${folderName}'),\n$2$3`
      );
      fs.writeFileSync(metroConfigPath, metroConfig);
      console.log(`✅ Updated metro.config.js with alias @${folderName}`);
    } else {
      console.warn('⚠️  Could not find alias section in metro.config.js');
    }
  } else {
    console.log(`ℹ️  metro.config.js already has @${folderName} alias`);
  }
} catch (error) {
  console.error('❌ Error updating metro.config.js:', error.message);
  process.exit(1);
}

// Step 4: Update babel.config.js
const babelConfigPath = path.join(rootDir, 'babel.config.js');
try {
  let babelConfig = fs.readFileSync(babelConfigPath, 'utf8');
  
  // Check if alias already exists
  const aliasPattern = new RegExp(`['"]@${folderName}['"]\\s*:`);
  if (!aliasPattern.test(babelConfig)) {
    // Find the last alias entry and add after it
    // This regex finds the alias object and captures content up to the closing brace
    const aliasRegex = /(alias:\s*\{[\s\S]*?['"][^'"]+['"]\s*:\s*['"][^'"]+['"])(\s*)(,?)(\s*)(}\s*,)/;
    if (aliasRegex.test(babelConfig)) {
      babelConfig = babelConfig.replace(
        aliasRegex,
        `$1,\n        '@${folderName}': './src/${folderName}'$4$5`
      );
      fs.writeFileSync(babelConfigPath, babelConfig);
      console.log(`✅ Updated babel.config.js with alias @${folderName}`);
    } else {
      console.warn('⚠️  Could not find alias section in babel.config.js');
    }
  } else {
    console.log(`ℹ️  babel.config.js already has @${folderName} alias`);
  }
} catch (error) {
  console.error('❌ Error updating babel.config.js:', error.message);
  process.exit(1);
}

console.log('\n✨ Done! You can now use:');
console.log(`   import something from '@${folderName}/something';\n`);
console.log('💡 Remember to restart Metro bundler and rebuild your app!\n');


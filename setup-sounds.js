#!/usr/bin/env node

/**
 * Sound Files Setup Script for ClassMate.info
 * 
 * This script provides instructions and checks for sound files.
 * Due to Pixabay's download restrictions, files must be downloaded manually.
 */

const fs = require('fs');
const path = require('path');

const soundsDir = path.join(__dirname, 'public', 'sounds');
const requiredFiles = [
  'bell-soft.mp3',
  'page-turn.mp3',
  'chalk-tap.mp3',
  'success-chime.mp3'
];

const downloadLinks = {
  'bell-soft.mp3': 'https://pixabay.com/sound-effects/school-bell-87744/',
  'page-turn.mp3': 'https://pixabay.com/sound-effects/pageturn-83801/',
  'success-chime.mp3': 'https://pixabay.com/sound-effects/success-1-6297/',
  'chalk-tap.mp3': 'https://pixabay.com/sound-effects/button-124476/'
};

console.log('\n🎵 ClassMate Sound Files Setup\n');
console.log('================================\n');

// Ensure sounds directory exists
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
  console.log('✅ Created public/sounds/ directory\n');
}

// Check which files are present
console.log('Checking for sound files...\n');

let allPresent = true;
const missingFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(soundsDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} - Found (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allPresent = false;
    missingFiles.push(file);
  }
});

console.log('\n');

if (allPresent) {
  console.log('🎉 All sound files are present!\n');
  console.log('✅ Sounds are ready to use');
  console.log('💡 Enable "Sound Effects" in the Settings panel\n');
} else {
  console.log('⚠️  Missing sound files detected\n');
  console.log('📥 Please download the following files:\n');
  
  missingFiles.forEach(file => {
    console.log(`   ${file}`);
    console.log(`   → ${downloadLinks[file]}`);
    console.log(`   → Click "Download" button`);
    console.log(`   → Save to: public/sounds/${file}\n`);
  });
  
  console.log('📖 For detailed instructions, see:');
  console.log('   SOUND_FILES_DOWNLOAD_INSTRUCTIONS.md\n');
  console.log('💡 Quick steps:');
  console.log('   1. Open each URL in your browser');
  console.log('   2. Click the green "Download" button');
  console.log('   3. Rename and move to public/sounds/');
  console.log('   4. Run this script again to verify\n');
}

console.log('After adding files, restart your dev server:');
console.log('  npm run dev\n');

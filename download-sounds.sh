#!/bin/bash

# Sound Files Download Script for ClassMate.info
# This script helps you download free sound effects from Pixabay

echo "🎵 ClassMate Sound Files Setup"
echo "================================"
echo ""
echo "This script will guide you through downloading sound files."
echo "All sounds are from Pixabay (royalty-free, no attribution required)"
echo ""

# Create sounds directory if it doesn't exist
mkdir -p public/sounds

echo "📥 Please download the following files manually:"
echo ""
echo "1. School Bell Sound (bell-soft.mp3)"
echo "   URL: https://pixabay.com/sound-effects/school-bell-87744/"
echo "   → Click 'Download' button"
echo "   → Save to: public/sounds/bell-soft.mp3"
echo ""

echo "2. Page Turn Sound (page-turn.mp3)"
echo "   URL: https://pixabay.com/sound-effects/pageturn-83801/"
echo "   → Click 'Download' button"
echo "   → Save to: public/sounds/page-turn.mp3"
echo ""

echo "3. Success Chime (success-chime.mp3)"
echo "   URL: https://pixabay.com/sound-effects/success-1-6297/"
echo "   → Click 'Download' button"
echo "   → Save to: public/sounds/success-chime.mp3"
echo ""

echo "4. Chalk Tap/Click (chalk-tap.mp3)"
echo "   URL: https://pixabay.com/sound-effects/button-124476/"
echo "   → Click 'Download' button"
echo "   → Save to: public/sounds/chalk-tap.mp3"
echo ""

echo "💡 TIP: Open each URL in your browser, click the green 'Download' button,"
echo "   then move the downloaded file to public/sounds/ with the correct name."
echo ""

# Check if files exist
echo "Checking for sound files..."
echo ""

files=("bell-soft.mp3" "page-turn.mp3" "chalk-tap.mp3" "success-chime.mp3")
all_present=true

for file in "${files[@]}"; do
  if [ -f "public/sounds/$file" ]; then
    echo "✅ $file - Found"
  else
    echo "❌ $file - Missing"
    all_present=false
  fi
done

echo ""

if [ "$all_present" = true ]; then
  echo "🎉 All sound files are present!"
  echo "✅ You can now enable sounds in the Settings panel"
else
  echo "⚠️  Some sound files are missing"
  echo "📖 See SOUND_FILES_DOWNLOAD_INSTRUCTIONS.md for detailed steps"
fi

echo ""
echo "After adding all files, restart your dev server:"
echo "  npm run dev"
echo ""

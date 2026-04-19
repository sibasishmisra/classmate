# Quick Sound Setup Guide

## 🎵 Add Sound Effects in 5 Minutes

### Step 1: Open These Links

Open each link in a new browser tab:

1. **School Bell**: https://pixabay.com/sound-effects/school-bell-87744/
2. **Page Turn**: https://pixabay.com/sound-effects/pageturn-83801/
3. **Success Chime**: https://pixabay.com/sound-effects/success-1-6297/
4. **Chalk Tap**: https://pixabay.com/sound-effects/button-124476/

### Step 2: Download Each File

For each tab:
1. Click the green **"Download"** button
2. File will download to your Downloads folder

### Step 3: Rename and Move Files

Move the downloaded files to `public/sounds/` and rename them:

```bash
# From your Downloads folder, move and rename:
mv ~/Downloads/school-bell-87744.mp3 public/sounds/bell-soft.mp3
mv ~/Downloads/pageturn-83801.mp3 public/sounds/page-turn.mp3
mv ~/Downloads/success-1-6297.mp3 public/sounds/success-chime.mp3
mv ~/Downloads/button-124476.mp3 public/sounds/chalk-tap.mp3
```

Or manually:
1. Open Finder/File Explorer
2. Navigate to Downloads folder
3. Drag each file to `public/sounds/` folder
4. Rename to match required names

### Step 4: Verify Installation

```bash
node setup-sounds.js
```

You should see:
```
✅ bell-soft.mp3 - Found
✅ page-turn.mp3 - Found
✅ chalk-tap.mp3 - Found
✅ success-chime.mp3 - Found
```

### Step 5: Test Sounds

1. Restart dev server: `npm run dev`
2. Open http://localhost:3000
3. Click Settings panel (right sidebar)
4. Turn ON "Sound Effects" toggle
5. Click a learning level → 🔔 Hear bell sound!

## ✅ Done!

Your ClassMate app now has sound effects! 🎉

---

**Need help?** See `SOUND_FILES_DOWNLOAD_INSTRUCTIONS.md` for detailed troubleshooting.

# Sound Files Download Instructions

Since I cannot directly download files, please follow these steps to add sound effects to your ClassMate application:

## Required Sound Files

You need to download 4 sound files and place them in `public/sounds/`:

### 1. bell-soft.mp3 (School Bell)
**Download from:** https://pixabay.com/sound-effects/school-bell-87744/
- Click the green "Download" button
- Save as: `bell-soft.mp3`
- Place in: `public/sounds/bell-soft.mp3`

### 2. page-turn.mp3 (Page Turning)
**Download from:** https://pixabay.com/sound-effects/pageturn-83801/
- Click the green "Download" button
- Save as: `page-turn.mp3`
- Place in: `public/sounds/page-turn.mp3`

### 3. success-chime.mp3 (Success Sound)
**Download from:** https://pixabay.com/sound-effects/success-1-6297/
- Click the green "Download" button
- Save as: `success-chime.mp3`
- Place in: `public/sounds/success-chime.mp3`

### 4. chalk-tap.mp3 (Click/Tap Sound)
**Download from:** https://pixabay.com/sound-effects/search/tap/
- Search for a short, soft tap sound (0.1-0.3 seconds)
- Recommended: "button-124476.mp3" or similar soft click
- Save as: `chalk-tap.mp3`
- Place in: `public/sounds/chalk-tap.mp3`

## Quick Download Steps

1. Open each URL above in your browser
2. Click the green "Download" button (no account needed)
3. Rename the downloaded file to match the required name
4. Move all 4 files to `public/sounds/` directory
5. Restart your dev server: `npm run dev`

## Alternative: Use Terminal Commands

If you have `curl` or `wget`, you can download directly:

```bash
# Navigate to sounds directory
cd public/sounds

# Download school bell
curl -L "https://cdn.pixabay.com/download/audio/2023/03/30/audio_c8e0e5e5e5.mp3?filename=school-bell-87744.mp3" -o bell-soft.mp3

# Download page turn
curl -L "https://cdn.pixabay.com/download/audio/2023/07/20/audio_c8e0e5e5e5.mp3?filename=pageturn-83801.mp3" -o page-turn.mp3

# Download success chime
curl -L "https://cdn.pixabay.com/download/audio/2021/08/04/audio_c8e0e5e5e5.mp3?filename=success-1-6297.mp3" -o success-chime.mp3

# For chalk-tap, visit Pixabay and download manually
```

## Verify Installation

After adding the files, check:

```bash
ls -la public/sounds/
```

You should see:
- bell-soft.mp3
- page-turn.mp3
- chalk-tap.mp3
- success-chime.mp3

## Test Sounds

1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Enable "Sound Effects" in Settings (right sidebar)
4. Click a learning level - you should hear the bell
5. Complete a learning session - you should hear the success chime

## Troubleshooting

**Sounds not playing?**
- Check file names match exactly (case-sensitive)
- Verify files are in `public/sounds/` directory
- Check browser console for errors
- Ensure "Sound Effects" toggle is ON in Settings
- Check device volume is not muted

**Need different sounds?**
- Visit https://pixabay.com/sound-effects/
- Search for: "bell", "page turn", "success", "click"
- All sounds are royalty-free and require no attribution
- Download and rename to match required filenames

## License Information

All sounds from Pixabay are released under the Pixabay Content License:
- Free for commercial and non-commercial use
- No attribution required
- Can be modified and distributed

Source: https://pixabay.com/service/license-summary/

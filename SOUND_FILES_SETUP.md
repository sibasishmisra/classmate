# Sound Files Setup Guide

## Current Status
⚠️ Sound files are **not included** in the repository. The sound toggle in Settings will work, but no sounds will play until you add audio files.

## Required Sound Files

Place these files in the `public/sounds/` directory:

1. **bell-soft.mp3** - Gentle school bell sound (plays when selecting a level)
2. **page-turn.mp3** - Page turning sound (for transitions)
3. **chalk-tap.mp3** - Chalk tapping sound (for interactions)
4. **success-chime.mp3** - Success celebration sound (after completing follow-up questions)

## File Specifications

- **Format**: MP3 (recommended) or WAV
- **Duration**: 0.5-2 seconds each
- **Volume**: Normalized to -3dB to -6dB
- **Sample Rate**: 44.1kHz or 48kHz
- **Bit Rate**: 128kbps or higher

## Where to Find Sound Effects

### Free Resources:
1. **Freesound.org** - https://freesound.org/
   - Search for: "school bell", "page turn", "chalk", "success chime"
   - Filter by: Creative Commons licenses

2. **Zapsplat.com** - https://www.zapsplat.com/
   - Free sound effects library
   - Requires free account

3. **Pixabay** - https://pixabay.com/sound-effects/
   - Royalty-free sound effects
   - No attribution required

### Recommended Search Terms:
- **bell-soft**: "school bell soft", "gentle bell", "notification bell"
- **page-turn**: "paper flip", "book page", "page turn"
- **chalk-tap**: "chalk board", "tap", "click soft"
- **success-chime**: "success", "achievement", "positive chime"

## Installation Steps

1. Download or create the 4 sound files
2. Rename them to match the required names above
3. Place them in `public/sounds/` directory:
   ```
   public/
   └── sounds/
       ├── bell-soft.mp3
       ├── page-turn.mp3
       ├── chalk-tap.mp3
       └── success-chime.mp3
   ```
4. Restart the development server
5. Test sounds by toggling the "Sound Effects" setting

## Testing Sounds

1. Go to http://localhost:3000
2. Open the Settings panel (right sidebar)
3. Make sure "Sound Effects" is ON (green toggle)
4. Click on a learning level - you should hear the bell sound
5. Complete a learning session to hear the success chime

## Troubleshooting

**No sound playing?**
- Check browser console for errors like "Sound not found: bell-soft"
- Verify files are in the correct directory
- Check file names match exactly (case-sensitive)
- Ensure your browser allows audio playback
- Check device volume is not muted

**Sounds too loud/quiet?**
- Adjust the volume in `lib/sound-manager.ts`
- Look for the `volume` property in the sound definitions

## Optional: Disable Sounds Completely

If you don't want to add sound files, the app will work fine without them. Users can toggle sounds off in Settings, and the app will gracefully handle missing sound files.

The sound manager logs warnings to console but doesn't break functionality:
```
Sound not found: bell-soft
```

This is expected behavior when sound files are missing.

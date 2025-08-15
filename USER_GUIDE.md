# 🚀 Quick Start Guide - Auto Wi-Fi Login Extension

## What you need:
- Chrome browser
- The extension files (all 8 files in this folder)

## Step-by-step installation:

### 1. Get the files
- Download .zip file in your computer
- Extract the folder

### 2. Install in Chrome
1. Open Chrome browser
2. Type `chrome://extensions/` in the address bar or directly clic on extentions (at right of the address bar) and click on 'manage extensions'
3. Turn ON "Developer mode" (switch in top-right corner)
4. Click "Load unpacked" button
5. Select the folder with all the extension files
6. ✅ Extension installed! You'll see the icon in your toolbar

### 3. Set up your login
1. Click the extension icon in Chrome toolbar
2. Enter your Wi-Fi username and password
3. Click "Save"
4. Click the checkbox only if you want the extension in all your devices.
5. Click on "Run Now"
6. ✅ Ready to use!

## How to use:

1. **Connect to Wi-Fi** that requires login (hotel, cafe, etc.)
2. **Wait** - Extension automatically detects login pages
3. **Done!** - You're logged in automatically

### Manual check:
- Click extension icon → "Run Now" if you want to check immediately

## What files do:
- `manifest.json` - Tells Chrome what the extension does
- `background.js` - Checks for Wi-Fi login pages
- `content_script.js` - Fills in login forms
- `popup.html` & `popup.js` - Settings window
- `auto_wifi_icon_48x48.png` - Extension icon
- `LICENSE` - Legal stuff
- `README.md` - This guide

## ⚠️ Important:
- Only use on Wi-Fi networks you're allowed to use
- Your password is stored safely in Chrome (but not encrypted)
- Works on most common Wi-Fi login pages

That's it! Simple automatic Wi-Fi login 🎉

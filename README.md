# Auto Wi-Fi Login Chrome Extension

A simple Chrome extension that automatically detects captive portals and logs you in using your saved credentials.

## What it does
- Automatically detects when you connect to Wi-Fi networks with login pages (captive portals)
- Uses your saved username and password to log in automatically
- Runs in the background and checks every 3 hours
- Works on most common Wi-Fi login pages (hotels, cafes, public Wi-Fi, etc.)

## How to install

1. **Download the extension**
   - Download all the files in this folder
   - Keep them all together in one folder

2. **Install in Chrome**
   - Open Chrome browser
   - Go to `chrome://extensions/`
   - Turn on "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the folder containing these files
   - The extension icon will appear in your toolbar

## How to use

1. **Set your credentials**
   - Click the extension icon in Chrome toolbar
   - Enter your Wi-Fi username and password
   - Click "Save"
   - Click the checkbox only if you want the extension in all your devices.
   - Click "Run Now"

2. **Connect to Wi-Fi**
   - Connect to any Wi-Fi network that requires login
   - The extension will automatically detect the login page and fill in your credentials
   - You'll be logged in automatically!

3. **Manual check**
   - If needed, click the extension icon and press "Run Now" to check immediately

## Important notes
- Your credentials are stored securely in Chrome (not in encrypted format)
- Only works on networks that redirect to a login page
- Make sure to respect your network's terms of service
- Test it first on networks you're allowed to use
- The attempt to login will fail if you are already logged in

## Files included
- `manifest.json` - Extension configuration
- `background.js` - Main extension logic
- `content_script.js` - Handles login forms
- `popup.html` - Settings interface
- `popup.js` - Settings functionality
- `auto_wifi_icon_48x48.png` - Extension icon
- `LICENSE` - MIT License

That's it! Simple automatic Wi-Fi login for Chrome.

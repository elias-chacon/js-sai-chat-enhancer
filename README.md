# SAI Chat Enhancer

A powerful userscript that enhances the SAI Library chat interface with improved layout, resizing capabilities, and convenient copy functionality.

## Overview

The SAI Chat Enhancer is a userscript designed to improve the user experience of the SAI Library chat interface. It automatically resizes chat elements to 80% of the viewport width, centers all message containers, repositions UI elements for better alignment, and adds convenient copy buttons to assistant messages with automatic HTML-to-Markdown conversion.

### Key Features

- **Automatic Resizing**: Resizes chat input fields and message containers to 80% of viewport width
- **Smart Centering**: Centers all chat elements for better visual alignment
- **Copy to Markdown**: Adds copy buttons to assistant messages with automatic HTML-to-Markdown conversion
- **Button Management**: Automatically moves reset buttons to appropriate button groups
- **Responsive Design**: Adapts to window resizing and dynamically loaded content
- **Real-time DOM Monitoring**: Uses MutationObserver to handle dynamically added content

## Installation

### For Violentmonkey (Recommended)

1. Install the [Violentmonkey browser extension](https://violentmonkey.github.io/)
2. Download the script file: `js-sai-chat-enhancer.js`
3. Open Violentmonkey dashboard
4. Click the "+" button to create a new script
5. Copy and paste the entire script content
6. Save the script (Ctrl+S)
7. Make sure the script is enabled

### For Greasemonkey (Firefox)

1. Install the [Greasemonkey extension](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
2. Download the script file: `js-sai-chat-enhancer.js`
3. Open Greasemonkey menu
4. Select "New user script"
5. Copy and paste the script content
6. Save and enable the script

### For Tampermonkey

1. Install the [Tampermonkey extension](https://www.tampermonkey.net/)
2. Download the script file: `js-sai-chat-enhancer.js`
3. Open Tampermonkey dashboard
4. Click "Create a new script"
5. Replace the default content with the script code
6. Save the script (Ctrl+S)

### Manual Installation

1. Copy the raw script content from `js-sai-chat-enhancer.js`
2. Open your userscript manager
3. Create a new script
4. Paste the content and save

## Usage

Once installed, the script works automatically when you visit the SAI Library chat interface (`https://sai-library.saiapplications.com/free-chat*`).

### Automatic Features

- **Layout Enhancement**: Chat elements are automatically resized and centered
- **Responsive Behavior**: Layout adjusts when you resize your browser window
- **Dynamic Content**: New messages and UI elements are automatically processed

### Copy Functionality

- Look for the copy button (📋 icon) next to assistant messages
- Click the button to copy the message content in Markdown format
- The button will show a checkmark (✓) when successfully copied
- Copied content includes proper Markdown formatting for code blocks, links, lists, etc.

### Supported Elements

The script enhances the following elements:
- `.chat-message-input` - Main chat input field
- `.user-message__messages` - User message containers
- `.assistant-message__response` - Assistant response containers
- `.assistant-message__container` - Assistant message wrappers
- `.user-message__container` - User message wrappers

## Configuration

The script includes several configurable parameters:

- **Viewport Width**: Set to 80% by default (can be modified in the code)
- **Minimum Width**: 300px minimum width for usability
- **Element Detection**: Automatic retry attempts for dynamically loaded content
- **Copy Format**: HTML-to-Markdown conversion with support for code blocks, links, and formatting

## Browser Compatibility

- ✅ Chrome/Chromium (with Violentmonkey/Tampermonkey)
- ✅ Firefox (with Greasemonkey/Violentmonkey/Tampermonkey)
- ✅ Edge (with Tampermonkey)
- ✅ Safari (with Userscripts)

## Troubleshooting

### Script Not Working
- Ensure your userscript manager is enabled
- Check that the script is active in your userscript manager
- Verify you're on the correct URL (`https://sai-library.saiapplications.com/free-chat*`)
- Try refreshing the page

### Copy Function Not Working
- Ensure your browser supports the Clipboard API
- Check that the site has permission to access the clipboard
- Try clicking the copy button again

### Layout Issues
- Try refreshing the page
- Check browser console for any error messages
- Ensure no other extensions are conflicting

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this script.

## License

This project is licensed under the GNU General Public License v3.0. Feel free to use and modify it!

See the [LICENSE](LICENSE) file for details.

**Note**: This userscript is designed specifically for the SAI Library chat interface and may not work on other websites.
```

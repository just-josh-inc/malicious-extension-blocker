# ExtensionChecker

A React component that detects unwanted Chrome extensions and displays warnings in various UI formats. It helps ensure specific browser extensions do not interfere with your application.

## Overview

Many Chrome extensions inject scripts, modify the DOM, or interfere with network requests in ways that can disrupt your application. **ExtensionChecker** identifies these unwanted extensions and provides a user-facing warning or block message to improve user experience and application reliability.

## Features

- Detects specific Chrome extensions by checking for known files.
- Provides warnings in multiple UI modes: alert, banner, modal, or block.
- Supports automatic re-checking at configurable intervals.
- Fires a callback with the list of detected unwanted extensions.
- Offers extensive customization for styling and behavior.



## How It Works

1. **Target Extensions**  
   The component maintains an internal list of target Chrome extensions. Each extension is identified by its ID, a known file path, and a display name.

2. **Detection**  
   For each extension, the component tries to fetch a known file using the `chrome-extension://` protocol. If the fetch succeeds, the extension is considered installed.

3. **Comparison**  
   The detected extensions are compared against the provided list of unwanted extensions. If there is a match, the component triggers a warning in the specified display mode.

4. **Display Modes**  
   The component supports four warning modes:
   - Alert: A small dismissable notification.
   - Banner: A persistent message near the bottom of the screen.
   - Modal: A full-screen overlay with a centered message.
   - Block: A complete screen block that prevents interaction.

5. **Repeat Checks**  
   Optionally, the component can re-check for extensions at regular intervals.



## Customization Options

- **Styling**: Customize the appearance using inline styles or additional CSS classes.
- **Extensions**: Modify or extend the list of target extensions to detect other specific browser extensions.
- **Behavior**: Configure display modes, automatic hiding, and intervals to suit your application's needs.

## API Reference

| Prop                 | Type                             | Default                             | Description                                                                                                                                                                                                                                        |
|----------------------|----------------------------------|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `unwantedExtensions` | `string[]`                       | **(required)**                      | A list of unwanted extension names to detect. These names must match the internal list of target extensions.                                                                                                                                        |
| `title`              | `string`                         | `"Unwanted Extensions Detected"`    | The title displayed in the warning.                                                                                                                                                                                                              |
| `description`        | `string`                         | `"The following browser extensions may interfere with this application:"` | A detailed description displayed below the title explaining the issue to the user.                                                                                                                                                                |
| `onDetect`           | `(detected: string[]) => void`   | `undefined`                         | A callback function triggered when one or more unwanted extensions are detected. It receives an array of detected extension names.                                                                                                                 |
| `displayMode`        | `"alert" \| "banner" \| "modal" \| "block"` | `"alert"`   | Specifies how the warning is displayed. Options include: `alert` (small dismissable box), `banner` (persistent message near the bottom-right), `modal` (centered overlay), or `block` (full-screen blocking overlay).                              |
| `autoHideDuration`   | `number \| undefined`            | `undefined`                         | Duration in milliseconds before the warning is automatically hidden. Applies only to `alert`, `banner`, or `modal` modes.                                                                                                                         |
| `customStyles`       | `React.CSSProperties`            | `undefined`                         | Custom inline styles for the alert, banner, modal, or block overlay.                                                                                                                                                                              |
| `checkInterval`      | `number`                         | `0`                                 | Interval in milliseconds for periodic re-checking of extensions. If `0`, the component checks only once on mount.                                                                                                                                 |
| `className`          | `string`                         | `""`                                | Additional CSS classes for styling the component.                                                                                                                                                                                                 |



## FAQ

**1. Does this work in browsers other than Chrome?**  
No. This component relies on the `chrome-extension://` protocol, which is specific to Chrome-based(Chromium) browsers.

**2. Will it detect extensions in Incognito mode?**  
Yes, but only if the extensions are explicitly allowed in Incognito mode by the user.

**3. Can this block or disable extensions?**  
No. The component only detects and notifies about unwanted extensions. It does not have the capability to block or uninstall them.

**4. What happens if an extension updates and changes its file structure?**  
The detection for that extension may fail. Ensure that the file paths for extensions in the internal list are updated if their structure changes.



## License

This component is open-source and available under the MIT License.

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

### Target Extensions

The component maintains an internal list of target Chrome extensions. Each extension is identified by its ID, a known file path, and a display name.

### Detection

For each extension, the component tries to fetch a known file using the `chrome-extension://` protocol. If the fetch succeeds, the extension is considered installed.

### Comparison

The detected extensions are compared against the provided list of unwanted extensions. If there is a match, the component triggers a warning in the specified display mode.

## Display Modes

**The component supports four modes:**

1. **Alert**  
   A small dismissable notification.

2. **Banner**  
   A persistent message near the bottom of the screen that is dismissable.

3. **Modal**  
   A full-screen overlay with a centered message that is dismissable.

4. **Block**  
   A complete screen block that prevents interaction. **Not dismissable**.

### Repeat Checks

Optionally, the component can re-check for extensions at regular intervals.

## Customization Options

- **Styling**: Customize the appearance using inline styles or additional CSS classes.
- **Extensions**: Modify or extend the list of target extensions to detect other specific browser extensions.
- **Behavior**: Configure display modes, automatic hiding, and intervals to suit your application's needs.

## API Reference

| Prop                   | Type                                                    | Required (Depends on displayMode) | Description                                                                                                                                                                                |
| ---------------------- | ------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **displayMode**        | `"silent" \| "alert" \| "banner" \| "modal" \| "block"` | Yes                               | Determines the behavior of the component: <br> - `"silent"`: No UI, relies on **onDetect** callback. <br> - `"alert"`, `"banner"`, `"modal"`, `"block"`: Displays a warning (or block) UI. |
| **onDetect**           | `(detected: string[]) => void`                          | Yes, when `displayMode: "silent"` | A callback function triggered when one or more unwanted extensions are detected. Required for `"silent"` mode, optional for other modes.                                                   |
| **unwantedExtensions** | `string[]`                                              | Yes                               | A list of unwanted extensions to detect. Each extension name must match the name field in the internal `targetExtensions` array.                                                           |
| **title**              | `string`                                                | No                                | The title to display in the warning UI. Optional for all modes.                                                                                                                            |
| **description**        | `string`                                                | No                                | The description text displayed below the title in the warning UI. Optional for all modes.                                                                                                  |
| **autoHideDuration**   | `number`                                                | No                                | Duration in milliseconds after which the alert/banner/modal is automatically hidden. Does not apply to `"block"` mode or `"silent"` mode.                                                  |
| **customStyles**       | `React.CSSProperties`                                   | No                                | Custom inline styles for the warning container.                                                                                                                                            |
| **checkInterval**      | `number`                                                | No                                | Interval in milliseconds for periodic re-checking of unwanted extensions.                                                                                                                  |
| **className**          | `string`                                                | No                                | Additional CSS class names for styling purposes.                                                                                                                                           |

## FAQ

1. **Does this work in browsers other than Chrome?**  
   No. This component relies on the `chrome-extension://` protocol, which is specific to Chrome-based (Chromium) browsers.

2. **Will it detect extensions in Incognito mode?**  
   Yes, but only if the extensions are explicitly allowed in Incognito mode by the user.

3. **Can this block or disable extensions?**  
   No. The component only detects and notifies about unwanted extensions. It does not have the capability to block or uninstall them.

4. **What happens if an extension updates and changes its file structure?**  
   The detection for that extension may fail. Ensure that the file paths for extensions in the internal list are updated if their structure changes.

## License

This component is open-source and available under the MIT License.

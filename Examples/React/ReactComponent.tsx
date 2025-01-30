import React, { useCallback, useEffect, useState } from "react";

/**
 * A simple function that tries to fetch a known file from each extension’s ID.
 * If the fetch succeeds (status 200), we consider that extension "installed."
 * Returns an array of installed extension names.
 */
async function checkExtensions(
  targetExtensions: Extension[]
): Promise<string[]> {
  if (typeof window === "undefined") return [];

  const results = await Promise.all(
    targetExtensions.map(async ({ id, file, name }) => {
      const url = `chrome-extension://${id}/${file}`;
      try {
        const response = await fetch(url);
        return response.ok ? name : null;
      } catch (err) {
        // Possibly a 404 or CORS error => extension not installed/inaccessible
        return null;
      }
    })
  );

  // Filter out null values, returning only installed extension names
  return results.filter((res): res is string => res !== null);
}

// Each Extension object must include a Chrome extension ID, file path, and display name
export interface Extension {
  id: string;
  file: string;
  name: string;
  identifier: string;
}

/**
 * Props for the `ExtensionChecker` component.
 * Uses a discriminated union based on the `displayMode` property.
 */
export type ExtensionCheckerProps =
  | {
      /**
       * When `displayMode` is `"silent"`, the component will not display any UI.
       * Instead, it will rely on the `onDetect` callback to handle detected extensions.
       */
      displayMode: "silent";

      /**
       * A callback function triggered when one or more unwanted extensions are detected.
       * Required when `displayMode` is `"silent"`.
       */
      onDetect: (detected: string[]) => void;

      /**
       * A list of unwanted extensions to detect. Each extension name must match
       * the `name` field in the internal `targetExtensions` array.
       */
      unwantedExtensions: string[];

      /**
       * Optional title for consistency, though it won't be displayed in "silent" mode.
       */
      title?: string;

      /**
       * Optional description for consistency, though it won't be displayed in "silent" mode.
       */
      description?: string;

      /**
       * Duration (in milliseconds) after which the alert/banner/modal is automatically hidden.
       * This does not apply to `"block"` mode.
       */
      autoHideDuration?: number;

      /**
       * Custom inline styles for the warning container.
       */
      customStyles?: React.CSSProperties;

      /**
       * Interval in milliseconds for periodic re-checking.
       */
      checkInterval?: number;

      /**
       * Additional CSS class names for styling purposes.
       */
      className?: string;
    }
  | {
      /**
       * When `displayMode` is not `"silent"`, the component will display a UI
       * warning based on the selected mode: `"alert"`, `"banner"`, `"modal"`, or `"block"`.
       */
      displayMode: "alert" | "banner" | "modal" | "block";

      /**
       * A callback function triggered when one or more unwanted extensions are detected.
       * Optional when `displayMode` is not `"silent"`.
       */
      onDetect?: (detected: string[]) => void;

      /**
       * A list of unwanted extensions to detect. Each extension name must match
       * the `name` field in the internal `targetExtensions` array.
       */
      unwantedExtensions: string[];

      /**
       * The title to display in the warning.
       */
      title?: string;

      /**
       * The description text displayed under the title.
       */
      description?: string;

      /**
       * Duration (in milliseconds) after which the alert/banner/modal is automatically hidden.
       * This does not apply to `"block"` mode.
       */
      autoHideDuration?: number;

      /**
       * Custom inline styles for the warning container.
       */
      customStyles?: React.CSSProperties;

      /**
       * Interval in milliseconds for periodic re-checking.
       */
      checkInterval?: number;

      /**
       * Additional CSS class names for styling purposes.
       */
      className?: string;
    };

/**
 * Internal list of target Chrome extensions to check.
 * You can customize or extend this list as needed.
 */
const targetExtensions: Extension[] = [
  {
    id: "bmnlcjabgnpnenekpadlanbbkooimhnj",
    name: "PayPal Honey",
    file: "checkoutPaypal/merchantSPBContent.js",
    identifier: "honey",
  },
  // Add more extensions here...
];

/**
 * A component that checks for the presence of unwanted extensions and displays
 * a warning (alert, banner, modal, or block) if any are detected.
 */

export function ExtensionChecker({
  unwantedExtensions,
  title = "PayPal Honey - Browser Plugin Detected",
  description = "We've detected the use of PayPal Honey - Browser Plugin. Using such a plugin denies us the ability to earn revenue for the advice we give. We would appreciate it if you would disable it and not use it at any eCommerce site that we have links to.",
  onDetect,
  displayMode = "alert", // Default display mode
  autoHideDuration,
  customStyles,
  checkInterval = 0,
  className = "",
}: ExtensionCheckerProps) {
  const [checkingExtensions, setCheckingExtensions] = useState(false);
  const [installedExtensions, setInstalledExtensions] = useState<string[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [hasShownMessage, setHasShownMessage] = useState(false);

  const checkAllExtensions = useCallback(async () => {
    if (typeof window === "undefined" || hasShownMessage) return;

    setCheckingExtensions(true);

    const installed = await checkExtensions(targetExtensions);
    setInstalledExtensions(installed);
    setCheckingExtensions(false);

    // Find any installed extensions that match the user's unwanted list
    const detectedUnwanted = installed.filter((ext) =>
      unwantedExtensions.includes(ext)
    );

    // If we found any unwanted extensions, show the warning once
    if (detectedUnwanted.length > 0) {
      setShowMessage(true);
      setHasShownMessage(true);
      if (onDetect) {
        onDetect(detectedUnwanted);
      }
    }
  }, [unwantedExtensions, onDetect, hasShownMessage]);

  useEffect(() => {
    checkAllExtensions();

    if (checkInterval > 0) {
      const intervalId = setInterval(checkAllExtensions, checkInterval);
      return () => clearInterval(intervalId);
    }
  }, [checkAllExtensions, checkInterval]);

  // Auto-hide for alert/banner/modal (not block)
  useEffect(() => {
    if (autoHideDuration && showMessage && displayMode !== "block") {
      const timeoutId = setTimeout(
        () => setShowMessage(false),
        autoHideDuration
      );
      return () => clearTimeout(timeoutId);
    }
  }, [autoHideDuration, showMessage, displayMode]);

  // Filter installed to get the unwanted ones
  const detectedUnwantedExtensions = installedExtensions.filter((ext) =>
    unwantedExtensions.includes(ext)
  );

  // If still checking, or no unwanted extensions, or not showing message => render nothing
  if (
    checkingExtensions ||
    !showMessage ||
    detectedUnwantedExtensions.length === 0
  ) {
    return null;
  }

  /**
   * Common content for any display mode
   */
  const renderContent = () => (
    <div style={{ position: "relative" }}>
      <h2 style={{ fontSize: "1.125rem", fontWeight: 600, margin: 0 }}>
        {title}
      </h2>
      <p style={{ marginTop: "0.5rem", marginBottom: 0, color: "#000" }}>
        {description}
      </p>
      <ul
        style={{
          marginTop: "0.5rem",
          listStyleType: "disc",
          paddingLeft: "1.5rem",
          color: "#000",
        }}
      >
        {detectedUnwantedExtensions.map((ext) => (
          <li
            style={{
              fontWeight: 600,
            }}
            key={ext}
          >
            {ext}
          </li>
        ))}
      </ul>
      {/* Close button for non-block modes */}
      {displayMode !== "block" && (
        <button
          onClick={() => setShowMessage(false)}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "0rem",
            right: "0rem",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#000",
          }}
        >
          X
        </button>
      )}
    </div>
  );

  /**
   * Common container style for alert/banner/modal modes
   */
  const baseContainerStyle: React.CSSProperties = {
    padding: "16px",
    borderRadius: "0.25rem",
    boxShadow: "2px 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "#fff", // fallback if not overridden
    color: "#000", // fallback if not overridden
    position: "relative",
  };

  switch (displayMode) {
    case "silent":
      return null;

    case "banner":
      return (
        <div
          className={className}
          style={{
            ...baseContainerStyle,
            position: "fixed",
            right: "0rem",
            bottom: "0rem",
            margin: "0.5rem 1rem",
            zIndex: 999,
            border: "1px #eee solid",
            // backgroundColor: "#fef9c3", // close to Tailwind bg-yellow-100
            backgroundColor: "#fefefe",
            color: "#854d0e", // close to Tailwind text-yellow-800
            ...customStyles,
          }}
        >
          {renderContent()}
        </div>
      );

    case "modal":
      return (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)", // old: bg-black bg-opacity-50
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            className={className}
            style={{
              ...baseContainerStyle,
              maxWidth: "28rem", // ~ Tailwind max-w-md
              width: "100%",
              backgroundColor: "#ffffff",
              color: "#1f2937", // ~ Tailwind text-gray-800
              ...customStyles,
            }}
          >
            {renderContent()}
          </div>
        </div>
      );

    case "block":
      // Block the entire screen with a red overlay
      return (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)", // old: bg-black bg-opacity-50
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            className={className}
            style={{
              ...baseContainerStyle,
              maxWidth: "28rem", // ~ Tailwind max-w-md
              width: "100%",
              backgroundColor: "#ffffff",
              color: "#1f2937", // ~ Tailwind text-gray-800
              ...customStyles,
            }}
          >
            {renderContent()}
          </div>
        </div>
      );

    case "alert":
    default:
      return (
        <div
          className={className}
          style={{
            ...baseContainerStyle,
            position: "fixed",
            right: "1.5rem", // approx. Tailwind "right-10"
            bottom: "1rem",
            border: "1px #eee solid",
            maxWidth: "600px",
            zIndex: 99999, // higher than banner
            // backgroundColor: "#fee2e2", // close to Tailwind bg-red-100
            backgroundColor: "#fefefe", // close to Tailwind bg-red-100
            color: "#b91c1c", // close to Tailwind text-red-800
            ...customStyles,
          }}
        >
          {renderContent()}
        </div>
      );
  }
}

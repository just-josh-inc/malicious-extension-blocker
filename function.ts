// Each Extension object must include a Chrome extension ID, file path, and display name
export interface Extension {
    id: string;
    file: string;
    name: string;
}
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

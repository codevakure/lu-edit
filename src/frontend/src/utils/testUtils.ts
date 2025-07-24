/**
 * Converts a name to a test-friendly format
 * @param name - The name to convert
 * @returns A test-friendly string
 */
export function convertTestName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

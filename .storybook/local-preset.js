/**
 * to load the built addon in this test Storybook
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function previewAnnotations(entry = []) {
  return [...entry, resolve(__dirname, "../dist/preview.js")];
}

export function managerEntries(entry = []) {
  return [...entry, resolve(__dirname, "../dist/manager.js")];
}

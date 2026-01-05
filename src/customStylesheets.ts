import { PARAM_KEY } from './constants';

export interface CustomStylesheet {
  id: string;
  name: string;
  url: string;
}

const CUSTOM_KEY = `${PARAM_KEY}:custom`;

export function getCustomStylesheets(): CustomStylesheet[] {
  const data = localStorage.getItem(CUSTOM_KEY);
  if (!data) return [];

  try {
    const parsed = JSON.parse(data);

    // Validate structure
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid format');
    }

    // Filter out invalid entries
    return Object.values(parsed).filter(
      (sheet: any): sheet is CustomStylesheet =>
        sheet &&
        typeof sheet.id === 'string' &&
        typeof sheet.name === 'string' &&
        typeof sheet.url === 'string'
    );
  } catch {
    // Clear corrupted data
    localStorage.removeItem(CUSTOM_KEY);
    return [];
  }
}

export function saveCustomStylesheet(url: string, name?: string): CustomStylesheet {
  const id = `custom:${Date.now()}`;
  const autoName = name || extractNameFromUrl(url);
  const customSheets = getCustomStylesheets();

  // Ensure unique name
  const finalName = ensureUniqueName(autoName, customSheets);

  const newSheet: CustomStylesheet = { id, name: finalName, url };

  const allSheets = [...customSheets, newSheet];
  const mapping = allSheets.reduce((acc, sheet) => {
    acc[sheet.id] = sheet;
    return acc;
  }, {} as Record<string, CustomStylesheet>);

  localStorage.setItem(CUSTOM_KEY, JSON.stringify(mapping));
  return newSheet;
}

export function deleteCustomStylesheet(id: string): void {
  const customSheets = getCustomStylesheets();
  const updated = customSheets.filter(sheet => sheet.id !== id);

  const mapping = updated.reduce((acc, sheet) => {
    acc[sheet.id] = sheet;
    return acc;
  }, {} as Record<string, CustomStylesheet>);

  localStorage.setItem(CUSTOM_KEY, JSON.stringify(mapping));

  // If deleted stylesheet was active, switch to default
  const active = localStorage.getItem(PARAM_KEY);
  if (active === id) {
    localStorage.setItem(PARAM_KEY, 'default');
  }
}

export function isValidStylesheetUrl(url: string): boolean {
  // Must end with .css
  if (!url.endsWith('.css')) return false;

  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      new URL(url); // Throws if invalid
      return true;
    }
    // Allow relative paths like ./theme.css or /styles/theme.css
    return url.startsWith('./') || url.startsWith('/') || !url.includes('://');
  } catch {
    return false;
  }
}

export function isDuplicateUrl(url: string, customStylesheets: CustomStylesheet[]): boolean {
  return customStylesheets.some(sheet => sheet.url === url);
}

function extractNameFromUrl(url: string): string {
  // Extract filename from URL
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename || 'Custom Stylesheet';
}

function ensureUniqueName(name: string, existing: CustomStylesheet[]): string {
  const existingNames = existing.map(s => s.name);
  if (!existingNames.includes(name)) return name;

  let counter = 2;
  while (existingNames.includes(`${name} (${counter})`)) {
    counter++;
  }
  return `${name} (${counter})`;
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedRegistration } from "./data/ngo-data";

const REGISTRATIONS_KEY = "ngo_registrations";

export async function getSavedRegistrations(): Promise<SavedRegistration[]> {
  try {
    const data = await AsyncStorage.getItem(REGISTRATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveRegistration(reg: SavedRegistration): Promise<void> {
  try {
    const existing = await getSavedRegistrations();
    const idx = existing.findIndex((r) => r.id === reg.id);
    if (idx >= 0) {
      existing[idx] = reg;
    } else {
      existing.push(reg);
    }
    await AsyncStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(existing));
  } catch {
    // silently fail
  }
}

export async function deleteRegistration(id: string): Promise<void> {
  try {
    const existing = await getSavedRegistrations();
    const filtered = existing.filter((r) => r.id !== id);
    await AsyncStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(filtered));
  } catch {
    // silently fail
  }
}

export async function getRegistrationById(id: string): Promise<SavedRegistration | null> {
  try {
    const all = await getSavedRegistrations();
    return all.find((r) => r.id === id) ?? null;
  } catch {
    return null;
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getStepCompletionRate(reg: SavedRegistration, stepId: string, totalItems: number): number {
  const checked = reg.checkedItems[stepId] ?? [];
  if (totalItems === 0) return 100;
  return Math.round((checked.length / totalItems) * 100);
}

export function getRequiredItemsForStep(
  reg: SavedRegistration,
  stepId: string,
  requiredItemIds: string[]
): { checked: string[]; missing: string[] } {
  const checked = reg.checkedItems[stepId] ?? [];
  const missing = requiredItemIds.filter((id) => !checked.includes(id));
  return { checked, missing };
}

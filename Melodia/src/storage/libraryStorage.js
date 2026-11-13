import AsyncStorage from "@react-native-async-storage/async-storage";
import instruments from "../data/instruments.json";

const instrumentIds = new Set(instruments.map((instrument) => instrument.id));

function storageKey(userId) {
  return `@melodia/library/v1/${userId}`;
}

export function emptyLibrary() {
  return { favourites: [], scores: [] };
}

export async function loadLibrary(userId) {
  if (!userId) return emptyLibrary();

  const raw = await AsyncStorage.getItem(storageKey(userId));
  return raw ? validateLibrary(JSON.parse(raw)) : emptyLibrary();
}

export async function saveLibrary(userId, library) {
  if (!userId) throw new Error("A signed-in account is required");
  const validated = validateLibrary(library);
  await AsyncStorage.setItem(storageKey(userId), JSON.stringify(validated));
  return validated;
}

function validateLibrary(library) {
  if (!library || !Array.isArray(library.favourites) || !Array.isArray(library.scores)) {
    throw new Error("Saved library data is invalid");
  }

  const favourites = library.favourites.filter(
    (id, index, values) =>
      instrumentIds.has(id) && values.indexOf(id) === index,
  );
  const scores = library.scores
    .filter(
      (entry) =>
        entry &&
        Number.isInteger(entry.score) &&
        Number.isInteger(entry.total) &&
        entry.total > 0 &&
        entry.score >= 0 &&
        entry.score <= entry.total &&
        typeof entry.date === "string" &&
        Number.isFinite(Date.parse(entry.date)),
    )
    .slice(0, 50);

  return { favourites, scores };
}

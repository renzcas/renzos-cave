// meaning-compiler.js
// Translates raw events into "meaning objects".

export function compileMeaning(event) {
  return {
    id: event.id ?? crypto.randomUUID?.() ?? String(Date.now()),
    type: event.type ?? "unknown",
    payload: event.payload ?? {},
    timestamp: Date.now(),
    // TODO: attach archetypes / trigrams later
  };
}

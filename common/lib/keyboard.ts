// True when the user types in a form field. Board shortcuts must not run then.
export const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

// Ctrl on Windows and Linux, Cmd on macOS.
export const hasModKey = (e: KeyboardEvent) => e.ctrlKey || e.metaKey;

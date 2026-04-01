// Stub for color-diff-napi
// The native Rust module (syntect + bat) is not available.
// Returns null from render() so callers fall back to plain diff rendering.
// The pure TS port in src/native-ts/color-diff/ exists but is not wired in
// here to avoid circular-dependency issues during module initialization.

export class ColorDiff {
  constructor(hunk, firstLine, filePath, prefixContent) {
    this.hunk = hunk
    this.firstLine = firstLine
    this.filePath = filePath
    this.prefixContent = prefixContent ?? null
  }

  render(themeName, width, dim) {
    return null
  }
}

export class ColorFile {
  constructor(code, filePath) {
    this.code = code
    this.filePath = filePath
  }

  render(themeName, width, dim) {
    return null
  }
}

export function getSyntaxTheme(themeName) {
  return {
    theme: themeName || 'default',
    source: null,
  }
}

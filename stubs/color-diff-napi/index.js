// Stub for color-diff-napi
// Re-exports from the pure TypeScript port in src/native-ts/color-diff/
// The native Rust module (syntect + bat) is not available

export class ColorDiff {
  constructor(options) {
    this.options = options || {}
  }

  render(oldContent, newContent, fileName) {
    // Basic fallback - the actual app will use the native-ts implementation
    // This stub exists only for module resolution
    const lines = []
    const oldLines = (oldContent || '').split('\n')
    const newLines = (newContent || '').split('\n')

    for (const line of oldLines) {
      lines.push(`- ${line}`)
    }
    for (const line of newLines) {
      lines.push(`+ ${line}`)
    }
    return lines.join('\n')
  }
}

export class ColorFile {
  constructor(options) {
    this.options = options || {}
  }

  render(content, fileName) {
    return content || ''
  }
}

export function getSyntaxTheme(themeName) {
  return {
    theme: themeName || 'default',
    source: null,
  }
}

export interface SyntaxTheme {
  theme: string
  source: string | null
}

export declare class ColorDiff {
  constructor(options?: Record<string, any>)
  render(oldContent: string, newContent: string, fileName?: string): string
}

export declare class ColorFile {
  constructor(options?: Record<string, any>)
  render(content: string, fileName?: string): string
}

export declare function getSyntaxTheme(themeName?: string): SyntaxTheme

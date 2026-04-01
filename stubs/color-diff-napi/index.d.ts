export interface SyntaxTheme {
  theme: string
  source: string | null
}

export declare class ColorDiff {
  constructor(hunk: Record<string, any>, firstLine: string | null, filePath: string, prefixContent?: string | null)
  render(themeName: string, width: number, dim: boolean): string[] | null
}

export declare class ColorFile {
  constructor(code: string, filePath: string)
  render(themeName: string, width: number, dim: boolean): string[] | null
}

export declare function getSyntaxTheme(themeName?: string): SyntaxTheme

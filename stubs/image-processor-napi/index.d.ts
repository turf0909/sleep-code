export interface NativeImageModule {
  hasClipboardImage(): boolean
  readClipboardImage(maxWidth: number, maxHeight: number): {
    png: Buffer
    originalWidth: number
    originalHeight: number
    width: number
    height: number
  } | null
}

export declare function getNativeModule(): NativeImageModule | null

/**
 * Global type declarations for the ink rendering layer.
 */

// Extend JSX namespace for custom ink elements
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // Allow custom ink element attributes
    interface IntrinsicElements {
      [elemName: string]: unknown
    }
  }
}

export {}

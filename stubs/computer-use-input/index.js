// Stub - native input module not available
// Exports discriminated union with isSupported: false
// so callers (inputLoader.ts) throw instead of crashing on property access.
const stub = { isSupported: false }
export default stub

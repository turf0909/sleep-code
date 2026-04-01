/**
 * Shared types and constants for the file persistence module.
 */

/** Branded timestamp type for turn start times */
export type TurnStartTime = number & { readonly __brand: 'TurnStartTime' }

/** A successfully persisted file */
export interface PersistedFile {
  filename: string
  file_id: string
}

/** A file that failed to persist */
export interface FailedPersistence {
  filename: string
  error: string
}

/** Event data emitted after file persistence completes */
export interface FilesPersistedEventData {
  files: PersistedFile[]
  failed: FailedPersistence[]
}

/** Subdirectory name within the session directory that holds output files */
export const OUTPUTS_SUBDIR = 'outputs'

/** Maximum number of files that can be persisted in a single turn */
export const FILE_COUNT_LIMIT = 100

/** Default number of concurrent file uploads */
export const DEFAULT_UPLOAD_CONCURRENCY = 5

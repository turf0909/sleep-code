/**
 * The type of a Jupyter notebook cell.
 */
export type NotebookCellType = 'code' | 'markdown' | 'raw'

/**
 * A single output entry from a notebook code cell, matching the nbformat
 * schema (stream, execute_result, display_data, error).
 */
export interface NotebookCellOutput {
  output_type: string
  text?: string | string[]
  data?: Record<string, unknown>
  name?: string
  ename?: string
  evalue?: string
  traceback: string[]
}

/**
 * A cell in a Jupyter notebook, as parsed from the .ipynb JSON.
 */
export interface NotebookCell {
  cell_type: NotebookCellType
  source: string | string[]
  metadata?: Record<string, unknown>
  outputs?: NotebookCellOutput[]
  execution_count?: number | null
  /** Cell identifier from nbformat v4.5+; may be absent in older notebooks. */
  id?: string
}

/**
 * Top-level structure of a .ipynb file.
 */
export interface NotebookContent {
  cells: NotebookCell[]
  metadata?: Record<string, unknown>
  nbformat: number
  nbformat_minor: number
}

/**
 * Processed representation of a notebook cell used for tool results.
 * Produced by processCell() in notebook.ts.
 */
export interface NotebookCellSource {
  cellType: NotebookCellType
  source: string
  execution_count?: number
  cell_id: string
  language?: string
  outputs?: NotebookCellSourceOutput[]
}

/**
 * A processed cell output entry. Text has been joined and formatted,
 * and images have been extracted into a structured shape.
 */
export interface NotebookCellSourceOutput {
  output_type: string
  text?: string
  image?: NotebookOutputImage
}

/**
 * An image extracted from a notebook cell output's data dictionary.
 */
export interface NotebookOutputImage {
  image_data: string
  media_type: 'image/png' | 'image/jpeg'
}

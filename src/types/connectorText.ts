/**
 * A content block produced by a connector. The API returns this block type
 * when the CONNECTOR_TEXT feature is enabled. The main text payload lives
 * in the `connector_text` field (not `text`) and the block may carry an
 * optional `signature` for verification.
 */
export interface ConnectorTextBlock {
  type: 'connector_text'
  connector_text: string
  signature?: string
}

/**
 * Streaming delta for a connector text block. Received during
 * content_block_delta events when the block type is connector_text.
 */
export interface ConnectorTextDelta {
  type: 'connector_text_delta'
  connector_text: string
}

/**
 * Type guard that checks whether an unknown block is a ConnectorTextBlock.
 */
export function isConnectorTextBlock(
  block: unknown,
): block is ConnectorTextBlock {
  return (
    block != null &&
    typeof block === 'object' &&
    (block as Record<string, unknown>).type === 'connector_text'
  )
}

/**
 * The set of operations that can be performed on the unified command queue.
 */
export type QueueOperation =
  | 'enqueue'
  | 'dequeue'
  | 'remove'
  | 'clear'
  | 'peek'
  | 'drain'

/**
 * A structured log entry emitted by the message queue manager whenever a
 * queue operation occurs. Persisted via recordQueueOperation in session
 * storage for debugging and observability.
 */
export interface QueueOperationMessage {
  type: 'queue-operation'
  operation: QueueOperation
  timestamp: string
  sessionId: string
  content?: string
}

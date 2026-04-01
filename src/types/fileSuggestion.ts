/**
 * Input object passed to the user-configured fileSuggestion hook command.
 * Built by spreading createBaseHookInput() and adding the current query.
 */
export interface FileSuggestionCommandInput {
  session_id: string
  transcript_path: string
  cwd: string
  permission_mode?: string
  agent_id?: string
  agent_type?: string
  query: string
}

# API Error Codes

The Anthropic API returns standard HTTP status codes. Here are the error codes you may encounter
and how to handle them.

## Error Response Format

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens: Field required"
  }
}
```

## Status Codes

### 400 -- Bad Request (`invalid_request_error`)

The request body is malformed or missing required fields.

**Common causes:**
- Missing `max_tokens` (required on every request)
- Empty `messages` array
- Invalid `role` value (must be `"user"` or `"assistant"`)
- Consecutive messages with the same role
- Invalid `model` ID

**Fix:** Check the request body against the API reference.

### 401 -- Unauthorized (`authentication_error`)

The API key is missing or invalid.

**Fix:** Set the `x-api-key` header to a valid API key from console.anthropic.com.

### 403 -- Forbidden (`permission_error`)

The API key does not have permission to use the requested resource.

**Common causes:**
- Using a key that lacks access to a specific model
- Workspace restrictions

**Fix:** Check your API key permissions in the Anthropic Console.

### 429 -- Rate Limited (`rate_limit_error`)

You have exceeded your rate limit (requests per minute or tokens per minute).

**Fix:** Implement exponential backoff with jitter:
1. Wait 1 second, retry
2. Wait 2 seconds, retry
3. Wait 4 seconds, retry
4. Continue doubling up to a maximum delay

### 500 -- Internal Server Error (`api_error`)

An unexpected error on Anthropic's servers.

**Fix:** Retry with exponential backoff. If persistent, check status.anthropic.com.

### 529 -- Overloaded (`overloaded_error`)

The API is temporarily overloaded with too many requests.

**Fix:** Retry with exponential backoff, using longer initial delays (e.g., start at 5 seconds).
This is temporary and typically resolves within minutes.

## Retry Strategy

```
retryable_codes = {429, 529, 500}
max_retries = 5
base_delay = 1.0  # seconds

for attempt in range(max_retries):
    response = make_request()
    if response.status_code not in retryable_codes:
        break
    delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
    sleep(delay)
```

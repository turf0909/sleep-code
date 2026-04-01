# Claude API -- Go

There is no official Anthropic Go SDK. Use the standard `net/http` package to call the API.

## Basic Usage

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type Request struct {
	Model    string    `json:"model"`
	MaxTokens int     `json:"max_tokens"`
	Messages []Message `json:"messages"`
}

type ContentBlock struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type Response struct {
	Content []ContentBlock `json:"content"`
	Model   string         `json:"model"`
	Usage   struct {
		InputTokens  int `json:"input_tokens"`
		OutputTokens int `json:"output_tokens"`
	} `json:"usage"`
}

func main() {
	reqBody := Request{
		Model:     "{{SONNET_ID}}",
		MaxTokens: 1024,
		Messages: []Message{
			{Role: "user", Content: "Hello, Claude!"},
		},
	}

	jsonBody, _ := json.Marshal(reqBody)
	req, _ := http.NewRequest("POST", "https://api.anthropic.com/v1/messages", bytes.NewReader(jsonBody))
	req.Header.Set("x-api-key", os.Getenv("ANTHROPIC_API_KEY"))
	req.Header.Set("anthropic-version", "2023-06-01")
	req.Header.Set("content-type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Fprintf(os.Stderr, "request failed: %v\n", err)
		os.Exit(1)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var result Response
	json.Unmarshal(body, &result)

	for _, block := range result.Content {
		if block.Type == "text" {
			fmt.Println(block.Text)
		}
	}
}
```

## Error Handling

```go
if resp.StatusCode != http.StatusOK {
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode == 429 {
		// Rate limited -- implement exponential backoff
		time.Sleep(retryDelay)
		continue
	}
	return fmt.Errorf("API error %d: %s", resp.StatusCode, string(body))
}
```

## Tips

- Always check `resp.StatusCode` before reading the body.
- Use `context.Context` for request timeouts and cancellation.
- Consider using `encoding/json.NewDecoder` for streaming responses.
- Set a reasonable `http.Client.Timeout` (e.g., 120 seconds for long completions).

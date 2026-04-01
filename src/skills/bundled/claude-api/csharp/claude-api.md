# Claude API -- C#

There is no official Anthropic C# SDK. Use `HttpClient` to call the Messages API directly.

## Installation

No package to install. Use the built-in `System.Net.Http.HttpClient`.

## Basic Usage

```csharp
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

var client = new HttpClient();
client.BaseAddress = new Uri("https://api.anthropic.com/");
client.DefaultRequestHeaders.Add("x-api-key", Environment.GetEnvironmentVariable("ANTHROPIC_API_KEY"));
client.DefaultRequestHeaders.Add("anthropic-version", "2023-06-01");

var requestBody = new
{
    model = "{{SONNET_ID}}",
    max_tokens = 1024,
    messages = new[]
    {
        new { role = "user", content = "Hello, Claude!" }
    }
};

var json = JsonSerializer.Serialize(requestBody);
var content = new StringContent(json, Encoding.UTF8, "application/json");
var response = await client.PostAsync("v1/messages", content);
var responseBody = await response.Content.ReadAsStringAsync();

Console.WriteLine(responseBody);
```

## With System Prompt

```csharp
var requestBody = new
{
    model = "{{SONNET_ID}}",
    max_tokens = 1024,
    system = "You are a helpful coding assistant.",
    messages = new[]
    {
        new { role = "user", content = "Explain async/await in C#." }
    }
};
```

## Error Handling

```csharp
if (!response.IsSuccessStatusCode)
{
    var errorBody = await response.Content.ReadAsStringAsync();
    if ((int)response.StatusCode == 429)
    {
        // Rate limited -- wait and retry with exponential backoff
        await Task.Delay(TimeSpan.FromSeconds(retryDelay));
    }
    else
    {
        throw new HttpRequestException($"API error {response.StatusCode}: {errorBody}");
    }
}
```

## Required Headers

| Header | Value |
|--------|-------|
| `x-api-key` | Your Anthropic API key |
| `anthropic-version` | `2023-06-01` |
| `content-type` | `application/json` |

# Claude API -- Java

There is no official Anthropic Java SDK. Use `java.net.http.HttpClient` (Java 11+).

## Basic Usage

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class ClaudeExample {
    public static void main(String[] args) throws Exception {
        String apiKey = System.getenv("ANTHROPIC_API_KEY");

        String requestBody = """
            {
                "model": "{{SONNET_ID}}",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content": "Hello, Claude!"}
                ]
            }
            """;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.anthropic.com/v1/messages"))
            .header("x-api-key", apiKey)
            .header("anthropic-version", "2023-06-01")
            .header("content-type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpResponse<String> response = client.send(request,
            HttpResponse.BodyHandlers.ofString());

        System.out.println(response.body());
    }
}
```

## With Jackson for JSON

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

ObjectMapper mapper = new ObjectMapper();
JsonNode root = mapper.readTree(response.body());
JsonNode content = root.get("content");
for (JsonNode block : content) {
    if ("text".equals(block.get("type").asText())) {
        System.out.println(block.get("text").asText());
    }
}
```

## Error Handling

```java
int statusCode = response.statusCode();
if (statusCode != 200) {
    if (statusCode == 429) {
        // Rate limited -- implement exponential backoff
        Thread.sleep(retryDelayMs);
    } else if (statusCode == 529) {
        // API overloaded -- retry after a delay
        Thread.sleep(retryDelayMs * 2);
    } else {
        throw new RuntimeException("API error " + statusCode + ": " + response.body());
    }
}
```

## Tips

- Use Java 11+ `HttpClient` (built-in, no external dependencies needed).
- For JSON parsing, Jackson or Gson are recommended.
- For streaming, use `HttpResponse.BodyHandlers.ofLines()` and process SSE events.
- Set a timeout on the `HttpClient` builder: `.connectTimeout(Duration.ofSeconds(30))`.

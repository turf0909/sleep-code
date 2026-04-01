# Batch API -- TypeScript

The Message Batches API processes large volumes of requests asynchronously at a 50% discount.
Ideal for evaluations, data processing, and content classification.

## Creating a Batch

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const batch = await client.messages.batches.create({
  requests: [
    {
      custom_id: "request-1",
      params: {
        model: "{{SONNET_ID}}",
        max_tokens: 1024,
        messages: [{ role: "user", content: "Summarize quantum computing." }],
      },
    },
    {
      custom_id: "request-2",
      params: {
        model: "{{SONNET_ID}}",
        max_tokens: 1024,
        messages: [{ role: "user", content: "Summarize machine learning." }],
      },
    },
  ],
});

console.log(`Batch ID: ${batch.id}`);
console.log(`Status: ${batch.processing_status}`);
```

## Checking Batch Status

```typescript
const status = await client.messages.batches.retrieve(batch.id);
console.log(`Status: ${status.processing_status}`);
// "in_progress" | "ended" | "canceling" | "canceled"
```

## Retrieving Results

```typescript
for await (const result of client.messages.batches.results(batch.id)) {
  console.log(`ID: ${result.custom_id}`);
  if (result.result.type === "succeeded") {
    const message = result.result.message;
    console.log(`Response: ${message.content[0].text}`);
  } else if (result.result.type === "errored") {
    console.error(`Error: ${result.result.error}`);
  }
}
```

## Listing Batches

```typescript
for await (const batch of client.messages.batches.list()) {
  console.log(`${batch.id}: ${batch.processing_status}`);
}
```

## Canceling a Batch

```typescript
await client.messages.batches.cancel(batch.id);
```

## Tips

- Each batch can contain up to 100,000 requests.
- Batch processing typically completes within 24 hours.
- Use `custom_id` to correlate requests with your internal tracking.
- Batches use the same `messages` format as the real-time API.
- Results are available for 29 days after the batch completes.
- Use `for await` to iterate results as they stream in.

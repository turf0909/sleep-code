# Batch API -- Python

The Message Batches API lets you send large volumes of requests asynchronously. Batches
run at a 50% discount and are ideal for non-latency-sensitive workloads like evaluations,
data processing, and content classification.

## Creating a Batch

```python
import anthropic

client = anthropic.Anthropic()

batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": "request-1",
            "params": {
                "model": "{{SONNET_ID}}",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": "Summarize quantum computing."}],
            },
        },
        {
            "custom_id": "request-2",
            "params": {
                "model": "{{SONNET_ID}}",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": "Summarize machine learning."}],
            },
        },
    ]
)

print(f"Batch ID: {batch.id}")
print(f"Status: {batch.processing_status}")
```

## Checking Batch Status

```python
batch = client.messages.batches.retrieve(batch.id)
print(f"Status: {batch.processing_status}")
# "in_progress", "ended", "canceling", "canceled"
```

## Retrieving Results

```python
# Wait for completion, then iterate over results
for result in client.messages.batches.results(batch.id):
    print(f"ID: {result.custom_id}")
    if result.result.type == "succeeded":
        message = result.result.message
        print(f"Response: {message.content[0].text}")
    elif result.result.type == "errored":
        print(f"Error: {result.result.error}")
```

## Listing Batches

```python
for batch in client.messages.batches.list():
    print(f"{batch.id}: {batch.processing_status}")
```

## Canceling a Batch

```python
client.messages.batches.cancel(batch.id)
```

## Tips

- Each batch can contain up to 100,000 requests.
- Batch processing typically completes within 24 hours.
- Use `custom_id` to correlate requests with your internal tracking.
- Batches use the same `messages` format as the real-time API.
- Results are available for 29 days after the batch completes.

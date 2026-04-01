# Files API -- Python

The Files API lets you upload files once and reference them across multiple API requests,
avoiding repeated base64 encoding and reducing request sizes.

## Uploading a File

```python
import anthropic

client = anthropic.Anthropic()

# Upload a file
with open("document.pdf", "rb") as f:
    file = client.files.create(
        file=f,
        purpose="messages",
    )

print(f"File ID: {file.id}")
```

## Using an Uploaded File in Messages

```python
message = client.messages.create(
    model="{{SONNET_ID}}",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "file",
                "source": {
                    "type": "file",
                    "file_id": file.id,
                },
            },
            {
                "type": "text",
                "text": "Summarize this document.",
            },
        ],
    }],
)

print(message.content[0].text)
```

## Listing Files

```python
files = client.files.list()
for f in files.data:
    print(f"{f.id}: {f.filename} ({f.size_bytes} bytes)")
```

## Retrieving File Metadata

```python
file = client.files.retrieve(file.id)
print(f"Filename: {file.filename}")
print(f"Size: {file.size_bytes}")
print(f"Created: {file.created_at}")
```

## Deleting a File

```python
client.files.delete(file.id)
```

## Supported File Types

- PDF documents (`.pdf`)
- Images (`.png`, `.jpg`, `.gif`, `.webp`)
- Plain text (`.txt`, `.csv`, `.json`, `.xml`)

## Tips

- Uploaded files persist for 24 hours unless deleted.
- Use files when the same document is referenced in multiple requests.
- File IDs can be shared across different message requests.
- Maximum file size is 32 MB.
- For images, the Files API is an alternative to inline base64 encoding.

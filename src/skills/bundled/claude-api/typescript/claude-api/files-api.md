# Files API -- TypeScript

The Files API lets you upload files once and reference them in multiple API requests,
reducing request sizes and avoiding repeated base64 encoding.

## Uploading a File

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { createReadStream } from "fs";

const client = new Anthropic();

const file = await client.files.create({
  file: createReadStream("document.pdf"),
  purpose: "messages",
});

console.log(`File ID: ${file.id}`);
```

## Using an Uploaded File in Messages

```typescript
const message = await client.messages.create({
  model: "{{SONNET_ID}}",
  max_tokens: 1024,
  messages: [{
    role: "user",
    content: [
      {
        type: "file",
        source: {
          type: "file",
          file_id: file.id,
        },
      },
      {
        type: "text",
        text: "Summarize this document.",
      },
    ],
  }],
});

console.log(message.content[0].text);
```

## Listing Files

```typescript
const files = await client.files.list();
for (const f of files.data) {
  console.log(`${f.id}: ${f.filename} (${f.size_bytes} bytes)`);
}
```

## Retrieving File Metadata

```typescript
const fileInfo = await client.files.retrieve(file.id);
console.log(`Filename: ${fileInfo.filename}`);
console.log(`Size: ${fileInfo.size_bytes}`);
console.log(`Created: ${fileInfo.created_at}`);
```

## Deleting a File

```typescript
await client.files.delete(file.id);
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
- For Node.js, use `createReadStream`; for browsers, use `File` or `Blob` objects.

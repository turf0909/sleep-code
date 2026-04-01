# Claude API -- PHP

There is no official Anthropic PHP SDK. Use PHP's built-in cURL functions.

## Basic Usage

```php
<?php

$apiKey = getenv('ANTHROPIC_API_KEY');

$data = [
    'model' => '{{SONNET_ID}}',
    'max_tokens' => 1024,
    'messages' => [
        ['role' => 'user', 'content' => 'Hello, Claude!']
    ]
];

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_HTTPHEADER => [
        'x-api-key: ' . $apiKey,
        'anthropic-version: 2023-06-01',
        'content-type: application/json',
    ],
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    throw new RuntimeException("API error {$httpCode}: {$response}");
}

$result = json_decode($response, true);

foreach ($result['content'] as $block) {
    if ($block['type'] === 'text') {
        echo $block['text'] . "\n";
    }
}
```

## With System Prompt

```php
$data = [
    'model' => '{{SONNET_ID}}',
    'max_tokens' => 1024,
    'system' => 'You are a helpful PHP expert.',
    'messages' => [
        ['role' => 'user', 'content' => 'How do I use PDO with PostgreSQL?']
    ]
];
```

## Error Handling with Retry

```php
function callClaude(array $data, int $maxRetries = 3): array {
    $apiKey = getenv('ANTHROPIC_API_KEY');
    $delay = 1;

    for ($attempt = 0; $attempt < $maxRetries; $attempt++) {
        $ch = curl_init('https://api.anthropic.com/v1/messages');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => [
                'x-api-key: ' . $apiKey,
                'anthropic-version: 2023-06-01',
                'content-type: application/json',
            ],
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            return json_decode($response, true);
        }
        if (in_array($httpCode, [429, 529])) {
            sleep($delay);
            $delay *= 2;
            continue;
        }
        throw new RuntimeException("API error {$httpCode}: {$response}");
    }
    throw new RuntimeException("Max retries exceeded");
}
```

# Claude API -- Ruby

There is no official Anthropic Ruby SDK. Use `net/http` from the standard library.

## Basic Usage

```ruby
require 'net/http'
require 'json'
require 'uri'

api_key = ENV['ANTHROPIC_API_KEY']
uri = URI('https://api.anthropic.com/v1/messages')

request_body = {
  model: '{{SONNET_ID}}',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Hello, Claude!' }
  ]
}

http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(uri.path)
request['x-api-key'] = api_key
request['anthropic-version'] = '2023-06-01'
request['content-type'] = 'application/json'
request.body = request_body.to_json

response = http.request(request)
result = JSON.parse(response.body)

result['content'].each do |block|
  puts block['text'] if block['type'] == 'text'
end
```

## With System Prompt

```ruby
request_body = {
  model: '{{SONNET_ID}}',
  max_tokens: 1024,
  system: 'You are a helpful Ruby expert.',
  messages: [
    { role: 'user', content: 'Explain blocks, procs, and lambdas.' }
  ]
}
```

## Error Handling with Retry

```ruby
def call_claude(body, max_retries: 3)
  uri = URI('https://api.anthropic.com/v1/messages')
  delay = 1

  max_retries.times do |attempt|
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.path)
    request['x-api-key'] = ENV['ANTHROPIC_API_KEY']
    request['anthropic-version'] = '2023-06-01'
    request['content-type'] = 'application/json'
    request.body = body.to_json

    response = http.request(request)

    case response.code.to_i
    when 200
      return JSON.parse(response.body)
    when 429, 529
      sleep(delay)
      delay *= 2
    else
      raise "API error #{response.code}: #{response.body}"
    end
  end
  raise 'Max retries exceeded'
end
```

## Tips

- Use `http.open_timeout` and `http.read_timeout` to avoid hanging requests.
- For production use, consider the `faraday` or `httparty` gems for cleaner HTTP handling.
- For streaming, use `http.request(request) { |res| res.read_body { |chunk| ... } }`.

# Verifying Server Applications

## Typical Verification Steps

### 1. Run Unit and Integration Tests

```bash
# Node.js / TypeScript
npm test
npx vitest run --project integration

# Python
pytest tests/ -m "not slow"
pytest tests/integration/

# Go
go test ./... -tags=integration

# Java
mvn test
```

### 2. Start the Server and Test Endpoints

```bash
# Start the server in the background
npm run dev &
SERVER_PID=$!

# Wait for the server to be ready
sleep 2

# Test health endpoint
curl -s http://localhost:3000/health | jq .

# Test a typical API endpoint
curl -s -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}' | jq .

# Clean up
kill $SERVER_PID
```

### 3. Verify Database Migrations

If the change includes database migrations:
- Run migrations forward: `npm run migrate:up` or `alembic upgrade head`
- Verify rollback works: `npm run migrate:down` or `alembic downgrade -1`

### 4. Check for Security Issues

- Verify authentication middleware is still applied to protected routes.
- Check that CORS headers are correct.
- Ensure sensitive data is not logged or exposed in error responses.

## What to Look For

- **Response codes**: Verify correct HTTP status codes (200, 201, 400, 404, 500).
- **Response format**: Ensure JSON structure matches the API contract.
- **Error handling**: Malformed requests should return 400, not 500.
- **Performance**: If benchmarks exist, run them to detect performance regressions.
- **Graceful shutdown**: Verify the server handles SIGTERM properly.
- **Middleware order**: Ensure logging, auth, and rate-limiting middleware run in order.

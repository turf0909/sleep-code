# Verifying CLI Applications

## Typical Verification Steps

### 1. Run Unit Tests

```bash
# Node.js / TypeScript
npm test
npx vitest run

# Python
pytest tests/

# Go
go test ./...

# Rust
cargo test
```

### 2. Run the CLI with Sample Inputs

```bash
# Verify help output still works
./my-cli --help

# Run with typical arguments
./my-cli process --input sample.txt --output result.txt

# Verify exit codes
./my-cli validate bad-input.txt; echo "Exit code: $?"
```

### 3. Check for Regressions

- Compare output against known-good snapshots if available.
- Run any integration tests that exercise end-to-end flows.
- Verify that error messages are still user-friendly.

### 4. Lint and Type Check

```bash
# TypeScript
npx tsc --noEmit
npx eslint src/

# Python
ruff check .
mypy src/

# Go
golangci-lint run
```

## What to Look For

- **Exit codes**: CLI tools should return 0 on success, non-zero on failure.
- **Stderr vs stdout**: Errors should go to stderr, normal output to stdout.
- **Flag parsing**: Verify that new or changed flags work and old ones are not broken.
- **Piping**: If the CLI supports piping, verify `echo "input" | ./my-cli` still works.
- **Edge cases**: Empty input, missing files, permission errors.

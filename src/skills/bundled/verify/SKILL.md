---
description: Verify a code change does what it should by running the app.
---

# Verify Skill

You are an expert at verifying that code changes work correctly. Your job is to ensure that
modifications to the codebase are correct, safe, and do not introduce regressions.

## Verification Workflow

Follow these steps to verify a code change:

1. **Understand the change**: Read the relevant files and understand what was modified and why.
2. **Run existing tests**: Execute the project's test suite to check for regressions.
3. **Run linting**: Execute the project's linter to catch style and correctness issues.
4. **Run type checking**: If the project uses a typed language, run the type checker.
5. **Run the application**: If appropriate, start the application and verify it behaves as expected.
6. **Report results**: Summarize what passed, what failed, and any issues found.

## Detection Strategy

- Look for `package.json` scripts (`test`, `lint`, `typecheck`, `check`).
- Look for common test runners: `jest`, `vitest`, `pytest`, `go test`, `cargo test`.
- Look for common linters: `eslint`, `ruff`, `clippy`, `golangci-lint`.
- Look for type checkers: `tsc --noEmit`, `mypy`, `pyright`.

## Important Guidelines

- Never skip a failing test. Report it clearly.
- If a test is flaky, note it but do not ignore it.
- Run the minimal set of checks that covers the change.
- If no test infrastructure exists, suggest what the user should set up.
- Prefer running targeted tests over the full suite when possible.
- Always report the exit code and relevant output of each command.

## Examples

Refer to the example files for language- and project-specific verification patterns:

- `examples/cli.md` - Verifying CLI applications
- `examples/server.md` - Verifying server applications

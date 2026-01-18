# Additional Requirements

These requirements are intentionally lightweight but important. They are meant to demonstrate basic production readiness, not exhaustive infrastructure work.

## Docker

- Provide a Dockerfile for the backend service

- Provide a docker-compose setup for required dependencies (e.g. database, Redis)

- The full system should be runnable locally using Docker

## Testing

- Include at least one of the following:

  - Unit tests covering workflow step logic

  - A test validating workflow state transitions end-to-end

- Tests should focus on correctness and clarity, not coverage percentage

## CI/CD

- Include a simple CI pipeline (e.g. GitHub Actions) that runs on push or pull request

- The pipeline should perform at least one of:

  - Running tests

  - Linting

  - Type checking or build validation

## Documentation

Provide a `README.md` or other markdown file(s) that clearly explain:

- The overall workflow design

- Why the workflow steps were chosen

- How AI failures and invalid outputs are handled

- Key architectural tradeoffs

- How to run the project locally, including:

  - Environment variable requirements

  - Docker and/or docker-compose commands

  - Any required setup steps

## Outputs

Update the `outputs.md` file, showing the final validated outputs for all ten provided [sample messages](../sample-messages.md). Each message should include:

- Message classification

- Structured extracted data

- Decision/recommendation

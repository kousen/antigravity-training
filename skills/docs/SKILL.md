---
name: docs
description: >-
  Generate comprehensive documentation for code. Use this skill when the user runs /docs or asks for
  this kind of task on a file or directory (e.g. "/docs @./src/app.py").
---

# /docs

Generate comprehensive documentation for the provided code:

## README.md
If this is a project or module, create a README with:
- Project description and purpose
- Installation instructions
- Quick start guide
- Usage examples with code snippets
- Configuration options
- API reference (if applicable)
- Contributing guidelines

## API Documentation
For functions, classes, or modules:
- Purpose and description
- Parameters with types and descriptions
- Return values with types
- Exceptions/errors that may be thrown
- Usage examples
- Related functions or methods

## Inline Documentation
- Add docstrings/JSDoc/JavaDoc as appropriate
- Document complex algorithms with step-by-step comments
- Add type hints where applicable

## Format
Use Markdown format with:
- Clear headings and structure
- Code blocks with syntax highlighting
- Tables for parameters and options
- Links to related documentation

Apply the above to the file(s) or directory the user referenced with `@`.

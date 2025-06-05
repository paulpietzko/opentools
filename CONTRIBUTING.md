# Contributing to OpenTools

Thank you for your interest in contributing to **OpenTools**! We welcome all kinds of contributions — from bug reports and feature requests to code improvements and documentation updates.

## 📋 Table of Contents
- [How to Contribute](#how-to-contribute)
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Style Guide](#style-guide)
- [License](#license)

---

## How to Contribute

There are many ways to help:
- File a [bug report](https://github.com/paulpietzko/opentools/issues)
- Suggest a new feature or tool
- Submit a pull request with code improvements or fixes
- Improve documentation
- Review or comment on open issues and PRs

---

## Code of Conduct

We are committed to a harassment-free, inclusive environment. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## Getting Started

1. Fork the repository and clone it:
   ```bash
   git clone https://github.com/paulpietzko/opentools.git
   cd opentools
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

---

## Development Setup

This project is built with:

* [Next.js](https://nextjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)

All tools are located under `/tools/{tool-name}`. Each tool should be self-contained and accessible via a clean URL route.

---

## Pull Request Guidelines

* Keep pull requests focused and concise.
* Link to the related issue in your PR description if applicable.
* Write clear, descriptive commit messages.
* Include tests or examples if your code adds new functionality.
* Ensure the app builds and passes lint checks:

  ```bash
  npm run lint
  npm run build
  ```

---

## Style Guide

* Use TypeScript for all components.
* Use functional components and React Hooks.
* Follow Tailwind CSS conventions for styling.
* Write accessible and responsive markup.
* Keep each tool isolated — no shared state unless necessary.

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

We appreciate your help in making **OpenTools** better for everyone! 🚀

```

Let me know if you want it customized for monorepo structure, internationalization, or automated workflows like Prettier/lint-staged.
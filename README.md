# VPlatform Frontend Template Project

Welcome to the VPlatform Frontend Template Project. This project serves as a starting point for developers to create frontend projects in Next.js efficiently.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Features](#features)
3. [Project Requirements](#project-requirements)
4. [Getting Started](#getting-started)
5. [Contribution Guidelines](#contribution-guidelines)
6. [Useful Links and Cheatsheets](#useful-links-and-cheatsheets)

---

## Project Structure

Follow this [guide](./docs/structure.md).

---

## Features

- **Material-UI (MUI)**: Material UI library which provide all the reusable components.
- **Styled Components**: Dynamic styling capabilities for React components.
- **Redux Toolkit**: Application State management.
- **Module Federation Support**: Nextjs module federation support.
- **React Hook Form**: Simplifies form handling with validation.
- **Zod**: validation library.
- **Day.js**: Efficient date manipulation and formatting.
- **Pre-commit and Pre-push Git Hooks**: Configured with Husky and lint-staged to run linting and formatting before commit, and to build the project before push.
- **ESlint**: Lint code as per language standard.
- **Prettier**: Standard code formatter.
- **Custom VSCode Configuration**: To Nextjs Debug, Useful Settings and Extensions recommendation to speed developer productivity.
- **Authentication**: Integrated OMNI Authentication.
- **Docker Support**: Includes a Dockerfile for containerization.
- **K8s Pipeline implementation**: K8s deployment deployment implementation in azure pipeline.
---

## Project Requirements

- Node 18+
- npm 10+

---

## Getting Started

### Installation Process

1.1. **Clone the repository**:

   ```bash
   git clone https://vgroupframework@dev.azure.com/vgroupframework/VPlatform-Apps/_git/Vplatform-Frontend-Template
   ```
1.2. **Use  DEV_1.2 git branch**.

2.1. **Obtain Azure Artifacts Token**:

   Follow this [guide](./docs/access-private-npm-packages.md).

2.2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

    ```bash
    npm run dev
    ```

### Commands

```bash
    # start in development mode.
    npm run dev

    # Build project.
    npm run build

    # start in production mode.
    npm run start

    # format before committing the code
    npm run format:fix

    # lint before committing the code
    npm run lint:fix

```

## Contribution Guidelines

1. Begin by creating a branch from `DEV`.
2. Develop your feature on the branch.
3. Before commit run linting & formatting command.
4. Create a pull request and assign it to the appropriate reviewer.
5. After approval, merge it into the `DEV` branch.
6. The pipeline will then automatically publish the changes.

---

## Useful Links and Cheatsheets

### Material-UI (MUI)
- [MUI Official Documentation](https://mui.com/material-ui/getting-started/learn/)
- [MUI Cheatsheet](https://yourdevkit.com/cheat-sheet/material-ui)

### Day.js
- [Day.js Documentation](https://day.js.org/docs/en/display/format)

### Next.js
- [Next.js Learning Resources](https://nextjs.org/learn)

### React Hook Form
- [Getting Started with React Hook Form](https://www.react-hook-form.com/get-started/)
- [Advanced Usage](https://www.react-hook-form.com/advanced-usage/)

### Redux Toolkit
- [Redux Toolkit Cheatsheet](https://www.codecademy.com/learn/fscp-redux/modules/refactoring-with-redux-toolkit/cheatsheet)

### Styled Components
- [Styled Components Basics](https://styled-components.com/docs/basics)
- [Advanced Concepts](https://styled-components.com/docs/advanced)
- [Styled Components Cheatsheet](https://scalablecss.com/static/Styled-Components-Cheat-Sheet-c9ef20eda7095a43b5e4c80b36b545a4.pdf)

### Zod
- [Zod Basics](https://zod.dev/?id=basic-usage#:~:text=directly%20from%20the-,%22zod%22%20package.,-Basic%20usage)
- [Learn Zod in 5 Minutes](https://dev.to/arafat4693/learn-zod-in-5-minutes-17pn)
- [Zod Integration with React Hook Form](https://www.austinshelby.com/blog/build-a-react-form-with-react-hook-form-and-zod)

---

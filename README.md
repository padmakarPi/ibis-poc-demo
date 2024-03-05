# Introduction

Welcome to the VPlatform Frontend Template Project. This project template will serve as a starting point for developers that will be creating Frontend projects in NextJS quickly and efficiently.

## Table Of Contents:

- Project Structure
- Setup the project
- Running the app
- Setup test library
- Important

### Project Structure

- A structure file is addded inside doc which states the basic folder structure followed in the project. Click here [🗄️ Project Structure](docs/structure.md)

### Setup the project 
Setting up a project in Next.js is relatively straightforward.

##### 1. Create a new next.js project
Run the following command to create a new Next.js project:
```
npx create-next-app@latest
```

##### 2. Install dependencies
##### Dependencies
To install dependencies in a Next.js project, you can use npm or yarn, depending on your preference
```
npm install
or
npm install <package name>
```
##### Dev dependencies
In package.json file, there is an object called as dev Dependencies and it consists of all the packages that are used in the project in its development phase and not in the production or testing environment with its version number. So, whenever you want to install any library that is required only in your development phase then you can find it in the dev Dependencies object. 
```
npm install <package name> --save-dev
```

## Running the app
This command starts the development server provided by Next.js, allowing you to preview your project in a local development environment.
```bash
npm run dev
```

## Setup the test library

Setting up Jest in a Next.js project involves a few steps to configure Jest to work with Next.js and to write and run tests for your application. Here's a step-by-step guide:

##### 1. Install Jest and Testing Utilities
First, you need to install Jest along with any necessary testing utilities. 
```
npm i -D @testing-library/jest-dom @testing-library/react @testing-library/user-event jest jest-environment-jsdom ts-jest
npm i --save-dev @types/jest
npm i -D ts-node
```
##### 2. Modify Package.json file
Add a new scripts 
```
"test":"jest"
"test:watch":"jest --watchAll"
```

##### 3. Add configuration
- Create a jest.config.ts file in the root directory and add the configuration.
```
import type { Config } from 'jest'
import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  preset: 'ts-jest',
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
```

- Create a jest.setup.ts file in the root directroy

Just import one library in jest.setup.ts
```
import '@testing-library/jest-dom'
```

- ESLint plugins for jest

These plugins provide ESLint rules specifically designed to work with Jest and testing utilities

```
npm i -D eslint-plugin-jest-dom eslint-plugin-testing-library
```

- Modify the .eslintrc.json file

```
 "extends": [
    "next/core-web-vitals",
    "plugin:testing-library/react",
    "plugin:jest-dom/recommended"
  ]
```
- Create new directory name ` __test__` in the root directory

Add the tests file in the __test__ directory. For instance :- `page.test.tsx or page.test.ts`
Make the proper folder or file structure in the __test__ directory.

- Run test cases
```
npm test
```
## Important
##### Before pushing code to a version control system like Azure DevOps, there are several things you should remember to ensure smooth collaboration and maintain code quality:


###### 1. To ensure your project runs successfully after implementing changes.
###### 2. Open the terminal and run `npm run build`. Before going to the next setup make sure all warning and error are resolved.
###### 3. ESLint will analyze your project files according to the configured rules and report any errors or warnings found. Run : `npm run lint`
###### 4. Absolutely, running `npm run lint:fix` after `npm run lint` is a good practice to automatically fix as many linting errors as possible.
###### 5. Run `npm run format` to format your project files using Prettier.
###### 6 you can run `npm run format:fix` to attempt to fix any remaining Prettier formatting issues.
###### 7. All test case must be passed. Run : `npm test`.
###### 8. Your branch must be update to date with main branch. Rebase your branch before push the code and resolve the conflict if any. 
###### 9. Provide clear and concise commit messages that accurately describe the changes made. Reference:- (docs/structure.md)







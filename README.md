# Introduction

Welcome to the VPlatform Frontend Template Project. This project template will serve as a starting point for developers that will be creating Frontend projects in NextJS quickly and efficiently.

## Table Of Contents:

- Development Branch
- Project Structure
- Setup the project
- Running the app
- Important

## Development Branch

The `DEV` branch is the primary development branch. It is the place where ongoing development work takes place. Contributors are encouraged to create branches based on `DEV` for new features or bug fixes.

## Project Structure

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

## Important
##### Before pushing code to a version control system like Azure DevOps, there are several things you should remember to ensure smooth collaboration and maintain code quality:


###### 1. To ensure your project runs successfully after implementing changes.
###### 2. Open the terminal and run `npm run build`. Before going to the next setup make sure all warning and error are resolved.
###### 3. ESLint will analyze your project files according to the configured rules and report any errors or warnings found. Run : `npm run lint`
###### 4. Absolutely, running `npm run lint:fix` after `npm run lint` is a good practice to automatically fix as many linting errors as possible.
###### 5. Run `npm run format` to format your project files using Prettier.
###### 6 you can run `npm run format:fix` to attempt to fix any remaining Prettier formatting issues.
###### 7. Your branch must be update to date with main branch. Rebase your branch before push the code and resolve the conflict if any. 
###### 8. Provide clear and concise commit messages that accurately describe the changes made. Reference:- (docs/structure.md)







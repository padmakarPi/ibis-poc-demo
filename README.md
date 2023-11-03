# Introduction

Welcome to the VPlatform Frontend Template Project. This project template will serve as a starting point for developers that will be creating Frontend projects in NextJS quickly and efficiently.

## Table Of Contents:

- Project Structure
- Installation process
- Running the app
- Features

## Project Structure

- A structure file is addded inside doc which states the basic folder structure followed in the project. Click here [🗄️ Project Structure](doc/structure.md)

## Installation Process

```bash
$ npm install
# if required
$ npm install <module_name>
```

### For using the shared utilities, Click here(https://dev.azure.com/vgroupframework/VPlatform-Apps/_artifacts/feed/common-utilities/Npm/@vplatform%2Fshared-components) for installation

### Before writing your code, change the `Vplatform-Frontend-Template` to your actual project name.

## Running the app

```bash
# development
$ npm run dev

# start application mode
$ npm run start

# build application
$ npm run build
```

## Features:

### Omni Integration

- The Omni integration within this project provides seamless access to Omni services. It enables interaction and utilization of Omni's features within the application. This documentation provides a guide on how to integrate and leverage Omni services effectively within the project. For this feature we need to add .env file with omni configuration. 


### Private Route

- The Private Route Higher-Order Component (HOC) allows developers to protect routes within the application, ensuring access control and authentication for specific components. This documentation provides a guide on how to use and implement the withPrivateRoute HOC effectively within your project.

### Axios Connection(Interceptor added as default)

- This documentation offers a guide on integrating error handling, Bearer token addition, and configuring base URLs using Axios within your project.

#### Error Handling
- Implement error handling to effectively manage error responses from HTTP requests. Customize error handling functions to intercept and manage errors according to the project's needs. This ensures smoother handling of unexpected errors, improving the application's reliability.

#### Bearer Token Addition
- Utilize Axios interceptors to add Bearer tokens to outgoing requests. This adds a layer of security by including authentication tokens with every request, ensuring secure communication with the server. Customize the interceptor to add Bearer tokens in line with your authentication mechanism.

#### Base URLs Configuration
- Define base URLs for different services or APIs in the src\lib\axios\base-urls.ts file. Centralizing these URLs streamlines request management, making it easier to interact with various endpoints across the application.

### Redux

#### Redux Integration
- Redux offers a predictable state container for JavaScript applications, facilitating the management of the application's state. Integrating Redux involves creating a store, actions, reducers, and connecting components for state management.

#### Storing Data in Local Storage
- To persist Redux store data in the local storage, modify the store.redux.ts file located at src\redux\store.redux.ts. Within the persistConfig.whitelist, include the newly created store, ensuring its data is saved and retrieved from local storage.

#### Creating a New Store
- To create a new store, add a new reducer within the src\redux\reducers folder. Reducers define how the application's state changes in response to actions sent to the store. Once the reducer is created, combine it with existing reducers within the rootReducer.

### DockerFile

- Docker is a configuration management tool that is used to automate the deployment of software in lightweight containers. These containers help applications to work efficiently in different environments.
- A Docker Image is a read-only file with a bunch of instructions. When these instructions are executed, it creates a Docker container.
- Dockerfile is a simple text file that consists of instructions to build Docker images.

### Error Handling

- Pending

### Error logging

- Pending

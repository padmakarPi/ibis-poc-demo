## Deployment Using PM2 CLI Tool

### Prerequisites
1. Clone the project from your repository.
2. Build the project using the necessary build commands (e.g., `npm install` and `npm run build`).

### Steps to Deploy

#### 1. Install PM2 Globally
First, you need to install PM2 globally on your system. PM2 is a process manager for Node.js applications that allows you to keep your applications running forever.

```bash
npm install pm2 -g
```

#### 2. Create a Startup Script
Next, create a file named `StartupScript.js` in the root directory of your project. This script will start your application using PM2.

```javascript
// File: StartupScript.js
const { exec } = require('child_process');

// Execute the npm run start command
const child = exec('npm run start', { cwd: __dirname });

// Pipe the child process's stdout and stderr to the main process's stdout and stderr
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

```

This script uses Node's `child_process` module to run the `npm run start` command, which should be defined in your `package.json` to start your application.

#### 3. Start the Application Using PM2
Use the PM2 CLI to start your application with a specified name.

```bash
pm2 start StartupScript.js --name vchat-app
```

This command tells PM2 to start your application using the `StartupScript.js` file and names the process `vchat-app`.

#### 4. Access the Application
After starting the application, you can access it via your localhost URL. By default, this is typically `http://localhost:3000` (assuming your application runs on port 3000). Make sure to replace `3000` with the actual port your application is configured to use.

Open a web browser and navigate to:

```
http://localhost:3000
```

#### 5. List All PM2 Processes
To see all processes managed by PM2, use the following command:

```bash
pm2 list
```

This will display a list of all applications currently managed by PM2, along with their status and other details.

#### 6. Stop the Application
If you need to stop the application, use the following command:

```bash
pm2 stop vchat-app
```

This stops the `vchat-app` process without deleting it from PM2's process list.

#### 7. Delete the Application
To remove the application from PM2's process list entirely, use the following command:

```bash
pm2 delete vchat-app
```

This will delete the `vchat-app` process from PM2, so it is no longer managed.

### Example Commands
Here are the commands summarized for easy reference:

```bash
# Install PM2 globally
npm install pm2 -g

# Start the application using PM2
pm2 start StartupScript.js --name vchat-app

# Access the application
# Open your browser and go to http://localhost:3000

# List all PM2 processes
pm2 list

# Stop the application
pm2 stop vchat-app

# Delete the application from PM2
pm2 delete vchat-app
```

### StartupScript.js Example
```javascript
// File: StartupScript.js
const { exec } = require('child_process');
const child = exec('npm run start', { cwd: __dirname });

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

```

With this guide, you should be able to deploy, start, and access your Node.js application using PM2, along with managing its lifecycle.

PM2 Documentation: https://pm2.keymetrics.io/docs/usage/process-management/
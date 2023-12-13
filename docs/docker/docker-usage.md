# Docker Usage Guide for Developers

## Download Docker

Download Docker Desktop from [this link](https://docs.docker.com/desktop/install/windows-install/).

***

<br/>


## Build Docker Image 

### Prerequisites
- Ensure Docker is running (Run Docker Desktop).

### Build locally when no Private NPM Package is installed.

### Steps

#### Step 1: Build the Image

```bash
docker build -t vgroupvplatform/<your frontend name>:latest . 
# For example: docker build -t vgroupvplatform/purchase-order-frontend:latest .
```
***

<br/>

### Build locally when Private NPM Package is installed.

### Steps

#### Step 1: Authenticate NPM using this command. [For more details.](../access-private-npm-packages.md)

```bash
vsts-npm-auth -config .npmrc
```

#### Step 2: Copy the content of `C:\Users\<user>\.npmrc` and paste it at the end of the `.npmrc` file.

```bash
# For Example
registry=https://pkgs.dev.azure.com/vgroupframework/_packaging/common-utilities/npm/registry/

always-auth=true
//pkgs.dev.azure.com/vgroupframework/_packaging/common-utilities/npm/registry/:username=VssSessionToken
//pkgs.dev.azure.com/vgroupframework/_packaging/common-utilities/npm/registry/:_password=<Your Password>
registry=http://registry.npmjs.org/
email=not-used@example.com
```

#### Step 3: Build the Image by following command:

```bash
docker build -t vgroupvplatform/<your frontend name>:latest . 
# For example: docker build -t vgroupvplatform/purchase-order-frontend:latest .
```
***

<br/>

## Push Image to DockerHub

#### Step 1: Docker Login

```bash
docker login
```

#### Step 2: Docker Push

```bash
docker push vgroupvplatform/<your frontend name>:latest
# For example: docker push vgroupvplatform/purchase-order-frontend:latest
```
***

<br/>

## Running Docker Container Locally

### Steps

#### Step 1: Create a new `docker-compose.yaml` file at the project root level.

#### Step 2: Add the following content to `docker-compose.yaml` and change the port:

```yaml
version: "v2"

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
```

#### Step 3: Run Docker Compose to start the application in a Docker container.

```bash
docker compose up
```
OR

For starting the application with no cache, use the following commands:

```bash
docker-compose build --no-cache
docker compose up
```

#### Step 4: Stop and remove the container using Docker Compose.

```bash
docker compose down
```
***
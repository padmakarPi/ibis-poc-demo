## To access private NPM package (@vplatform/[any npm package])

## If you are a developer follow step 3 & 4

### Step 1: Navigate to Azure Artifacts feed 

1. Login to Azure Devops
2. Navigate to Azure Artifacts and select `common-utilities` feed

For detailed instructions, refer to the [Azure DevOps documentation](https://learn.microsoft.com/en-us/azure/devops/artifacts/feeds/feed-permissions?view=azure-devops#azure-artifacts-settings)

### Step 2: Add User and Set Permissions

Follow the steps outlined in the [Azure DevOps documentation](https://learn.microsoft.com/en-us/azure/devops/artifacts/feeds/feed-permissions?view=azure-devops#:~:text=when%20you%27re%20done.-,Feed%20settings,Select%20Save%20when%20you%27re%20done.,-Note) to add a user and assign roles.


### Step 3: Install vsts-npm-auth helper

```bash
 npm install -g vsts-npm-auth --registry https://registry.npmjs.com --always-auth false
```

### Step 4: Authenticate and Obtain Azure Artifacts Token

Run the following command to authenticate and obtain an Azure Artifacts token:

```bash
vsts-npm-auth -config .npmrc
```
If above doesn't works then try below

```bash
npx vsts-npm-auth -config .npmrc
```


This will ask you for your vships credential.
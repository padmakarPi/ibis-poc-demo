# 🗄️ Project Structure

Most of the code lives in the `src` folder and looks like this:

```sh
src
|
+-- app               # all the pages that you want to add on route you can create it here.
|    |
|    +-- feature      # all the specific feature page shold be here.
|    |
|    +-- error.tsx      # this file will be handle all error from our application(https://nextjs.org/docs/app/api-reference/file-conventions/error)
|    |
|    +-- layout.tsx      # this file will be handle Ui that will be shared between routes from our application(https://nextjs.org/docs/app/api-reference/file-conventions/layout)
|    |
|    +-- page.tsx      # This is the index page of our application whenever application start nextjs first rerender this page(https://nextjs.org/docs/app/api-reference/file-conventions/page).
|    |
|    +-- favicon.ico      # This is the ico file if we need to chnage application favicon we need to replace it with new file.
|
+-- components        # all the common components you need to develop here.
|    |
|    +-- common         # all the common components shold be here.
|       |
|       +-- HOC             # all the higher order component develop here
|    
|    +-- feature1       # all the feature1 related components shold be here.
|    |
|    +-- feature2       # all the feature2 related components shold be here.
|    
+-- constants         # all the constant messages and configuration shold be here.
|    |
|    +-- config         # all the application configuration should be here.
|    |
|    +-- messages       # all the application messages should be here.
|    |
|    +-- metadata       # all the application metadata should be here.
|
+-- hooks             # all the Hooks develop here.
|
+-- images            # all the applications static file add here.
|
+-- interfaces        # all the applications interfaces develop here.
|    |
|    +-- api         
|       |
|       +-- requests    # all api request paramas interfaces should be here.
|       |
|       +-- responses    # all api request interfaces should be here. 
|    |
|    +-- common         # all the application common interfaces should be here.
|    |
|    +-- state         # all the application redux state interfaces should be here.
|
+-- lib               # all the applications common functionalities develop here.
|
+-- redux             # all the applications redux store and configuration develop here.
|
+-- services          # all the applications services develop here.
|
+-- styles            # all the applications css develop here.
|    |
|    +-- MUI         # all the application MUI style should be here should be here(file name should be component name So easy for readbility).
```


## FAQ

#### why we use tsx for components
 - Typesefety, jsx support,
 - tsx is a file syntax extension used by React and here you can use CSS and Html as well. You should use tsx files when rendering a React component.

#### why we use .ts file for non component file.
 - basically on the non component file we don't need to use jsx features.

#### what is the purpose of lib folder?
 - lib contains general reusable code and utilities. services has integrations.
 - lib code is synchronous. services involve async data fetching.
 - lib functions are app-specific. Services can be more generic.
 - Services often use lib utilities under the hood.

#### what is the purpose of service folder.
 - Contains integration with external services such as making API calls.
 - Anything involving async operations and data fetching.
 - Requests to backend APIs or external services.

#### what is the folder structure for new routes.
 - folder sturure for route page. we use routeName/page.tsx (becuse of in future we will able to add new child route as well like: feature/new route)
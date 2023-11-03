# 🗄️ Project Structure

Most of the code lives in the `src` folder and looks like this:

```sh
src
|
+-- app               # all the pages that you want to add on route you can create it here.
|
+-- components        # all the common components you need to develop here.
|
+-- constants         # all the constant messages and configuration shold be here.
|
+-- HOC               # all the higher order component develop here
|
+-- hooks             # all the Hooks develop here.
|
+-- images            # all the applications static file add here.
|
+-- interfaces        # all the applications interfaces develop here.
|
+-- lib               # all the applications common functionalities develop here.
|
+-- redux             # all the applications redux store and configuration develop here.
|
+-- services          # all the applications services develop here.
|
+-- styles            # all the applications css develop here.
```

A feature module could have the following structure:

```sh
src/<featurename>
|
+-- dtos         # DTOs for request and response classes.
|
+-- models       # Model are stored here.
|
+-- interfaces   # Interfaces are stored here.
|
+-- utilities    # utility functions for a specific feature.
|
+-- types        # typescript types for TS specific feature domain.
|
+-- constants    # Constants like procedure names are stored here
```

## Create main application component
    ### Setup versioning
    * all the parts of the main application rest below `src`
    * to allow correct, flexible and failsave versioning of your API place all components of your application into a subfolder, which is named after the version, which the components belong to
    * the management of the different versions is then done in the main `src/app.js` file
    * this approach leads to the disadvantage of code duplication among the different API versions, but brings the advantage of stable versioning
    * maybe an approach including linking between files of different versions can reduce the disdvantage

    Example:
    ```
    src
      \
      |app.js
      \
      |v1
      | \
      |  routes
      |   \
      |    apiRoutes.js
      \
       v2
        \
         routes
          \
           apiRoutes.js
    ```

    More on API versioning:
    * [Evan Hahn: Express.js: How to version your API](http://freecontent.manning.com/wp-content/uploads/express-js-how-to-version-your-api.pdf)

    ### Create main application component
    * the entry point into an express based application is an express [application object](https://expressjs.com/en/4x/api.html#app)
    * to create a new application object call `express()` after importing `express` as `express`
    * express selects the handler for a request to a specific API endpoint by following defined routes ([Routing](https://expressjs.com/en/guide/routing.html))
    * a route binds a handler function to a request URI / a class of request URIs
    * a route is identified via it's **method** and it's **path**
    * if a request matches a route, the bound handler or the bound middleware is called, but only the first matching route will be followed(!)
    * routes are tested in the order they were defined
    
    #### Defining routes
    * routes can be defined directly on the application object with `app.METHOD(PATH, [MIDDLEWARE...], HANDLER)` where `METHOD` is the regarding HTTP method ( **get**, **post**, **put**, **delete**, **head** and [others](https://expressjs.com/en/4x/api.html#app.METHOD)) or **all** if the route should match on every type of request; `PATH` is the path on which the route should match (or a part of the path), `MIDDLEWARE` [Optional] are one or multiple [express middleware objects/functions](https://expressjs.com/en/guide/using-middleware.html) which should be applied on a request mathching this route and `HANDLER` is the final handler function which should be applied on a matching request
    * even if it is possible to define routes on the application object it is uncommon (or even an anti-pattern), except to special cases like error handlers or default routes
    <!-- TODO: Add reference -->
    * routes are generally defined using router middleware in special route files in the regarding version subdirectory 
    * these routers get then applied on the application object for their subtree of the URI tree (`app.use(SUBTREE, ROUTER)`)
    
        ##### Managing versions
        * maintain multiple versions and applying routes is done in the same process
        * because all the application files (routes, middleware, etc.) is defined seperately for each version, setting up a version is done by applying the routers and other middleware for this version under a subtree for this version
        
    <!-- TODO: Error handling, middleware -->

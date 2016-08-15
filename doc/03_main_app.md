## Create main application component
    ### Setup versioning
    * all the parts of the main application rest below `src`
    * to allow correct, flexible and failsave versioning of your API place all components of your application into a subfolder, which is named after the main version, which the components belong to
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
    * [Vinay Sahni: Best Practices for Designing a Pragmatic RESTful API](http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#versioning)

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
        * because all the application files (routes, middleware, etc.) is defined seperately for each main version, setting up a version is done by applying the routers and other middleware for this version under a subtree for this version
        * to address subversions of a main version, it is possible for the client to include a custom version header; this brings a good tradeoff between a stable versioning, an
        easy to use API and an easy update mechanism (even without a specific subversion, the API should be save to use, because the major version is described in the URL, but
        small changes can be included easily by an subversion which can be automatically used [or specifically avoided] by the clients)

    #### Using middleware
    * middleware functions are functions, which get hooked into the request-handling chain, to modify the request and response objects of the currently handled request
    * middleware can be hooked in by using the [`app.use(MIDDLEWARE...)`](https://expressjs.com/en/4x/api.html#app.use) (or the [`router.use(MIDDLEWARE...)`](https://expressjs.com/en/4x/api.html#router.use)) function
    * when adding a middleware by just calling `app.use(MIDDLEWARE)`, it is used at every request passing the current application (or router)
    * it is also possible to add middleware by using `app.use(PATH, MIDDLEWARE...)`; in this case the middleware is only hooked into requests to the given `PATH` or a subtree of this `PATH`; this middleware functions get called after the global midlewares; the matching section of the requests path is stripped from the requests path, so following middleware gets it's own subtree of the path-tree
    * when adding middleware, which accepts an error handler, this middleware gets called after every other defined middleware, or if another middleware passes an error
    
    More on Middleware:
    * [Express reference](https://expressjs.com/en/guide/using-middleware.html)
    
    #### Using routers
    * [Routers](https://expressjs.com/en/4x/api.html#router) are a special kind of middleware
    * they can be set up with routes and appropriate handlers
    * after that the router can be hooked into the regular request-handling chain of an app and handle all requests, which match a route defined on them
    * to set up routes routers provide the same methods (one for each HTTP method and an `all` method) like an application object



        
    <!-- TODO: Error handling -->

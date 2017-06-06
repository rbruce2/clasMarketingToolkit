# ASU CLAS Marketing Tool Kit

This marketing tool kit for the College of Liberal Arts and Sciences at Arizona State University will enable marketing units across the university to perform the following task:

  - Run detailed search querires against iSearch directory
  - Audit iSearch Profile content based on ASU Brand Guidelines
  - Audit drupal sites that use ASU's webspark theme for allignment with ASU Brand Guidelines

# Branding Standards
  - The ASU Brand Guidelines can be found at brandguide.asu.edu

### Tech

This marketing tool kit uses a number of open source projects to work properly:

* [AngularJS] - HTML enhanced for web apps!
* [AngularJS Material] - CSS Framework for Angular
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [jQuery] - js lib
* [Grunt] - task runner

And of course Many more that can be found in this repo's package.json and bower.json files

### Installation

CLAS Marketing Toolkit requires [Node.js](https://nodejs.org/) to run.

Install the dependencies and start the server.

```sh
$ cd clasMarketingToolkit
$ npm install
$ node server.js
```

Using grunt for development (automatically starts listening on port 3000)
```sh
$ cd clasMarketingToolkit
$ npm install
$ grunt express-dev
```

For production environments (Heroku Deploy)... coming soon!

### Todos

 - Write Tests
 - Add more reports/audits

License
----

MIT



[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [dill]: <https://github.com/joemccann/dillinger>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [markdown-it]: <https://github.com/markdown-it/markdown-it>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Grunt]: <http://gruntjs.com>
   [AngularJS Material]: <https://material.angularjs.org/latest/>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>

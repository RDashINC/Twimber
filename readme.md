Twimber
=========

Twimber is a HTML5 and Javascript based Desktop Twitter Client.

Features
----

x = done

/ = sorta done

- Multi-User support. [/]
- Same-Client DM Read marking Support. [ ]
- Encrypt DMs too other Users. [ ]
- Twitter stream API lag test. [x]


Version
----

2.0.0

Internals
-----------

Twimber uses a number of open source projects to work properly:

* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [jQuery] - duh
* [node.js] - Event driven amazingness.
* [node-webkit] - Wrapping nodejs in the DOM.
* [FontAwesome] - An epic icon thing that really adds to the expirence.

Using Source
-----------

You'll need a version of [NW.js](https://github.com/nwjs/nw.js) and [node/io].js. Also bower.

```
npm install -g bower
```

```
cp src/cfg/default.json src/cfg/config.json
pushd src
bower install
popd
<path/to/nw/> ./
```

License
----

MIT (Yes, some say GNUGPLv3, but it's all MIT now.)

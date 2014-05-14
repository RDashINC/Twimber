[![Build Status](https://travis-ci.org/RDashINC/Twimber.svg?branch=master)](https://travis-ci.org/RDashINC/Twimber)
Twimber
=========

Twimber (VSTweet) is a HTML5 and Javascript based Desktop/Web Twitter Client.

Features
----

- Multi-User support.
- Same-Client DM Read marking Support.
- Encrypt DMs too other Users.
- And many more...


Version
----

1.0.1 Pre-Alpha

Internals
-----------

Twimber uses a number of open source projects to work properly:

* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [jQuery] - duh
* [HTML5] - Because it's better than HTML4
* [node.js] - Only thing that would honestly work.
* [Javascript] - this is an easy one.
* [node-webkit] - Creating Simple node.js applications.

Using Source
-----------

You'll need a version of [node-webkit](https://github.com/rogerwang/node-webkit) [Any OS]

If you run windows, you can download this make utility: [make](http://www.mediafire.com/download/r49swq23xw3ow66/make.7z)

Extract nw, and if using make, into the base directory.

Manual
---------

Zip src/* (DO NOT INCLUDE SRC AS FOLDER, IT MUST BE BASE).

Run `nw [zip].zip`


Make
--------

Run `make launch`

-- or --

Run `make` too just package it.

-- or --

Run `make release` too create a standalone exe (reqs. DLLs)

License
----

GNUGPLv3
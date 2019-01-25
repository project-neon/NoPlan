# NoPlan

NoPlan is the software used to guide our Very Small Size Soccer Robots.

On NoPlan project we aim to create a project that can be develop by many member at same time. To improve productivity we follow part of Git-flow cheatsheet. Using Master as our "competition" code, develop as our main branch. Also we create legacy as old code of LARC-2017 as a safe point to return.

## Tech

If you are new on this project, you might like to take a look on these stuff:

* [SSL-Vision](https://github.com/RoboCup-SSL/ssl-vision/wiki)
* [Protocol Buffers](https://developers.google.com/protocol-buffers/)
* [Javascript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
* [Node](https://nodejs.org/en/)

## Install

To install this project you just need to `git clone`. Come on, I know you can do that.

## Requirements
  - `Node > 8.4.0`
  - Being able to sudo, in other words, **YOU FUCKING NEED A LINUX DISTRO**
  - Have SSL-Vision installed

## Contributing

Before you start to mess with our code base:
 * [install .editorconfig plugin in your editor](https://editorconfig.org/#download)
 * [install standard (linter) plugin in your editor](https://standardjs.com/index.html#are-there-text-editor-plugins)


## Running

Just type `sudo node server` and press enter in your terminal. Remember to start SSL-Vision `./bin/vision` before do that.

### SSL-Vision
  - Remember to set the field control points and configure collors correct

### Simulated Version
  - To run the position simulator use `sudo SIMULATED=1 node server`

### Running The Game Manager
  - To run use  `sudo node server`


### TODO
  - Inside Intention/index.js try normalizing weight instead of cropping

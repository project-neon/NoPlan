# NoPlan

NoPlan is the software used to guide our Very Small Size Soccer Robots.

With NoPlan, we aim to create a project that can be developed by as many team members as possible at the same time. To improve productivity, we follow part of the [Gitflow cheat sheet](https://danielkummer.github.io/git-flow-cheatsheet/index.pt_BR.html). We use Master as our "competition" code and develop as our main devopment branch.

## Dependencies

If you are new on this project, you might like to take a look on these stuff:

* [SSL-Vision](https://github.com/RoboCup-SSL/ssl-vision/wiki)
* [Protocol Buffers](https://developers.google.com/protocol-buffers/)
* [Javascript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
* [Node](https://nodejs.org/en/)

## Install

 To install this project you just need to:
 -  `git clone`
 - `yarn install` inside repository to install all node dependencies

## Requirements
  - `Node > 8.4.0`
  - Have SSL-Vision installed

## Running

Just type `sudo RUN_MODE=1 node server` and press enter in your terminal. Remember to start SSL-Vision `./bin/vision` before do that.

### SSL-Vision
  - Remember to set the field control points and configure collors correct

### Simulated Version
  - To run the position simulator use `sudo RUN_MODE=2 node server`. Make sure to have [NoPlanVssSimulator](https://github.com/project-neon/NoPlanVssSimulator)

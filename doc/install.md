# Install, compile, and run

## Folder structure

doc -- the document files  
lib -- the source code of the library  
test -- the unit tests  
testapp -- the executable test application

## Install Jincu library

You may install the library directly to your application module repository.

### npm from the remote repository
In your application root folder, run,

npm install --save jincu

Note: since Jincu is in development stage, the NPM package may most likely be behind the code on Github. You should better download the source code and build your version.

### Link locally
Download the source code from Github, then in Jincu root folder, run,

npm link

In your application root folder, run,

npm link jincu

## Compile

You may also compile the library and use the minified .js file.

In Jincu root folder, run,

npm run build

Then fetch file jincu/dist/jincu.m.js

## Run the test application

The library itself is not runnable, but there is a testapp to test the library.

In jincu/testapp, run,

npm start

Be sure Jincu was linked built correctly. Here is the full steps to build the test application.

In jincu/, run,

npm link

In jincu/testapp, run,

npm link jincu

in jincu/, run,

npm run build

in jincu/testapp, run,

npm start

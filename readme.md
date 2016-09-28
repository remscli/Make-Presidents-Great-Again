# Build Your Perfect President

## How to install ?

Ensure to have NodeJS and Mongodb installed.

    $ brew update
    $ brew install mongodb
    $ mkdir -p /data/db # with sudo if necessary
    $ sudo chown -R `id -u` /data/db # fixing permissions


Then launch MongoDB :

    $ mongod

Install all node modules with npm :

    $ npm install

Finally, launch site with nodemon (automatic relaunch):

    $ npm install -g nodemon
    $ nodemon server

or simply with :

    $ node server

And go to http://localhost:4000
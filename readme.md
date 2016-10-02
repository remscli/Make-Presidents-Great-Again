# Make Presidents Great Again

## Concept

The november 8th 2016, americans will have to choose between an irresponsible clown and a crazy 
ex first lady for being their president. This ridicule situation gave me the idea to turn it into 
derision with an interactive and comic experiment where citizens can build their great president 
depending on their opinions on 2016's election main subjects. Finally, users instantly see the 
results of their choices and can vote for the great president which fully represent their ideas.
 

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

Launch site with nodemon (automatic relaunch):

    $ npm install -g nodemon
    $ nodemon server

Start sass compilation if needed :
    
    $ gulp

Finally go to http://localhost:4000
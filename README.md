# Awesome Boggle - Server

## Setup

### Seeding the database

This is assuming that [https://github.com/dwyl/english-words/]() is checked out in the sibling directory.


First we need to create the *words.sql* file...

    $ db/create_dictionary.sh
    
Now we need to populate the database:

    $ db/setup.sh

## Tests

The test database will need to be setup the same was as the development database. So when you run the test command, it'll setup the test database first, then run the tests against it.

### Run the tests

    $ npm test
    
## Running

### Start the server

This is a node/express app so you should be able to run the following command to get it running on port *8080*.

    $ npm start
    
### Test it out


    $ curl -L -I http://localhost:8080/api/v1.0/users/test
    
Should come back with...

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 20
    ETag: W/"14-KnCd09Ago1yr7pprcN6p/5bSaPo"
    Date: Wed, 02 Jan 2019 13:32:46 GMT
    Connection: keep-alive

## Docker - Running for realsies

This will be running in a docker container up in AWS so the docker container will need to be built and then deployed out to the cloud.

### Build container

    $ docker build -t awesomeboggle-server:1.0 .
    
### Run the container

    $ docker run -d \
      --name awesomeboggle-server \
      -p 8080:8080 \
      awesomeboggle-server:1.0

### Push to AWS

???
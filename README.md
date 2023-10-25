# graphile-starter-slim

this is a template for starting a new graphile project with a database, graphql server, and react frontend

## getting started

### requirements

* node (v18+)
* yarn
* docker
* docker-compose

once you have the required software and have cloned the repo, from inside the repo directory:

``` sh
yarn setup
```

the `setup` script will run several commands:

* install package dependencies
* generate an .env file
* create databases and roles
* run database migrations
* use `postgraphile` to generate a graphql schema from the postgres schema
* start the server in development mode

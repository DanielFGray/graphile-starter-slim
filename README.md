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
* start building a custom docker postgres image with extensions
* create databases and roles
* run database migrations
* use `postgraphile` to generate a graphql schema from the postgres schema
* `start` the dev server, which will:
  * look for graphql queries and generate typescript commands using `graphql-codegen`
  * watch for migration files to change and keep the db in sync using `graphile-migrate`
  * generate css classes (using `tailwind`)
  * start the dev server running `postgraphile` and server-rendering react using `vite`

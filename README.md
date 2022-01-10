[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# TutorialExG 

## Design an app to manage Tutorials

This task is all about to learn the NODE.JS, And all the api works with documentation. with proper skeleton by express-generator

# Tech

- [Node] - evented I/O for the backend
- [Expres] - fast node.js network app framework
- [MongoDb] - NoSQL database program

## Note

- title: string|min:3|max:100|required
- description: string|min:1|max:5000|required
- published: boolean

- Autogenerated:
  -- id: uuid
  -- createdAt: datetime
  -- updatedAt: datetime

## APIs

- Create a Tutorial
- Update a Tutorial by ID
- Delete a Tutorial by ID
- Get all Tutorials
  -- Able to search by Title
  -- Able to sort by crated/updated date (Default updated DESC)

## Installation

TutorialCRUD requires [Node.js](https://nodejs.org/) v17 to run.

Install the dependencies and devDependencies and start the server.

```sh
// in TutorialCRUD Directory
npx yarn install
```

For Run the app .

```sh
npx yarn run tutorial
```

> Note: this uses the Swagger for documentation, runs on port 3000 with path 'http://localhost:3000/swagger'

![swagger.png](public/images/swagger.png?raw=true 'swagger')

## License

MIT

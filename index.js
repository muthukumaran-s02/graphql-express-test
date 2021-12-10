var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    world(name:String): World
  }

  type Mutation {
    world(name:String!, age:String, location:String): World
  }

  type World {
    name: String
    age: String
    location: String
  }

`);

worlds = {
  "Earth":{
    name: "Earth",
    age: "5 M",
    location: "3rd Planet in Solar System"
  },
  "Mercury":{
    name:"Mercury",
    age: "1 M",
    location: "1st Planet in Solar System"
  },
  "Venus" : {
    name: "Venus",
    age: "10 M",
    location: "2nd Planet in Solar System"
  }
}

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello, world!';
  },
  world: (args,context) => {
    console.log([args,context]);
    if(args.name != undefined && args.name.length > 0){
      var world = worlds[args.name];
      if(!world){
        world = {};
      } 
      if(args.age != undefined && args.age.length > 0){
        world.age = args.age;
      }
      if(args.location != undefined && args.location.length > 0){
        world.location = args.location;
      }
      return world;
    } else {
      return null;
    }
  }
};

var app = express();
app.use(
  '/',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/');

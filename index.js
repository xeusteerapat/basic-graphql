const { ApolloServer, gql } = require('apollo-server');

const users = [
  {
    name: 'Teerapat',
    id: '0',
    age: 34
  },
  {
    name: 'Moowarn',
    id: '1'
  }
];

const posts = [
  {
    title: 'Post 1',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat quo animi consequatur sequi repellat! A tempore sapiente placeat? Deserunt, labore.',
    id: '0',
    author: '1'
  },
  {
    title: 'Post 2',
    body:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est doloribus earum officia necessitatibus alias cupiditate!',
    id: '1',
    author: '0'
  }
];

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    age: Int
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    author: User!
  }

  type Query {
    message: String!
    users(query: String): [User!]!
    user(id: ID!): User
    posts(title: String): [Post!]!
  }

  type Mutation {
    createUser(name: String!, age: Int): User
  }
`;

const resolvers = {
  Query: {
    message: () => 'Hello, GrapQL',
    users: (parent, args) => {
      if (args.query) {
        return users.filter(user => user.name.includes(args.query));
      }
      return users;
    },
    user: (parent, args) => {
      return users.find(user => user.id === args.id);
    },
    posts: (parent, args) => {
      if (args.title) {
        return posts.filter(post => post.title.includes(args.title));
      }
      return posts;
    }
  },
  Mutation: {
    createUser: (parent, args) => {
      const { name, age } = args;
      const id = users.length;
      const newUser = {
        name,
        age,
        id
      };
      users.push(newUser);
      return newUser;
    }
  },
  Post: {
    author: (parent, args) => {
      return users.find(user => user.id === parent.author);
    }
  },
  User: {
    posts: (parent, args) => {
      return posts.filter(post => post.author === parent.id);
    },
    age: (parent, args) => {
      return 0;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`Server started at ${url}`));

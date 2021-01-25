import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import {v4 as uuidv4} from 'uuid';
// import 'dotenv/config';

const app = express();

app.use(cors());

const schema = gql`
    type Query {
        users: [User!]
        user(id: ID!): User 
        me:User
        
        messages: [Message!]!
        message(id: ID!): Message!
    }

    type Mutation {
        createMessage(text: String!): Message!
    }

    type User {
        id: ID!
        username: String!
        messages: [Message!]
    }
    
    type Message {
        id: ID!
        text: String!
        user: User!
    }
`;

let users = {
    1: {
        id: '1',
        username: 'Adam Martin',
        messageIds: [1],
    },
    2: {
        id: '2',
        username: 'Jonathan Barclay',
        messageIds: [2],
    },
};
const me = users[1];

let messages = {
    1: {
        id: '1',
        text: 'Hello World',
        userId: '1',
    },
    2: {
        id: '2',
        text: 'Bye World',
        userId: '2',
    },
};

const resolvers = {
    Query: {
        users: () => {
            return Object.values(users);
        },
        user: (parent, { id }) => {
            return users[id];
        },
        me: (parent, args, { me }) => {
            return me;
        },
        messages: () => {
            return Object.values(messages);
        },
        message: (parent, { id }) => {
            return messages[id];
        },
    },

    Mutation: {
        createMessage: (parent, {text}, {me}) => {
            const id = uuidv4();
            const message = {
                id,
                text, 
                userId: me.id,
            };

            return message;
        },
    },

    User: {
        messages: user => {
            return Object.values(messages).filter(
                message => message.userId === user.id,
            );
        },
    },

    Message: {
        user: message => {
            return users[message.userId];
        },
    },
};


const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
        me: users[1],
    },
});



server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
})


// console.log ('Hello ever running Node.js project.');

// console.log(process.env.MY_SECRET);
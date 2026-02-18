"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
async function startServer() {
    try {
        const server = new apollo_server_express_1.ApolloServer({
            typeDefs: schema_1.typeDefs,
            resolvers: resolvers_1.resolvers,
            context: () => ({ prisma }),
        });
        await server.start();
        server.applyMiddleware({ app: app });
        app.listen(4000, () => {
            console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
        });
    }
    catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}
startServer();

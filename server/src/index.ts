import { ApolloServer } from "apollo-server-express";
import express, { Application } from "express";
import { PrismaClient } from "@prisma/client";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

const prisma = new PrismaClient();
const app: Application = express();

async function startServer() {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({ prisma }),
    });

    await server.start();
    server.applyMiddleware({ app: app as any });

    app.listen(4000, () => {
      console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();

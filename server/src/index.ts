import "dotenv/config";
import express, { Application } from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

const prisma = new PrismaClient();
const app: Application = express();

// Parse whitelist from env
const whitelist = (process.env.CORS_WHITELIST || "").split(",");

const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin || whitelist.includes(origin)) {
      // Allow requests with no origin (e.g., Postman) or in whitelist
      callback(null, true);
    } else {
      callback(new Error(`CORS error: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ prisma }),
  });

  await server.start();
  server.applyMiddleware({ app: app as any, cors: false }); // disable Apollo internal CORS

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(
      `Server ready at http://localhost:${PORT}${server.graphqlPath}`,
    ),
  );
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});

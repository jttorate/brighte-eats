import { gql } from "apollo-server-express";

export const typeDefs = gql`
  enum Service {
    delivery
    pick_up
    payment
  }

  type Lead {
    id: ID!
    name: String!
    email: String!
    mobile: String!
    postcode: String!
    services: [Service!]!
    createdAt: String!
  }

  type Query {
    leads: [Lead!]!
    lead(id: ID!): Lead
  }

  type Mutation {
    register(
      name: String!
      email: String!
      mobile: String!
      postcode: String!
      services: [Service!]!
    ): Lead!
  }
`;

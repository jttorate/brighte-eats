import { gql } from "apollo-server-express";

/**
 * GraphQL schema definitions for the Leads API.
 *
 * @remarks
 * - Enum `Service` defines the possible services a lead can request.
 * - Type `Lead` defines the structure of a lead object.
 * - `Query` provides:
 *   - `leads` – fetch all leads
 *   - `lead` – fetch a single lead by ID
 * - `Mutation` provides:
 *   - `register` – create a new lead with associated services
 */
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

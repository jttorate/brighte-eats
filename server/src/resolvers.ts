/**
 * GraphQL resolvers for the Leads API.
 *
 * @remarks
 * Contains Query and Mutation resolvers for fetching and creating leads.
 * Also includes a field resolver for `Lead.services`.
 *
 * Query Resolvers:
 * - `leads` – Fetches all leads with their associated services.
 * - `lead` – Fetches a single lead by ID, including services.
 *
 * Mutation Resolvers:
 * - `register` – Creates a new lead and associates selected services.
 *
 * Field Resolvers:
 * - `Lead.services` – Maps the services relation to a simple array of service names.
 */
export const resolvers = {
  Query: {
    leads: async (_: any, __: any, { prisma }: any) => {
      // Include related services
      return await prisma.lead.findMany({ include: { services: true } });
    },
    lead: async (_: any, { id }: any, { prisma }: any) => {
      return await prisma.lead.findUnique({
        where: { id: Number(id) },
        include: { services: true },
      });
    },
  },
  Mutation: {
    register: async (_: any, args: any, { prisma }: any) => {
      const { services, ...leadData } = args;

      return await prisma.lead.create({
        data: {
          ...leadData,
          services: {
            create: services.map((s: string) => ({ service: s })),
          },
        },
        include: { services: true }, // include services for GraphQL response
      });
    },
  },
  Lead: {
    services: (parent: any) => parent.services.map((s: any) => s.service),
  },
};

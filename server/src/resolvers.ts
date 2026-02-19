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

export const resolvers = {
  Query: {
    leads: async (_: any, __: any, { prisma }: any) => {
      return await prisma.lead.findMany();
    },
    lead: async (_: any, { id }: any, { prisma }: any) => {
      return await prisma.lead.findUnique({ where: { id: Number(id) } });
    },
  },
  Mutation: {
    register: async (_: any, args: any, { prisma }: any) => {
      return await prisma.lead.create({
        data: {
          ...args,
          services: JSON.stringify(args.services),
        },
      });
    },
  },
  Lead: {
    services: (parent: any) => JSON.parse(parent.services),
  },
};

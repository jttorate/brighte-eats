"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
exports.resolvers = {
    Query: {
        leads: async (_, __, { prisma }) => {
            return await prisma.lead.findMany();
        },
        lead: async (_, { id }, { prisma }) => {
            return await prisma.lead.findUnique({ where: { id: Number(id) } });
        },
    },
    Mutation: {
        register: async (_, args, { prisma }) => {
            return await prisma.lead.create({
                data: {
                    ...args,
                    services: JSON.stringify(args.services),
                },
            });
        },
    },
    Lead: {
        services: (parent) => JSON.parse(parent.services),
    },
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolvers_1 = require("../resolvers");
test("register mutation returns lead with services", async () => {
    const args = {
        name: "Test",
        email: "test@example.com",
        mobile: "123456",
        postcode: "0000",
        services: ["delivery"],
    };
    const prisma = {
        lead: {
            create: jest.fn().mockResolvedValue({
                ...args,
                id: 1,
                services: JSON.stringify(args.services),
            }),
        },
    };
    const result = await resolvers_1.resolvers.Mutation.register(null, args, { prisma });
    expect(result.name).toBe("Test");
    expect(JSON.parse(result.services)).toContain("delivery");
});

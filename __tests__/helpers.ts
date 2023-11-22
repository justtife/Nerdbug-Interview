import { faker } from "@faker-js/faker";
export const testUser = {
    email: `${faker.person.firstName()}@test.com`,
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    username: faker.person.middleName(),
    role: "admin",
    password: "testing@1234",
    repeat_password: "testing@1234",
};
export function userResponse(
    res: any,
    status: number,
    message: string,
    extended: boolean = false
) {
    const expectedOutput = {
        status: 'success',
        message,
        data: extended ? expect.arrayContaining(
            Array.from({ length: res.body.data.length }, (_, index) => {
                const expected = {
                    userID: expect.any(String),
                    email: expect.any(String),
                    firstname: expect.any(String),
                    lastname: expect.any(String),
                    username: expect.any(String),
                    password: expect.any(String),
                    user_role: expect.objectContaining({
                        role: 'user' || "admin" || "owner",
                        roleID: expect.any(String),
                    }),
                };
                return expect.objectContaining(expected);
            })
        ) : expect.objectContaining({
            userID: expect.any(String),
            email: testUser.email,
            firstname: testUser.firstname,
            lastname: testUser.lastname,
            username: testUser.username,
            user_role: expect.objectContaining({
                role: 'admin',
                roleID: expect.any(String),
            })
        }),
        statusCode: status,
        code: 12345
    };
    expect(res.header["content-type"]).toContain("application/json");
    expect(res.status).toBe(status);
    expect(res.body).toEqual(expect.objectContaining(expectedOutput));
    expect(res.body).not.toEqual(expect.objectContaining({
        password: expect.any(String),
        token: expect.any(String),
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
        locked: expect.any(Boolean),
    }));
}
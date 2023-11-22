import * as dotenv from "dotenv";
dotenv.config();
import supertest from 'supertest';
import { TestSetup } from './config';
import { config } from '../src/config'
const testSetup = new TestSetup();
import { AppConfig } from "../src";
const appConfig = new AppConfig(config)
const request = supertest(appConfig.getApp())
import { testUser, userResponse } from './helpers';
import { faker } from "@faker-js/faker";
describe("TESTING THE SERVICE", () => {
    beforeAll(async () => {
        await testSetup.setup();
        const numOfUsers = 5;
        for (let i = 0; i < numOfUsers; i++) {
            const user = {
                email: `${faker.person.firstName()}@test.com`,
                firstname: faker.person.firstName(),
                lastname: faker.person.lastName(),
                username: faker.person.middleName(),
                password: "testing@1234",
                repeat_password: "testing@1234",
            };
            // Make requests to create users
            await request
                .post('/api/v1/users/signup')
                .set('user-agent', 'PostmanRuntime/7.29.2')
                .send(user)
                .catch((error) => {
                    console.error('Error creating user:', error);
                });
        }
    });
    afterAll(async () => {
        await testSetup.teardown();
    });
    let userID: string;
    let token: string;
    describe('Success messages', () => {
        it("Should create a new user", async () => {
            await request
                .post("/api/v1/users/signup")
                .set("user-agent", "PostmanRuntime/7.29.2")
                .send(testUser)
                .then((res) => {
                    userID = res.body.data.userID;
                    token = res.body.token;
                    userResponse(res, 201, "Signup successful");
                });
        });
        it("Should log a user in", async () => {

            await request
                .post("/api/v1/users/login")
                .send({ user: testUser.email, password: testUser.password })
                .then((res) => {
                    userID = res.body.data.userID;
                    token = res.body.token;
                    userResponse(res, 200, "Login successful");
                });
        });
        it("Should get a user", async () => {
            await request
                .get(`/api/v1/users/${userID}`)
                .set("Authorization", `Bearer ${token}`)
                .then((res) => {
                    userResponse(res, 200, `User ${userID} profile`);
                });
        });
        it("Should get all users", async () => {
            await request
                .get(`/api/v1/users/all`)
                .set("Authorization", `Bearer ${token}`)
                .then((res) => {
                    userResponse(res, 200, "All Users", true);
                });
        });
        // it("Should get all admins", async () => {
        //     await request
        //         .get(`/api/v1/users/admins`)
        //         .set("Authorization", `Bearer ${token}`)
        //         .then((res) => {
        //             userResponse(res, 200, "All Admins", true)
        //         })
        // })
        it("Should update a user", async () => {
            await request
                .patch(`/api/v1/users/${userID}`)
                .set("Authorization", `Bearer ${token}`).send({
                    firstname: "John",
                    lastname: "Doe",
                    email: "johndoe@email.com"
                })
                .then((res) => {
                    expect(res.body).toEqual(expect.objectContaining({
                        status: 'success',
                        message: 'Account Updated successfully',
                        statusCode: 200,
                        code: 12345
                    }))
                })
        })
        it("Should delete a user", async () => {
            await request
                .delete(`/api/v1/users/${userID}`)
                .set("Authorization", `Bearer ${token}`).send({ password: testUser.password, repeat_password: testUser.repeat_password }).then((res) => {
                    expect(res.body).toEqual(expect.objectContaining({
                        message: "Account successfully deleted",
                    }))
                })
        })
    });
    describe("Error Messages", () => {
        it('should should return not found error', async () => {
            await request.get("/hellowordl").expect(404,).then((res) => {
                expect(res.body).toEqual({
                    status: 'failed',
                    message: 'NotFoundError',
                    data: 'Route /hellowordl cannot be found',
                    statusCode: 404,
                    code: 13356
                })
            })
        });
        it('should return unauthenticated error', async () => {
            await request
                .get(`/api/v1/users/${userID}`)
                .set("Authorization", `Bearer ${token}`).expect(401)
                .then((res) => {
                    expect(res.body).toEqual({
                        status: 'failed',
                        message: "You are not logged in",
                        statusCode: 401,
                        code: 12563
                    })
                });
        });

    })
})
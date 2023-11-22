import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "Joi";
import { UserRole } from "..";
import { Error } from "..";
class ValidateUsers {
    static createUser(req: Request, res: Response, next: NextFunction) {
        const createUserSchema = Joi.object({
            body: Joi.object({
                firstname: Joi.string().min(3).max(50).default("John").required(),
                lastname: Joi.string().min(3).max(50).required().default("doe"),
                username: Joi.string().min(3).max(50).default("Dan"),
                email: Joi.string().email().default("johndoe@email.com").required(),
                role: Joi.string().valid(UserRole.admin, UserRole.owner, UserRole.user),
                password: Joi.string()
                    .min(6)
                    .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
                    .required()
                    .default("Passcode"),
                repeat_password: Joi.string()
                    .required()
                    .equal(Joi.ref("password"))
                    .default("Passcode")
                    .messages({
                        "any.only": "Passwords do not match",
                    }),
            }).with("password", "repeat_password"),
            query: Joi.object({}),
            params: Joi.object({}),
        })
        return ValidateUsers.validate(createUserSchema)(req, res, next);
    }
    static loginUser(req: Request, res: Response, next: NextFunction) {
        const logUserInSchema = Joi.object({
            body: Joi.object({
                user: Joi.alternatives([Joi.string(), Joi.string().email()])
                    .default("johndoe@email.com")
                    .required(),
                password: Joi.string()
                    .min(6)
                    .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
                    .required()
                    .default("Passcode"),
            }),
            query: Joi.object({}),
            params: Joi.object({}),
        });
        return ValidateUsers.validate(logUserInSchema)(req, res, next);
    }
    static getSingleUser(req: Request, res: Response, next: NextFunction) {
        const getSingleUserSchema = Joi.object({
            body: Joi.object({}),
            query: Joi.object({}),
            params: Joi.object({
                userID: Joi.string().guid().required().default("432ba85"),
            }),
        });
        return ValidateUsers.validate(getSingleUserSchema)(req, res, next);
    }
    static deleteUserAccount(req: Request, res: Response, next: NextFunction) {
        const deleteUserAccountSchema = Joi.object({
            body: Joi.object({
                password: Joi.string()
                    .min(6)
                    .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
                    .required()
                    .default("Passcode"),
                repeat_password: Joi.string()
                    .required()
                    .equal(Joi.ref("password"))
                    .default("Passcode")
                    .messages({
                        "any.only": "Passwords do not match",
                    }),
            }).with("password", "repeat_password"),
            query: Joi.object({}),
            params: Joi.object({
                userID: Joi.string().guid().default("432ba85"),
            }),
        })
        return ValidateUsers.validate(deleteUserAccountSchema)(req, res, next);
    }
    static updateUser(req: Request, res: Response, next: NextFunction) {
        const updateUserSchema = Joi.object({
            body: Joi.object({
                firstname: Joi.string().min(3).max(50).required().default("Jane"),
                lastname: Joi.string().min(3).max(50).required().default("Smith"),
                username: Joi.string().min(3).max(50).default("Jane Smith"),
                email: Joi.string().email().required().default("johndoe@email.com"),
                role: Joi.string().valid(UserRole.admin, UserRole.owner, UserRole.user),

            }),
            query: Joi.object({}),
            params: Joi.object({
                userID: Joi.string().guid(),
            }),
        });
        return ValidateUsers.validate(updateUserSchema)(req, res, next);
    }
    private static validate(schema: ObjectSchema) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await schema.validateAsync({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                });
                next();
            } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
                const fieldName = error.details[0].context.key;
                const errorMessage = error.details[0].message.replace(
                    /^.+\"\s/, // eslint-disable-line no-useless-escape
                    `${fieldName} `,
                );
                throw new Error.BadRequest(errorMessage);
            }
        };
    }
}
export default ValidateUsers;

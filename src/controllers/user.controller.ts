import { Request, Response, NextFunction } from "express";
import { UserInterface } from "../utils";
import passport from "passport";
import { UserService } from "../services";
import { CreateToken, ResponseHandler, StatusCode, Error, Auth } from "../utils";
export default class User {
    static async createUser(req: Request, res: Response, next: NextFunction) {
        passport.authenticate(
            "signup",
            function (err: Error.Custom, user: UserInterface, info: any) {
                if (err) {
                    return next(err);
                }
                //If any Error, info about the Error is generated
                if (info) {
                    return ResponseHandler.error(res, {
                        message: info.message,
                        code: info.code || StatusCode.BADREQUEST_ERROR,
                        statusCode: info.statusCode,
                    });
                }
                req.logIn(user, async (err) => {
                    if (err) {
                        return next(err);
                    }
                    const initializeToken = new CreateToken({ req, res, user })
                    const token = initializeToken.createJWT();
                    initializeToken.attachTokenToCookies(res, token)
                    return ResponseHandler.success(res, {
                        message: "Signup successful",
                        data: user,
                        token,
                        statusCode: StatusCode.CREATED,
                    })
                });
            }
        )(req, res, next);
    }
    static async loginUser(req: Request, res: Response, next: NextFunction) {
        passport.authenticate(
            "login",
            async (err: Error.Custom, user: UserInterface, info: any) => {
                if (err) {
                    return next(err);
                }
                if (info) {
                    return ResponseHandler.error(res, {
                        message: info.message,
                        code: info.code || StatusCode.BADREQUEST_ERROR,
                        statusCode: info.statusCode,
                    });
                }
                req.logIn(user, async (err) => {
                    if (err) {
                        return next(err);
                    }
                    const initializeToken = new CreateToken({ req, res, user })
                    const token = initializeToken.createJWT();
                    initializeToken.attachTokenToCookies(res, token)
                    ResponseHandler.success(res, {
                        message: "Login successful",
                        token,
                        data: user,
                    })
                });
            }
        )(req, res, next);
    }
    static async getAllUsers(req: Request, res: Response) {
        const users = await UserService.getAllUser();
        ResponseHandler.success(res, {
            message: "All Users",
            status: "success",
            data: users,
        })
    }
    static async getUserByID(req: Request, res: Response) {
        const { userID } = req.params;
        await Auth.checkPermission(req.user as any, userID as string);
        const user = await UserService.getUserByID(userID as string);
        if (!user) {
            throw new Error.NotFound(
                `User with id: ${req.params.id} does not exist`
            );
        }
        ResponseHandler.success(res, {
            message: `User ${userID} profile`,
            status: "success",
            data: user,
        })
    }
    static async updateProfile(req: Request, res: Response) {
        const { userID } = req.params;
        await UserService.updateUser(req.body, userID)
        ResponseHandler.success(res, { message: "Account Updated successfully" })
    }
    //Delete Controller
    static async deleteAccount(req: Request, res: Response) {
        const { password } = req.body;
        const { userID } = req.params;
        await Auth.checkPermission(req.user as any, userID as string);
        const user = await UserService.getUserByID(userID as string);
        if (!user) {
            throw new Error.NotFound("Account does not exist");
        }
        const isPasswordValid = await user.isValidPassword(password);
        if (!isPasswordValid) {
            throw new Error.Unauthorised(
                "Invalid Password, Unauthorized to perform operation"
            );
        }
        await user.destroy();
        ResponseHandler.success(res, { message: "Account successfully deleted" })
    }
    static async getAllAdmin(req: Request, res: Response) {
        const admin = await UserService.getAllAdmin();
        ResponseHandler.success(res, {
            message: "All Admins",
            status: "success",
            data: admin,
        })
    }
}

import { Request, Response, NextFunction } from 'express'
import { Error, UserInterface, ResponseHandler, StatusCode } from "..";
import { RoleService } from '../../services';
import passport from "passport";
class Auth {
    static async authUser(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt", function (err: Error, user: any, info: any) {
            if (err) {
                return next(err);
            }
            if (info) {
                return ResponseHandler.error(res, {
                    message: info.message,
                    code: info.code || StatusCode.AUTH_ERROR,
                    statusCode: info.statusCode,
                });
            }
            req.user = user;
            return next();
        })(req, res, next);
    }
    static async checkPermission(
        requestUser: UserInterface,
        resourceUserId: string
    ) {
        const user = await RoleService.checkRoleByUser(requestUser.userID)
        if (
            user!.role &&
            (user!.role === "admin" || user!.role === "owner")
        )
            return;
        if (requestUser!.userID === resourceUserId.toString()) return;
        throw new Error.Unauthorised("You are unauthorized to carry out this operation");
    }
    static authorizePermissions = (...roles: string[]) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            const reqUser = req.user as UserInterface
            const user = await RoleService.checkRoleByUser(reqUser!.userID)
            if (
                !user ||
                !user.role ||
                !roles.includes(user.role)
            ) {
                throw new Error.Unauthorised("Unauthorized to access this route");
            }
            next();
        };
    };
}
export default Auth;

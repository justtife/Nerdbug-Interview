import { Request } from "express";
import { ResponseInterface, StatusCode } from ".."
import { config } from "../../config";
import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy } from "passport-jwt"
import { UserService } from "../../services";
/**
 *
 * @param passport
 */
function PassportLoad(passport: PassportStatic) {
    //SIGN UP STRATEGY
    passport.use(
        "signup",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true,
            },
            async (req: Request, email: string, password: string, done: Function): Promise<void> => {
                try {
                    const newUser = await UserService.createUser({
                        ...req.body,
                        email,
                        password,
                    });
                    done(null, newUser);
                } catch (error) {
                    done(error); // Pass the error to the passport callback
                }
            }
        )
    );
    //LOGIN STRATEGY
    passport.use(
        "login",
        new LocalStrategy(
            {
                usernameField: "user",
                passwordField: "password",
            },
            async (user: string, password: string, done: Function): Promise<void> => {
                let errorMessage: ResponseInterface;
                const userDetail = await UserService.loginUser(user);
                if (!userDetail) {
                    errorMessage = {
                        message: "User does not exist, please sign up",
                        statusCode: StatusCode.NOT_FOUND,
                        code: StatusCode.USER_NOT_FOUND,
                    };
                    return done(null, false, errorMessage);
                } else {
                    const checkPass = await userDetail.isValidPassword(password);
                    if (!checkPass) {
                        errorMessage = {
                            message:
                                "Invalid Credentials, please ensure login details are correct",
                            code: StatusCode.BADREQUEST_ERROR,
                        };
                        return done(null, false, errorMessage);
                    }
                    done(null, userDetail);
                }
            }
        )
    );
    //Cookie Extractor
    let jwtExtractor = function (req: Request): string {
        let token: any = null;
        const { authorization } = req.headers;
        if (authorization && authorization.startsWith("Bearer ")) {
            token = authorization.split(" ")[1];
        } else if (req && req.signedCookies.accessToken) {
            token = req.signedCookies["accessToken"];
        }
        return token;
    };
    //JWT Strategy
    passport.use(
        "jwt",
        new JWTStrategy(
            {
                secretOrKey: config.JWT_SECRET as string,
                jwtFromRequest: jwtExtractor,
            },
            async function (jwt_payload: any, done: Function) {
                //Check if the user saved in token exist in database
                const user = await UserService.getUserByID(jwt_payload.userID);
                //If the user does not exist, throw not logged in user
                if (!user) {
                    return done(null, false, {
                        message: "You are not logged in",
                        statusCode: StatusCode.UNAUTHORIZED,
                        code: StatusCode.AUTH_ERROR,
                    });
                }
                done(null, user);
            }
        )
    );
    passport.serializeUser<any, any>(
        (req: Request, user: any, done: Function): void => {
            done(null, user.userID);
        }
    );
    //Deserialize User
    passport.deserializeUser<any>(async (userID: string, done: Function): Promise<void> => {
        await UserService.getUserByID(userID)
            .then((user) => {
                done(null, user);
            })
            .catch((err: Error) => done(null, err));
    });
}
export default PassportLoad;

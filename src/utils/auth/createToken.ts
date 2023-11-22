import { sign } from "jsonwebtoken";
import { config } from "../../config";
import { TokenInterface, TokenUserInterface } from "..";
import { Response } from "express"
class Token {
    constructor(private readonly tokenArg: TokenInterface) { }
    private createTokenUser(): TokenUserInterface {
        const user = this.tokenArg.user;
        return {
            userID: user.userID,
            role: user.user_role!.roleID,
            firstname: user.firstname,
        }
    }
    public createJWT() {
        const token = sign(this.createTokenUser(), <string>config.JWT_SECRET, {
            // algorithm: "RS256",
            issuer: `Interview-${config.APP_ENV}`,
            subject: `${this.createTokenUser().userID}`,
            expiresIn: 60 * 60 * 24 * 30,
        })
        return token
    }
    public attachTokenToCookies(res: Response, token: string
    ): void {
        const sevenDays = 7 * 6 * 60 * 60 * 1000;
        res.cookie("accessToken", token, {
            httpOnly: true,
            signed: true,
            expires: new Date(Date.now() + sevenDays),
            secure: false,
        });
    };

}
export default Token;
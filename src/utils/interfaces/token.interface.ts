import { UserInterface } from ".";
import { Request, Response } from "express"
interface TokenArgs {
    req: Request;
    res: Response;
    user: UserInterface;
}
interface TokenUser {
    userID: string,
    role: string,
    firstname: string
}
export { TokenArgs as TokenInterface, TokenUser as TokenUserInterface };
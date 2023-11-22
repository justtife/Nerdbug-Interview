import Custom from "./custom.error";
import { StatusCode } from "../enums";
export default class Unauthenticated extends Custom {
    constructor(
        message: string,
        readonly name: string = "UnauthenticatedError",
        readonly statusCode: number = StatusCode.UNAUTHORIZED,
        readonly errorCode: number = StatusCode.AUTH_ERROR,
    ) {
        super(message, statusCode, errorCode);
        this.name = name;
    }
}

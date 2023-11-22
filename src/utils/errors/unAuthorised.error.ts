import Custom from "./custom.error";
import { StatusCode } from "../enums";
export default class Unauthorised extends Custom {
    constructor(
        message: string,
        readonly name: string = "UnAuthorisedError",
        readonly statusCode: number = StatusCode.UNAUTHORIZED,
        readonly errorCode: number = StatusCode.AUTH_ERROR,
    ) {
        super(message, statusCode, errorCode);
        this.name = name;
    }
}

import Custom from "./custom.error";
import { StatusCode } from "../enums";
export default class Server extends Custom {
    constructor(
        message: string,
        readonly name: string = "InternalServerError",
        readonly statusCode: number = StatusCode.INTERNAL_SERVER_ERROR,
        readonly errorCode: number = StatusCode.SERVER_ERROR,
    ) {
        super(message, statusCode, errorCode);
        this.name = name;
    }
}

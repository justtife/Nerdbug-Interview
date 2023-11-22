import { StatusCode, ResponseInterface } from "..";
import { Response } from "express";
/**
 * API RESPONSE
 */
class Output {
    /**
     * SUCCESS RESPONSE FORMAT
     * @param res
     * @param param1(object)
     */
    static success(
        res: Response,
        { message, data, statusCode, token }: ResponseInterface,
    ): void {
        const output: ResponseInterface = {
            status: "success",
            message,
            data,
            token,
            statusCode: statusCode || StatusCode.OK,
            code: StatusCode.SUCCESS_RESPONSE,
        };
        res.status(output.statusCode as number).json(output);
    }
    /**
     * ERROR RESPONSE FORMAT
     * @param res
     * @param param1(object)
     */
    static error(
        res: Response,
        { message, data, statusCode, code, status }: ResponseInterface,
    ): void {
        const output: ResponseInterface = {
            status: status || "failed",
            message,
            data,
            statusCode: statusCode || StatusCode.BAD_REQUEST,
            code: code || StatusCode.ERROR_RESPONSE,
        };
        res.status(output.statusCode as number).json(output);
    }
}
export default Output;

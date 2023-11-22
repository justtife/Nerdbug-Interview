export default interface OutputResponse {
    message: string;
    data?: object | string | string[] | any;
    statusCode?: number;
    code?: number;
    token?: string;
    status?: "success" | "failed" | "pending";
}

export default class Custom extends Error {
    protected constructor(
        message: string,
        public statusCode: number,
        public errorCode: number,
    ) {
        super(message);
    }
}

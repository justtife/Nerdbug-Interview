const mainConfig: Record<string, Record<string, string | Buffer | number | Boolean | Record<string, string | number | Boolean | Record<string, string | number>>>> = {
    development: {
        APP_ENV: process.env.APP_ENV as string,
        SERVICE: "userservice",
        DB: {
            name: process.env.DEV_DB_NAME as string,
            user: process.env.DEV_DB_USER as string,
            pass: process.env.DEV_DB_PASS as string,
            host: process.env.DEV_DB_HOST as string,
            port: (process.env.DEV_DB_PORT || 5432) as number,
            dialect: 'mysql',
            logging: false as Boolean,
            pool: {
                max: 5,
                min: 0,
                acquire: 100000,
                idle: 10000,
            },
        },
        JWT_SECRET: process.env.JWT_SECRET as string,
        SESSION_SECRET: process.env.SESSION_SECRET as string,
        COOKIE_SECRET: process.env.COOKIE_SECRET as string,
    },
    production: {
    },
    test: {
        APP_ENV: process.env.APP_ENV as string,
        SERVICE: "userservice",
        DB: {
            name: process.env.TEST_DB_NAME as string,
            user: process.env.TEST_DB_USER as string,
            pass: process.env.TEST_DB_PASS as string,
            host: process.env.TEST_DB_HOST as string,
            port: (process.env.TEST_DB_PORT || 5432) as number,
            dialect: 'mysql',
            logging: false as Boolean,
            pool: {
                max: 5,
                min: 0,
                acquire: 100000,
                idle: 10000,
            },
        },
        JWT_SECRET: process.env.JWT_SECRET as string,
        SESSION_SECRET: process.env.SESSION_SECRET as string,
        COOKIE_SECRET: process.env.COOKIE_SECRET as string,
    },
};
const env: Record<string, any> = mainConfig[process.env.APP_ENV as string] || mainConfig["development"];
export default env;

import { config } from ".";
const DB = config.DB as Record<string, string | number>
const sessionDBOptions = {
    host: DB.host,
    port: DB.port,
    user: DB.user,
    password: DB.pass,
    database: DB.name,
    clearExpired: true,
    checkExpirationInterval: 900000,//Fifteen minutes
    schema: {
        tableName: `${config.SERVICE}-session`,
        columnNames: {
            session_id: 'sessionID',
            expires: 'expires',
            data: 'data'
        }
    }
};
export default sessionDBOptions
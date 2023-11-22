import {
    Sequelize,
} from "sequelize";
import { DBInterface } from "../utils";
const sequelize = ({
    name,
    user,
    pass,
    host,
    port,
    dialect,
    pool,
}: DBInterface): Sequelize => {
    return new Sequelize(name, user, pass, {
        host,
        port,
        dialect,
        pool,
    });
};
export {
    sequelize as DB,
};

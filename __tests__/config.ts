import 'regenerator-runtime/runtime';
import { DBConnection } from '../src/utils';
import { Sequelize } from "sequelize"
export class TestSetup {
    private sequelize: Sequelize;
    constructor() {
        this.sequelize = DBConnection.db
    }
    async setup() {
        await this.sequelize.sync({ force: true });
    }
    async teardown() {
        await this.sequelize.drop();
        await this.sequelize.close();
    }
}

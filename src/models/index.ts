import { UserModel } from "./user.model";
import { RoleModel } from "./role.model";
import { Logger } from "../logger";
//User Associations
UserModel.hasOne(RoleModel, { foreignKey: 'userID', as: "user_role" })
//Role Associations
RoleModel.belongsTo(UserModel, { foreignKey: 'userID', as: "user" })
async function syncModels() {
    try {
        await UserModel.sync();
        await RoleModel.sync();
        Logger.info("Models synchronized successfully")
    } catch (error) {
        Logger.error('Error synchronizing models:', error);
    }
}
syncModels()
export { UserModel, RoleModel }
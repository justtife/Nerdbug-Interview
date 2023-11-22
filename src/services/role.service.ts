import { RoleModel, } from "../models";
import { RoleInterface, Error } from "../utils"
export default class User {
    static async checkRole(roleID: string): Promise<RoleInterface | Error> {
        const role = await RoleModel.findByPk(roleID)
        if (!role) {
            throw new Error.NotFound("User does not exist")
        }
        return role;
    }
    static async checkRoleByUser(userID: string): Promise<RoleModel | null> {
        const role = await RoleModel.findOne({ where: { userID } })
        if (!role) {
            throw new Error.NotFound("User does not exist")
        }
        return role;
    }
}

import { RoleService } from ".";
import { UserModel, RoleModel } from "../models";
import { UserInterface, Error, DBConnection } from "../utils";
import { Op } from "sequelize"
export default class User {
    static async createUser(userDetail: any): Promise<UserInterface | Error> {
        const sequelize = DBConnection.db
        const { firstname, lastname, username, email, password, role } = userDetail
        const user = await User.getUserByEmail(email);
        if (user) {
            throw new Error.Duplicate(
                "User with email exist, please signup with a new email"
            );
        }
        const t = await sequelize.transaction();
        try {
            let newUser = UserModel.build();
            newUser.firstname = firstname;
            newUser.lastname = lastname;
            newUser.username = username;
            newUser.email = email;
            newUser.password = password;
            const mainUser = await newUser.save({ transaction: t });
            let userRole = RoleModel.build();
            if (role) userRole.role = role
            userRole.userID = mainUser.userID;
            await userRole.save({ transaction: t });
            let createdUser = mainUser.toJSON();
            createdUser["user_role"] = userRole.toJSON();
            await t.commit();
            return createdUser;
        }
        catch (error) {
            if (t) {
                t.rollback();
            }
            throw new Error.Server(`Database Error: ${error}`)
        }
    }
    static async getUserByEmail(email: string): Promise<UserModel | null | Error> {
        const user = await UserModel.findOne({ where: { email }, attributes: { exclude: ["password", "othername", "username", "phone_number", "createdAt", "updatedAt"] } })
        return user;
    }
    static async getUserByID(id: string): Promise<UserModel | null> {
        const user = await UserModel.findByPk(id, {
            include: [
                { model: RoleModel, as: "user_role", attributes: { exclude: ["userID", "locked", "createdAt", "updatedAt"] } },
            ]
        });
        return user;
    }
    static async loginUser(userData: string): Promise<UserModel | null> {
        const loginUser = await UserModel.findOne({
            where: {
                [Op.or]: [
                    { email: userData },
                    { lastname: userData } // Assuming 'name' is an association
                ]
            },
            include: [
                { model: RoleModel, as: "user_role", attributes: { exclude: ["userID", "locked", "createdAt", "updatedAt"] } },
            ],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        return loginUser;
    }
    static async getAllUser(): Promise<UserInterface[] | any> {
        const users = await UserModel.findAll({
            include: [{
                model: RoleModel,
                as: 'user_role',
                where: { role: 'user' } // Specify the condition for the role ('admin' in this case)
            }]
        })
        if (!users) {
            throw new Error.NotFound("No user was found")
        }
        return users
    }
    static async getAllAdmin(): Promise<UserModel[] | null> {
        const admins = await UserModel.findAll({
            include: [{
                model: RoleModel,
                as: 'user_role',
                where: { role: { [Op.not]: "user" } } // Specify the condition for the role ('admin' in this case)
            }]
        })
        if (!admins) {
            throw new Error.NotFound("No admin was found")
        }
        return admins
    }
    static async updateUser(body: any, userID: string): Promise<UserModel | Error> {
        const sequelize = DBConnection.db
        const { firstname, lastname, username, email, role } = body;
        const t = await sequelize.transaction();
        const user = await User.getUserByID(userID);
        try {
            user!.firstname = firstname;
            user!.lastname = lastname;
            user!.username = username;
            user!.email = email;
            const mainUser = await user!.save({ transaction: t });
            if (role) {
                const userRole = await RoleService.checkRoleByUser(userID)
                userRole!.role = role
                await userRole!.save({ transaction: t });
            }
            await t.commit();
            return mainUser;
        }
        catch (error) {
            if (t) {
                t.rollback();
            }
            throw new Error.Server(`Database Error: ${error}`)
        }
    }
}

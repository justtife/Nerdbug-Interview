import { Model, DataTypes } from "sequelize";
import { RoleInterface, UserRole, DBConnection } from "../utils"
import { UserModel } from ".";
class Role
    extends Model<RoleInterface>
    implements RoleInterface {
    roleID!: string;
    userID!: string;
    locked!: boolean;
    role!: UserRole;
}
Role.init(
    {
        roleID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userID: {
            type: DataTypes.UUID,
            references: {
                model: UserModel,
                key: 'userID',
            },
            allowNull: false
        },
        locked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        role: {
            type: DataTypes.ENUM(UserRole.admin, UserRole.owner, UserRole.user),
            allowNull: false,
            defaultValue: UserRole.user
        }
    },
    {
        indexes: [{ fields: ['userID', 'locked'] }],
        defaultScope: { attributes: { exclude: ['updatedAt', 'createdAt', 'userID', 'locked'] } },
        sequelize: DBConnection.db,
        tableName: "roles",
        modelName: "Role"
    }
);
export { Role as RoleModel };

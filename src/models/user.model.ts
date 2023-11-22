import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";
import { UserInterface, DBConnection } from "../utils"
class User
    extends Model<UserInterface>
    implements UserInterface {
    userID!: string;
    email!: string;
    password!: string;
    firstname!: string;
    lastname!: string;
    username?: string;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
    async isValidPassword(password: string): Promise<boolean | Error> {
        return await bcrypt.compare(password, this.password);
    }
}
User.init(
    {
        userID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstname: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
        },
    },
    {
        hooks: {
            beforeSave: async (user) => {
                if (user.changed("password")) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
        indexes: [{
            fields: ["email", "username"]
        }],
        defaultScope: { attributes: { exclude: ['updatedAt', 'createdAt'] } },
        sequelize: DBConnection.db,
        tableName: "users",
        modelName: "User"
    }
);
export { User as UserModel };

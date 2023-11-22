import { RoleInterface } from ".";
export interface UserAttributes {
    userID: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    username?: string;
    user_role?: RoleInterface;
}


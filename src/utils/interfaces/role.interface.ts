import { UserRole } from ".."
export interface RoleAttributes {
    roleID: string;
    userID:string;
    locked: boolean;
    role: UserRole;
}
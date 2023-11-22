import { Router } from "express";
import { Auth, UserValidation } from "../utils";
const userRouter = Router();
import { UserController } from "../controllers";
userRouter.post(
    "/signup",
    UserValidation.createUser,
    UserController.createUser
);
userRouter.post("/login", UserValidation.loginUser, UserController.loginUser);
userRouter.get(
    "/all",
    Auth.authUser,
    Auth.authorizePermissions("admin", "owner"),
    UserController.getAllUsers
);
userRouter.route("/admins").get(
    Auth.authUser,
    Auth.authorizePermissions("admin", "owner"),
    UserController.getAllAdmin)
userRouter
    .route("/:userID")
    .get(
        Auth.authUser,
        UserValidation.getSingleUser,
        UserController.getUserByID
    )
    .patch(Auth.authUser, UserValidation.updateUser, UserController.updateProfile)
    .delete(
        Auth.authUser,
        UserValidation.deleteUserAccount,
        UserController.deleteAccount
    );
export default userRouter;

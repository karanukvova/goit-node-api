import express from "express";
import usersController from "../../controllers/usersController.js";

import * as userSchemas from "../../models/users.js";
import { validateBody } from "../../decorators/index.js";
import authenticate from "../../middlewares/authenticate.js";


const userSignupValidate = validateBody(userSchemas.userSignupSchema);
const userSignInValidate = validateBody(userSchemas.userSigninSchema);

const usersRouter = express.Router();

usersRouter.post("/register", userSignupValidate, usersController.register);

usersRouter.post("/login", userSignInValidate, usersController.login);

usersRouter.get("/current", authenticate, usersController.getCurrent);

usersRouter.post("/signout", authenticate, usersController.signout);


export default usersRouter;

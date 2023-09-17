import express from "express";
import contactsController from "../../controllers/contactsController.js";

import contactsSchemas from "../../schemas/contactsSchemas.js";

import { validateBody } from "../../decorators/index.js";
import authenticate from "../../middlewares/authenticate.js";

const contactsAddValidate = validateBody(contactsSchemas.contactsAddSchema);


const contactsRouter = express.Router()
contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:id", contactsController.getById);

contactsRouter.post("/", contactsAddValidate, contactsController.add);

contactsRouter.put("/:id/favorite", contactsController.updateById);

contactsRouter.delete("/:id", contactsController.deleteById);

export default contactsRouter;
import Joi from "joi";

const contactsAddSchema = Joi.object({
  name: Joi.string().required().message("You must write name"),

  email: Joi.string().required().message("You must write email"),

  phone: Joi.string().required().message("You must write phone"),
  favorite: Joi.boolean(),
});

export default {
  contactsAddSchema,
};
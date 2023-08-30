import contactsServise from "./contacts.js"
import { program } from "commander";

const invokeAction = async ({ action, id, name, email, phone }) => {
  switch (action) {
    case "list":
      const allContacts = await contactsServise.getAllContacts();
      console.log(allContacts);
      break;
    case "get":
      const oneContact = await contactsServise.getContactById(id);
      console.log(oneContact);
      break;

    case "add":
      const newContact = await contactsServise.addContact(
        name,
        email,
        phone,
      );
      console.log(newContact);
      break;

    case "remove":
      const deleteContact = await contactsServise.removeContact(id);
      console.log(deleteContact);
      break;

    default:
      console.log("Unknown action");
  }
};
program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");
program.parse();

const options = program.opts();
invokeAction(options);

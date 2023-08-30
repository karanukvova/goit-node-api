import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";


const contactsPath = path.resolve("db", "contacts.json");

const updateMovies = (movies) =>
  fs.writeFile(contactsPath, JSON.stringify(movies, null, 2));

export const getAllContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
};

export const getContactById = async id => {
 const contacts = await getAllContacts();
 const result = contacts.find((item) => item.id === id);
 return result || null;
}

export const removeContact = async id => {
  const contacts = await getAllContacts();
  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await updateMovies(contacts);
  return result;
}

export const addContact= async (name, email, phone) => {
  const contacts = await getAllContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);

  await updateMovies(contacts);
  return newContact;
}

export default {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
};
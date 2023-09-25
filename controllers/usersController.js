import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar"
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp"



import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import User from "../models/users.js";

const postersPath = path.resolve("public", "avatars");


const register = async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already exist");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const url = gravatar.url(email);
  const fullUrl = `http:${url}`
  console.log('url: ', url);
  const result = await User.create({
    ...req.body,
    avatarURL:fullUrl,
    password: hashPassword,
  });
  res.status(201).json({
    email: result.email,
    subscription: result.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const { _id: id } = user;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });

}

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    subscription,
    email,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findOne({ _id });
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Signout success",
  });
};

const avatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
    const newPath = path.join(postersPath, filename);
    await fs.rename(oldPath, newPath);
    const avatarURL = path.join("avatars", filename);
    const result = await User.findByIdAndUpdate(_id, avatarURL);
    res.status(201).json(result);

  
};



export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  avatar: ctrlWrapper(avatar),
};

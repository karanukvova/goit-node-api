import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar"
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp"



import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import User from "../models/users.js";
import { nanoid } from "nanoid";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
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
  const verificationToken = nanoid();
  await sendEmail(email, verificationToken)
  console.log("token: ", verificationToken);
  const result = await User.create({
    ...req.body,
    avatarURL: fullUrl,
    password: hashPassword,
    verificationToken: verificationToken,
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
  if (!user.verify) {
    throw HttpError(401, "Email not verify");
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

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOneAndUpdate(
    {verificationToken},
    {
      verify: true,
      verificationToken: null,
    },
    { new: true }
  );
  console.log("user: ", user);
  if (!user) {
    throw HttpError(404, "User not found");
  }
  res.status(200).json({ message: "Verification successful" });

}

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  await sendEmail(email, user.verificationToken);
  res.status(200).json({ message: "Verification email sent" });
}

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  avatar: ctrlWrapper(avatar),
  verify: ctrlWrapper(verify),
  resendVerifyEmail:ctrlWrapper(resendVerifyEmail),
};

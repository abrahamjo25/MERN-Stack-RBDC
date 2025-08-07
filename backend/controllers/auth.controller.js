import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

import jwt from "jsonwebtoken";
export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (username && email && password) {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    try {
      await newUser.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      next(error);
    }
  } else {
    next(errorHandler(400, "Fill all required fields"));
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (email && password) {
    try {
      const userData = await User.findOne({ email });

      if (userData) {
        if (bcryptjs.compareSync(password, userData.password)) {
          const token = jwt.sign({ _id: userData._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          });
          const { password: pass, ...user } = userData._doc;

          res.status(200).json({token, user});
        } else {
          next(errorHandler(400, "Invalid password"));
        }
      } else {
        next(errorHandler(400, "Invalid username"));
      }
    } catch (err) {
      next(err);
    }
  } else {
    next(errorHandler(400, "Fill all required fields"));
  }
};

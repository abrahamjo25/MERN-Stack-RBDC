import User from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("roles", "name");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    next(errorHandler(400, "User id is required"));
  }
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  const { username, email, password, roles } = req.body;

  if (username && email && password) {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      roles,
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

export const updateUser = async (req, res, next) => {
  const { username, email, password, roles } = req.body;
  const { id } = req.params;
  if (!id) {
    next(errorHandler(400, "User id is required"));
  }
  if (username && email) {

    try {
      const role = await User.findByIdAndUpdate(
        id,
        { username, email, roles },
        { new: true }
      );
      res.status(200).json({
        payload: role,
        success: true,
        message: `User updated successfully`,
      });
    } catch (err) {
      next(err);
    }
  } else {
    next(errorHandler(400, "Fill all required fields"));
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(errorHandler(400, "User ID is required"));
  }

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({
      payload: user,
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const assignRoles = async (req, res, next) => {
  const { id } = req.params;
  const { roles } = req.body;
  if (!id) {
    next(errorHandler(400, "User id is required"));
  }
  if (!roles) {
    next(errorHandler(400, "Roles are required"));
  }
  try {
    const user = await User.findByIdAndUpdate(id, { roles }, { new: true });

    const { password, ...userdata } = user._doc;
    res.status(200).json({
      payload: userdata,
      success: true,
      message: `Roles assigned successfully`,
    });
  } catch (err) {
    next(err);
  }
};

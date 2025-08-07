import Permission from "../models/permission.models.js";
import { errorHandler } from "../utils/error.js";

export const getPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find().sort({ name: 1 });
    res.status(200).json(permissions);
  } catch (err) {
    next(err);
  }
};

export const getPermissionsById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    next(errorHandler(400, "Permission id is required"));
  }

  try {
    const permission = await Permission.findById(id);
    res.status(200).json(permission);
  } catch (err) {
    next(err);
  }
};
export const createPermissions = async (req, res, next) => {
  const { name, route, method, requiresAuth } = req.body;

  const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

  // Unified validation
  if (
    !name ||
    typeof name !== "string" ||
    name.trim() === "" ||
    !route ||
    typeof route !== "string" ||
    route.trim() === "" ||
    !method ||
    !allowedMethods.includes(method)
  ) {
    return res.status(400).json({
      success: false,
      message: "Fill all required fields",
    });
  }

  const authRequired = typeof requiresAuth === "boolean" ? requiresAuth : true;

  try {
    const permission = new Permission({
      name: name.trim(),
      route: route.trim(),
      method,
      requiresAuth: authRequired,
    });
    await permission.save();

    res.status(201).json({
      payload: permission,
      success: true,
      message: "Permission saved successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const updatePermissions = async (req, res, next) => {
  const { name, route, method } = req.body;
  const { id } = req.params;
  if (!id) {
    next(errorHandler(400, "Permission id is required"));
  }
  try {
    const permision = await Permission.findByIdAndUpdate(
      id,
      { name, route, method },
      { new: true }
    );
    res.status(201).json({
      payload: permision,
      success: true,
      message: `Permission updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePermissions = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    next(errorHandler(400, "Permission id is required"));
  }
  try {
    const permision = await Permission.findByIdAndDelete(id);
    if (!permision) {
      return next(errorHandler(404, "Permission not found"));
    }
    res.status(200).json({
      payload: permision,
      success: true,
      message: `Permission deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
};

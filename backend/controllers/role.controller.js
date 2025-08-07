import Role from "../models/role.models.js";
import { errorHandler } from "../utils/error.js";

export const getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (err) {
    next(err);
  }
};

export const getRolesById = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    next(errorHandler(400, "Role id is required"));
  }
  try {
    const role = await Role.findById(id).populate("permissions","name");
    res.status(200).json(role);
  } catch (err) {
    next(err);
  }
};

export const createRole = async (req, res, next) => {
  const { name, permissions } = req.body;
  const role = new Role({ name, permissions });

  if (!name) {
    next(errorHandler(400, "Role name is required"));
  }
  try {
    await role.save();
    res.status(201).json({
      payload: role,
      success: true,
      message: `Role saved successfully`,
    });
  } catch (err) {
    next(err);
  }
};
export const updateRoles = async (req, res, next) => {
  const { name, permissions } = req.body;
  const { id } = req.params;

  if (!id) {
    next(errorHandler(400, "Role id is required"));
  }
  if (!name) {
    next(errorHandler(400, "Role name is required"));
  }

  try {
    const role = await Role.findByIdAndUpdate(
      id,
      { name, permissions },
      { new: true }
    );
    res.status(200).json({
      payload: role,
      success: true,
      message: `Role updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteRole = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    next(errorHandler(400, "Role id is required"));
  }
  try {
    const role = await Role.findByIdAndDelete(id);
        if (!role) {
          return next(errorHandler(404, "Role not found"));
        }
    res.status(200).json({
      payload: role,
      success: true,
      message: `Role deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
};
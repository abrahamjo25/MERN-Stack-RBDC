import express from "express";
import {
  createPermissions,
  deletePermissions,
  getPermissions,
  getPermissionsById,
  updatePermissions,
} from "../controllers/permission.controller.js";
import {
  createRole,
  deleteRole,
  getRoles,
  getRolesById,
  updateRoles,
} from "../controllers/role.controller.js";
import {
  assignRoles,
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import authGuard from "../middleware/auth.middleware.js";

const router = express.Router();
//Users

router.get("/users", authGuard, getUsers);
router.get("/user/:id", authGuard, getUserById);
router.post("/user", authGuard, createUser);
router.put("/user/:id", authGuard, updateUser);
router.delete("/user/:id", authGuard, deleteUser);

//Roles

router.get("/roles", authGuard, getRoles);
router.get("/role/:id", authGuard, getRolesById);
router.post("/role", authGuard, createRole);
router.put("/role/:id", authGuard, updateRoles);
router.delete("/role/:id", authGuard, deleteRole);

//Permissions
router.get("/permission", authGuard, getPermissions);
router.get("/permission/:id", authGuard, getPermissionsById);
router.post("/permission", authGuard, createPermissions);
router.put("/permission/:id", authGuard, updatePermissions);
router.delete("/permission/:id", authGuard, deletePermissions);

router.post("/assign-roles/:id", authGuard, assignRoles);

export default router;

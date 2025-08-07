import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import Permission from "../models/permission.models.js";
import { errorHandler } from "../utils/error.js";

const authGuard = async (req, res, next) => {
  try {
    const fullPath = `${req.baseUrl}${req.route?.path || ""}`;
    const method = req.method;

    const permission = await Permission.findOne({ route: fullPath, method });
    if (!permission) {
      return next(errorHandler(404, `Route not found`));
    }

    // If auth not required
    if (!permission.requiresAuth) return next();

    // Auth required
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return next(errorHandler(401, "User not authenticated"));

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified._id).populate({
      path: "roles",
      populate: {
        path: "permissions",
      },
    });

    if (!user) return next(errorHandler(401, "User not found"));

    const isAuthorized = user.roles.some((role) =>
      role.permissions.some(
        (perm) => perm.route === fullPath && perm.method === method
      )
    );

    if (!isAuthorized) {
      return next(errorHandler(403, "User is not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(errorHandler(400, "Invalid token or access denied"));
  }
};

export default authGuard;

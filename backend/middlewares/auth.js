import jwt from "jsonwebtoken";
import secrets from "../config/secrets.js";

const auth = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // Check for token in cookies first
      const token = req.cookies.jwt;

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, secrets.JWT_SECRET);
      req.user = decoded; // { id, role }

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token", error: error.message });
    }
  };
};

export default auth;

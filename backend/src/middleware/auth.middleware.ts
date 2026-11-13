
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Add logged-in user details to Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: "admin" | "staff";
      };
    }
  }
}

// JWT authentication middleware
const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // Check whether token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please login first."
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);

    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "string" ||
      (decoded.role !== "admin" && decoded.role !== "staff")
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token"
      });
    }

    // Attach user details to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default authMiddleware;

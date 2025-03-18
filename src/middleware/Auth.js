import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/User.js";
import Admin from "../model/Admin.js";
dotenv.config();

const AuthMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.auth;
    if (!token) {
      return res.json({
        status: 401,
        message: "Superadmin is not found",
        data: [],
      });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (decode.user) {
      req.user = decode.user.id;
      let checkUser = await User.findOne({ _id: req.user, isVerified: true });
      if (checkUser) {
        next();
      } else {
        return res.status(401).json({
          status: 401,
          message: "Un-Authorized",
        });
      }
    } else if (decode) {
      req.admin = decode.id;

      let checkAdmin = await Admin.findOne({
        _id: req.admin,
        isVerified: true,
      });
      if (checkAdmin) {
        next();
      } else {
        return res.status(401).json({
          status: 401,
          message: "Un-Authorized",
        });
      }
    }
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "Un-Authorized",
    });
  }
};
export default AuthMiddleware;

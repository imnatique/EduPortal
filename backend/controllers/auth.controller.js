import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ---------------- SIGNUP ----------------
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return next(errorHandler(400, "All fields are required!"));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(409, "User already exists with this email"));
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: req.body.role || "student",
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    next(error);
  }
};

// ---------------- SIGNIN ----------------
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(400, "Email and password are required!"));
    }

    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found!"));

    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) return next(errorHandler(401, "Wrong credentials!"));

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: pass, ...userData } = user._doc;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

// ---------------- GOOGLE AUTH (REAL TOKEN VERIFY) ----------------
export const google = async (req, res, next) => {
  try {
    const { id_token } = req.body;

    if (!id_token) {
      return next(errorHandler(400, "Google token missing"));
    }

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const name = payload.name;
    const photo = payload.picture;

    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      user = await User.create({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: photo,
        role: "student",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: pass, ...userData } = user._doc;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    next(errorHandler(400, "Invalid Google credentials"));
  }
};

// ---------------- SIGN OUT ----------------
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "User has been logged out!" });
  } catch (error) {
    next(error);
  }
};

export const verifyAuth = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) return res.status(401).json({ message: "No authentication token" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      try {
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json(user);   // ✅ FIXED – Send user back!
      } catch (dbError) {
        next(dbError);
      }
    });
  } catch (error) {
    next(error);
  }
};

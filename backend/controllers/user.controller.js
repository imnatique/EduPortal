import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import uploadOnCloudinary from "../config/cloudinary.js";

// ---------------- UPDATE USER ----------------
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let updatedData = {
      username: req.body.username || user.username,
      email: req.body.email || user.email,
    };

    // If a new image is uploaded
    if (req.file) {
      const uploadResponse = await uploadOnCloudinary(req.file.path);
      if (uploadResponse && uploadResponse.secure_url) {
        updatedData.avatar = uploadResponse.secure_url;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ---------------- DELETE USER ----------------
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only delete your own account!"));
  }

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return next(errorHandler(404, "User not found!"));
    }

    res.clearCookie("access_token");
    res.status(200).json({ message: "User has been deleted!" });
  } catch (error) {
    next(error);
  }
};

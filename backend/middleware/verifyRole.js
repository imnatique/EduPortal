export const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if token was verified properly
    if (!req.user || !req.user.role) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user role found" });
    }

    // Check if user role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions" });
    }

    next();
  };
};

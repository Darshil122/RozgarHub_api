const permit = (...permittedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!permittedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "you are not allowed" });
    }

    next();
  };
}

module.exports = permit;
import User from '../models/user.js';

export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Not authorized, no user id' });
    }

    const user = await User.findById(req.user.id);

    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Admins only.' });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Server authorization error: ' + err.message });
  }
};

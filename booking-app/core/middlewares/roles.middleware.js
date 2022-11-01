import { ROLES } from '@shared/constants';

export const isAdmin = (req, res, next) => {
  console.log('req', req);
  const { role } = req.decoded;

  if (role !== ROLES.ADMIN) {
    return res.status(403).json({
      error: true,
      message: 'Access denied',
    });
  }
  next();
};

export const isOwner = (req, res, next) => {
  const { role } = req.decoded;
  if (role !== ROLES.OWNER) {
    return res.status(403).json({
      error: true,
      message: 'Access denied',
    });
  }
  next();
};

export const isAdminOrOwner = (req, res, next) => {
  const { role } = req.decoded;
  console.log('role :>> ', role);
  if (role !== ROLES.ADMIN && role !== ROLES.OWNER) {
    return res.status(403).json({
      error: true,
      message: 'Access denied',
    });
  }
  next();
};

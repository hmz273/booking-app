import User from '@models/user.model';
import jwt from 'jsonwebtoken';
import { appConfig } from '@config';
import { options } from '@shared/jwt/options';

const isAuth = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({
      error: true,
      message: 'Access token is missing',
    });
  }

  const token = req.headers.authorization.split(' ')[1]; // Bearer <token>

  try {
    const user = await User.findOne({
      accessToken: token,
    });

    if (!user) {
      return res.status(403).json({
        error: true,
        message: 'Authorization error',
      });
    }

    const result = jwt.verify(token, appConfig.jwtSecret, options);

    if (!user.userId === result.id) {
      return res.status(401).json({
        error: true,
        message: 'Invalid token',
      });
    }

    req.decoded = result;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: true,
        message: 'Token expired',
      });
    }
    return res.status(403).json({
      error: true,
      message: 'Authentication error',
    });
  }
};

export default isAuth;

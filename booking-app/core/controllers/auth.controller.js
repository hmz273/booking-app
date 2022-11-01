import { v4 as uuid } from 'uuid';
import { generateJwt } from '@shared/jwt/jwtGenerator';
import User from '@models/user.model';
import { hashPassword, comparePasswords } from '@shared/utils/password';
import { userSchema } from '@utils/validators';
import { messages } from '@shared/constants/messages';
import { appConfig } from '@config';
import { encode, decode } from '@utils/buffer';
import { sendMail } from '@shared/utils/sendMail';
import { ROLES } from '@shared/constants';

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found',
      });
    }

    const isValid = await comparePasswords(password, user.password);

    if (!isValid) {
      return res.status(400).json({
        error: true,
        message: 'Invalid password',
      });
    }
    if (!user.active) {
      return res.status(400).json({
        error: true,
        message:
          'User is not active, Please activate your account, check your email',
      });
    }

    const { error, token } = await generateJwt({
      userId: user.id,
      role: user.role,
    });

    if (error) {
      return res.status(500).json({
        error: true,
        message: 'Error generating token',
      });
    }
    user.accessToken = token;
    user.lastLogin = new Date();

    await user.save();

    return res.send({
      success: true,
      message: 'Login successful',
      accessToken: token,
      role: user.role,
    });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({
      error: true,
      message: 'Login failed',
    });
  }
};

const signup = async (req, res) => {
  const result = userSchema.validate(req.body);
  const { email, password, confirmPassword } = result.value;
  try {
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }
    const user = await User.findOne({
      email: result.value.email,
    });

    if (user) {
      return res.json({
        error: true,
        status: 400,
        message: 'User already exists',
      });
    }

    if (password !== confirmPassword) {
      return res.json({
        error: true,
        status: 400,
        message: 'Passwords do not match',
      });
    }

    const hash = await hashPassword(password);

    const newUser = await User.create({
      ...result.value,
      userId: uuid(),
      password: hash,
    });

    const data = await sendMail(email);

    if (data.status !== 200) {
      return res.json({
        error: true,
        status: 400,
        message: data.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('Signup error', error);
    return res.status(500).json({
      error: true,
      message: 'Error creating user',
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.send({
        status: 400,
        error: true,
        message: 'Email is required',
      });
    }
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.send({
        success: true,
        message: messages['auth.forgot-password'],
      });
    }

    const { error, token } = await generateJwt({
      userId: user.userId,
      secret: appConfig.emailSecret,
    });
    if (error) {
      return res.status(500).json({
        error: true,
        message: 'Error generating token',
      });
    }
    const url = `${appConfig.serverURL}/reset/${encode(token)}`;
    console.log('url', url);
    user.resetPasswordToken = token;

    await user.save();

    return res.send({
      success: true,
      message: messages['auth.forgot-password'],
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  try {
    if (!token || !newPassword || !confirmPassword) {
      return res.status(403).json({
        error: true,
        message: 'Invalid request',
      });
    }
    const user = await User.findOne({
      resetPasswordToken: decode(token),
    });

    if (!user) {
      return res.send({
        error: true,
        message: 'Token is invalid or has expired.',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: true,
        message: 'Passwords do not match',
      });
    }
    const hash = await hashPassword(req.body.newPassword);
    user.password = hash;
    user.resetPasswordToken = null;

    await user.save();

    return res.send({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const activeAccount = async (req, res) => {
  const { code, email } = req.body;
  try {
    if (!code || !email) {
      return res.status(400).json({
        error: true,
        message: 'please provide code and email',
      });
    }
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.send({
        error: true,
        message: 'User not found',
      });
    }

    if (user.active) {
      return res.send({
        error: true,
        message: 'Account is already active',
      });
    }

    const data = await sendMail(email, code);

    if (data.status !== 200) {
      return res.json({
        error: true,
        status: 400,
        message: data.message,
      });
    }
    user.active = true;

    await user.save();

    return res.status(200).send({
      success: true,
      message: 'Account activated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    console.log('req.decoded', req.decoded);
    const { id } = req.decoded;
    const user = await User.findOne({
      userId: id,
    });

    if (!user) {
      return res.send({
        error: true,
        message: 'User not found',
      });
    }

    user.accessToken = null;

    await user.save();

    return res.send({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const addRole = async (req, res) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      return res.status(400).json({
        error: true,
        message: 'please provide userId',
      });
    }
    const user = await User.findOne({
      userId,
    });

    if (!user) {
      return res.send({
        error: true,
        message: 'User not found',
      });
    }
    if (user.role === ROLES.OWNER) {
      return res.send({
        error: true,
        message: 'User already has this role',
      });
    }

    user.role = ROLES.OWNER;

    await user.save();

    return res.send({
      success: true,
      message: 'Role added successfully',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const getUsersByRole = async (req, res) => {
  const { role } = req.body;
  try {
    if (!role) {
      return res.status(400).json({
        error: true,
        message: 'please provide role',
      });
    }
    const users = await User.find({
      role,
    });

    if (!users) {
      return res.send({
        error: true,
        message: 'Users not found',
      });
    }

    return res.send({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const { id } = req.decoded;
    const user = await User.findOne({
      _id: id,
    });
    return res.send({
      error: false,
      message: 'User retrieved successfully',
      data: {
        ...user._doc,
        password: null,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
export {
  login,
  signup,
  forgotPassword,
  resetPassword,
  logout,
  activeAccount,
  addRole,
  getUsersByRole,
  getCurrentUser,
};

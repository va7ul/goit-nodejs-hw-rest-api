const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('node:path');
const fs = require('node:fs/promises');
const gravatar = require('gravatar');
const Jimp = require('jimp');
const { User } = require('../models/user');
const { HttpError, ctrlWrapper } = require('../helpers');
const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: passwordHash,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  res.status(204).end();
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;

  const updatedSubscription = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  res.status(200).json({ updatedSubscription });
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, 'Not found photo');
  }
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, fileName);

  Jimp.read(tempUpload)
    .then((avatar) => {
      return avatar.resize(250, 250).write(resultUpload);
    })
    .catch((err) => {
      console.error(err);
    });

  // await fs.rename(tempUpload, resultUpload); --аналог для переміщення
  await fs.unlink(tempUpload);
  const avatarURL = path.join('avatars', fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};

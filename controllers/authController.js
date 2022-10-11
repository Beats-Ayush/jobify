import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  //check for empty values
  if (!name || !email || !password) {
    throw new BadRequestError("please provide all values");
  }

  //check for duplicate email
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }

  //document created
  const user = await User.create({ name, email, password });
  //calling custom instance method
  const token = user.createJWT();

  user.password = undefined;
  res.status(StatusCodes.CREATED).json({
    user,
    token,
    location: user.location,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  //check for empty values
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ email }).select("+password");

  //check for valid email
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  //check for correct password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();

  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

export const updateUser = async (req, res) => {
  const { email, name, lastname, location } = req.body;
  if (!email || !name || !lastname || !location) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findById(req.user.userId);

  user.email = email;
  user.name = name;
  user.lastname = lastname;
  user.location = location;

  const newUser = await user.save();
  console.log(newUser);

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

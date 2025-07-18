const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Please enter name correctly : ");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email !!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password!!");
  }
};
const validationEditProfile = (req) => {
  const allowedItem = ["firstName", "lastName", "age", "gender","photoUrl","about","skills"];
  const keys = Object.keys(req.body);
  const isAllowed = keys.every((key) => allowedItem.includes(key));
  return isAllowed;
};
module.exports = { validateSignUp, validationEditProfile };

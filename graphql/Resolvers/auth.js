const bcrypt = require("bcrypt");
const User = require("../../model/user");
const jwt = require("jsonwebtoken");

module.exports = {
  users: async () => {
    try {
      const user = await User.find();
      return user.map((us) => {
        return {
          ...us._doc,
        };
      });
    } catch (error) {
      throw error;
    }
  },
  createUser: async ({ userInput: { email, password } }) => {
    try {
      const users = await User.findOne({ email });
      if (users) {
        throw new Error("User already exist");
      }
      const hashed = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashed,
      });
      const result = await user.save();
      return { ...result._doc, _id: result.id, password: null };
    } catch (err) {
      return err;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("invalid credentials");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("invalid credentials");
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "graphqltutorial",
        {
          expiresIn: "1h",
        }
      );
      return {
        userId: user.id,
        token,
        tokenExpiration: 1,
      };
    } catch (error) {
      throw error;
    }
  },
};

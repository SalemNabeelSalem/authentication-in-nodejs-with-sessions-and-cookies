const bcrypt = require("bcryptjs");

const User = require("../models/User");

/**
 * @description: Landing Page.
 */
exports.landing_page = (req, res) => {
  res.render("landing");
};

/**
 * @description: Register Page.
 */
exports.register_get = (req, res) => {
  const error = req.session.error;

  delete req.session.error;

  res.render("register", { error: error });
};

exports.register_post = async (req, res) => {
  const { username, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    req.session.error = "User Already Exists.";
    return res.redirect("/register");
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();

  res.redirect("/login");
};

/**
 * @description: Login Page.
 */
exports.login_get = (req, res) => {
  const error = req.session.error;

  delete req.session.error;

  res.render("login", { error: error });
};

exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    req.session.error = "Invalid Credentials.";

    return res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    req.session.error = "Invalid Credentials.";

    return res.redirect("/login");
  }

  req.session.isAuth = true;

  req.session.username = user.username;

  res.redirect("/dashboard");
};

/**
 * @description: Dashboard Page.
 */
exports.dashboard_get = (req, res) => {
  const username = req.session.username;

  if (!req.session.isAuth) {
    return res.redirect("/login");
  }

  res.render("dashboard", { username: username });
};

/**
 * @description: Logout Page.
 */
exports.logout_post = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      throw error;
    }

    res.redirect("/");
  });
};

const bcrypt = require("bcryptjs");

const User = require("../models/User");

exports.landing_page = (req, res) => {
  res.render("landing");
};

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

module.exports = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    req.session.error = "You must be logged in to view this page.";
    res.redirect("/login");
  }
};

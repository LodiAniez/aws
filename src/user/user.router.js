const express = require("express")
const passport = require("passport")

const app = express.Router()

app.get("/", (req, res) => {
  res.render("index")
})

app.get("/dashboard", (req, res) => {
  res.render("dashboard")
})

app.get('/login/facebook', passport.authenticate('facebook'));
app.get('/login/google', passport.authenticate('google'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/', failureMessage: true }), function(req, res) {
  res.redirect('/dashboard');
});

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function(req, res) {
  res.redirect('/dashboard');
});

module.exports = app
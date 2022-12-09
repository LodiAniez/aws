const express = require("express")
const passport = require("passport")
const db = require("./../configs/db")

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

app.post("/create", async (req, res) => {
  try {
    const {firstName, lastName} = req.body
    const database = await db

    const col = database.db("crud").collection("users")

    await col.insertOne({
      firstName, lastName
    })

    const list = col.find().toArray()

    res.render("list", { list, error: false })
  } catch (err) {
    res.sendStatus(500)
  }
})

module.exports = app
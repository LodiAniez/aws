const express = require("express")
const passport = require("passport")
const db = require("./../configs/db")
const { Configuration, OpenAIApi } = require("openai");

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

    const list = await col.find().toArray()

    res.render("list", { list, error: false })
  } catch (err) {
    res.sendStatus(500)
  }
})

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/openai", async (req, res) => {
  const {text} = req.body

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: text,
    temperature: 0.7,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0
  });

  res.render("index", { response: response.data.choices[0].text, error: false })
})

module.exports = app
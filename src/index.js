const {config} = require("dotenv")
config()
const express = require("express")
const passport = require("passport")
const FacebookStrategy = require("passport-facebook")
const GoogleStrategy = require("passport-google-oidc")
const userRouter = require("./user/user.router")
const session = require("express-session")
const path = require("path")

const app = express();
const port = 3000;

app.set("view engine", "ejs")

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL
},
function (accessToken, refreshToken, profile, cb) {
  console.log(profile)
  
  return cb(null, profile)
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
function(issuer, profile, cb) {
  console.log(profile)
  return cb(null, profile)
}));

app.use(express.static(path.join(__dirname, "src")))
app.use(session({ secret: "sessionstaticsecret", resave: true, saveUninitialized: true }))
app.use(passport.initialize());
app.use(passport.session())

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(express.json());
app.use("/", userRouter);

app.listen(port, async () => {
  console.log(`Server listening on ${port}`);
});
// Require express
const express = require("express");

const cookieParser = require("cookie-parser");

//require app
const app = express();
//Assign port Number
const port = 1000;
const path = require("path");

const expressLayouts = require("express-ejs-layouts");

const db = require("./confiq/mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./confiq/passport-local");
const passportGoogle = require("./confiq/passport-google-auth2");
const bodyParser = require("body-parser");

const MongoStore = require("connect-mongo")(session);

//post use
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

//use cookies
app.use(cookieParser());

app.use(express.static("./assert"));

// app.use(expressLayouts);
// //extract style and script from sub pages into the layout

// app.set('layout extractStyles',true);
// app.set('layout extractScripts',true);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//mongo use to store the session cookies in data base

app.use(
  session({
    name: "Node",
    secret: "dosomething",
    saveUninitialized: false,
    resave: false,

    cookie: {
      maxAge: 100 * 60 * 100,
    },
    //store in monmgoose
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disable",
      },
      //if errr the print errr
      function (err) {
        console.log(err || "connect-mongoodb setup ook");
      }
    ),
    // store:new MongoStore({
    //     mongooseConnection:db,
    //     autoRemove:'disable'

    // }),//<--- added closing parenthesis

    // function (err){
    //     console.log(err || 'connect-mongoodb setup ook')
    // }
  })
);
//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//check passport setAuthenticatedUser
app.use(passport.setAuthenticatedUser);

//use router
app.use("/", require("./routers"));

// Server Create
app.listen(port, (err) => {
  //any Error print err message
  if (err) {
    console.log("err msg", err);
  } else {
    console.log("This Server is Running in Port", port);
  }
});

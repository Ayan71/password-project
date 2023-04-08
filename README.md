# password-project
Creating a user registration form employs the management of the registered user. This is where user role authentication comes into play. Role authentication ensures that non-admin users cannot make changes or access exclusive information. It grants administrative privileges to admin users and basic privileges to basic users.
Express.js is a Node.js framework for building web applications quickly and easily.

Nodemon is a tool that watches the file system and automatically restarts the server when there is a change.

You require express in your application to listen for a connection on port 5000. Create a new file server.js in the root directory and create the listening event:

const express = require("express")
const app = express()
const PORT = 5000
app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`))
The next step is to test your application. Open up your package.json file and add the following to scripts:

"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
Open your terminal and run npm run dev to start the server.

Connect to the Database
Earlier, you've created a function that connects to MongoDB and exported that function. Now import that function into your server.js:

const connectDB = require("./db");
...
//Connecting the Database
connectDB();
You also need to create an error handler that catches every unhandledRejection error.

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
)
// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1))
})
The listening event is assigned to a constant server. If an unhandledRejection error occurs, it logs out the error and closes the server with an exit code of 1.

Create User Schema
Schema is like a blueprint that shows how the database will be constructed.

You'll structure a user schema that contains username, password, and role.

Create a new folder model in the project's directory, and create a file called User.js. Now open User.js and create the user schema:

// user.js
const Mongoose = require("mongoose")
const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    default: "Basic",
    required: true,
  },
})
In the schema, the username will be unique, required, and will accept strings.

You've specified the minimum characters(6) the password field will accept. The role field grants a default value (basic) that you can change if needed.

Now, you need to create a user model and export it:

const User = Mongoose.model("user", UserSchema)
module.exports = User
You've created the user model by passing the UserSchema as the second argument while the first argument is the name of the model user.

Perform CRUD Operations
You'll create functions that handle:

adding users;
getting all users;
updating the role of users; and,
deleting users.
Register Function
As the name implies, this function will handle the registrations of users.

Let's create a new folder named Auth. It will contain the Authentication file and the Route set-up file.

After creating the Auth folder, add two files — Auth.js and Route.js.

Now open up our Auth.js file and import that User model:

const User = require("../model/User")
The next step is to create an async express function that will take the user's data and register it in the database.

You need to use an Express middleware function that will grant access to the user's data from the body. You'll use this function in the server.js file:

const app = express()
app.use(express.json())
Let's go back to your Auth.js file and create the register function:

// auth.js
exports.register = async (req, res, next) => {
  const { username, password } = req.body
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" })
  }
  try {
    await User.create({
      username,
      password,
    }).then(user =>
      res.status(200).json({
        message: "User successfully created",
        user,
      })
    )
  } catch (err) {
    res.status(401).json({
      message: "User not successful created",
      error: error.mesage,
    })
  }
}
The exported register function will be used to set up the routes. You got the username and password from the req.body and created a tryCatch block that will create the user if successful; else, it returns status code 401 with the error message.

Set Up Register Route
You'll create a route to /register using express.Router. Import the register function into your route.js file, and use it as the route's function:

const express = require("express")
const router = express.Router()
const { register } = require("./auth")
router.route("/register").post(register)
module.exports = router
The last step is to import your route.js file as middleware in server.js:

app.use("/api/auth", require("./Auth/route"))
The server will use the router middleware function if there is a request to /api/auth.

Test the Register Route
You'll use Postman to test all the routes.

Open up Postman to send a POST request to http://localhost:5000/api/auth/register and pass the username and password to the body:

Register Route

Login Function
You've created a function that adds registered users to the database. You have to create another function that will authenticate user credentials and check if the user is registered.

Open the Auth.js file and create the Login function, as follows:

// auth.js
exports.login = async (req, res, next) => {
  const { username, password } = req.body
  // Check if username and password is provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    })
  }
}
The login function returns status code 400 if the username and password were not provided. You need to find a user with the provided username and password:

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username, password })
    if (!user) {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      res.status(200).json({
        message: "Login successful",
        user,
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }
}
Here, it returns status code 401 when a user isn't found and 200 when a user is found. The code snippet wrapped all this in a tryCatch block to detect and output errors, if any.

Set Up Login Route
To set up the login route, import the login function into your route.js:

const express = require("express");
const router = express.Router();
const { register, login } = require("./auth");
...
router.route("/login").post(login);
module.exports = router;
Test the Login Route
Make a POST request at http://localhost:5000/api/auth/login and pass a valid username and password to the body:

login Route

Update Function
This function will be responsibile for updating the role of a basic user to an admin user. Open the auth.js file and create the update function, as follows:

//auth.js
exports.update = async (req, res, next) => {
  const { role, id } = req.body
  // Verifying if role and id is presnt
  if (role && id) {
    // Verifying if the value of role is admin
    if (role === "admin") {
      await User.findById(id)
    } else {
      res.status(400).json({
        message: "Role is not admin",
      })
    }
  } else {
    res.status(400).json({ message: "Role or Id not present" })
  }
}
The first if statement verifies if role and id are present in the request body.

The second if statement checks if the value of role is admin. You should do this to avoid having over two roles.

After finding a user with that ID, you'll create a third if block that will check for the role of the user:

exports.update = async (req, res, next) => {
  const { role, id } = req.body;
  // First - Verifying if role and id is presnt
  if (role && id) {
    // Second - Verifying if the value of role is admin
    if (role === "admin") {
      // Finds the user with the id
      await User.findById(id)
        .then((user) => {
          // Third - Verifies the user is not an admin
          if (user.role !== "admin") {
            user.role = role;
            user.save((err) => {
              //Monogodb error checker
              if (err) {
                res
                  .status("400")
                  .json({ message: "An error occurred", error: err.message });
                process.exit(1);
              }
              res.status("201").json({ message: "Update successful", user });
            });
          } else {
            res.status(400).json({ message: "User is already an Admin" });
          }
        })
        .catch((error) => {
          res
            .status(400)
            .json({ message: "An error occurred", error: error.message });
        });

       ...
The third if block prevents assigning an admin role to an admin user, while the last if block checks if an error occurred when saving the role in the database.

The numerous if statements might be a little bit tricky but understandable. Please read the comments in the above code block for better understanding.

Set Up Update Route
Import the update function in your route.js, as follows:

const { register, login, update } = require("./auth");
...
router.route("/update").put(update);
Testing the Update Route
Send a put request to http://localhost:5000/api/auth/update:

update Route

Delete Function
The deleteUser function will remove a specific user from the database. Let's create this function in our auth.js file:

exports.deleteUser = async (req, res, next) => {
  const { id } = req.body
  await User.findById(id)
    .then(user => user.remove())
    .then(user =>
      res.status(201).json({ message: "User successfully deleted", user })
    )
    .catch(error =>
      res
        .status(400)
        .json({ message: "An error occurred", error: error.message })
    )
}
You remove the user based on the id you get from req.body.

Set up the deleteUser Route
Open your route.js file to create a delete request to /deleteUser, using the deleteUser as its function:

const { register, login, update, deleteUser } = require("./auth");
...
router.route("/deleteUser").delete(deleteUser);
Test the deleteUser Route
Send a delete request to http://localhost:5000/api/auth/deleteUser by passing a valid id to the body:

Delete Route

Hash User Passwords
Saving user passwords in the database in plain text format is reckless. It is preferable to hash your password before storing it.

For instance, it will be tough to decipher the passwords in your database if they are leaked. Hashing passwords is a cautious and reliable practice.

Let's use bcryptjs to hash your user passwords.

Lets install bcryptjs:

npm i bcryptjs
After installing bcryptjs, import it into your auth.js

const bcrypt = require("bcryptjs")
Refactor Register Function
Instead of sending a plain text format to your database, lets hash the password using bcrypt:

exports.register = async (req, res, next) => {
  const { username, password } = req.body;

  ...

  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      username,
      password: hash,
    })
      .then((user) =>
        res.status(200).json({
          message: "User successfully created",
           user,
        })
      )
      .catch((error) =>
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
        })
      );
  });
};
bcrypt takes in your password as the first argument and the number of times it will hash the password as the second argument. Passing a large number will take bcrypt a long time to hash the password, so give a moderate number like 10.

bcrypt will return a promise with the hashed password; then, send that hashed password to the database.

Test the Register Function
Send a POST request to http://localhost:5000/api/auth/register and pass the username and password to the body:

Register Route

Refactor the Login Function
exports.login = async (req, res, next) => {
  const { username, password } = req.body
  // Check if username and password is provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    })
  }
  try {
    const user = await User.findOne({ username })
    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, user.password).then(function (result) {
        result
          ? res.status(200).json({
              message: "Login successful",
              user,
            })
          : res.status(400).json({ message: "Login not succesful" })
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }
}
bcrypt.compare checks if the given password and the hashed password in the database are the same.

Test the Login Function
Send a POST request to http://localhost:5000/api/auth/login and pass a valid username and password to the body:

Hashed Login Route

Authenticate Users with JSON Web Token (JWT)
JSON Web Token helps shield a route from an unauthenticated user. Using JWT in your application will prevent unauthenticated users from accessing your users' home page and prevent unauthorized users from accessing your admin page.

JWT creates a token, sends it to the client, and then the client uses the token for making requests. It also helps verify that you're a valid user making those requests.

You've to install JWT before using it in your application:

npm i jsonwebtoken
Refactor the Register Function
When a user registers, you'll send a token to the client using JWT as a cookie. To create this token, you need to set a secret string. You'll use the node's in-built package called crypto to create random strings:

node
require("crypto").randomBytes(35).toString("hex")
Output:

Crypto

Storing this secret string in an environment variable is a safe practice. If this secret string is leaked, unauthenticated users can create fake tokens to access the route.

Store your secret string in a variable:

const jwtSecret =
  "4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd"
Once you've created your jwtSecret, import jsonwebtoken as the token in the register function:



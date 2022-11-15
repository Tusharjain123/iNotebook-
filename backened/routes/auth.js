const express = require("express")
const router = express.Router()
const User = require("../models/User.jsx")
const { body, validationResult } = require("express-validator")
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
const JWT_Secret = "Harryisagoodb$oy"
var fetchuser = require("../middleware/fetchuser")

//  Routes for creation of new user
router.post("/createuser", [
  body("email", "Enter a valid email").isEmail(),
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("password", `Password must be atleast 5 characters`).isLength({ min: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  // If there are error then respnd status = 404
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check whether the user with repeated email exist already
    let user = User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(400).json({ error: "Sorry a user with this email already exist" })
    }
    // to generate a random salt to secure our paasword 

    const salt = await bcrypt.genSalt(10)
    const secPass= await bcrypt.hash(req.body.password,salt)
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    })
    // .then(user => res.json(user)).catch((err)=>{
    //   console.log(err)
    //   res.json({error: "Please enter a unique value for email", message:err.message})
    // })
    const data = {
      user: {
        id: user.id
      }
    }
    // here sign is a synchronous function so we don't have to take care of the await function
    const authToken = jwt.sign(data,JWT_Secret)
    console.log(authToken)
    // res.json(user)
    res.json({authToken})
  }
  catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Servor Error")
  }
})

// Authenticating a user using post "/api/auth/login". No login required
router.post("/login", [
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password cannot be blank").exists(),
], async (req, res) => {
  const errors = validationResult(req);
  // If there are error then respond status = 404
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} =req.body
  try {
    let user = await User.findOne({email})
    if (!user){
      return res.status(400).json({error: "Please try to login with correct credential"})
    }
    // Asynchronously compare the password with the hash user.password and return true false
    const passwordCompare = await bcrypt.compare(password, user.password)

    if (!passwordCompare){
      return res.status(400).json({error: "Pleasr try to login with correct credential"})
    }
    const data = {
      user:{
        id: user.id
      }
    }
    const authToken = jwt.sign(data,JWT_Secret)
    res.json(authToken)
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Servor Error")
  }

})


// Route 3: Get logged in user Details using post /api/auth/
router.post("/getuser",fetchuser,async (req, res) => {
try {
  userId= req.user.id
  const user = await User.findById(userId).select("-password")
  res.send(user)
  
} catch (error) {
  console.error(error.message)
  res.status(500).send("Internal Servor Error")
}
})




module.exports = router  
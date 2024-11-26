// controllers/authController.js
const {hashPassword, comparePassword} = require('../helper/auth')
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// User Registration
const userRegister = async (req, res) => {
    const { name, email, password, role } = req.body;
    const checkName = name.trim()
    try {
        if(!name || (!/^[a-zA-Z\s]*$/.test(checkName))) {
            return res.json({
                error: 'Invalid Name'
            })
        }else if (!password || password.length < 8){
            return res.json({
                error: 'Password should be at least 8 characters'
            })
        } 
        const exist = await User.findOne({email});
        if(exist) {
            return res.json({
                error: "Email is already taken"
            })
        }
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })
        return res.json({
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log(error)
    }
}
// User login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Invalid slapID');
            return res.json({ error: 'Invalid Slap ID' });
        }

        const isMatch = await comparePassword(password, user.password);
        if (isMatch) {
            jwt.sign({email: user.email, name: user.name, id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '7d'}, (err, token) => {
                if(err) throw err;
                res.cookie("token", token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
                        }).json(user);
            })
        } else if (!isMatch) {
            console.log('Invalid password');
            return res.json({ error: 'Invalid Password' });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Logout 
const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({
        message: "Logged out successfully"
    })
}

// Profile
const getProfile = async (req, res) => {
    const {token} = req.cookies
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if(err) throw err;
            res.json(user)
        })
    } else {
        res.json(null)
    }
}
// Fetch All Users
const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select("-password"); // Exclude the password field
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };
  
module.exports = {login, userRegister, logout, getProfile, getAllUsers}

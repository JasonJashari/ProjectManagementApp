const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const asyncHandler = require('express-async-handler');

const User = require('../models/user');
require('dotenv').config();

// Create a user with a hashed password
router.post('/signup', asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'Please provide all fields'
        });
    }

    // Check if username is taken
    const usernameExists = await User.findOne({username});
    if (usernameExists) {
        return res.status(422).json({
            message: 'Username taken'
        });
    }

    // Check if email entered is already signed up
    const emailExists = await User.findOne({email});
    if (emailExists) {
        return res.status(422).json({
            message: 'Please log in'
        });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        _id: new mongoose.Types.ObjectId(),
        username,
        email,
        password: hashedPassword
    });

    console.log(user);

    if (user) {
        res.status(201).json({
            message: 'User created!'
        });
    } else {
        res.status(400).json({
            message: 'Invalid user data'
        });
    }

}))

router.post('/login', asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and Password are required'
        });
    }

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
        return res.status(401).json({
            message: 'Auth Failed'
        });
    }

    // Evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {

        // create JWTs
        const token = jwt.sign(
            {username: foundUser.username,
             userId: foundUser._id
            },
            process.env.JWT_KEY,
            {expiresIn: '1d'}
        );
        const refreshToken = jwt.sign(
            {username: foundUser.username,
             userId: foundUser._id
            },
            process.env.JWT_KEY_REFRESH,
            {expiresIn: '1d'}
        );

        // Save refresh token with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        res.cookie('jwt', refreshToken,{
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            message: 'Auth successful',
            token: token
        });
    } else {
        return res.status(401).json({
            message: 'Auth Failed'
        });
    }

}));


router.get('/refresh', asyncHandler(async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(403).json();
    const refreshToken = cookies.jwt;

    // Find user
    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) return res.status(403).json();

    // Evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.JWT_KEY_REFRESH,
        (err, decoded) => {
            if (err) return res.status(403).json();
            // Create new access token - refresh token verified
            const token = jwt.sign(
                {username: decoded.username,
                 userId: decoded.userId
                },
                process.env.JWT_KEY,
                {expiresIn: 900}
            );
            res.json({ token });
        }
    );

}));

router.get('/logout', async (req, res, next) => {
    // On the client, also delete accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    // Find refreshToken in db
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();

    // Delete cookie
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    });
    res.sendStatus(204);

});

router.get('/', checkAuth, (req, res, next) => {
    const id = req.userData.userId;
    User.findById(id)
    .exec()
    .then(user => {
        res.status(200).json({
            id: user._id,
            email: user.email,
            username: user.username
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
});

router.delete('/:userId', (req, res, next) => {
    // should delete all lists of user
    User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;
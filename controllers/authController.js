const User = require('../models/user');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { username: '', password: '' };

    if (err.message === 'incorrect username') {
        errors.username = 'username not found';
    }
    if (err.message === 'incorrect password') {
        errors.password = 'password is incorrect';
    }

    if (err.code === 11000) {
        errors.username = 'Username already exists';
        return errors;
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

// jwt
const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds
const createToken = (id) => {
    return jwt.sign({ id }, 'strange secret', {
        expiresIn: maxAge
    });
}

const signup_get = (req, res) => {
    res.render('signup', { title: 'Sign Up' });
}

const signup_post = async (req, res) => {
    const { username, password } = req.body;
    try{
        const user = await User.create({ username, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch(err){
        errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

const login_get = (req, res) => {
    res.render('login', { title: 'Log In' });
}

const login_post = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

module.exports = {
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get
}
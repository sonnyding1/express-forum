const User = require('../models/user');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { username: '', password: '' };
    if (err.message.includes('user validation failed')) {
        console.log(err);
    }
}

const signup_get = (req, res) => {
    res.render('signup', { title: 'Sign Up' });
}

const signup_post = async (req, res) => {
    const { username, password } = req.body;
    try{
        const user = await User.create({ username, password });
        res.status(201).json(user);
    }
    catch(err){
        handleErrors(err);
        res.status(400).send('error, user not created')
    }
}

const login_get = (req, res) => {
    res.render('login', { title: 'Log In' });
}

const login_post = (req, res) => {

}

const logout_get = (req, res) => {

}

module.exports = {
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get
}
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

// express app
const app = express();
const port = 3000;

// connect to mongodb
const dbURI = 'mongodb+srv://sonnyding:Vz6YuRytxM1sVkVi@strange-blog.p7owah0.mongodb.net/strange-blog?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('connected to db');
        app.listen(3000);
    })
    .catch((err) => console.log(err));

// register view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(express.static(path.join(__dirname, 'public'))); // serve static files
app.use(express.json());  // for the json data
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));  // for the form data
app.get('*', checkUser);

app.get('/', (req, res) => {
    res.redirect('/posts');
})

// auth routes
app.use('/', authRoutes);

// post routes
app.use('/posts', postRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).send('404');
})

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);   
// })
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Post = require('./models/post');

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

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));  // for the form data

app.get('/', (req, res) => {
    res.redirect('/posts');
})

app.get('/posts/create', (req, res) => {
    res.render('create', { title: 'Create a new post' });
})

app.get('/posts', (req, res) => {
    Post.find().sort({ createdAt: -1})
        .then((result) => {
            res.render('index', { title: 'All posts', posts: result });
        })
        .catch((err) => {
            console.log(err);
        });
})

app.post('/posts', (req, res) => {
    const post = new Post(req.body);
    post.save()
        .then((result) => {
            res.redirect('/posts');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/posts/:id', (req, res) => {
    const id = req.params.id;
    Post.findById(id)
        .then((result) => {
            res.render('details', { title: 'Post Details', post: result});
        })
        .catch((err) => {
            console.log(err);
        })
})

app.delete('/posts/:id', (req, res) => {
    const id = req.params.id;
    Post.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/posts' });
        })
        .catch(err => {
            console.log(err);
        });
});

// 404 page
app.use((req, res) => {
    res.status(404).send('404');
})

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);   
// })
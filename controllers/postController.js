const Post = require('../models/post');

const post_index = (req, res) => {
    Post.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All posts', posts: result });
        })
        .catch((err) => {
            console.log(err);
        });
}

const post_details = (req, res) => {
    const id = req.params.id;
    Post.findById(id)
        .then((result) => {
            res.render('details', { title: 'Post Details', post: result});
        })
        .catch((err) => {
            console.log(err);
        })
}

const post_create_get = (req, res) => {
    res.render('create', { title: 'Create a new post' });
}

const post_create_post = async (req, res) => {
    const post = new Post(req.body);
    try{
        const p = await post.save();
        res.status(201).json({ post: p._id });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
    // post.save()
    //     .then((result) => {
    //         res.redirect('/posts');
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
}

const post_delete = (req, res) => {
    const id = req.params.id;
    Post.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/posts' });
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = {
    post_index,
    post_details,
    post_create_get,
    post_create_post,
    post_delete
}
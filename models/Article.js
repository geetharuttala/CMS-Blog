const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    author: String,
    date: { type: Date, default: Date.now },
    isFeatured: { type: Boolean, default: false }
});

module.exports = mongoose.model('Article', articleSchema);
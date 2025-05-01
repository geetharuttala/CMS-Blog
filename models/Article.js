const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    isFeatured: { 
        type: Boolean, 
        default: false 
    },
    // Adding createdAt and updatedAt
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });  // Adds createdAt and updatedAt fields

module.exports = mongoose.model('Article', articleSchema);
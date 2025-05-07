const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Article = require('./models/Article');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Ensure the folder exists
const imageStoragePath = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imageStoragePath)) {
    fs.mkdirSync(imageStoragePath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageStoragePath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// Add this before your routes
app.locals.formatDate = function(date) {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

// Routes
app.get('/', async (req, res) => {
    try {
        // Get featured articles first
        const featuredArticles = await Article.find({ isFeatured: true }).sort({ date: -1 });
        
        // If no featured articles are found, get the 3 most recent ones
        const articlesToShow = featuredArticles.length > 0 ? 
            featuredArticles : 
            await Article.find().sort({ date: -1 }).limit(3);
        
        res.render('index', {
            currentPage: 'home',
            articles: articlesToShow  // Changed from featuredArticles to articles to match index.ejs
        });
    } catch (err) {
        console.error(err);
        res.render('index', {
            currentPage: 'home',
            articles: []  // Changed from featuredArticles to articles
        });
    }
});

app.get('/blog', async (req, res) => {
    try {
        const articles = await Article.find().sort({ date: -1 });
        res.render('blog', { articles: articles, currentPage: 'blog' });
    } catch (err) {
        console.error('Error fetching articles:', err);
        res.render('blog', { articles: [], currentPage: 'blog' });
    }
});

app.get('/articles/new', (req, res) => {  // Changed from /add-article to match your navbar link
    res.render('form', { currentPage: 'add-article' });
});

app.post('/submit-article', upload.single('image'), async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const imagePath = req.file ? `/images/${req.file.filename}` : '';
        
        // Add this line to get the featured checkbox value
        const isFeatured = req.body.isFeatured === 'on';
        
        // Create the current date
        const currentDate = new Date();

        const newArticle = new Article({
            title,
            content,
            image: imagePath,
            author,
            date: currentDate,
            isFeatured,
            createdAt: currentDate,
            updatedAt: currentDate
        });

        await newArticle.save();
        console.log('Article saved:', newArticle); // For debugging
        res.redirect('/blog');
    } catch (err) {
        console.error('❌ Error saving article:', err);
        res.status(500).send('Something went wrong');
    }
});

app.get('/articles/:id', async (req, res) => {  // Changed from /article/:id to match your article links
    try {
        const article = await Article.findById(req.params.id);
        if (article) {
            // Make sure we're passing complete article data
            res.render('article', { 
                article: article, 
                currentPage: 'blog' 
            });
        } else {
            res.status(404).send('<h2>Article not found</h2><a href="/blog">Back to Blog</a>');
        }
    } catch (err) {
        console.error('Error fetching article:', err);
        res.status(500).send('Something went wrong');
    }
});

// Route to show the edit form
app.get('/articles/edit/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article) {
            res.render('edit-form', { 
                article: article, 
                currentPage: 'blog' 
            });
        } else {
            res.status(404).send('<h2>Article not found</h2><a href="/blog">Back to Blog</a>');
        }
    } catch (err) {
        console.error('Error fetching article for edit:', err);
        res.status(500).send('Something went wrong');
    }
});

// Route to handle the form submission for updating an article
app.post('/update-article/:id', upload.single('image'), async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).send('<h2>Article not found</h2><a href="/blog">Back to Blog</a>');
        }
        
        // Update article fields
        article.title = req.body.title;
        article.content = req.body.content;
        article.author = req.body.author;
        article.isFeatured = req.body.isFeatured === 'on';
        article.updatedAt = new Date();
        
        // Handle image upload if a new image was provided
        if (req.file) {
            // Delete the old image if it exists
            if (article.image) {
                const oldImagePath = path.join(__dirname, 'public', article.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            
            // Set the new image path
            article.image = `/images/${req.file.filename}`;
        }
        
        await article.save();
        res.redirect(`/articles/${article.id}`);
    } catch (err) {
        console.error('Error updating article:', err);
        res.status(500).send('Something went wrong');
    }
});

// New route for deleting articles
app.post('/delete-article/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        
        // Delete the image file if it exists
        if (article && article.image) {
            const imagePath = path.join(__dirname, 'public', article.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        // Delete the article from database
        await Article.findByIdAndDelete(req.params.id);
        
        res.redirect('/blog');
    } catch (err) {
        console.error('Error deleting article:', err);
        res.status(500).send('Something went wrong');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
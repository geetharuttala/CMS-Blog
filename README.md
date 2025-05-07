# CMS-Blog

A minimal yet functional **Content Management System (CMS)** built with **Node.js, Express, MongoDB**, and **EJS**. This app allows users to add, view, and explore blog articles with a clean and responsive interface.

🔗 **Live Site**: [https://cms-blog-i8mu.onrender.com](https://cms-blog-i8mu.onrender.com)

---

## Features

### Full Article Management (CRUD)
- **Create**: Submit new blog articles via a simple form.
- **Read**: View a list of articles and click to read full content.
- **Update**: Edit articles with a pre-filled update form.
- **Delete**: Permanently delete articles when needed.

### Blog Listing Page
- Displays submitted articles in a responsive card layout
- “Load More” button to show additional articles dynamically

### Individual Article Page
- View article with:
  - Title
  - Full content
  - Author name
  - Publish date
  - Article image
  - Social sharing options

---

## Tech Stack

| Technology | Role |
|-----------|------|
| **Node.js** | Backend runtime |
| **Express.js** | Server framework |
| **MongoDB** | Database |
| **Mongoose** | ODM for MongoDB |
| **EJS** | Templating engine |
| **CSS** | Styling (custom layout) |
| **Render** | Cloud deployment |

---

## Usage & Setup

### Clone the Repository

```bash
git clone https://github.com/geetharuttala/CMS-Blog.git
cd cms-project
````

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```
MONGODB_URI=your_mongodb_atlas_connection_string
```

> Do **not** use localhost MongoDB for deployment. Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or another cloud DB provider.

### Run Locally

```bash
npm run dev  # Uses nodemon
```

Visit `http://localhost:3000` in your browser.

---

## Deployment

This project is deployed on **Render**.

### Start Script for Production

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

---

## Project Structure

```
CMS-Blog/
│
├── views/              
│   ├── article.ejs        
│   ├── blog.ejs   
│   ├── edit-form.ejs     
│   ├── form.ejs       
│   └── index.ejs      
│
├── public/              # Static assets and styles
│
├── app.js              
├── models/  
│   ├── Article.js             
├── routes/    
│   ├── articleRoutes.js          
└── .env       
```

---

## Contact

For suggestions, contributions, or issues, feel free to open a [GitHub](https://github.com/geetharuttala).

---

## License

This project is open-source and available under the [MIT License](LICENSE).



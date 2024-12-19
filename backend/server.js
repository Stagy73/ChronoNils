import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"; // Import cors

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Enable CORS for all routes
app.use(cors());

// In-memory storage for posts
const posts = [];

// Storage for images
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Post API to accept blog posts
app.post("/api/posts", upload.single("image"), (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const post = { title, content, image, date: new Date() };
  posts.push(post); // Save the post to memory

  console.log("New post received:", post);
  res.status(201).json(post);
});

// GET API to return all posts
app.get("/api/posts", (req, res) => {
  res.json(posts); // Return all posts
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

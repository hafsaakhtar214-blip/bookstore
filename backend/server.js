const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const JWT_SECRET = 'yourSuperSecretKey'; 
const JWT_EXPIRE = '10d'; 
 
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Hafsa_2005@billa',
  database: 'bookshop'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const signupSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required()
    .messages({ "string.email": "Email must be valid and contain '@'" }),
  password: Joi.string().min(1).required()
    .messages({ "string.min": "Password must have at least 1 character" })
});

app.post('/signup', async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query('INSERT INTO user (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ message: 'Error creating user' });
        res.json({ message: 'User created successfully' });
      });
    });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: 'Server error' });
  }
});

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(1).required()
});

app.post('/login', (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;

  db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (results.length === 0) return res.status(400).json({ message: 'Invalid email or password' });

    const user = results[0];

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    const now = new Date();

    db.query(
      'INSERT INTO sessions (user_id, token, datenow, created_at) VALUES (?, ?, ?, ?)',
      [user.id, token, now, now],
      (err) => {
        if (err) return res.status(500).json({ message: 'Error creating session' });
        res.json({ message: 'Login successful', token });
      }
    );
  });
});

function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token invalid or expired' });
    req.user = decoded;
    next();
  });
}

app.get('/profile', authMiddleware, (req, res) => {
  db.query('SELECT id, email FROM user WHERE id = ?', [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(results[0]);
  });
});

app.get('/books', (req, res) => {
  db.query('SELECT * FROM book', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


app.get('/books/top-sellers', (req, res) => {
  db.query('SELECT * FROM book b WHERE id BETWEEN 20 AND 30', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get('/books/recently-added', (req, res) => {
  db.query('SELECT * FROM book ORDER BY published_date DESC LIMIT 10', (err, results) => {
    if(err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get('/books/search', (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ message: "Query missing" });
  db.query('SELECT * FROM book WHERE LOWER(book_name) LIKE LOWER(?)', [`%${q}%`], (err, results) => {
    if (err) return res.status(500).json({message: "Book not found" });
    if (results.length === 0) return res.status(404).json({ message: "Book not found" });
    res.json(results);
  });
});

app.get('/books/collections/:genre', (req, res) => {
  const genre = req.params.genre;
  let sql = "";
  if (genre.toLowerCase() === 'fiction') {
    sql = `SELECT b.*, g.genre_name FROM book b JOIN genre g ON b.genre_id = g.id 
           WHERE LOWER(g.genre_name) = 'fiction' OR LOWER(g.genre_name) = 'fantasy'`;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  } else {
    sql = `SELECT b.*, g.genre_name FROM book b JOIN genre g ON b.genre_id = g.id 
           WHERE LOWER(g.genre_name) = LOWER(?)`;
    db.query(sql, [genre], (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  }
});

app.get("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const sql = `SELECT b.id, b.book_name, b.price, b.published_date, b.ISBN, b.image, a.author_name, g.genre_name
               FROM book b
               JOIN author a ON b.author_id = a.id
               JOIN genre g ON b.genre_id = g.id
               WHERE b.id = ?`;
  db.query(sql, [bookId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "Book not found" });
    res.json(results[0]);
  });
});

app.post("/cart/add", authMiddleware, (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Please log in first!" });
  }
  const { book_id } = req.body;
  const user_id = req.user.id;
  if (!book_id) return res.status(400).json({ message: "Book ID required" });
  db.query("SELECT price FROM book WHERE id=?", [book_id], (err, books) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (books.length === 0) return res.status(404).json({ message: "Book not found" });
    const price = books[0].price;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    db.query(
      "INSERT INTO order_items (order_id, book_id, quantity, item_price, user_id) VALUES (NULL, ?, 1, ?, ?)",
      [book_id, price, user_id],
      (err) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json({ message: "Added to cart" });
      }
    );
  });
});


app.get("/cart", authMiddleware, (req, res) => {
  const user_id = req.user.id;

  db.query(
    `SELECT oi.book_id, oi.quantity, oi.item_price, b.book_name AS title, b.image
     FROM order_items oi
     JOIN book b ON oi.book_id = b.id
     WHERE oi.order_id IS NULL AND oi.user_id=?`,
    [user_id],
    (err, items) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      res.json({ cartItems: items });
    }
  );
});
app.delete("/cart/:book_id", authMiddleware, (req, res) => {
  const user_id = req.user.id;
  const book_id = req.params.book_id;

  db.query(
    "DELETE FROM order_items WHERE order_id IS NULL AND user_id=? AND book_id=?",
    [user_id, book_id],
    (err) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      res.json({ message: "Removed from cart" });
    }
  );
});

app.post("/cart/checkout", authMiddleware, (req, res) => {
  const user_id = req.user.id;

  db.query(
    "SELECT * FROM order_items WHERE order_id IS NULL AND user_id=?",
    [user_id],
    (err, items) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      if (items.length === 0) return res.status(400).json({ message: "Cart is empty" });
      const total = items.reduce((sum, item) => sum + item.item_price * item.quantity, 0);
      const order_date = new Date();
      db.query(
        "INSERT INTO orders (user_id, order_date, total) VALUES (?, ?, ?)",
        [user_id, order_date, total],
        (err, result) => {
          if (err) return res.status(500).json({ message: "DB error", error: err });
          const order_id = result.insertId;
          const ids = items.map(item => item.id);
          db.query(
            "UPDATE order_items SET order_id=? WHERE id IN (?)",
            [order_id, ids],
            (err) => {
              if (err) return res.status(500).json({ message: "DB error", error: err });
              res.json({ message: "Order placed successfully", order_id });
            }
          );
        }
      );
    }
  );
});

app.put("/cart/update/:book_id", authMiddleware, (req, res) => {
  const user_id = req.user.id;
  const book_id = req.params.book_id;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" });

  db.query(
    "UPDATE order_items SET quantity=? WHERE user_id=? AND order_id IS NULL AND book_id=?",
    [quantity, user_id, book_id],
    (err) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      res.json({ message: "Quantity updated" });
    }
  );
});

app.post("/createproduct", upload.single("image"), (req, res) => {
  const { name, author, genre, isbn, price, published_date, pages } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  db.query("SELECT id FROM author WHERE author_name = ?", [author], (err, authorResult) => {
    if (err) return res.status(500).json(err);

    if (authorResult.length > 0) {
      insertGenre(authorResult[0].id);
    } else {
      db.query("INSERT INTO author (author_name) VALUES (?)", [author], (err, insertAuthor) => {
        if (err) return res.status(500).json(err);
        insertGenre(insertAuthor.insertId);
      });
    }
  });

  function insertGenre(authorId) {
    db.query("SELECT id FROM genre WHERE genre_name = ?", [genre], (err, genreResult) => {
      if (err) return res.status(500).json(err);

      if (genreResult.length > 0) {
        insertBook(authorId, genreResult[0].id);
      } else {
        db.query("INSERT INTO genre (genre_name) VALUES (?)", [genre], (err, insertGenre) => {
          if (err) return res.status(500).json(err);
          insertBook(authorId, insertGenre.insertId);
        });
      }
    });
  }

  function insertBook(authorId, genreId) {
    const bookQuery = `
      INSERT INTO book 
      (book_name, page, published_date, ISBN, price, author_id, genre_id, image) 
      VALUES (?,?,?,?,?,?,?,?)
    `;

    db.query(
      bookQuery,
      [name, pages, published_date, isbn, price, authorId, genreId, imagePath],
      (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({
          message: "Book added successfully!",
          bookId: result.insertId,
          image: imagePath,
        });
      }
    );
  }
});

app.delete("/cart/clear", authMiddleware, (req, res) => {
  const userId = req.user.id;
  db.query(
    "DELETE FROM order_items WHERE user_id = ? AND order_id IS NULL",
    [userId],
    (err) => {
      if (err) return res.status(500).json({ message: "Failed to clear cart", error: err });
      res.json({ message: "Cart cleared successfully" });
    }
  );
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  console.log("Trying to delete book with id:", bookId);

  db.query("DELETE FROM book WHERE id = ?", [bookId], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });

    console.log("Delete result:", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  });
});


app.listen(4000, () => console.log("Server running on port 4000"));

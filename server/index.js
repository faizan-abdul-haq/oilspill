import express from "express"; // to create express app
import pg from "pg"; // database
import bodyParser from "body-parser"; // to get hold of user entry,body
import env from "dotenv"; // to hide important keys
import bcrypt from "bcrypt"; // to hash passwords
import passport from "passport"; // for google auth
import { Strategy } from "passport-local"; 
import axios from 'axios';
import GoogleStrategy from "passport-google-oauth2"; // google strategy
import session from "express-session";
import cors from "cors";
import multer from 'multer';
import path from 'path'; // for path
import fs from 'fs';
import FormData from 'form-data'
import cookieParser from "cookie-parser";

// import * as tf from '@tensorflow/tfjs-node';
// import { decodeJpeg } from '@tensorflow/tfjs-node'; // To decode JPEG images
import { fileURLToPath } from 'url'; // for path

const app = express();
// app.use(cors({
//   origin: 'http://localhost:3000', // Allow requests only from your React app
//   credentials: true // Allow cookies to be sent with requests
// }));

 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


env.config(); // Load environment variables from .env file
const port = 5000; // app port
const saltRounds = 10; // salt rounds for hashing 
app.use(bodyParser.json()); // parse bodies
app.use(bodyParser.urlencoded({ extended: true })); // parse url encoded bodies


// using session
app.use(session({
    secret: process.env.SESSION_SECRET, // secret for session encryption
    resave: false, // not save in db only server ( can be stored in db, look into it)
    saveUninitialized: true, // store uninitialized session to the server memory
    cookie: {
      maxAge: 1000*60 *60, // this is fo rthe seasion's time ( its in milliseconds)
      // httpOnly: true,
      // secure: false,
      // sameSite: 'None',  // Allow cross-origin cookie
    }
}));

app.use(passport.initialize()); // initialize passport
app.use(passport.session());

// initializing DB
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect(); // connect to PostgreSQL

// Fetch all users (for display in the ManageUsers component)
app.get('/api/users', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, email, fname, lname, country, city, phone, gender, organization
      FROM clients
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Search users by keyword (name, email, etc.)
app.get('/api/users/search', async (req, res) => {
  const { query } = req.query;
  try {
    const result = await db.query(`
      SELECT id, email, fname, lname, country, city, phone, gender, organization
      FROM clients
      WHERE fname ILIKE $1 OR lname ILIKE $1 OR email ILIKE $1
    `, [`%${query}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error searching users:", err);
    res.status(500).json({ error: "Failed to search users" });
  }
});

// Update a user’s information
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, fname, lname, country, city, phone, gender, organization } = req.body;
  try {
    await db.query(`
      UPDATE clients 
      SET email = $1, fname = $2, lname = $3, country = $4, city = $5, phone = $6, gender = $7, organization = $8
      WHERE id = $9
    `, [email, fname, lname, country, city, phone, gender, organization, id]);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});
// Delete a user
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM clients WHERE id = $1", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});




// app.get('/', (req, res) => {
//   res.render('/http://localhost:3000')
// });

app.get('/about', (req, res) => {
  res.send('Welcome to the About Page');
});



app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    res.json({
      email: user.email,
      fname: user.fname,
      lname: user.lname,
      city: user.city,
      country: user.country,
      gender: user.gender,
      phone: user.phone,
      organization: user.organization,
    });
  } else {
     res.redirect("/login")
  }
});

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir); // Create the directory if it doesn't exist
}

const upload = multer({ storage: multer.memoryStorage() }); // In-memory storage to send as buffer

app.post('/api/detect', upload.array('images'), async (req, res) => {
  console.log('Received files:', req.files);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No images uploaded' });
  }

  try {
    // Prepare the images to send to Django
    const form = new FormData();
    req.files.forEach((file) => {
      form.append('images', file.buffer, { filename: file.originalname });
    });

    const headers = {
      ...form.getHeaders(),
    };

    // Send the images to Django server for prediction
    const response = await axios.post('http://127.0.0.1:8000/modelapp/predict/', form, { headers });
    console.log('Django response:', response.data);

    const results = response.data.results || []; // Adjust based on the actual Django response structure
    const processedResults = results.map((result, index) => ({
      predictionMask: result.prediction_mask, // Base64-encoded mask
      pixelsWithOilSpills: result.oil_spill_pixels, // Extract number of pixels from Django
      oilSpillPercentage: result.oil_spill_percentage, // Oil spill percentage
      fileName: req.files[index].originalname.replace(/\.[^/.]+$/, ''), // Remove file extension
    }));

    const predictionResult = {
      message: 'Images sent to Django successfully',
      results: processedResults,
    };

    console.log('Authenticated:', req.isAuthenticated());

    if (req.isAuthenticated()) {
      // Save prediction results for logged-in users
      const user = req.user;
      console.log(user,'xxx');
      const userDir = path.join('public/images', user.id.toString());
      const uploadedDir = path.join(userDir, 'uploaded_images');
      const masksDir = path.join(userDir, 'generated_masks');

      // Ensure user-specific directories exist
      [userDir, uploadedDir, masksDir].forEach((dir) => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

      const predictionDate = new Date().toISOString();

      for (let i = 0; i < req.files.length; i++) {
        const uploadedImagePath = path.join(uploadedDir, req.files[i].originalname);
        const maskFileName = `${processedResults[i].fileName}_mask.jpg`;
        const maskPath = path.join(masksDir, maskFileName);

        // Save the uploaded image
        fs.writeFileSync(uploadedImagePath, req.files[i].buffer);

        // Decode and save the prediction mask
        const maskBuffer = Buffer.from(processedResults[i].predictionMask, 'base64');
        fs.writeFileSync(maskPath, maskBuffer);

        // Generate a unique predictionId for each image
        const uniquePredictionId = `pred-${Date.now()}-${i}`; // Include an index to ensure uniqueness

        // Save the prediction record in the database

        await db.query(
          `INSERT INTO predictions (
              prediction_id, user_id, image_path, mask_path, prediction_date, pixels_with_oil_spills, oil_spill_percentage
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            uniquePredictionId,         // Unique predictionId for each image
            user.id,
            uploadedImagePath,          // Store image path as a string
           // Store result as a string (file name)
            maskPath,                   // Store mask path as a string
            predictionDate,
            processedResults[i].pixelsWithOilSpills, // Number of pixels with oil spills
            processedResults[i].oilSpillPercentage, // Oil spill percentage
          ]
        );

        console.log(`Inserted prediction: ${uniquePredictionId}, ${uploadedImagePath}, ${maskPath}`);
      }

      predictionResult.userId = user.id;
      predictionResult.predictionDate = predictionDate;
    }

    // Send the results back to the frontend
    res.json(predictionResult);

  } catch (error) {
    console.error('Error sending image to Django:', error);
    res.status(500).json({ error: 'Error sending image to Django server', details: error.message });
  }
});





// app.get('/login', (req, res) => {
//   res.send('Please log in to access your profile');
// });

app.get('/api/user-role', (req, res) => {
  if (req.user) {
    console.log("logged in role: ",req.user.role)
    res.json({ role: req.user.role }); // assuming `role` is stored in the user session or JWT
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});


app.use('/static', express.static(path.join(__dirname, 'public/images')));


// Backend endpoint to get past predictions for the logged-in user
app.get('/api/predictions', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'You must be logged in to view predictions' });
  }

  try {
    const user = req.user;

    console.log("user in view predictions", user);

    // Query the database to get predictions related to the user, including mask_path
    const result = await db.query(
      `SELECT prediction_id, image_path, mask_path, prediction_date, pixels_with_oil_spills
       FROM predictions 
       WHERE user_id = $1 
       ORDER BY prediction_date DESC`,
      [user.id]
    );

    console.log("result of query: ", result.rows);

    // If no predictions are found, send an empty array
    if (result.rows.length === 0) {
      return res.json({ predictions: [] });
    }
     
    // Map the database results to include only the filename from the image and mask path
    const predictions = result.rows.map((row) => ({
      imagePath: `public/images/${user.id}/uploaded_images/${row.image_path.split("\\").pop()}`,
      result: row.result,
      maskPath: `public/images/${user.id}/generated_masks/${row.mask_path.split("\\").pop()}`,
      predictionDate: row.prediction_date,
      pixels_with_oil_spills: row.pixels_with_oil_spills

      
    }));

    console.log("predictions sent to frontend: ",predictions)

    res.json({ predictions });

  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ error: 'Error fetching predictions from database' });
  }
});



app.get('/api/auth/status', (req, res) => {
  console.log("Received status check request"); // Add a log here
  if (req.isAuthenticated()) {

    console.log("User is authenticated");
    return res.json({ isAuthenticated: true });
  } else {
    console.log("User is not authenticated");
    return res.json({ isAuthenticated: false });
  }
});

app.post("/logout", (req, res, next) => {
  req.logout(function(err) {  // Use callback for req.logout()
    if (err) { 
      return next(err);
    }
    req.session.destroy((err) => {  // Destroy the session
      if (err) {
        return res.status(500).json({ message: 'Failed to log out' });
      }
      res.clearCookie("connect.sid");  // Clear the session cookie
      res.status(200).json({ message: 'Logged out successfully' });  // Send response
    });
  });
});





app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);


app.get("/fail", (req,res)=>{
console.log("failure in loggin in")
})

app.get(
  "/auth/google/oilSpill",
  passport.authenticate("google", {
    successRedirect: "http://88.99.241.139:5000/profile?loggedIn=true",
    failureRedirect: "/fail",
  })
);


app.post("/login", (req, res, next) => {
  console.log("Received login request:", req.body); // Log the incoming request
  passport.authenticate("local", (err, user, info) => {
      if (err) {
          console.error("Authentication error:", err);
          return res.status(500).json({ message: "Internal server error" });
      }
      if (!user) {
          console.log("Login failed:", info.message); // Log the failure message
          return res.status(401).json({ message: info.message });
      }
      req.logIn(user, (err) => {
          if (err) {
              console.error("Login error:", err);
              return res.status(500).json({ message: "Internal server error" });
          }
          console.log("Login successful for user:", user.email); // Log successful login
          
          return res.status(200).json({ message: "Login successful", role: user.role});
      });
  })(req, res, next);
});




passport.authenticate("local", {
  successRedirect:"http://88.99.241.139:5000/profile?loggedIn=true",
  failureRedirect: "/login",
});




//--------------------------------------------------------
//post request of register 
app.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmedPassword,
    country,
    city,
    phone,
    gender,
    organization,
  } = req.body;

  try {
    // Check if the user already exists
    const userCheck = await db.query("SELECT * FROM clients WHERE email = $1", [email]);

    if (userCheck.rows.length > 0) {
      return res.redirect("/login"); // Redirect if the user already exists
    }

    // Generate a 10-digit unique user ID
    const userId = Math.floor(1000000000 + Math.random() * 9000000000); // 10-digit random number

    // Hash the password and insert into clients table
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).send("Error registering user.");
      }

      try {
        // Insert user into the database
        await db.query(
          "INSERT INTO clients ( email, password, fname, lname, country, city, phone, gender, organization) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
          [email, hash, firstName, lastName, country, city, phone, gender, organization]
        );
        res.redirect("/login"); // Redirect to login after registration
      } catch (insertErr) {
        console.error("Error inserting user:", insertErr);
        res.status(500).send("Error registering user.");
      }
    });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).send("Error registering user.");
  }
});





// using local startegy
passport.use(
  "local",
  new Strategy({ username: "email" }, async function verify(email, password, done) {
    try {
      // Check in clients table first
      let userResult = await db.query("SELECT * FROM clients WHERE email = $1", [email]);
      let role = "client"; // Assume role is client

      // If not found in clients, check in admins
      if (userResult.rows.length === 0) {
        userResult = await db.query("SELECT * FROM admins WHERE email = $1", [email]);
        role = "admin";
      }

      // If still not found, return error
      if (userResult.rows.length === 0) {
        return done(null, false, { message: "User not found" });
      }

      const user = userResult.rows[0];
      user.role = role; // Include role in the user object

      // Verify password
      bcrypt.compare(password, user.password, (err, valid) => {
        if (err) return done(err);
        if (valid) {
          return done(null, user); // Pass user object to session
        } else {
          return done(null, false, { message: "Invalid password" });
        }
      });
    } catch (err) {
      console.error("Error during authentication:", err);
      return done(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === "production" 
                    ? "https://your-production-domain.com/auth/google/callback" 
                    : "http://localhost:5000/auth/google/oilSpill",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // Check if user already exists
        const result = await db.query("SELECT * FROM clients WHERE email = $1", [profile.email]);
        if (result.rows.length === 0) {
          // User not found, insert into the database
          const newUser = await db.query(
            "INSERT INTO clients (email, password, Fname, Lname) VALUES ($1, $2, $3, $4) RETURNING *",
            [profile.email, "google", profile.given_name || '', profile.family_name || '']
          );
          return cb(null, newUser.rows[0]); // Pass the newly created user
        } else {
          return cb(null, result.rows[0]); // User found, pass the existing user
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);


    passport.serializeUser((user,cb)=>{
        cb(null,user);
      });
     //7
     // saves user info such as id , email to local storage
      passport.deserializeUser((user,cb)=>{
       cb(null,user);
     });
     
  // Catch-all route to serve index.html for React app
app.all("*", function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
   
  });
  
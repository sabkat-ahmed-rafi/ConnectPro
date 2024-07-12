require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());



app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
  optionSuccessStatus: 200
  })
);


const verifyToken = (req, res, next) => {
  const token = req.cookies?.token
  if(!token) return res.status(401).send({ message: "unauthorized access" })


  jwt.verify(token, process.env.TOKEN, (err, decoded) => {
    if(err) return res.status(403).send({ message: "unauthorized access" })
      req.user = decoded;
    next();
  })

}


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_KEY}@connectpro.44qlbv0.mongodb.net/?retryWrites=true&w=majority&appName=ConnectPro`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // next time i have to add the verifyToken and axiosSecure to logout user after session expired 
    
    // Creating token and saving it to the cookies in browser 
    app.post("/jwt" , async (req, res) => {

      const user = req.body;

      const token = jwt.sign(user, process.env.TOKEN, { expiresIn: '365d' });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      }).send({ success: true });
    })

    
    // Removing a token from browser after a user logouts 
    app.get('/logout', async (req, res) => {
      try {
        res.clearCookie("token", {
          maxAge: 0,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        }).send({ success: true });
      }catch(err) {
        console.error("Error logging out: ", err);
        return res.status(500).send(err);
      }
    })




    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello Welcome to ConnectPro server.');
})

app.listen(port, () => {
    console.log(`ConnectPro server is running on port ${port}`);
})
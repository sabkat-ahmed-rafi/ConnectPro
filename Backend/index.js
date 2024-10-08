const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const http = require('http');
const { Server } = require('socket.io');



const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [`${process.env.FRONTEND_URL}`],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  },
  transports: ['websocket'],
})

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());



app.use(cors({
  origin: [`${process.env.FRONTEND_URL}`],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
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

    const database = client.db("ConnectPro");
    const usersCollection = database.collection("users"); 
    const conversationList = database.collection("conversations");
    const messages = database.collection("messages");
    
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

    // Getting all users for search 
    app.get('/users', async (req, res) => {
      const search = req.query.search

      const searchString = String(search || '');

      const query = { $or: [ 
       { userName: { $regex: searchString, $options: 'i' } }
      ] }

      const users = await usersCollection.find(query).toArray();

      res.send(users);
    })

    // getting a user by uid for the user message view
    app.get('/userMessage/:uid', async (req, res) => {
      const userId = req.params.uid;
      const query = { uid: userId }
      const user = await usersCollection.findOne(query);
      if(!user) return res.status(404).send({ message: "User not found" })
      res.send(user);
    })

    // showing all user for the conversationList view 
    app.get('/userConversations', async (req, res) => {
      const senderEmail = req.query.senderEmail;
      const query = { 
        $or: [
          { senderEmail: senderEmail },
          { receiverEmail: senderEmail }
        ]
       };
      const conversations = await conversationList.find(query).toArray();
      res.send(conversations);
    })

    // Get users messages 
    app.get('/messages', async (req, res) => {

      const senderEmail = req.query.senderEmail;
      const receiverEmail = req.query.receiverEmail;

      const query = { 
        $or: [
          { senderEmail: senderEmail, receiverEmail: receiverEmail },
          { senderEmail: receiverEmail, receiverEmail: senderEmail }
        ],
       };


       const chats = await messages.find(query).toArray();
       res.send(chats);
    })

    // creating a new conversation  for a user  in the conversationList view  
    app.post('/conversations', async (req, res) => {
      const {uid, email, photo, userName, senderUid, senderEmail, senderPhoto, senderName } = req.body;
      if(email == senderEmail) return res.status(200).send({message: "you can't send message to yourself"})
        const query = { 
          $or: [
            { $and: [{ senderEmail: senderEmail }, { receiverEmail: email }] },
            { $and: [{ senderEmail: email }, { receiverEmail: senderEmail }] }
          ]
        };
      const conversation = {
        receiverUid: uid, 
        receiverEmail: email,
        receiverPhoto: photo,
        receiverName: userName,
        senderUid,
        senderEmail,
        senderPhoto,
        senderName,

      }
      const isExist = await conversationList.findOne(query);
      if(isExist) return res.status(404).send({ message: "already exist" })
      const result = await conversationList.insertOne(conversation);
      res.send(result);
    })


    let activeCalls = {};

    // Socket.io events 
    io.on("connection", (socket) => {
      console.log(`socket connected: ${socket.id}`)

      // registering user with uid for socket connection
      socket.on("register", async ({uid, email, userName, photo}) => {
        console.log(`register user ${uid} with socket id: ${socket.id}`)
        await usersCollection.updateOne(
          {uid: uid},
          { $set: {
            socketId: socket.id,
            email: email,
            userName: userName,
            photo,
          }},
          { upsert: true }
        )

        console.log(userName)
      })


      // sending a private message 
      socket.on("private message", async ({receiverUid, receiverEmail, receiverPhoto, receiverName, senderUid, senderEmail, senderPhoto, senderName, message}) => {
        const sender = await usersCollection.findOne({socketId: socket.id});
        const recipient = await usersCollection.findOne({uid: receiverUid});

        console.log(`message for ${receiverUid}: ${message}`)
        const chat = {
          receiverUid, receiverEmail, receiverPhoto, receiverName, senderUid, senderEmail, senderPhoto, senderName, date: new Date(Date.now()) , message
        }

        
        if(recipient && recipient.socketId) {
          io.to(recipient.socketId).emit("private message", { senderId: sender.uid, message });
        }
        
       if(chat) {
        const singleChat = await messages.insertOne(chat);
       }
      })


   

      // Handling video call requests
      socket.on("callUser", ({receiverSocketId, callerName, callerPhoto, receiverUid, receiverPhoto, receiverName, callType}) => {

        if(activeCalls[socket.id] || activeCalls[receiverSocketId]) {
         socket.emit("userBusy", {message: "User is busy now."})
         return 0
        } else {
          console.log(callerName, receiverUid)
          const callData = {
            receiverUid,
            receiverSocketId,
            callerSocketId: socket.id,
            callerName,
            callerPhoto,
            receiverName,
            receiverPhoto,
            timeStamp: new Date(Date.now()),
            callType,
            callId: Math.random().toString(36).substr(2, 9)
          }


          activeCalls[socket.id] = true;
          activeCalls[receiverSocketId] = true;


          // I can fetch the calldata, if I call the incomingCall route in a useEffect in any component.
          io.to(receiverSocketId).emit("incomingCall", callData)
        }
   
      })

      // Handling video call accept and rejects
      socket.on("acceptVideoCall", ({callerSocketId, callId}) => {
        io.to(callerSocketId).emit("videoCallAccepted", { callId, callStatus: "accepted" })
      })

      socket.on("rejectVideoCall", ({callerSocketId, callId}) => {
        console.log(activeCalls)
        deleteActiveCallUser(callerSocketId)
        deleteActiveCallUser(socket.id)
        io.to(callerSocketId).emit("videoCallRejected", { callId, callStatus: "declined" })
      })

      socket.on("callerRejected", ({callerSocketId}) => {
        deleteActiveCallUser(callerSocketId)
        deleteActiveCallUser(socket.id)
        io.to(callerSocketId).emit("callerVideoCallRejected", {callStatus: "rejected" })
      })
    


      // NEW: Handling WebRTC Offer
      socket.on("sendOffer", ({offer, receiverSocketId}) => {
        io.to(receiverSocketId).emit("receiveOffer", { offer, callerSocketId: socket.id });
      });
      
      // NEW: Handling WebRTC Answer
      socket.on("sendAnswer", ({answer, callerSocketId}) => {
        io.to(callerSocketId).emit("receiveAnswer", { answer, from: socket.id });
      });
      
      // NEW: Handling ICE Candidate Exchange
      socket.on("sendIceCandidate", ({candidate, receiverSocketId}) => {
        io.to(receiverSocketId).emit("receiveIceCandidate", { candidate, from: socket.id });
      });



      const deleteActiveCallUser = (socketId) => {
        delete activeCalls[socketId];
      }



      // Handling public chat messages
      socket.on("public message", (msg) => {
        io.emit("public message", msg)
      })


        // Handling client disconnection
      socket.on("disconnect", () => {
        console.log(`socket disconnected: ${socket.id}`)
      })
    
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
    res.send('Hello! Welcome to ConnectPro server.');
})






server.listen(port, () => {
    console.log(`ConnectPro server is running on port ${port}`);
})


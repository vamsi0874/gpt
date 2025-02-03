import express from "express";
import cors from "cors";
import path from "path";
import url, { fileURLToPath } from "url";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
// import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

import dotenv from 'dotenv'
import { loginSchema, registerSchema } from "./validation/authVlidation.js";
import protectRoute from "./middleware/authMiddleware.js";
import User from "./models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(__filename)


// app.use(
//   cors({
//     origin: "https://gpt-front-two.vercel.app", // Allow only your frontend
//     credentials: true, // Allow cookies & authentication headers
//   })
// );

// app.use(cors(
//   {
//     origin:true,
//     credentials:true
//   }
// ));

// app.use(cors({
//   origin: process.env.CLIENT_URL,  // Replace with your actual frontend URL
//   credentials: true,
// }));

app.use(cors())





app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});


app.post("/users/signup", async (req, res) => {
  try {
    // console.log('req.body',req.body)
    const parsedData = registerSchema.parse(req.body);
  // console.log('parsedData',parsedData)

    let user = await User.findOne({ email: parsedData.email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(parsedData.password, 10);
    user = new User({ ...parsedData, password: hashedPassword });
  // console.log('user',user)
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET)
      // console.log('user saved')
      res.json({ token, user, success:'user saved' });

    // console.log('token',token);
    // res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(400).json({ message: error.errors || "Invalid data" });
  }
});

// @route   POST /api/auth/login
app.post("/users/login", async (req, res) => {
  try {
    const parsedData = loginSchema.parse(req.body);

    const user = await User.findOne({ email: parsedData.email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(parsedData.password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, user: { name: user.name, email: user.email } });

  } catch (error) {
    res.status(400).json({ message: error.errors || "Invalid data" });
  }
});


app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.post("/api/chats",protectRoute, async (req, res) => {
  // const userId = req.auth.userId;
  const userId = req.user.userId;
  const { text } = req.body;

  try {
    // CREATE A NEW CHAT
    console.log('userId',userId)
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // CHECK IF THE USERCHATS EXISTS
    const userChats = await UserChats.find({ userId: userId });

    // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
    } else {
      // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );

      res.status(201).send(newChat._id);
    }
  } catch (err) {
    // console.log(err);
    res.status(500).send("Error creating chat!");
  }
});

app.get("/api/userchats",protectRoute,async (req, res) => {
  // console.log('req.auth',req.auth)
  // console.log('req',req.user)
  // console.log('req',req.user?.userId)
  // const userId = req.auth.userId;

  try {
    const userChats = await UserChats.find({ userId : `${req.user.userId}` });
  // res.send([{_id:1,title:'chat1'},{_id:2,title:'chat2'}])
    res.status(200).send(userChats[0]?.chats);
  } catch (err) {
    // console.log(err);
    res.status(500).send("Error fetching userchats!");
  }
});

app.get("/api/chats/:id",protectRoute, async (req, res) => {
  const userId = req.user.userId;
  // console.log('id',req.params.id)
  // console.log('userId',userId)
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });

    // const chat = await Chat.findOne({  userId });


    res.status(200).send(chat);
  } catch (err) {
    // console.log(err);
    res.status(500).send("Error fetching chat!");
  }
});

app.put("/api/chats/:id",protectRoute, async (req, res) => {
  const userId = req.user.userId;

  const { question, answer, img } = req.body;
  // console.log('123456')
  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

//   const newItems = [
//     { 
//       role: "user", 
//       parts: [{ text: question || "Default question" }], // Ensure "user" role is always included, even if question is falsy
//       ...(img && { img })  // Include img if it's provided
//     },
//     { 
//       role: "model", 
//       parts: [{ text: answer }]  // Ensure "model" role is always present with the answer
//     }
// ];
// console.log('new items',newItems)

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding conversation!");
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(401).send("Unauthenticated!");
});

// PRODUCTION
// app.use(express.static(path.join(__dirname, "../dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../dist", "index.html"));
// });

app.listen(port, () => {
  connect();
  console.log("Server running on 3000");
});

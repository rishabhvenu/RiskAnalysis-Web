import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import Database from "./database/Database";
import JsonResponse from "./utils/JsonResponse";
import validator from "validator";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import https from "https";
import fs from "fs";

declare module "express-session" {
  export interface SessionData {
    username: string;
  }
}
dotenv.config();

const app = express();
const PORT = 5050;

app.use(
  cors({
    credentials: true,
    origin: process.env.BASE_URL,
  })
);
app.use(express.json());

const database = new Database(process.env.MONGODB_URI);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

const registerEmailCheck = async (email) => {
  if (!validator.isEmail(email)) {
    return 1;
  }

  if (await database.getEmailSchema(email)) {
    return 2;
  }

  return 0;
};

app.get("/register/email", async (req, res) => {
  const email = req.query.email;
  res.send(JsonResponse(await registerEmailCheck(email)));
});

const registerUsernameCheck = async (username) => {
  if (await database.getUsernameSchema(username)) {
    return 1;
  }

  return 0;
};

app.get("/register/username", async (req, res) => {
  const username = req.query.username;

  res.send(JsonResponse(await registerUsernameCheck(username)));
});

const registerPasswordCheck = (password) => {
  if (validator.isStrongPassword(password)) {
    return 0;
  } else {
    return 1;
  }
};

app.get("/register/password", (req, res) => {
  const password = req.query.password;

  res.send(JsonResponse(registerPasswordCheck(password)));
});

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  if (
    (await registerEmailCheck(email)) == 0 &&
    (await registerUsernameCheck(username)) == 0 &&
    registerPasswordCheck(password) == 0
  ) {
    database.createUser(username, await database.hashPassword(password), email);
  }
  res.send(JsonResponse(0));
});

app.get("/login/username_or_email", async (req, res) => {
  const login = req.query.login;

  if (
    (await database.getUsernameSchema(login)) ||
    (await database.getEmailSchema(login))
  ) {
    res.send(JsonResponse(0));
  } else {
    res.send(JsonResponse(1));
  }
});

app.post("/login", async (req, res) => {
  const { login, password } = req.body;

  if (
    (await database.authenticateLogin(login, undefined, password)) ||
    (await database.authenticateLogin(undefined, login, password))
  ) {
    let schema = await database.getEmailSchema(login);
    if (!schema) {
      schema = await database.getUsernameSchema(login);
    }
    req.session.username = schema.username;
    req.session.save();
    res.send(JsonResponse(0));
  } else {
    res.send(JsonResponse(1));
  }
});

app.get("/session", async (req, res) => {
  res.send({ username: req.session.username });
});

app.delete("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.send(JsonResponse(0));
  });
});

https.createServer({
  key: fs.readFileSync(process.env.KEY),
  cert: fs.readFileSync(process.env.CERT)
}, app).listen(PORT);

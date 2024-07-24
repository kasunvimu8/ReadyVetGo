import mongoose, { ObjectId } from "mongoose";
import "reflect-metadata";
import "dotenv/config";
import http from "http";
import "@configs/mongoose-plugins";
import config from "@configs/env.config";
import api from "./api";
import { User } from "@models/user.model";
import { initializeSocketIO } from "./io";

type UserData = Pick<
  User,
  | "id"
  | "createdDate"
  | "email"
  | "isVerified"
  | "isEmailVerified"
  | "role"
  | "emailChallenge"
> & {
  firstName: string;
  lastName: string;
  profileId: ObjectId;
  subscriptionActive: boolean;
};

// set the port
api.set("port", config.port);
api.set("view engine", "ejs");

// http server in express
const server = http.createServer(api);

// Extend the Express Request interface to add the authorized_user property to the request by the authMiddleware
declare global {
  namespace Express {
    interface Request {
      authorized_user?: UserData;
    }
  }
}

// mongoDB connection
mongoose
  .connect(config.mongoURL, {
    dbName: config.db,
    bufferCommands: false,
  })
  .then(() => {
    server.listen(config.port, () => {
      console.log(`Backend is running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the mongoDB", err.message);
    process.exit(1);
  })
  .then(() => {
    // socket.io
    // is dependent on running database connection to handel profile online status
    initializeSocketIO(server);
  });

server.on("error", (err: Error) => {
  console.error("Server error:", err.message);
  process.exit(1);
});

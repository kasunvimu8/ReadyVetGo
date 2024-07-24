import express, { Express } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import userRoutes from "@routes/user.route";
import profileRoutes from "@routes/profile.route";
import cmsRoutes from "@routes/cms.route";
import fileUpload from "@routes/file-upload.route";
import subscriptionRoutes from "@routes/subscription.route";
import medicalRecordRoutes from "@routes/medical-record.route";
import authRoutes from "@routes/authentication.route";
import chatRoutes from "@routes/chat.route";
import aiAssistantRouter from "@routes/aiAssistant.router";
import errorMiddleware from "@middlewares/error.middleware";
import notFoundMiddleware from "@middlewares/not-found.middleware";
import authenticationMiddleware from "@middlewares/authentication.middleware";
import { servePrivateFile } from "@controllers/file-upload.controller";

const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URL?.startsWith("https://dev.readyvetgo.de")
    ? ["http://localhost:3000"]
    : []),
];

const api: Express = express();
const cookieParser = require("cookie-parser");
api.use(cookieParser());

api.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data:"],
    },
  })
);
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

api.use("/public", express.static("public"));
api.use(authenticationMiddleware);

api.get("/", (req, res) => {
  res.json({ name: "Ready Vet Go  backend connection ok" });
});

// API users
api.use("/users", userRoutes);

// API auth
api.use("/auth", authRoutes);

// API profiles
api.use("/profile", profileRoutes);

// API cms
api.use("/cms", cmsRoutes);

// API cms
api.use("/file-upload", fileUpload);

// API chat
api.use("/chat", chatRoutes);

// API subscriptions
api.use("/subscription", subscriptionRoutes);

// API medical records
api.use("/medical-records", medicalRecordRoutes);

// Serving the private files to the respective user
api.use("/private/uploads/:userId/:fileName", servePrivateFile);

// Ai Assistant
api.use("/ai-assistant", aiAssistantRouter);

api.use(errorMiddleware);
api.use(notFoundMiddleware);

export default api;

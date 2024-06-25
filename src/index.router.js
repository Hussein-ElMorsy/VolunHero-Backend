import morgan from "morgan";
import { connectDB } from "../DB/connection.js";
import { globalErrorHandling } from "./utils/errorHandling.js";
import authRouter from "./modules/auth/auth.router.js";
import userRouter from "./modules/user/user.router.js";
import chatRouter from "./modules/chat/chat.router.js";
import messageRouter from "./modules/message/message.router.js";
import postRouter from "./modules/Post/post.router.js";
import commentRouter from "./modules/comment/comment.router.js";
import savedPostsRouter from "./modules/SavedPosts/savedPosts.router.js";
import { savePost } from "./modules/SavedPosts/savedPosts.validation.js";
import donationFormRouter from "./modules/donationForm/donationForm.router.js";
import notificationsRouter from "./modules/notifications/notifications.router.js";
import meetingRouter from "./modules/meeting/meeting.router.js"
const initApp = (app, express) => {
  if (process.env.MOOD == "DEV") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

  app.use(express.json({}));
  app.get("/", (req, res, next) => {
    return res.status(200).json({ message: "Welcome to Volanhero" });
  });
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter); // Added
  app.use("/api/chat", chatRouter); // Added
  app.use("/api/message", messageRouter); // Added
  app.use("/api/post", postRouter); // Added
  app.use("/api/comment", commentRouter); // Added
  app.use("/api/savedPosts", savedPostsRouter); // Added
  app.use("/api/donationForm", donationFormRouter); // Added
  app.use("/api/notifications", notificationsRouter); // Added
  app.use("/api/meeting", meetingRouter); // Added
  app.all("*", (req, res, next) => {
    return res.json({ message: "In-valid routing" });
  });
  app.use(globalErrorHandling);
  connectDB();
};
export default initApp;

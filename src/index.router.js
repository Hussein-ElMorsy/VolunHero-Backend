import morgan from "morgan";
import { connectDB } from "../DB/connection.js";
import { globalErrorHandling } from "./utils/errorHandling.js";
import authRouter from "./modules/auth/auth.router.js"
import userRouter from "./modules/user/user.router.js"
import chatRouter from "./modules/chat/chat.router.js"
import messageRouter from "./modules/message/message.router.js"

const initApp = (app, express) => {
  if (process.env.MOOD == "DEV") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

    app.use(express.json({}));
    app.get("/",(req, res, next) => {
       return res.status(200).json({message:"Welcome to Volanhero"});
    })
    app.use("/api/auth", authRouter)
    app.use("/api/users", userRouter) // Added
    app.use("/api/chat", chatRouter) // Added
    app.use("/api/message", messageRouter) // Added

  app.all("*", (req, res, next) => {
    return res.json({ message: "In-valid routing" });
  });
  app.use(globalErrorHandling);
  connectDB();
};
export default initApp;

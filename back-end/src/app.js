import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("/public"));
app.use(cookieParser());

app.use("/shopper/users", userRouter);
app.use("/shopper/products", productRouter);

export default app;
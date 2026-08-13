import { Router } from "express";
import app from "./app";
import routes from "./routes";
const router = Router();

app.use("/api/v1", routes);

const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
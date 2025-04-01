import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import employeeRoutes from "./routes/employeeRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = ["http://localhost:3000", "https://react-test-gold-zeta.vercel.app"];


app.use(express.json());

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

mongoose.connect(process.env.DB_TEST as string, {});

app.use("/api/employees", employeeRoutes);
app.get("/", async (req, res) => {
    res.json({ message: "Hello Employeer" });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// "dev": "nodemon --ext ts --exec ts-node src/server.ts",
// "build": "tsc",
// "start": "node dist/server.js"
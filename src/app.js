import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"))

app.get('/', (req, res) => {
    res.send("Welcome HomePage");
})

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

export default app
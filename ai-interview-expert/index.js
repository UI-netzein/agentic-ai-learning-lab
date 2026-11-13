import express from "express";
import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";
import router from "./routes/chat.js"


// 1. Recreate __dirname (Required in ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to automatically serve everything inside the 'public' folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/", router)

app.listen(process.env.PORT, async () => {
  console.log("App running on port", process.env.PORT);
});

process.on("SIGINT", (signal) => {
  process.exit(1);
});

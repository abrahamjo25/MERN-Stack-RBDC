import next from "next";
import dotenv from "dotenv";
import app from "./backend/app.js";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: "./frontend" });
const handle = nextApp.getRequestHandler();

const PORT = process.env.PORT || 5000;

nextApp
  .prepare()
  .then(() => {
    app.all("*", (req, res) => {
      if (!req.path.startsWith("/api")) {
        return handle(req, res);
      }
      res.status(404).send("Not Found");
    });

    app.listen(PORT, () => {
      console.log(`Server ready on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error preparing Next.js app:", err);
  });

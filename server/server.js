const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const exercisesRouter = require("./routes/exercises");
const workoutsRouter = require("./routes/workouts");
const routinesRouter = require("./routes/routines");

app.get("/health", (req, res, next) => {
  res.send("<h1>Exercises database is up and running !</h1>");
});

// Mount routers on '/api' base URL path
app.use("/api", exercisesRouter);
app.use("/api", workoutsRouter);
app.use("/api", routinesRouter);

const PORT = process.env.PORT || 3001; // Use port 3001 or the one specified in environment variable
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

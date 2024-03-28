const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const exercisesRouter = require('./routes/exercises'); // Assuming your router file is in './routes/exercises'

app.get("/health", (req, res, next) =>{
    res.send("<h1>Exercises database is up and running !</h1>");
});

// Mount exercisesRouter on '/api' base URL path
app.use('/api', exercisesRouter);

const PORT = process.env.PORT || 3001; // Use port 3001 or the one specified in environment variable
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


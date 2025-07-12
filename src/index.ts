import app from "./app";
import dotenv from "dotenv";
import DBConnection from "./db/DBConnection";

dotenv.config(); // Load the environment
// variables from the file

// 1. Define the application port
const port = process.env.PORT || 3000; //Access the port

DBConnection().then(result => console.log(result));

// 2. Instructs the express app to listen on port 3000
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});




import app from "./app";

// 1. Define the application port
const port = 3000;

// 2. Instructs the express app to listen on port 3000
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});




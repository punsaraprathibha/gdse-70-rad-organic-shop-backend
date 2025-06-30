## Creating a Node.js backend using Express as the server with Typescript

1. Create an empty project using intelliJ IDEA.
   `File -> New -> Project -> Empty Project`
2. Then open a terminal and execute the following command to initialize a `package.json` file.
```shell
npm init -y
```
3. As per next step, let's install `express` and `typescript`.
```shell
npm install express
npm install -D typescript ts-node @types/node @types/express
```
4. In npm, there are two types of dependencies:

| Type                                         | Use                                                                                                     |
| -------------------------------------------- |---------------------------------------------------------------------------------------------------------|
| `"dependencies"` (`npm install <pkg>`)       | Dependencies which are needed to **run the app** in production.                                         |
| `"devDependencies"` (`npm install -D <pkg>`) | Dependencies which are needed **only during development** (like building, testing, linting, compiling) — not needed at runtime. |

5. Then create a `tsconfig.json` file using following command.
```shell
npx tsc --init
```
5. Then replace the `tsconfig.json` file with the following.
```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist", // Output folder for the deployment ready code generated 
    "rootDir": "./src", // Root directory of the app
    "strict": true,
    "esModuleInterop": true
  }
}
```
6. Then inside `src` folder, let's create a file called `index.ts`.
7. Then let's create and configure our express server inside this file.
```typescript
import express, { Request, Response, Express } from 'express';

// 1. Initialize the express app
const app:Express = express();
// 2. Define the application port
const port = 3000;

// 3. Define a simple HTTP GET Request
app.get('/', (req: Request, res: Response) => {
  res.send('Hello!');
});

// 4. Instructs the express app to listen on port 3000
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```
8. Then let's define the following scripts in `package.json`.
```json
"scripts": {
  "dev": "ts-node src/index.ts", // Dev run command
  "build": "tsc", // Build command
  "serve": "node dist/index.js" // Run in production mode
}
```
9. Here `ts-node`:
    * Runs .ts files directly, skipping manual compile → helpful for development time.
    * In production, you don’t use it — you run the compiled .js.
    * So it’s a → devDependency
10. Then we can run the application locally using following command.
```shell
npm run dev
```
10. Then let's try to update text that returns in the
    response of the get request and see whether realtime updates are realtime reflects.
9. As you can see, it is not, where the server is not restarting due to changes we've done just like React.
10. So, let's make that possible using following dependency as a Dev dependency.
```shell
npm install -D nodemon
```
11. So, in here,
    typescript -> Needed to compile .ts files → .js
    * Not needed after code is compiled — the server runs .js
    * So it’s a build-time tool → devDependency
12. Then you need to add following `nodemon.json` file of defining instructions.
```json
{
  "watch": ["src"], // Tells Nodemon which folders to watch for file changes.
  "ext": "ts", // Tells Nodemon to watch only files with the .ts extension (TypeScript files).
  "ignore": ["src/**/*.spec.ts"], // Tells Nodemon to ignore specific files, even if they match the watch and ext rules.
  "exec": "ts-node ./src/index.ts" // Tells Nodemon what command to run when starting/restarting the app.
}
```
13. Then let's update the scripts in the `package.json` as below.
```json
"scripts": {
  "dev": "nodemon", // Instructs nodemon to take control of running the command
  "build": "tsc", // Perform a production ready build
  "start": "node dist/index.js" // run application in production mode
}
```
14. Then you need to restart the app using following command.
```shell
npm run dev
```
15. Now, changes would be reflected real time.
16. Now, let's move the app related changes to a separate file called `app.ts`.

```typescript
// app.ts
import express, {Express, Request, Response} from "express";

// 1. Initialize the express app
const app: Express = express();

// 2. Define a simple HTTP GET Request
app.get('/', (req: Request, res: Response) => {
    res.send("Hello World!");
});

// 3. Expert the app to use outside (in index.ts)
export default app;
```

```typescript
// index.ts
import app from "./app";

// 1. Define the application port
const port = 3000;

// 2. Instructs the express app to listen on port 3000
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});
```
17. Next, we can define several Middlewares for different purposes as below.
```typescript
import express, {Express, Request, Response} from "express";

// 1. Initialize the express app
const app: Express = express();

// 2. Define Middlewares

// 2.1 Instruct to parse the request payload data to be converted to JSON format
app.use(express.json());

// 3. Define a simple HTTP GET Request
app.get('/', (req: Request, res: Response) => {
    res.send("Hello World!");
});

// 4. Expert the app to use outside (in index.ts)
export default app;
```
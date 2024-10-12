import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import { db } from "./db";
import cors from "cors";
import bodyParser = require("body-parser");

//For env File
dotenv.config();

const app: Application = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome");
});
app.post("/submit", async (req: Request, res: Response) => {
  const { username, language, codeValue, stdInput } = req.body;

  // const output = db.query(
  //   `insert into submission(username, language, code, stdin) values("${username}", "${language}", "${codeValue}", "${stdInput}")`,
  //   (error, results) => {
  //     if (error) {
  //       console.log(error);
  //       return false;
  //     }
  //     return true;
  //   }
  // );
  res.status(201).send("Submission added successfully..");
  let output = true;
  // if(output){
    // await createSubmission({ language, codeValue, stdInput });
  // }
  res.status(400).send("Error Adding Submission:");
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});


const getSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await db.query("select * from submission");
    res.status(200).send(submissions);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error getting submissions:");
  }
};

import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import { db } from "./db";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import WebSocket from "ws";
import { createSubmission } from "./submission/createSubmission";
import { getSubmssion } from "./submission/getSubmission";
import { updateDatabase } from "./controllers/updateDB";

dotenv.config();

const app: Application = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Adjust this based on your needs
    methods: ["GET", "POST"],
  })
);
const port = process.env.PORT || 8000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map<string, WebSocket>();

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: WebSocket.Data) => {
    if (typeof message === "string") {
      try {
        const data = JSON.parse(message);
        if (data.type === "register") {
          clients.set(data.submissionId, ws);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    }
  });

  ws.on("close", () => {
    for (let [submissionId, socket] of clients.entries()) {
      if (socket === ws) {
        clients.delete(submissionId);
        break;
      }
    }
  });
});

// Endpoints
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Code Submission API");
});

app.post("/submit", async (req: Request, res: Response) => {
  const { username, language, codeValue, stdInput } = req.body;
  try {
    const results: any = await new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO submission(username, language, code, stdin, status, result) 
         VALUES (?, ?, ?, ?, 'pending', '')`,
        [username, language, codeValue, stdInput],
        (error, results) => {
          if (error) reject(error);
          else resolve(results);
        }
      );
    });

    const submissionId = Object(results).insertId;
    res
      .status(201)
      .json({ submissionId, message: "Submission received and processing" });

    processSubmission({ submissionId, language, codeValue, stdInput });
  } catch (error) {
    console.error("Error in /submit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/all-submissions", async (req: Request, res: Response) => {
  try {
    const submissions: any = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM submission", (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error getting submissions:", error);
    res.status(400).json({ error: "Error getting submissions" });
  }
});

app.get("/delete-submission", async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    await new Promise((resolve, reject) => {
      db.query(
        `DELETE FROM submission WHERE submissionId = ?`,
        [id],
        (error, results) => {
          if (error) reject(error);
          else resolve(results);
        }
      );
    });
    res.status(200).json({ message: "Submission deleted successfully" });
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(400).json({ error: "Error deleting submission" });
  }
});

interface SubmissionData {
  submissionId: number;
  language: string;
  codeValue: string;
  stdInput: string;
}

async function processSubmission({
  submissionId,
  language,
  codeValue,
  stdInput,
}: SubmissionData) {
  try {
    const submissionToken = await createSubmission({
      language,
      codeValue,
      stdInput,
    });
    const output = await getSubmssion({ submissionToken });
    await updateDatabase(submissionId, output);
    updateWebSocket(submissionId, "completed", submissionToken);
  } catch (error) {
    console.error("Error processing submission:", error);
    await updateDatabase(submissionId, {
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    });
    updateWebSocket(submissionId, "error", {
      message: "An error occurred during processing",
    });
  }
}

function updateWebSocket(submissionId: number, status: string, result: any) {
  const ws = clients.get(String(submissionId));
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ status, result }));
  }
}

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

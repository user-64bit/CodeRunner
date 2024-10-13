import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import { db } from "./db";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import WebSocket from "ws";

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

    const submissionId = results.insertId;
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
        `DELETE FROM submission WHERE id = ?`,
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
    const judge0Result = await createSubmission({
      language,
      codeValue,
      stdInput,
    });
    console.log(judge0Result);
    await updateDatabase(submissionId, judge0Result);
    sendUpdate(submissionId, "completed", judge0Result);
  } catch (error) {
    console.error("Error processing submission:", error);
    await updateDatabase(submissionId, {
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    });
    sendUpdate(submissionId, "error", {
      message: "An error occurred during processing",
    });
  }
}

interface Judge0SubmissionData {
  language: string;
  codeValue: string;
  stdInput: string;
}

const createSubmission = async ({
  language,
  codeValue,
  stdInput,
}: Judge0SubmissionData) => {
  const url = "https://judge0-ce.p.rapidapi.com/submissions?fields=*";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY as string,
      "x-rapidapi-host": process.env.RAPIDAPI_HOST as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language_id: getLanguageId(language),
      source_code: codeValue,
      stdin: stdInput,
    }),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

function getLanguageId(language: string): number {
  const languageMap: { [key: string]: number } = {
    "Assembly (NASM 2.14.02)": 45,
    "Bash (5.0.0)": 46,
    "Basic (FBC 1.07.1)": 47,
    "C (Clang 18.1.8)": 104,
    "C (Clang 7.0.1)": 75,
    "C++ (Clang 7.0.1)": 76,
    "C (GCC 14.1.0)": 103,
    "C++ (GCC 14.1.0)": 105,
    "C (GCC 7.4.0)": 48,
    "C++ (GCC 7.4.0)": 52,
    "C (GCC 8.3.0)": 49,
    "C++ (GCC 8.3.0)": 53,
    "C (GCC 9.2.0)": 50,
    "C++ (GCC 9.2.0)": 54,
    "Clojure (1.10.1)": 86,
    "C# (Mono 6.6.0.161)": 51,
    "COBOL (GnuCOBOL 2.2)": 77,
    "Common Lisp (SBCL 2.0.0)": 55,
    "Dart (2.19.2)": 90,
    "D (DMD 2.089.1)": 56,
    "Elixir (1.9.4)": 57,
    "Erlang (OTP 22.2)": 58,
    Executable: 44,
    "F# (.NET Core SDK 3.1.202)": 87,
    "Fortran (GFortran 9.2.0)": 59,
    "Go (1.13.5)": 60,
    "Go (1.18.5)": 95,
    "Groovy (3.0.3)": 88,
    "Haskell (GHC 8.8.1)": 61,
    "JavaFX (JDK 17.0.6, OpenJFX 22.0.2)": 96,
    "Java (JDK 17.0.6)": 91,
    "Java (OpenJDK 13.0.1)": 62,
    "JavaScript (Node.js 12.14.0)": 63,
    "JavaScript (Node.js 18.15.0)": 93,
    "JavaScript (Node.js 20.17.0)": 97,
    "JavaScript (Node.js 22.08.0)": 102,
    "Kotlin (1.3.70)": 78,
    "Lua (5.3.5)": 64,
    "Multi-file program": 89,
    "Objective-C (Clang 7.0.1)": 79,
    "OCaml (4.09.0)": 65,
    "Octave (5.1.0)": 66,
    "Pascal (FPC 3.0.4)": 67,
    "Perl (5.28.1)": 85,
    "PHP (7.4.1)": 68,
    "PHP (8.3.11)": 98,
    "Plain Text": 43,
    "Prolog (GNU Prolog 1.4.5)": 69,
    "Python (2.7.17)": 70,
    "Python (3.11.2)": 92,
    "Python (3.12.5)": 100,
    "Python (3.8.1)": 71,
    "R (4.0.0)": 80,
    "R (4.4.1)": 99,
    "Ruby (2.7.0)": 72,
    "Rust (1.40.0)": 73,
    "Scala (2.13.2)": 81,
    "SQL (SQLite 3.27.2)": 82,
    "Swift (5.2.3)": 83,
    "TypeScript (3.7.4)": 74,
    "TypeScript (5.0.3)": 94,
    "TypeScript (5.6.2)": 101,
    "Visual Basic.Net (vbnc 0.0.0.5943)": 84,
  };
  return languageMap[language.toLowerCase()] || 100;
}

async function updateDatabase(
  submissionId: number,
  result: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE submission SET status = ?, result = ? WHERE id = ?",
      [result.status, JSON.stringify(result), submissionId],
      (error) => {
        if (error) reject(error);
        else resolve();
      }
    );
  });
}

function sendUpdate(submissionId: number, status: string, result: any) {
  const ws = clients.get(String(submissionId));
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ status, result }));
  }
}


server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

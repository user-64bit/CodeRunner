import { useState } from "react";
import { Combobox } from "./Selection";
import { Spinner } from "./Spinner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";


const frameworks: {
  value: string;
  label: string;
}[] = [
    {
      value: "cpp",
      label: "C++ (GCC 14.1.0)",
    },
    {
      value: "python3",
      label: "Python (3.12.5)",
    },
    {
      value: "rust",
      label: "Rust (1.40.0)",
    },
    {
      value: "java",
      label: "Java (JDK 17.0.6)",
    },
    {
      value: "javascript",
      label: "JavaScript (Node.js 22.08.0)",
    },
  ]
export const Home = () => {
  const [username, setUsername] = useState("");
  const [codeValue, setCodeValue] = useState("")
  const [language, setLanguage] = useState("")
  const [stdInput, setStdInput] = useState("");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/submit`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST", body: JSON.stringify({
          username,
          language,
          codeValue: btoa(codeValue),
          stdInput: btoa(stdInput),
        })
      });
      const data = await response;
      console.log(data);
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setSubmitting(false);
      setCodeValue("");
      setStdInput("");
      setLanguage("");
      setUsername("");
    }
  }

  return (
    <>
      <div>
        <h1 className="text-center pb-10 pt-5 font-bold underline text-2xl">Submit & Run Your Code</h1>
        <div className="flex justify-center gap-x-10">
          <div className="w-1/2">
            <Label>Username</Label>
            <Input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="mt-2" />
          </div>
          <div className="w-1/2">
            <Label>Select Language</Label>
            <Combobox
              language={language}
              setLanguage={setLanguage}
              className="mt-2"
              frameworks={frameworks}
            />
          </div>
        </div>
        <div className="mt-2">
          <Textarea
            spellCheck="false"
            className="bg-slate-200/50 focus-visible:bg-transparent"
            onChange={(e) => setCodeValue(e.target.value)}
            value={codeValue}
            placeholder="paste your code here...." />
        </div>
        <div className="mt-2">
          <Input
            onChange={(e) => setStdInput(e.target.value)}
            value={stdInput}
            placeholder="STDIN" />
        </div>
        <div className="mt-4">
          <Button
            className="w-full"
            onClick={handleSubmit}
          >
            {
              submitting ? <Spinner /> : "Submit"
            }
          </Button>
        </div>
      </div>
    </>
  )
}
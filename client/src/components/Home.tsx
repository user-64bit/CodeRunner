import { useState } from "react";
import { Combobox } from "./Selection"
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Spinner } from "./Spinner";
import { encode as base64_encode } from 'base-64';


const frameworks: {
  value: string;
  label: string;
}[] = [
    {
      value: "Cpp",
      label: "C++",
    },
    {
      value: "python3",
      label: "Python3",
    },
    {
      value: "rust",
      label: "Rust",
    },
    {
      value: "java",
      label: "Java",
    },
    {
      value: "javascript",
      label: "JavaScript",
    },
  ]
export const Home = () => {
  const [username, setUsername] = useState("");
  const [codeValue, setCodeValue] = useState("")
  const [language, setLanguage] = useState("")
  const [stdInput, setStdInput] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:8000/submit", {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST", body: JSON.stringify({
          username,
          language,
          codeValue: base64_encode(codeValue),
          stdInput,
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
import { getLanguageId } from "./getLanguageId";

interface Judge0SubmissionData {
  language: string;
  codeValue: string;
  stdInput: string;
}

export const createSubmission = async ({
  language,
  codeValue,
  stdInput,
}: Judge0SubmissionData) => {
  const url = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*";
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
  const { token } = await response.json();
  return token;
};

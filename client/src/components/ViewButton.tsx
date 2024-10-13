import { Button } from "./ui/button";

interface submissionType {
  id: string;
  username: string;
  language: string;
  status: string;
  code: string;
  stdin: string;
  result: any;
}

export const ViewButton = ({
  id,
  username,
  language,
  status,
  code,
  stdin,
  result,
}: submissionType) => {
  const showSubmissionPopup = ({
    id,
    username,
    language,
    status,
    code,
    stdin,
    result,
  }: submissionType) => {
    console.log({
      id,
      username,
      language,
      status,
      code,
      stdin,
      result,
    });
  }
  return (
    <Button
      onClick={() => showSubmissionPopup({
        id,
        username,
        language,
        status,
        code,
        stdin,
        result,
      })}
      variant={"ghost"}
    >
      View
    </Button>
  );
};
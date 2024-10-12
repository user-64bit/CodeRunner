import { Button } from "./ui/button";

interface submissionType {
  submissionId: number;
  username: string;
  language: string;
  status: string;
  code: string;
  stdin: string;
  result: any;
}

export const ViewButton = ({
  submissionId,
  username,
  language,
  status,
  code,
  stdin,
  result,
}: submissionType) => {
  const showSubmissionPopup = ({
    submissionId,
    username,
    language,
    status,
    code,
    stdin,
    result,
  }: submissionType) => {
    console.log({
      submissionId,
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
        submissionId,
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
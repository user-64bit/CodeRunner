import { useEffect, useState } from "react";

export const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    console.log("AllSubmissions");
    fetchAllSubmissions();
  }, []);

  const fetchAllSubmissions = async () => {
    const response = await fetch("http://localhost:8000/submissions");
    const data = await response.json();
    setSubmissions(data);
  };

  const showSubmissionPopup = ({
    submissionId,
    username,
    language,
    status,
    code,
    stdin,
    result,
  }: {
    submissionId: number;
    username: string;
    language: string;
    status: string;
    code: string;
    stdin: string;
    result: any;
  }) => {
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

  if (submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-xl">
        No submissions found
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Submissions</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Id</th>
              <th className="py-3 px-6 text-left">Username</th>
              <th className="py-3 px-6 text-left">Language</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {submissions.map((submission: any) => (
              <tr
                key={submission.id}
                className={`border-b border-gray-200 hover:bg-gray-100 bg-${getStatusColor(submission?.status?.trim().toLowerCase())}`}>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="font-medium">{submission.id}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">
                  <div className="flex items-center">
                    <span>{submission.username}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">
                  <div className="flex items-center">
                    <span>{submission.language}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">
                  <span className={`text-black font-medium py-1 px-2 rounded`}>
                    {submission?.status ?? 'Unknown'}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <button
                      onClick={() => showSubmissionPopup({
                        submissionId: submission.id,
                        username: submission.username,
                        language: submission.language,
                        status: submission.status,
                        code: submission.code,
                        stdin: submission.stdin,
                        result: submission.result,
                      })}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  console.log(status);
  switch (status) {
    case 'completed':
      return 'green-200';
    case 'pending':
      return 'yellow-200';
    case 'error':
      return 'red-200';
    default:
      return 'gray-200';
  }
};
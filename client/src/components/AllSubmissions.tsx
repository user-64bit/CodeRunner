import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useState } from "react";
import { Spinner } from "./Spinner";
import { ViewButton } from "./ViewButton";

interface SubmissionData {
  id: string;
  username: string;
  language: string;
  status: string;
  code: string;
  stdin: string;
  result: any;
}

export const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/all-submissions");
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllSubmissions();
  }, [fetchAllSubmissions]);

  const deleteSubmission = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/delete-submission?id=${id}`);
      const data = await response.json();
      console.log(data);
      await fetchAllSubmissions();
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={"lg"} />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardContent className="flex items-center justify-center h-64 text-gray-500 text-xl">
          No submissions found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">All Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>A list of your recent submissions</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] border">Id</TableHead>
                <TableHead className="border">Username</TableHead>
                <TableHead className="border">Language</TableHead>
                <TableHead className="w-[150px] border">Status</TableHead>
                <TableHead className="text-center w-[100px] border">Action</TableHead>
                <TableHead className="text-center w-[100px] border">Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.id}</TableCell>
                  <TableCell>{submission.username}</TableCell>
                  <TableCell>{submission.language}</TableCell>
                  <TableCell>
                    <StatusBadge status={submission.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ViewButton {...submission} />
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      className="text-red-500 hover:text-red-800 focus:outline-none"
                      onClick={() => deleteSubmission(submission.id)}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: { [key: string]: { color: string; label: string } } = {
    completed: { color: "bg-green-100 text-green-800", label: "Completed" },
    pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    error: { color: "bg-red-100 text-red-800", label: "Error" },
  };

  const { color, label } = statusConfig[status?.trim().toLowerCase()] || {
    color: "bg-gray-100 text-gray-800",
    label: status || "Unknown",
  };

  return <Badge className={`${color} font-semibold hover:text-white cursor-pointer`}>{label}</Badge>;
};

export default AllSubmissions;
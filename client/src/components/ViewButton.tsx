import React from 'react';
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "./ui/textarea";
import { Eye } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Input } from './ui/input';

interface SubmissionType {
  submissionId: number;
  username: string;
  language: string;
  status: string | number;
  code: string;
  stdin: string;
  result: any;
}

export const ViewButton: React.FC<SubmissionType> = ({
  submissionId,
  username,
  language,
  status,
  code,
  stdin,
  result,
}) => {
  console.log({
    submissionId,
    code
  })
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Submission #{submissionId}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium mr-2">By:</span>
              {username}
            </div>
            <div>
              <span className="text-sm font-medium mr-2">Language:</span>
              {language.charAt(0).toUpperCase() + language.slice(1)}
            </div>
            <StatusBadge status={status} />
          </div>
          <div>
            <Label className="text-sm font-medium">Code</Label>
            <Textarea
              spellCheck="false"
              className="font-mono text-sm mt-1 focuanys-visible:ring-0"
              value={atob(code)}
              readOnly
              placeholder="No code available"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Input</Label>
              <Input
                value={atob(stdin)}
                readOnly
                placeholder="No input"
                className="mt-1 focus-visible:ring-0"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Output</Label>
              <Input
                value={atob(result)}
                readOnly
                placeholder="No output"
                className="mt-1 focus-visible:ring-0"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewButton;

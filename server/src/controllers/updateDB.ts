import { db } from "../db";

export async function updateDatabase(
  submissionId: number,
  output: any
): Promise<void> {
  const { status_id, stdout } = output;
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE submission SET status = ?, result = ? WHERE submissionId = ?",
      [status_id, stdout, submissionId],
      (error) => {
        if (error) reject(error);
        else resolve();
      }
    );
  });
}
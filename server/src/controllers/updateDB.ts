import { db } from "../db";

export async function updateDatabase(
  submissionId: number,
  output: any
): Promise<void> {
  const { status_id, expected_output } = output;
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE submission SET status = ?, result = ? WHERE submissionId = ?",
      [status_id, JSON.stringify(expected_output), submissionId],
      (error) => {
        if (error) reject(error);
        else resolve();
      }
    );
  });
}
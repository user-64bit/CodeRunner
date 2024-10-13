

export const getSubmssion = async ({
  submissionToken,
}: {
  submissionToken: string;
}) => {
  const url = `https://judge0-ce.p.rapidapi.com/submissions/${submissionToken}?base64_encoded=true&fields=*`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY as string,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST as string
    }
  };
  console.log(url, options);
  
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

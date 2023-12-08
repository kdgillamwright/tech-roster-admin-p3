import type { NextApiRequest, NextApiResponse } from 'next'
import { createCourse } from "@/tools/DataManager";

export default async function handler(request: NextApiRequest, response: NextApiResponse<any>) {
  if (request.method == "POST") {
    await createCourse(request, response);
  };
}

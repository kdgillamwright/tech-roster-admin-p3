import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteCourse, updateCourse } from "@/tools/DataManager";

export default async function handler(request: NextApiRequest, response: NextApiResponse<any>) {
  console.log("in courses");
  if (request.method == "DELETE") {
    await deleteCourse(request, response);
  } else if (request.method == "PUT") {
    await updateCourse(request, response);
  };
}

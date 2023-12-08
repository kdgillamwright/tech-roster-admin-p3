import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteTechnology, updateTechnology } from "@/tools/DataManager";

export default async function handler(request: NextApiRequest, response: NextApiResponse<any>) {
  console.log("in technologies");
  if (request.method == "DELETE") {
    await deleteTechnology(request, response);
  } else if (request.method == "PUT") {
    await updateTechnology(request, response);
  };
}

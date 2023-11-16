import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteTechnology } from "@/tools/DataManager";

export default async function handler( request: NextApiRequest, response: NextApiResponse<any>) {
    if (request.method == "POST") {
        await deleteTechnology(request, response);
    }
}

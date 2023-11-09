import type { NextApiRequest, NextApiResponse } from 'next'
import { createTechnology } from '@/tools/DataManager';

export default async function handler( request: NextApiRequest, response: NextApiResponse<any>) {
    // response.send("request received!");
    if (request.method == "POST") {
        await createTechnology(request, response);
    }
}
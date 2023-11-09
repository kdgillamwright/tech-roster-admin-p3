import type { NextApiRequest, NextApiResponse } from 'next'
import { updateTechnology } from '@/tools/DataManager';

export default async function handler( request: NextApiRequest, response: NextApiResponse<any>) {
    if (request.method == "PUT") {
        await updateTechnology(request, response);
    }
}
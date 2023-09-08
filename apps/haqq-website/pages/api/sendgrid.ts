import client from '@sendgrid/client';
import type RequestOptions from '@sendgrid/helpers/classes/request';
import type { NextApiRequest, NextApiResponse } from 'next';

const sendGridKey = process.env['SENDGRID_API_KEY'] || '';
client.setApiKey(sendGridKey);

async function submitEmail(req: NextApiRequest, res: NextApiResponse) {
  const data = {
    list_ids: [process.env['SENDGRID_LIST_ID']],
    contacts: [
      {
        email: req?.body?.email,
      },
    ],
  };

  const request: RequestOptions = {
    url: `/v3/marketing/contacts`,
    method: 'PUT',
    body: data,
  };

  try {
    await client.request(request);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200);
}

export default submitEmail;

import client from '@sendgrid/client';
import type { NextApiRequest, NextApiResponse } from 'next';

client.setApiKey(process.env['SENDGRID_API_KEY']);

async function submitEmail(req: NextApiRequest, res: NextApiResponse) {
  const data = {
    list_ids: [process.env['SENDGRID_LIST_ID']],
    contacts: [
      {
        email: req?.body?.email,
      },
    ],
  };

  const request = {
    url: `/v3/marketing/contacts`,
    method: 'PUT',
    body: data,
  };

  try {
    await client.request(request as any);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ error: '' });
}

export default submitEmail;

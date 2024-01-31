import { NextResponse } from 'next/server';
import { FALCONER_ENDPOINT } from '../../../../constants';

interface GetTicketsResponse {
  tickets: TicketEntity[];
}

interface TicketEntity {
  meetup: MeetupEntity;
  ticket: string;
}

interface MeetupEntity {
  id: string;
  name: string;
  address: string;
  description: string;
  start_date_utc: number;
  finish_date_utc: number;
  location_lat: number;
  location_long: number;
}

export const runtime = 'edge';

export async function GET() {
  const signupUrl = new URL('/meetup/all', FALCONER_ENDPOINT);
  const signupResponse = await fetch(signupUrl.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const meetups: GetTicketsResponse = await signupResponse.json();

  return NextResponse.json<{ result: GetTicketsResponse }>(
    {
      result: meetups,
    },
    {
      status: 200,
    },
  );
}

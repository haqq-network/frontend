import { NextRequest, NextResponse } from 'next/server';
import { FALCONER_ENDPOINT } from '../constants';

interface  GetTicketsResponse {
  tickets: TicketEntity[],
}

interface  TicketEntity {
   meetup: MeetupEntity,
   ticket: string,
}

interface  MeetupEntity {
   id: string,
   name: string,
   address: string,
   description: string,
   start_date_utc: number,
   finish_date_utc: number,
   location_lat: number,
   location_long: number,
}

export async function GET(request: NextRequest) {
  const signature = request.nextUrl.searchParams.get('signature')

  const signupUrl = new URL('/meetup/tickets', FALCONER_ENDPOINT);
  const signupResponse = await fetch(signupUrl.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ signature }),
  });

  const { tickets }: GetTicketsResponse = await signupResponse.json();

  return NextResponse.json<{ result: TicketEntity[] }>(
    {
      result: tickets
    },
    {
      status: 200,
    },
  );
}

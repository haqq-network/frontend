import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const unbondingResponseSchema = z.object({
  address_unbondings: z.array(
    z.object({
      address: z.string(),
      receiver: z.string(),
      unbonding_estimated_time: z.string(),
      amount: z.string(),
      denom: z.string(),
      claim_is_pending: z.boolean(),
      epoch_number: z.string(),
    }),
  ),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } },
) {
  try {
    const { address } = params;

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 },
      );
    }

    const endpoint = new URL(
      `/api/stride/lcd/Stride-Labs/stride/stakeibc/unbondings/${address}`,
      'https://edge.stride.zone',
    );

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error('Failed to fetch unbondings data');
    }

    const data = await response.json();

    // Валидация ответа
    const validatedData = unbondingResponseSchema.parse(data);

    return NextResponse.json(validatedData);
  } catch (error) {
    console.error('Error fetching unbondings:', error);

    return NextResponse.json(
      { error: 'Failed to fetch unbondings data' },
      { status: 500 },
    );
  }
}

import { NextResponse } from 'next/server';

interface ContactPayload {
  name: string;
  email: string;
  type: string;
  company?: string;
  message: string;
}

export async function POST(request: Request) {
  const body = await request.json() as ContactPayload;

  if (!body.name || !body.email || !body.type || !body.message) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
  }

  // Mock — simulation latence réseau. À remplacer par persistance BDD.
  await new Promise((r) => setTimeout(r, 700));

  return NextResponse.json({ success: true });
}

import { NextResponse } from 'next/server';
import { db, contactMessages } from '@/db';

const TYPES_AUTORISES = ['alternance', 'mission_freelance', 'question', 'autre'] as const;
type TypeDemande = (typeof TYPES_AUTORISES)[number];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  nom: string;
  email: string;
  type_demande: string;
  entreprise?: string;
  message: string;
  _honeypot?: string;
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  // Honeypot : répondre 200 silencieusement pour ne pas alerter le bot
  if (body._honeypot) {
    return NextResponse.json({ success: true });
  }

  // Validation
  if (!body.nom?.trim() || !body.email?.trim() || !body.type_demande || !body.message?.trim()) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(body.email)) {
    return NextResponse.json({ error: 'Email invalide.' }, { status: 400 });
  }
  if (!TYPES_AUTORISES.includes(body.type_demande as TypeDemande)) {
    return NextResponse.json({ error: 'Type de demande invalide.' }, { status: 400 });
  }

  try {
    await db.insert(contactMessages).values({
      nom:          body.nom.trim(),
      email:        body.email.trim().toLowerCase(),
      type_demande: body.type_demande as TypeDemande,
      entreprise:   body.entreprise?.trim() || null,
      message:      body.message.trim(),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/contact]', err);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

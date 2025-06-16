import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const RESERVAS_PATH = path.resolve(process.cwd(), 'reservas.json');

async function leerReservas() {
  try {
    const data = await fs.readFile(RESERVAS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function guardarReservas(reservas: any[]) {
  await fs.writeFile(RESERVAS_PATH, JSON.stringify(reservas, null, 2), 'utf-8');
}

export async function GET() {
  const reservas = await leerReservas();
  return NextResponse.json(reservas);
}

export async function POST(req: NextRequest) {
  const nuevaReserva = await req.json();
  const reservas = await leerReservas();
  reservas.push({ ...nuevaReserva, fecha: new Date().toISOString() });
  await guardarReservas(reservas);
  return NextResponse.json({ ok: true });
} 
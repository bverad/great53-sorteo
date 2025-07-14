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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // Parámetros de paginación y filtrado
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '1000');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';
  const payment = searchParams.get('payment') || 'all';
  
  const reservas = await leerReservas();
  
  // Aplicar filtros
  let filteredReservas = reservas;
  
  if (search) {
    filteredReservas = filteredReservas.filter((r: any) => 
      r.numero.toString().padStart(3, "0").includes(search) ||
      (r.customerName && r.customerName.toLowerCase().includes(search.toLowerCase()))
    );
  }
  
  if (status === 'reserved') {
    // Solo reservados (todos los que están en el archivo)
    filteredReservas = filteredReservas;
  } else if (status === 'available') {
    // Para disponibles, necesitamos crear un array con todos los números no reservados
    const reservedNumbers = new Set(reservas.map((r: any) => r.numero));
    filteredReservas = Array.from({ length: 1000 }, (_, i) => ({
      numero: i + 1,
      isReserved: false
    })).filter((num: any) => !reservedNumbers.has(num.numero));
  }
  
  if (payment !== 'all') {
    filteredReservas = filteredReservas.filter((r: any) => r.paymentStatus === payment);
  }
  
  // Aplicar paginación
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReservas = filteredReservas.slice(startIndex, endIndex);
  
  // Calcular estadísticas
  const total = filteredReservas.length;
  const totalPages = Math.ceil(total / limit);
  
  return NextResponse.json({
    data: paginatedReservas,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
}

export async function POST(req: NextRequest) {
  const nuevaReserva = await req.json();
  const reservas = await leerReservas();
  reservas.push({ ...nuevaReserva, fecha: new Date().toISOString() });
  await guardarReservas(reservas);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const { numero, ...updates } = await req.json();
  let reservas = await leerReservas();
  reservas = reservas.map((r: any) =>
    r.numero === numero ? { ...r, ...updates } : r
  );
  await guardarReservas(reservas);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { numero } = await req.json();
  let reservas = await leerReservas();
  reservas = reservas.filter((r: any) => r.numero !== numero);
  await guardarReservas(reservas);
  return NextResponse.json({ ok: true });
} 
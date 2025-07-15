import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const RESERVAS_PATH = path.resolve(process.cwd(), 'reservas.json');

async function leerReservas() {
  try {
    const data = await fs.readFile(RESERVAS_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.log('Error leyendo reservas, devolviendo array vacío:', error);
    return [];
  }
}

async function guardarReservas(reservas: any[]) {
  await fs.writeFile(RESERVAS_PATH, JSON.stringify(reservas, null, 2), 'utf-8');
}

export async function POST(req: NextRequest) {
  try {
    const { numbers, name, phone, email, notes } = await req.json();
    
    // Validaciones
    if (!Array.isArray(numbers) || numbers.length === 0) {
      return NextResponse.json(
        { error: 'Debe proporcionar al menos un número' },
        { status: 400 }
      );
    }

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nombre y teléfono son obligatorios' },
        { status: 400 }
      );
    }

    // Validar que los números estén en el rango válido
    const invalidNumbers = numbers.filter(num => num < 1 || num > 1000);
    if (invalidNumbers.length > 0) {
      return NextResponse.json(
        { error: `Números inválidos: ${invalidNumbers.join(', ')}` },
        { status: 400 }
      );
    }

    const reservas = await leerReservas();
    
    // Verificar que los números no estén ya reservados
    const reservedNumbers = reservas.map((r: any) => r.numero);
    const alreadyReserved = numbers.filter(num => reservedNumbers.includes(num));
    
    if (alreadyReserved.length > 0) {
      return NextResponse.json(
        { 
          error: `Los siguientes números ya están reservados: ${alreadyReserved.join(', ')}`,
          alreadyReserved 
        },
        { status: 409 }
      );
    }

    // Crear las nuevas reservas
    const fecha = new Date().toISOString();
    const nuevasReservas = numbers.map(numero => ({
      numero,
      customerName: name,
      customerPhone: phone,
      customerEmail: email || undefined,
      customerNotes: notes || undefined,
      paymentStatus: "pending",
      fecha
    }));

    // Agregar las nuevas reservas al array
    const reservasActualizadas = [...reservas, ...nuevasReservas];
    
    // Guardar en el archivo
    await guardarReservas(reservasActualizadas);

    return NextResponse.json({ 
      ok: true, 
      message: `Se reservaron ${numbers.length} número(s) exitosamente`,
      reservedNumbers: numbers
    });

  } catch (error) {
    console.error('Error al procesar reserva múltiple:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
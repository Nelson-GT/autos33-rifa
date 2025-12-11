import { NextResponse } from 'next/server';
import { checkOperationStatus } from '@/lib/r4service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
        
    /* Respuesta Aprobada */
    /*
    return NextResponse.json({
        success: true,
        status: 'APROBADO',
        message: 'Operación Aceptada',
        reference: "123456789"
      });
      */

    /* Respuesta Pendiente */
    /*
    return NextResponse.json({
        success: false,
        status: 'RECHAZADO',
        message: 'Operación fallida',
        originalCode: "AB01"
      });
    */
  
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID requerido' }, { status: 400 });
    }
    const result = await checkOperationStatus({ id });

    if (result.code === 'ACCP' || result.success === true) {
      return NextResponse.json({
        success: true,
        status: 'APROBADO',
        message: 'Operación Aceptada',
        reference: result.reference
      });
    } else if (result.code === 'AC00') {
        // Sigue pendiente
        return NextResponse.json({
            success: true,
            status: 'PENDIENTE',
            message: 'Aún en espera...'
        });
    } else {
      // Cualquier otro código es rechazo
      return NextResponse.json({
        success: false,
        status: 'RECHAZADO',
        message: result.message || 'Operación fallida',
        originalCode: result.code
      });
    }

  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}
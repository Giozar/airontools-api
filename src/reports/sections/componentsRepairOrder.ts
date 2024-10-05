import path from 'path';
import { Content, ContentStack } from 'pdfmake/interfaces';

// Mantén las variables iniciales
const num_de_orden = 4000;
const fecha_actual = '04 / octubre / 2024';
const fecha_autorizacion = '04 / octubre / 2024';
const diag = 'Lorem ipsum...'; // Tu diagnóstico aquí

// Función para crear la orden
export function order(): ContentStack {
  return {
    stack: [
      {
        canvas: [
          {
            type: 'rect',
            x: 100,
            y: 0,
            w: 140,
            h: 60,
            r: 5,
            lineColor: 'black',
          },
        ],
      },
      {
        table: {
          headerRows: 1,
          body: [
            [{ text: 'ORDEN DE REPARACIÓN', style: 'tableHeader', bold: true }],
            [{ text: '', lineHeight: 2 }],
            [
              {
                text: 'AT' + num_de_orden,
                alignment: 'center',
                color: '#FF0000',
                fontSize: 20,
              },
            ],
          ],
        },
        layout: {
          vLineWidth: () => 0,
          hLineWidth: (i: number) => (i === 1 ? 1 : 0),
        },
        absolutePosition: { x: 440, y: 22 },
      },
    ],
  };
}

// Función para crear el título
export function title(): Content {
  return {
    stack: [
      {
        columns: [
          {
            width: 100,
            image: path.join(
              __dirname,
              '../../assets/images/fallback-images/no-image.jpg',
            ),
            height: 70,
          },
          {
            width: 200,
            text: 'AIRON TOOLS, S.A. DE C.V.',
            fontSize: 16,
            margin: [0, 25],
          },
          {
            width: 150,
            stack: order().stack,
          },
        ],
        columnGap: 10,
      },
    ],
  };
}

// Función para las fechas
export function dates(): Content {
  return {
    stack: [
      {
        columns: [
          {
            text: `Fecha de entrada: ${fecha_actual}`,
            alignment: 'right',
            lineHeight: 1.5,
          },
          {
            text: `Fecha de Autorización: ${fecha_autorizacion}`,
            alignment: 'right',
            lineHeight: 1.5,
          },
        ],
      },
      {
        text: 'Procedencia: ____________________________________________________',
        lineHeight: 1.5,
      },
      {
        text: 'Tiempo de Entrega de Cotización: ___________________________________',
        lineHeight: 1.5,
      },
      {
        columns: [
          {
            width: '60%',
            text: 'Responsable: ___________________________________',
            lineHeight: 1.5,
          },
          {
            width: '40%',
            text: 'Tel: ___________________________',
            lineHeight: 1.5,
          },
        ],
      },
    ],
  };
}

// Función para los datos del producto
export function productData(): Content {
  return {
    stack: [
      { text: 'Datos de la herramienta', alignment: 'center', fontSize: 16 },
      {
        table: {
          headerRows: 1,
          widths: ['auto', 70, 120, '*'],
          body: [
            [
              { text: 'Cantidad', alignment: 'center' },
              { text: 'Modelo', alignment: 'center' },
              { text: 'Número de serie', alignment: 'center' },
              { text: 'Descripción', alignment: 'center' },
            ],
            ...Array(9).fill(['1', '', '', '']), // Genera filas vacías
          ],
        },
      },
    ],
  };
}

// Función para las observaciones
export function observations(): ContentStack {
  return {
    stack: [
      {
        table: {
          widths: [350],
          body: [[{ text: 'Observaciones:', alignment: 'left' }], [diag]],
        },
      },
      { text: '', margin: [0, 30] },
      { text: 'Después de 30 días no nos hacemos responsables.' },
    ],
  };
}

// Función para el diagnóstico
export function diagnostics(): Content {
  return {
    stack: [
      {
        columns: [
          { stack: observations().stack },
          {
            image: path.join(
              __dirname,
              '../../assets/images/fallback-images/no-image.jpg',
            ),
            width: 180,
            height: 200,
          },
        ],
      },
      { text: '', margin: [0, 10] },
    ],
  };
}

// Función para el pie de página
export function footer(): Content {
  return {
    stack: [
      {
        columns: [
          {
            width: '50%',
            text: 'Nombre y Firma de quién recibe la herramienta',
            decoration: 'overline',
            alignment: 'center',
            margin: [0, -40, 0, 0],
          },
          {
            width: '50%',
            text: 'Responsable',
            decoration: 'overline',
            alignment: 'center',
            margin: [0, -40, 0, 0],
          },
        ],
      },
      {
        text: 'Calz. de Guadalupe No. 572 Col. Industrial C.P. 07800 Tel. 8589-7373 www.airontools.com',
        alignment: 'center',
        margin: [0, -10],
      },
    ],
  };
}

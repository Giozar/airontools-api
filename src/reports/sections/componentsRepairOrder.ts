import path from 'path';
import { Content, ContentStack } from 'pdfmake/interfaces';
import { DateFormatter } from 'src/helpers';

// Función para crear la orden
export function order(searchedOrder: any): ContentStack {
  return {
    stack: [
      {
        canvas: [
          {
            type: 'rect',
            x: 75,
            y: -15,
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
                text: 'AT' + searchedOrder.control,
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
export function title(searchedOrder: any): Content {
  return {
    stack: [
      {
        columns: [
          {
            width: 100,
            image: path.join(__dirname, '../../assets/images/logos/logo.png'),
            height: 60,
          },
          {
            width: 200,
            text: 'AIRON TOOLS, S.A. DE C.V.',
            fontSize: 16,
            margin: [0, 25],
          },
          {
            width: 150,
            stack: order(searchedOrder).stack,
          },
        ],
        columnGap: 10,
      },
    ],
  };
}

// Función para las fechas
export function dates(order: any): Content {
  return {
    stack: [
      {
        columns: [
          {
            text: `Fecha de entrada: ${DateFormatter.getDDMMMMYYYY(order.createdAt)}`,
            alignment: 'right',
            lineHeight: 1.5,
          },
          {
            text: `Fecha de Autorización: ${DateFormatter.getDDMMMMYYYY(order.authorizationDate)}`,
            alignment: 'right',
            lineHeight: 1.5,
          },
        ],
      },
      {
        table: {
          widths: ['auto', '*'], // Ajuste automático del ancho de la segunda celda
          body: [
            [
              {
                text: 'Procedencia:',
                lineHeight: 1.5,
                border: [false, false, false, false],
                margin: [0, 5, 10, 0], // Margen en [izquierda, arriba, derecha, abajo]
              },
              {
                text: order.company.name || '',
                bold: true,
                border: [false, false, false, true], // Línea debajo
                margin: [0, 5, 0, 5], // Ajusta márgenes para el texto dentro de la celda
              },
            ],
          ],
        },
      },
      {
        table: {
          widths: ['auto', '*'],
          body: [
            [
              {
                text: 'Tiempo de Entrega de Cotización:',
                lineHeight: 1.5,
                border: [false, false, false, false],
                margin: [0, 5, 10, 0],
              },
              {
                text: order.quoteDeliveryTime || '',
                bold: true,
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
              },
            ],
          ],
        },
      },
      {
        columns: [
          {
            width: '60%',
            table: {
              widths: ['auto', '*'],
              body: [
                [
                  {
                    text: 'Responsable:',
                    lineHeight: 1.5,
                    border: [false, false, false, false],
                    margin: [0, 5, 10, 0],
                  },
                  {
                    text: order.customer.name || '',
                    bold: true,
                    border: [false, false, false, true],
                    margin: [0, 5, 0, 5],
                  },
                ],
              ],
            },
          },
          {
            width: '40%',
            table: {
              widths: ['auto', '*'],
              body: [
                [
                  {
                    text: 'Tel:',
                    lineHeight: 1.5,
                    border: [false, false, false, false],
                    margin: [0, 5, 10, 0],
                  },
                  {
                    text: order.customer.phoneNumber || '',
                    bold: true,
                    border: [false, false, false, true],
                    margin: [0, 5, 0, 5],
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  };
}

export function productData(order: any): Content {
  return {
    stack: [
      {
        text: 'Datos de la herramienta',
        alignment: 'center',
        fontSize: 16,
        margin: [0, 20, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          widths: ['auto', 70, 120, '*'],
          heights: 15, // Altura de todas las filas
          body: [
            [
              { text: 'Cantidad', alignment: 'center' },
              { text: 'Modelo', alignment: 'center' },
              { text: 'Número de serie', alignment: 'center' },
              { text: 'Descripción', alignment: 'center' },
            ],
            ...order.products.map((product: any) => [
              { text: product.quantity.toString(), alignment: 'center' },
              { text: product.model || 'N/A', alignment: 'center' },
              { text: product.serialNumber || 'N/A', alignment: 'center' },
              {
                text: product.description || 'Sin descripción',
                alignment: 'center',
              },
            ]),
            ...Array(9 - order.products.length).fill([
              { text: ' ', alignment: 'center' },
              { text: ' ', alignment: 'center' },
              { text: ' ', alignment: 'center' },
              { text: ' ', alignment: 'center' },
            ]),
          ],
        },
      },
    ],
  };
}

// Función para las observaciones
export function observations(order: any): ContentStack {
  return {
    stack: [
      {
        margin: [0, 20, 0, 10],
        table: {
          widths: [350],
          body: [
            [{ text: 'Observaciones:', alignment: 'left' }],
            [order.observations],
          ],
        },
      },
      { text: '', margin: [0, 30] },
      { text: 'Después de 30 días no nos hacemos responsables.' },
    ],
  };
}

// Función para el diagnóstico

function renderImage(imagePath?: any) {
  if (imagePath.length > 0) {
    return {
      image: imagePath,
      width: 180,
      height: 200,
    };
  }
}
export function diagnostics(order: any, imagePath?: any): Content {
  return {
    stack: [
      {
        columns: [{ stack: observations(order).stack }, renderImage(imagePath)],
      },
      { text: '', margin: [0, 10] },
    ],
  };
}

// Función para el pie de página
export function footer(order): Content {
  return {
    stack: [
      {
        columns: [
          {
            width: '50%',
            stack: [
              {
                text: 'Nombre y Firma de quién recibe la herramienta',
                decoration: 'overline',
                alignment: 'center',
                margin: [0, -80, 0, 0],
              },
              {
                text: order.receivedBy.name || '', // Se extrae el nombre del que recibe
                bold: true,
                alignment: 'center',
                margin: [0, -30, 0, 0],
              },
            ],
          },
          {
            width: '50%',
            stack: [
              {
                text: 'Responsable',
                decoration: 'overline',
                alignment: 'center',
                margin: [0, -80, 0, 0],
              },
              {
                text: order.deliveryRepresentative || '', // Se extrae el nombre del quién entrega
                alignment: 'center',
                bold: true,
                margin: [0, -30, 0, 0],
              },
            ],
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

import { Content, ContentStack, StyleDictionary } from 'pdfmake/interfaces';
import { Specification } from 'src/specifications/schemas/specification.schema';

export function renderList(items: string[]): Content[] {
  if (!items || items.length === 0) {
    return [{ text: 'No hay elementos disponibles', style: 'noDataStyle' }];
  }
  return items.map((item): Content => ({ text: item }));
}

export function toolHeader(title: string): ContentStack {
  return {
    stack: [
      {
        margin: [5, 5, 5, 5],
        columns: [
          {
            width: '50%',
            stack: [
              {
                image: './static/logo/logo.png', // logo airontools
                width: 200,
                height: 100,
              },
            ],
            margin: [0, 0, 10, 20],
          },
          {
            width: '50%',
            text: title || 'Información no disponible',
            fontSize: 20,
            alignment: 'right',
            margin: [0, 0, 0, 10],
            bold: true,
          },
        ],
      },
    ],
  };
}

export function toolList(name: string, list: Content[]): ContentStack {
  return {
    stack: [
      {
        table: {
          widths: ['92%'],
          body: [
            [
              {
                border: [false, false, false, false],
                text: name || 'Información no disponible',
                alignment: 'left',
                color: '#fff',
                bold: true,
                fillColor: '#1A87C0',
              },
            ],
          ],
        },
      },
      {
        ul:
          list.length > 0
            ? list
            : [{ text: 'No hay elementos disponibles', style: 'noDataStyle' }],
      },
    ],
  };
}

export function toolDescription(description: string) {
  const renderToolDescription: ContentStack = {
    stack: [
      {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                border: [false, false, false, false],
                text: 'Descripción',
                alignment: 'left',
                color: '#fff',
                bold: true,
                fillColor: '#1A87C0',
              },
            ],
          ],
        },
      },
      {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                border: [false, false, false, false],
                text: description || 'Descripción no disponible',
                alignment: 'justify',
                fontSize: 10,
                margin: [0, 10, 0, 20],
              },
            ],
          ],
        },
      },
    ],
  };
  return renderToolDescription;
}

export function toolImage(model: string, image: string) {
  const renderToolImage: ContentStack = {
    stack: [
      {
        text: model || 'Modelo no disponible',
        alignment: 'right',
        background: '#1A87C0',
        color: '#fff',
        bold: true,
        fontSize: 15,
        margin: [5, 5, 5, 5],
      },
      {
        margin: [5, 5, 5, 5],
        alignment: 'right',
        table: {
          widths: ['100%'],
          body: [
            [
              {
                alignment: 'right',
                image: image || './static/no-image.jpg',
                width: 200,
                height: 200,
                padding: [0, 0, 0, 20],
              },
            ],
          ],
        },
      },
    ],
  };

  return renderToolImage;
}

export const renderSpecs = (
  specifications: { specification: Specification; value: string }[],
): ContentStack => {
  if (specifications.length === 0) {
    return {
      stack: [
        {
          text: 'No hay especificaciones disponibles',
          style: 'noDataStyle',
        },
      ],
    };
  }
  return {
    stack: [
      {
        margin: [0, 0, 0, 10],
        layout: {
          hLineColor: '#223C80',
          vLineColor: '#223C80',
        },
        table: {
          widths: ['50%', '50%'],
          body: [
            [
              {
                colSpan: 2,
                text: 'Especificaciones',
                style: 'headerSpec',
              },
              {},
            ],
            ...specifications.map(({ specification, value }) => [
              {
                text: specification.name || 'Nombre no disponible',
                style: 'specStyle',
              },
              {
                text:
                  `${value} ${specification?.unit}` || 'Valor no disponible',
                style: 'specValueStyle',
              },
            ]),
          ],
        },
      },
    ],
  };
};

export const toolFooter: Content[] = [
  {
    table: {
      widths: ['*'],
      body: [
        [
          {
            text: 'www.airontools.com',
            alignment: 'center',
            color: '#fff',
            bold: true,
            fillColor: '#1A87C0',
          },
        ],
        [
          {
            text: '*Las imágenes y especificaciones de los productos están sujetos a cambios sin previo aviso',
            alignment: 'center',
            color: '#fff',
            bold: true,
            fillColor: '#1A87C0',
            fontSize: 10,
          },
        ],
      ],
    },
    layout: 'noBorders',
  },
];

export const styles: StyleDictionary = {
  header: {
    fontSize: 15,
    bold: true,
    fillColor: '#223C80',
    color: '#fff',
  },
  headerSpec: {
    fontSize: 12,
    bold: true,
    fillColor: '#223C80',
    color: '#fff',
  },
  specStyle: {
    fontSize: 10,
    bold: true,
    fillColor: '#223C80',
    color: '#fff',
    alignment: 'center',
  },
  specValueStyle: {
    fontSize: 10,
    alignment: 'center',
  },
  noDataStyle: {
    fontSize: 10,
    italics: true,
    color: '#888',
  },
};

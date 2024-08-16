import {
  Content,
  ContentStack,
  StyleDictionary,
  TableLayout,
} from 'pdfmake/interfaces';

export function renderList(items: string[]): Content[] {
  const renderList: Content[] = items.map((item): Content => ({ text: item }));
  return renderList;
}

export function toolHeader(title: string): ContentStack {
  return {
    stack: [
      {
        columns: [
          {
            width: '50%',
            stack: [
              {
                image: './static/logo/logo.png', // logo airontools
                width: 100,
                height: 100,
              },
            ],
            margin: [0, 0, 10, 20],
          },
          {
            width: '50%',
            text: title,
            fontSize: 20,
            alignment: 'right',
            margin: [0, 0, 0, 10],
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
                text: `${name}`,
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
        ul: list,
      },
    ],
  };
}
export function toolDescription(description: string) {
  const renderToolDescription: ContentStack = {
    stack: [
      {
        table: {
          widths: ['92%'],
          body: [
            [
              {
                border: [false, false, false, false],
                text: 'características',
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
        text: description,
        alignment: 'justify',
        margin: [0, 5, 20, 20],
      },
    ],
  };
  return renderToolDescription;
}
export function toolImage(model: string, image: string) {
  const renderToolImage: ContentStack = {
    stack: [
      {
        text: model,
        alignment: 'right',
        background: '#1A87C0',
        color: '#fff',
        bold: true,
        fontSize: 15,
        margin: [5, 5, 5, 5],
      },
      {
        image: image,
        width: 250,
        height: 200,
        margin: [0, 0, 0, 20],
      },
    ],
  };

  return renderToolImage;
}

export const specs: ContentStack = {
  stack: [
    {
      layout: {
        hLineColor: '#223C80',
        vLineColor: '#223C80',
      } as unknown as TableLayout,
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
          [
            { text: 'Rango de Torque', style: ['specStyle'] },
            { text: '2.5-5.9Nm', style: ['specValueStyle'] },
          ],
          [
            { text: 'Velocidad', style: ['specStyle'] },
            { text: '1,100 rpm', style: ['specValueStyle'] },
          ],
          [
            { text: 'Tipo de Mecanismo', style: ['specStyle'] },
            { text: 'Clutch con corte de aire', style: ['specValueStyle'] },
          ],
          [
            { text: 'Tipo de salida', style: ['specStyle'] },
            { text: '1/4" hexagonal', style: ['specValueStyle'] },
          ],
          [
            { text: 'Entrada de aire', style: ['specStyle'] },
            { text: '1/4" NPT', style: ['specValueStyle'] },
          ],
          [
            { text: 'Peso', style: ['specStyle'] },
            { text: '0.95 kg', style: ['specValueStyle'] },
          ],
        ],
      },
    },
  ],
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
};

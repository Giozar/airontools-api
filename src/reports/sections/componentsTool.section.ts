import {
  Content,
  ContentStack,
  StyleDictionary,
  TDocumentDefinitions,
  TableLayout,
} from 'pdfmake/interfaces';

const listItems = ['Item 1', 'Item 2', 'Item 3'];
const itemList: Content[] = listItems.map((item): Content => ({ text: item }));
const listItems2 = ['Item 1', 'Item 2', 'Item 3', 'Item 1', 'Item 2', 'Item 3'];
const itemList2: Content[] = listItems2.map(
  (item): Content => ({ text: item }),
);
const listItems3 = ['Item 1', 'Item 2', 'Item 3', 'Item 1', 'Item 2', 'Item 3'];
const itemList3: Content[] = listItems3.map(
  (item): Content => ({ text: item }),
);
const listItems4 = ['Item 1', 'Item 2', 'Item 3', 'Item 1'];
const itemList4: Content[] = listItems4.map(
  (item): Content => ({ text: item }),
);

export function toolheader(title: string): ContentStack {
  return {
    stack: [
      {
        columns: [
          {
            width: '50%',
            stack: [
              {
                image: 'sampleImage.jpg', // logo airontools
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

export function toollist(name: string, list: Content[]): ContentStack {
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

const muchotexto =
  'Explore the origins, history and meaning of the famous passage...';

export const tooldescription: ContentStack = {
  stack: [
    {
      table: {
        widths: ['92%'],
        body: [
          [
            {
              border: [false, false, false, false],
              text: 'Caracteristicas',
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
      text: muchotexto,
      alignment: 'justify',
      margin: [0, 5, 20, 20],
    },
  ],
};

export const toolimage: ContentStack = {
  stack: [
    {
      text: 'ATSD-30S11',
      alignment: 'right',
      background: '#1A87C0',
      color: '#fff',
      bold: true,
      fontSize: 15,
      margin: [5, 5, 5, 5],
    },
    {
      image: 'sampleImage.jpg',
      width: 250,
      height: 200,
      margin: [0, 0, 0, 20],
    },
  ],
};

export const specs: ContentStack = {
  stack: [
    {
      layout: {
        hLineColor: (i: number, node: unknown): string => '#223C80',
        vLineColor: (i: number, node: unknown): string => '#223C80',
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

const toolfooter: Content[] = [
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

const styles: StyleDictionary = {
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

export const dd: TDocumentDefinitions = {
  pageSize: 'LETTER',

  footer: function (currentPage: number, pageCount: number): Content[] {
    return toolfooter;
  },

  content: [
    toolheader('ATORNILLADOR DE PARO AUTOMÁTICO CON DES-CONEXIÓN'),
    {
      columns: [
        {
          width: '50%',
          stack: [
            tooldescription,
            toollist('Aplicaciones', itemList),
            toollist('Recomendaciones', itemList2),
            toollist('Requisitos de operación', itemList3),
          ],
        },
        {
          width: '50%',
          stack: [
            toolimage,
            specs,
            toollist('Accesorios Opcionales', itemList4),
          ],
        },
      ],
    },
  ],
  styles: styles,
};

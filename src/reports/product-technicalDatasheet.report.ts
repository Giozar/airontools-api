import {
  Content,
  ContentStack,
  TDocumentDefinitions,
  StyleDictionary,
} from 'pdfmake/interfaces';
import { Product } from 'src/products/schemas/product.schema';
import { Family } from 'src/families/schemas/family.schema';
import { Category } from 'src/categories/schemas/category.schema';
import { Subcategory } from 'src/subcategories/schemas/subcategory.schema';
import { Specification } from 'src/specifications/schemas/specification.schema';
import { User } from 'src/auth/schemas/user.schema';

// Function to generate the product technical datasheet
export const getProductTechnicalDatasheet = (
  product: Product & {
    family: Family;
    category: Category;
    subcategory: Subcategory;
    specifications: {
      specification: Specification;
      value: string;
    }[];
    createdBy: User;
    updatedBy: User;
  },
): TDocumentDefinitions => {
  const {
    name,
    model,
    family,
    category,
    subcategory,
    description,
    characteristics,
    includedItems,
    optionalAccessories,
    operationRequirements,
    applications,
    recommendations,
    specifications,
    images,
  } = product;

  // Helper function to create a list section
  const createListSection = (title: string, items: string[]): ContentStack => {
    const itemList: Content[] = items.map((item) => ({ text: item }));
    return {
      stack: [
        {
          table: {
            widths: ['92%'],
            body: [
              [
                {
                  border: [false, false, false, false],
                  text: title,
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
          ul: itemList,
        },
      ],
    };
  };

  // Helper function to create the specification table
  const createSpecsTable = (
    specs: { specification: Specification; value: string }[],
  ): ContentStack => {
    return {
      stack: [
        {
          layout: {
            hLineColor: () => '#223C80',
            vLineColor: () => '#223C80',
          },
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                { colSpan: 2, text: 'Especificaciones', style: 'headerSpec' },
                {},
              ],
              ...specs.map((spec) => [
                { text: spec.specification.name, style: 'specStyle' },
                { text: spec.value, style: 'specValueStyle' },
              ]),
            ],
          },
        },
      ],
    };
  };

  // Define the document
  const docDefinition: TDocumentDefinitions = {
    pageSize: 'LETTER',
    footer: [
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
    ],
    content: [
      {
        stack: [
          {
            columns: [
              {
                width: '50%',
                stack: [
                  {
                    image: images.length > 0 ? images[0] : 'sampleImage.jpg', // Primera imagen del arreglo o imagen por defecto
                    width: 100,
                    height: 100,
                  },
                ],
                margin: [0, 0, 10, 20],
              },
              {
                width: '50%',
                text: name || 'Nombre del Producto',
                fontSize: 20,
                alignment: 'right',
                margin: [0, 0, 0, 10],
              },
            ],
          },
        ],
      },
      {
        columns: [
          {
            width: '50%',
            stack: [
              createListSection('Características', characteristics || []),
              createListSection('Aplicaciones', applications || []),
              createListSection('Recomendaciones', recommendations || []),
              createListSection(
                'Requisitos de Operación',
                operationRequirements || [],
              ),
            ],
          },
          {
            width: '50%',
            stack: [
              {
                stack: [
                  {
                    text: model || 'Modelo del Producto',
                    alignment: 'right',
                    background: '#1A87C0',
                    color: '#fff',
                    bold: true,
                    fontSize: 15,
                    margin: [5, 5, 5, 5],
                  },
                  {
                    image: images.length > 0 ? images[0] : 'sampleImage.jpg', // Primera imagen del arreglo o imagen por defecto
                    width: 100,
                    height: 100,
                  },
                ],
              },
              createSpecsTable(specifications),
              createListSection(
                'Accesorios Opcionales',
                optionalAccessories || [],
              ),
            ],
          },
        ],
      },
    ],
    styles: {
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
    },
  };

  return docDefinition;
};

import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Product } from 'src/products/schemas/product.schema';
import { Family } from 'src/families/schemas/family.schema';
import { Category } from 'src/categories/schemas/category.schema';
import { Subcategory } from 'src/subcategories/schemas/subcategory.schema';
import { Specification } from 'src/specifications/schemas/specification.schema';
import { User } from 'src/auth/schemas/user.schema';
import {
  renderList,
  renderSpecs,
  styles,
  toolDescription,
  toolFooter,
  toolHeader,
  toolImage,
  toolList,
} from './sections/componentsTool.section';
import { Types } from 'mongoose';

// Function to generate the product technical datasheet
export const getProductTechnicalDatasheet = (
  product: Product & {
    _id: Types.ObjectId;
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
  opt?: number,
): TDocumentDefinitions => {
  const {
    _id,
    name,
    model,
    description,
    optionalAccessories,
    operationRequirements,
    applications,
    recommendations,
    images,
    specifications,
  } = product;
  const imagePath =
    images && images.length > 0 && images[opt]
      ? `./static/uploads/images/${_id}/${images[opt].replace(/\S+\/\/\S+\/\w+\//, '')}`
      : './static/images/no-image.jpg';
  const docDefinition: TDocumentDefinitions = {
    pageSize: 'LETTER',
    footer: toolFooter,

    content: [
      {
        table: {
          widths: ['100%'],
          heights: 700,
          body: [
            [
              {
                fillColor: 'white', // Fondo blanco interior
                margin: [10, 5, 5, 10], // Margen para el contenido
                stack: [
                  toolHeader(name),
                  {
                    columns: [
                      {
                        width: '50%',
                        stack: [
                          toolDescription(description),
                          toolList('Aplicaciones', renderList(applications)),
                          toolList(
                            'Recomendaciones',
                            renderList(recommendations),
                          ),
                          toolList(
                            'Requisitos de operación',
                            renderList(operationRequirements),
                          ),
                        ],
                      },
                      {
                        width: '50%',
                        stack: [
                          toolImage(model, imagePath),
                          renderSpecs(specifications),
                          toolList(
                            'Accesorios Opcionales',
                            renderList(optionalAccessories),
                          ),
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        layout: {
          hLineColor: '#223C80',
          vLineColor: '#223C80',
          hLineWidth: function () {
            return 7;
          },
          vLineWidth: function () {
            return 7;
          },
        },
      },
    ],
    styles: styles,
    pageMargins: [20, 20, 20, 50],
  };

  return docDefinition;
};

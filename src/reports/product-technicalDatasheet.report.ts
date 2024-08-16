import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Product } from 'src/products/schemas/product.schema';
import { Family } from 'src/families/schemas/family.schema';
import { Category } from 'src/categories/schemas/category.schema';
import { Subcategory } from 'src/subcategories/schemas/subcategory.schema';
import { Specification } from 'src/specifications/schemas/specification.schema';
import { User } from 'src/auth/schemas/user.schema';
import {
  renderList,
  specs,
  styles,
  toolDescription,
  toolFooter,
  toolHeader,
  toolImage,
  toolList,
} from './sections/componentsTool.section';

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
    description,
    optionalAccessories,
    operationRequirements,
    applications,
    recommendations,
    // images,
  } = product;

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'LETTER',

    footer: toolFooter,

    content: [
      toolHeader(name),
      {
        columns: [
          {
            width: '50%',
            stack: [
              toolDescription(description),
              toolList('Aplicaciones', renderList(applications)),
              toolList('Recomendaciones', renderList(recommendations)),
              toolList(
                'Requisitos de operación',
                renderList(operationRequirements),
              ),
            ],
          },
          {
            width: '50%',
            stack: [
              toolImage(
                model,
                './static/uploads/images/66b2b977d864ae78a6c7d213/8703d197-a75d-472c-adc4-078dbd199995.png',
              ),
              specs,
              toolList(
                'Accesorios Opcionales',
                renderList(optionalAccessories),
              ),
            ],
          },
        ],
      },
    ],
    styles: styles,
  };

  return docDefinition;
};

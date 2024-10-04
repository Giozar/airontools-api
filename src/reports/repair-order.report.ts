import { TDocumentDefinitions } from 'pdfmake/interfaces';
import {
  dates,
  diagnostics,
  footer,
  productData,
  title,
} from './sections/componentsRepairOrder';

export const getRepairOrder = (): TDocumentDefinitions => {
  const docDefinition: TDocumentDefinitions = {
    pageSize: 'LETTER',
    content: [dates(), productData()],
    images: {
      airontools: 'https://picsum.photos/seed/picsum/200/300',
      placeholder: 'https://picsum.photos/seed/picsum/200/300',
    },
    footer: footer(),
    pageMargins: [20, 20, 20, 20],
  };
  return docDefinition;
};

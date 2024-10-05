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
    content: [title(), dates(), productData(), diagnostics()],
    footer: footer(),
    pageMargins: [20, 20, 20, 20],
  };
  return docDefinition;
};

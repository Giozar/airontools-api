import { TDocumentDefinitions } from 'pdfmake/interfaces';
import {
  dates,
  diagnostics,
  footer,
  productData,
  title,
} from './sections/componentsRepairOrder';
import { Order } from 'src/orders/schemas/order.schema';

export const getRepairOrder = (searchedOrder: Order): TDocumentDefinitions => {
  const docDefinition: TDocumentDefinitions = {
    pageSize: 'LETTER',
    content: [
      title(),
      dates(searchedOrder),
      productData(searchedOrder),
      diagnostics(searchedOrder),
    ],
    footer: footer(searchedOrder),
    pageMargins: [20, 20, 20, 20],
  };
  return docDefinition;
};

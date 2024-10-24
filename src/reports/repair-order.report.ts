import { TDocumentDefinitions } from 'pdfmake/interfaces';
import {
  dates,
  diagnostics,
  footer,
  productData,
  title,
} from './sections/componentsRepairOrder';
import { Order } from 'src/orders/schemas/order.schema';

export const getRepairOrder = (
  searchedOrder: Order,
  imagePath: string,
): TDocumentDefinitions => {
  const docDefinition: TDocumentDefinitions = {
    pageSize: 'LETTER',
    content: [
      title(searchedOrder),
      dates(searchedOrder),
      productData(searchedOrder),
      diagnostics(searchedOrder, imagePath),
    ],
    footer: footer(searchedOrder),
  };
  return docDefinition;
};

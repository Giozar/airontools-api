import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from './sections/header.section';
import { DateFormatter } from 'src/helpers';
import { Product } from 'src/products/schemas/product.schema';

const styles: StyleDictionary = {
  header: {
    fontSize: 22,
    bold: true,
    alignment: 'center',
    margin: [0, 60, 0, 20],
  },
  body: {
    alignment: 'justify',
    margin: [0, 0, 0, 70],
  },
  signature: {
    fontSize: 14,
    bold: true,
    // alignment: 'left',
  },
  footer: {
    fontSize: 10,
    italics: true,
    alignment: 'center',
    margin: [0, 0, 0, 20],
  },
  subheader: {
    fontSize: 14,
    bold: true,
    margin: [0, 10, 0, 5],
  },
};

export const getProductTechnicalDatasheet = (
  product: Product,
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
    // technicalDatasheet,
    // specifications,
    images,
    // webImages,
    manuals,
    videos,
    // createdBy,
    // updatedBy,
  } = product;

  const docDefinition: TDocumentDefinitions = {
    styles: styles,
    pageMargins: [40, 60, 40, 60],

    header: headerSection({
      showLogo: true,
      showDate: true,
    }),

    content: [
      {
        text: `Nombre del Producto: ${name}`,
        style: 'subheader',
      },
      {
        text: `Modelo: ${model}`,
        style: 'body',
      },
      {
        text: `Familia: ${family}`,
        style: 'body',
      },
      {
        text: `Categoría: ${category}`,
        style: 'body',
      },
      {
        text: `Subcategoría: ${subcategory}`,
        style: 'body',
      },
      {
        text: `Descripción: ${description}`,
        style: 'body',
      },
      {
        text: `Características: ${characteristics?.join(', ') || 'No especificadas'}`,
        style: 'body',
      },
      {
        text: `Ítems Incluidos: ${includedItems?.join(', ') || 'No especificados'}`,
        style: 'body',
      },
      {
        text: `Accesorios Opcionales: ${optionalAccessories?.join(', ') || 'No especificados'}`,
        style: 'body',
      },
      {
        text: `Requisitos de Operación: ${operationRequirements?.join(', ') || 'No especificados'}`,
        style: 'body',
      },
      {
        text: `Aplicaciones: ${applications?.join(', ') || 'No especificadas'}`,
        style: 'body',
      },
      {
        text: `Recomendaciones: ${recommendations?.join(', ') || 'No especificadas'}`,
        style: 'body',
      },
      {
        text: `Especificaciones Técnicas:`,
        style: 'subheader',
      },
      //   {
      //     ul: specifications?.map(
      //       (spec) => `${spec.specification}: ${spec.value}`,
      //     ) || ['No especificadas'],
      //   },
      {
        text: `Imágenes: ${images?.join(', ') || 'No disponibles'}`,
        style: 'body',
      },
      {
        text: `Manuales: ${manuals?.join(', ') || 'No disponibles'}`,
        style: 'body',
      },
      {
        text: `Videos: ${videos?.join(', ') || 'No disponibles'}`,
        style: 'body',
      },
      { text: DateFormatter.getDDMMMMYYYY(new Date()), style: 'signature' },
    ],

    footer: {
      text: 'Esta ficha técnica es proporcionada para información general y no constituye un compromiso legal.',
      alignment: 'center',
      margin: [0, 20, 0, 0],
    },
  };

  return docDefinition;
};

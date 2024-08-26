import { Injectable } from '@nestjs/common';
import path from 'path';
import PdfPrinter from 'pdfmake';

import { BufferOptions, TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
  Roboto: {
    normal: path.join(__dirname, '../assets/fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '../assets/fonts/Roboto-Medium.ttf'),
    italics: path.join(__dirname, '../assets/fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(
      __dirname,
      '../assets/fonts/Roboto-MediumItalic.ttf',
    ),
  },
};

@Injectable()
export class PrinterService {
  private printer = new PdfPrinter(fonts);

  createPdf(
    docDefinition: TDocumentDefinitions,
    options: BufferOptions = {},
  ): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(docDefinition, options);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { handleDBErrors } from 'src/handlers';
import { parseIntValidate } from 'src/handlers/parseIntValidate.handle';
import { PrinterService } from 'src/printer/printer.service';
import { ProductsService } from 'src/products/products.service';
import {
  getEmploymentLetterByIdReport,
  getHelloWorldReport,
  getProductTechnicalDatasheet,
} from 'src/reports';
import { getEmploymentLetterReport } from 'src/reports/employment-letter.report';
import * as https from 'https';

@Injectable()
export class BasicReportsService {
  constructor(
    private readonly printerService: PrinterService,
    private readonly authService: AuthService,
    private readonly productsService: ProductsService,
  ) {
    // super();
  }

  hello() {
    const docDefinition = getHelloWorldReport({
      name: 'Airontools',
    });

    const doc = this.printerService.createPdf(docDefinition);

    return doc;
  }

  employmentLetter() {
    const docDefinition = getEmploymentLetterReport();
    const doc = this.printerService.createPdf(docDefinition);
    return doc;
  }

  async employmentLetterById(employeeId: string) {
    const employee = await this.authService.findOne(employeeId);

    if (!employee) {
      throw new NotFoundException(`Employee with id ${employeeId} not found`);
    }

    const docDefinition = getEmploymentLetterByIdReport({
      employerName: 'Fernando Herrera',
      employerPosition: 'Gerente de RRHH',
      employeeName: employee.name,
      employeePosition: 'employee.role',
      employeeStartDate: new Date(),
      employeeHours: 1,
      employeeWorkSchedule: 'employee.work_schedule',
      employerCompany: 'Tucan Code Corp.',
    });

    const doc = this.printerService.createPdf(docDefinition);

    return doc;
  }
  //primero hay que hacer la peticion de la imagen externa
  private getImageBuffer(imageUrl: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      https.get(imageUrl, (response) => {
        const chunks: Buffer[] = [];
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        response.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        response.on('error', (error) => {
          reject(error);
        });
      });
    });
  }
  /**
   *
   * TODO: hacer bonito el servicio si se puede
   *
   *
   */
  async productTechnicalDatasheet(id: string, opt: string = '0') {
    try {
      const product = await this.productsService.findOne(id);
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      const parsedOpt = parseIntValidate(opt);
      let docDefinition;
      if (!product.images[parsedOpt].includes('localhost')) {
        const imagebuffer = await this.getImageBuffer(
          product.images[parsedOpt] /*|| //imagen de prueba
            ' https://airontools-admin.s3.amazonaws.com/images/categories/66f84f85de9c3616b4f60748/imagen2.jpg', */,
        );
        const imageBase64 = imagebuffer.toString('base64'); //Esto es importante
        const imageDataUri = `data:image/jpeg;base64,${imageBase64}`; //Esto es importante
        docDefinition = getProductTechnicalDatasheet(product, imageDataUri);
      } else if (!product.images[parsedOpt].includes('.gif')) {
        //Esto es importante de manejar, ya que hay tipos que PDFmake no maneja
        docDefinition = getProductTechnicalDatasheet(
          product,
          `./assets/uploads/images/products/${product._id}/${product.images[opt].replace(/\S+\/\/\S+\/\w+\//, '')}`,
        );
      } else {
        //Por si nada funciono pues vacio y va al fallback image
        docDefinition = getProductTechnicalDatasheet(product);
      }
      const doc = this.printerService.createPdf(docDefinition);
      await this.productsService.assignDatasheet(
        id,
        `${process.env.HOST_API}/basic-reports/product/${id}`,
      );

      return doc;
    } catch (error) {
      handleDBErrors(error);
    }
  }
}

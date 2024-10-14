import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { handleDBErrors, ifNotFound } from 'src/handlers';
import { parseIntValidate } from 'src/handlers/parseIntValidate.handle';
import { PrinterService } from 'src/printer/printer.service';
import { ProductsService } from 'src/products/products.service';
import {
  getEmploymentLetterByIdReport,
  getHelloWorldReport,
  getProductTechnicalDatasheet,
} from 'src/reports';
import { getEmploymentLetterReport } from 'src/reports/employment-letter.report';
import validateImageUtil from './utils/validateImage.util';
import { getRepairOrder } from 'src/reports/repair-order.report';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class BasicReportsService {
  constructor(
    private readonly printerService: PrinterService,
    private readonly authService: AuthService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
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

  async productTechnicalDatasheet(id: string, opt: string = '0') {
    try {
      const product = await this.productsService.findOne(id);
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      parseIntValidate(opt);
      const image = product.images[opt];
      const imagePath = await validateImageUtil(image, id);
      const docDefinition = getProductTechnicalDatasheet({
        product,
        imagePath: imagePath,
      });
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
  async repairOrder(id: string) {
    try {
      const searchedOrder = await this.ordersService.findOne(id);
      ifNotFound({ id, entity: searchedOrder });
      console.log(searchedOrder);
      const docDefinition = getRepairOrder(searchedOrder);
      const doc = this.printerService.createPdf(docDefinition);
      return doc;
    } catch (error) {}
  }
}

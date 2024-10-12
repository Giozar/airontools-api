import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { BasicReportsService } from './basic-reports.service';
import { Response } from 'express';
import { validateId } from 'src/handlers';

@Controller('basic-reports')
export class BasicReportsController {
  constructor(private readonly basicReportsService: BasicReportsService) {}

  @Get()
  async hello(@Res() response: Response) {
    const pdfDoc = this.basicReportsService.hello();

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Hola-Mundo';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('employment-letter')
  async employmentLetter(@Res() response: Response) {
    const pdfDoc = this.basicReportsService.employmentLetter();

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Employment-Letter';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('employment-letter/:employeeId')
  async employmentLetterById(
    @Res() response: Response,
    @Param('employeeId') employeeId: string,
  ) {
    const pdfDoc =
      await this.basicReportsService.employmentLetterById(employeeId);

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Employment-Letter';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('product/:id')
  async productTechnicalDatasheet(
    @Res() response: Response,
    @Param('id') id: string,
    @Query('opt') opt?: string,
  ) {
    const pdfDoc = await this.basicReportsService.productTechnicalDatasheet(
      id,
      opt,
    );

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Airontools-Herramientas-Industriales';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('repair-order/:id')
  async repairOrder(@Res() response: Response, @Param('id') id: string) {
    validateId(id);
    const pdfDoc = await this.basicReportsService.repairOrder(id);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Airontools-Herramientas-Industriales';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}

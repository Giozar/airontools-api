import { Injectable } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { getHelloWorldReport } from 'src/reports';
import { getEmploymentLetterReport } from 'src/reports/employment-letter.report';

@Injectable()
export class BasicReportsService {
  constructor(private readonly printerService: PrinterService) {
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
}

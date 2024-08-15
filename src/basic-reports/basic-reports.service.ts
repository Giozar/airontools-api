import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrinterService } from 'src/printer/printer.service';
import {
  getEmploymentLetterByIdReport,
  getHelloWorldReport,
} from 'src/reports';
import { getEmploymentLetterReport } from 'src/reports/employment-letter.report';

@Injectable()
export class BasicReportsService {
  constructor(
    private readonly printerService: PrinterService,
    private readonly authService: AuthService,
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
}

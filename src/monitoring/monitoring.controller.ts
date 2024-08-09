import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { CreateMonitoringDto } from './dto/create-monitoring.dto';
import { Monitoring } from './schemas/monitoring.schema';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Post()
  async create(
    @Body() createMonitoringDto: CreateMonitoringDto,
  ): Promise<Monitoring> {
    return this.monitoringService.create(createMonitoringDto);
  }

  @Get()
  async findAll(): Promise<Monitoring[]> {
    return this.monitoringService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Monitoring> {
    return this.monitoringService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.monitoringService.remove(id);
  }
}

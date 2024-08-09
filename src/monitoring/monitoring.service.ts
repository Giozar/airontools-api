import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Monitoring, MonitoringDocument } from './schemas/monitoring.schema';
import { CreateMonitoringDto } from './dto/create-monitoring.dto';
// import { UpdateMonitoringDto } from './dto/update-monitoring.dto';

@Injectable()
export class MonitoringService {
  constructor(
    @InjectModel(Monitoring.name)
    private readonly monitoringModel: Model<MonitoringDocument>,
  ) {}

  async create(createMonitoringDto: CreateMonitoringDto): Promise<Monitoring> {
    const newMonitoring = new this.monitoringModel(createMonitoringDto);
    return newMonitoring.save();
  }

  async findAll(): Promise<Monitoring[]> {
    return this.monitoringModel.find().exec();
  }

  async findOne(id: string): Promise<Monitoring> {
    const monitoring = await this.monitoringModel.findById(id).exec();
    if (!monitoring) {
      throw new NotFoundException(
        `Monitoring record with ID "${id}" not found`,
      );
    }
    return monitoring;
  }

  // Uncomment this section when you implement update functionality
  // async update(id: string, updateMonitoringDto: UpdateMonitoringDto): Promise<Monitoring> {
  //   const updatedMonitoring = await this.monitoringModel
  //     .findByIdAndUpdate(id, updateMonitoringDto, { new: true })
  //     .exec();
  //   if (!updatedMonitoring) {
  //     throw new NotFoundException(`Monitoring record with ID "${id}" not found`);
  //   }
  //   return updatedMonitoring;
  // }

  async remove(id: string): Promise<void> {
    const result = await this.monitoringModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(
        `Monitoring record with ID "${id}" not found`,
      );
    }
  }
}

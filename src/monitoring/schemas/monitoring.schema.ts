import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MonitoringDocument = HydratedDocument<Monitoring>;

@Schema({
  timestamps: true,
})
export class Monitoring {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  computerId: string;

  @Prop({
    type: [
      {
        activityType: { type: String },
        fileName: { type: String, required: true },
        sourcePath: { type: String },
        destinationPath: { type: String, required: true },
        fileSize: { type: Number },
        fileType: { type: String },
        eventTimestamp: { type: String },
      },
    ],
    required: true,
  })
  activities: Array<{
    activityType: string;
    fileName: string;
    sourcePath: string;
    destinationPath: string;
    fileSize: number;
    fileType: string;
    eventTimestamp: string;
  }>;

  @Prop({})
  fileHash: string;

  @Prop({})
  status: string;

  @Prop({})
  remarks: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const MonitoringSchema = SchemaFactory.createForClass(Monitoring);

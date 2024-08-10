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
        eventTimestamp: { type: Date },
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
    eventTimestamp: Date;
  }>;

  @Prop({})
  fileHash: string;

  @Prop({})
  status: string;

  @Prop({})
  remarks: string;
}

export const MonitoringSchema = SchemaFactory.createForClass(Monitoring);

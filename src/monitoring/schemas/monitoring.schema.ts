import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument /* Schema as MongooseSchema */ } from 'mongoose';

export type MonitoringDocument = HydratedDocument<Monitoring>;

@Schema({
  timestamps: true,
})
export class Monitoring {
  @Prop({ required: true })
  activityType: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  sourcePath: string;

  @Prop({ required: true })
  destinationPath: string;

  @Prop({ required: true })
  eventTimestamp: Date;

  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  // userId: MongooseSchema.Types.ObjectId;

  // @Prop({
  //   type: MongooseSchema.Types.ObjectId,
  //   ref: 'Computer',
  //   required: false,
  // })
  // computerId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  computerId: string;

  @Prop({})
  fileSize: number;

  @Prop({})
  fileType: string;

  @Prop({})
  fileHash: string;

  @Prop({})
  status: string;

  @Prop({})
  remarks: string;
}

export const MonitoringSchema = SchemaFactory.createForClass(Monitoring);

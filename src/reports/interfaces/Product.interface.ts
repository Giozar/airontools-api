import { Document, Types } from 'mongoose';

export interface Product {
  name: string;
  model: string;
  family: Types.ObjectId;
  category: Types.ObjectId;
  subcategory: Types.ObjectId;
  description: string;
  characteristics?: string[];
  includedItems?: string[];
  optionalAccessories?: string[];
  operationRequirements?: string[];
  applications?: string[];
  recommendations?: string[];
  images?: string[];
  manuals?: string[];
  videos?: string[];
  // Añade más propiedades si es necesario
}

// Asegúrate de que ProductDocument implementa IProduct
export type ProductDocument = Document & Product;

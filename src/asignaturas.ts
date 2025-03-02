import { Schema, model, Document } from 'mongoose';
import { IProfesor } from './profesores.js';

export interface IAsignatura extends Document {
  nombre: string;
  creditos: number;
  profesor: IProfesor["_id"];
}

const asignaturaSchema = new Schema<IAsignatura>({
  nombre: { type: String, required: true },
  creditos: { type: Number, required: true },
  profesor: { type: Schema.Types.ObjectId, ref: 'Profesor' }
});

export const AsignaturaModel = model<IAsignatura>('Asignatura', asignaturaSchema);
  
  
  

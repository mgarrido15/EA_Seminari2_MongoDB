import { Schema, model, Document } from 'mongoose';
import { IAsignatura } from './asignaturas.js';

export interface IProfesor extends Document {
  nombre: string;
  apellidos: string;
  edad: number;
  asignaturas: IAsignatura["_id"] [];

}

const profesorSchema = new Schema<IProfesor>({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  edad: { type: Number, required: true },
  asignaturas: [{ type: Schema.Types.ObjectId, ref: 'Asignatura' }]
});

export const ProfesorModel = model<IProfesor>('Profesor', profesorSchema);
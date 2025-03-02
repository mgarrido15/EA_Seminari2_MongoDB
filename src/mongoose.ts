import mongoose from 'mongoose';
import { UserModel, IUser } from './user.js';
import { ProfesorModel, IProfesor } from './profesores.js';
import { AsignaturaModel, IAsignatura } from './asignaturas.js';

async function main() {
  mongoose.set('strictQuery', true); // Mantiene el comportamiento actual

  await mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar:', err));

  const user1:  IUser = {
    "name": 'Bill',
    "email": 'bill@initech.com',
    "avatar": 'https://i.imgur.com/dM7Thhn.png'
  }; 



  console.log("user1", user1); 
  const newUser= new UserModel(user1);
  const user2: IUser = await newUser.save();
  console.log("user2",user2);

  
  // findById devuelve un objeto usando el _id.
  const user3: IUser | null = await UserModel.findById(user2._id);
  console.log("user3",user3);

  // findOne devuelve un objeto usando un filtro.
  const user4: IUser | null = await UserModel.findOne({name: 'Bill'});
  console.log("user4",user4);

  // Partial<IUser> Indica que el objeto puede tener solo algunos campos de IUser.
  // select('name email') solo devuelve name y email.
  // lean() devuelve un objeto plano de JS en lugar de un documento de Mongoose.
  const user5: Partial<IUser> | null  = await UserModel.findOne({ name: 'Bill' })
    .select('name email').lean();
  console.log("user5",user5);

  // Creacion un profesor y una asignatura

  const profesor1: IProfesor = new ProfesorModel({
    nombre: 'Alejandro',
    apellidos: 'Rodriguez',
    edad: 35,
    asignaturas: []   
  });
  
  await profesor1.save();
  
  const asignatura1: IAsignatura = new AsignaturaModel({
    nombre: 'EA',
    creditos: 12,
    profesor: profesor1._id, 
  });
  
  const asignatura2: IAsignatura = new AsignaturaModel({
    nombre: 'DSA',
    creditos: 10,
    profesor: profesor1._id, 
  });
  
  await asignatura1.save();
  await asignatura2.save();
  console.log("asignatura1", asignatura1);
  console.log("asignatura2", asignatura2);
  
  profesor1.asignaturas.push(asignatura1._id);
  profesor1.asignaturas.push(asignatura2._id);
  await profesor1.save();
  console.log("profesor1", profesor1);

  //Ejecucion funciones CRUD
  await crearAsignatura('IOT', 6, profesor1._id);
  await crearAsignatura('PX', 4, profesor1._id);
  await crearAsignatura('SX', 4, profesor1._id);
  await verAsignatura(asignatura2._id);
  await editarAsignatura(asignatura2._id, 'XT', 6, profesor1._id);
  await borrarAsignatura(asignatura1._id);
  await listarAsignaturas();



}

// Funciones CRUD para asignatura

//Ver
async function verAsignatura(id: mongoose.Types.ObjectId) {
  const asignatura = await AsignaturaModel.findById(id);
  console.log("Asignatura encontrada:", asignatura);
  return asignatura;
}

//Crear
async function crearAsignatura(nombre: string, creditos: number, profesorId: mongoose.Types.ObjectId) {
  const nuevaAsignatura = new AsignaturaModel({
    nombre,
    creditos,
    profesor: profesorId
  });
  await nuevaAsignatura.save();
  console.log("Asignatura creada:", nuevaAsignatura);
}

//Borrar
async function borrarAsignatura(id: mongoose.Types.ObjectId) {
  const asignaturaBorrada = await AsignaturaModel.findByIdAndDelete(id);
  console.log("Asignatura borrada:", asignaturaBorrada);
  return asignaturaBorrada;
}

//Editar
async function editarAsignatura(id: mongoose.Types.ObjectId, nombre: string, creditos: number, profesorId: mongoose.Types.ObjectId) {
  const asignaturaActualizada = await AsignaturaModel.findByIdAndUpdate(id, {
    nombre,
    creditos,
    profesor: profesorId
  }, { new: true });
  console.log("Asignatura actualizada:", asignaturaActualizada);
  return asignaturaActualizada;
}

//Listar
async function listarAsignaturas() {
  const asignaturas = await AsignaturaModel.aggregate([
    {
      $match: { creditos: { $gte: 5 } } 
    },
    { $limit: 2 },

  ]);
  console.log("Lista de asignaturas:", asignaturas);
  return asignaturas;
}


main()

    

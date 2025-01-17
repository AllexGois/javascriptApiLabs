import mongoose from 'mongoose';

const laboratorioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true,
        trim: true,
    },
    capacidade: {
        type: Number,
        required: true,
    },
    foto: {
        type: String,
        required: false,
    },
},
    {timestamps: true}
);

const Laboratorio = mongoose.model("Laboratorio", laboratorioSchema);

export default Laboratorio;
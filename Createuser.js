require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
}));

async function crearUsuario() {
    try {
        console.log("Conectando a MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);

        const username = "usuario"; //cambiar por usuario
        const password = "contraseña"; //cambiar por contraseña

        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoAdmin = new User({ username, password: hashedPassword });
        
        await nuevoAdmin.save();
        console.log(`Usuario '${username}' creado exitosamente.`);
        
    } catch (error) {
        console.error("Error:", error.message);
    } finally {

        mongoose.connection.close();
        process.exit(0);
    }
}

crearUsuario();
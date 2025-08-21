import mongoose  from "mongoose";

const dbConnection = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Conectado a la base de datos")
    }catch(error){
        console.log("No fue posible conectar con la base de datos")
    }
}

export default dbConnection
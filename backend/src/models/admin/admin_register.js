import mongoose from 'mongoose' ;

const adminRegisterSchema = new mongoose.Schema 
({
    email : {
        type : String ,
        required : true ,
        unique: true

    } ,
    password : {
        type : String ,
        required : true
    } , 
    createdAt : {       
        type : Date ,
        default : Date.now
    }
}) ;

const AdminRegister = mongoose.model ( 'AdminRegister' , adminRegisterSchema ) ;                            

// ✅ DEFAULT EXPORT    
export default AdminRegister ;
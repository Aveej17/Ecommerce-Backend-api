import jwt from "jsonwebtoken";



export const verifyToken = (token) =>{
    return jwt.verify(token, process.env.JWT_KEY, (err, decoded) =>{
        if(err){
            throw new Error("Token expired/invalid");
        }else{
            return decoded;
        }
    });
    // return new Promise((resolve, reject) => {
    //     jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    //         if (err) {
    //             reject('Token expired/invalid');
    //         } else {
    //             resolve(decoded);
    //         }
    //     });
    // });
};
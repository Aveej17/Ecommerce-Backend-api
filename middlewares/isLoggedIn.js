import { getTokenFromHeader } from "../utils/getTokenFromHeader.js"
import { verifyToken } from "../utils/verifyToken.js";


export const isLoggedIn = (req, res, next) =>{

    // get token from header 
    const token = getTokenFromHeader(req);   
    // console.log(`token: ${token}`); 
    // verify the token 
    const  decodedUser = verifyToken(token);

    // console.log(`decodedUser ${decodedUser}`);
    

    if(!decodedUser){
        throw new Error('Invalid\Expired token, please login again');
    }else{

        // save the user into the req obj
        req.userAuthId = decodedUser?.id;
        next();
    }
}
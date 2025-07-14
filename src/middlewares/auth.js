const adminAuth = (req,res,next)=>{
    const token = "xyz";
    const isAdmin = token === "xyz";
    console.log("Auth is checking Admin");
    if(!isAdmin){
        res.status(401).send("Unauthorized Access");
    }
    else{
        next();
    }
}
const userAuth = (req,res,next)=>{
    const token = "xyz";
    const isUser = token === "xyz";
    console.log("Auth is checking User");
    if(!isUser){
        res.status(401).send("Unauthorized Access");
    }
    else{
        next();
    }
}
module.exports = {
    adminAuth,
    userAuth
}
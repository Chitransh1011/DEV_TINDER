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
module.exports = {
    adminAuth
}
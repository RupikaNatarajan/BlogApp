const { validateToken } = require("../services/authentication")

function checkForAuthentication(cookiename){
    return (req,res,next)=>{
        const tokenCookie = req.cookies[cookiename]
        if(!tokenCookie){
            return next()
        }


        try{
            const userPayload = validateToken(tokenCookie)
            req.user =userPayload
        }catch(error){
            
        }
        return next()
    }
}
module.exports = {
    checkForAuthentication
}
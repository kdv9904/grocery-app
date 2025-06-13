import jwt  from 'jsonwebtoken';
export const sellerLogin = async (req,res) =>{
    try{
    const {email, password} = req.body;

    if(password === process.env.SELLER_PASSWORD && process.env.SELLER_EMAIL){
        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '7d'});
    

    res.cookie('sellerToken',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production', // use secure cookie in protextion
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict', //  from csrf protection 
            maxAge: 7* 24 * 60 * 60* 1000, // 7 day
        })
     return res.json({success:true, message:"Logged In"});
    }else{
        return res.json({success:false, message:"invalid credentials"})
}
    }
    catch(error){
        console.log(error.message);
    }
}

export const isSellerAuth = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const sellerLogout = async(req,res)=>{
    try{
        res.clearCookie('sellerToken',{
             httpOnly:true,
            secure: process.env.NODE_ENV === 'production', // use secure cookie in protextion
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict', //  from csrf protection 
            maxAge: 7* 24 * 60 * 60* 1000,
        })
        return res.json({success:true,message:"Logged out"})
    }
    catch(error){
        console.log(error.message);
        res.json({success:false, message:error.message});
    }
}
//Modules

//Models
const RolePermModel = require("../models/Role_Permission.js");

//


const canChangeUserRole = async (req,res,next)=>{

    const reqRole = req.user.role

    //geting roler permission model
    const rolePermModel = await RolePermModel.findOne({role:reqRole});

    const {role} = req.body;
    if(role=="Manager"||role=="Admin")
    {
        res.status(403)
            .json({
                message:"Can not Make Manager or Admin",
                success:false
            })
    }

    // checking Permission
    if(rolePermModel.permissions.canChangeUserRole)//if have permission 
    {
            next();
    }
    else//if dont have permission
    {
        return res.status(403)
                .json({
                    message:"Access Denied",
                    success:false
                })
    }    
}

const canMakeManager = async(req,res,next)=>{
    
    //geting roler permission model
    const rolePermModel = await RolePermModel.findOne({role:req.user.role});

    const {role} = req.body;
    if(role=="Admin")
    {
        res.status(403)
            .json({
                message:"Can not Make Admin",
                success:false
            })
    }

    // checking Permission
    if(rolePermModel.permissions.canMakeManager)//if have permission 
    {
            next();
    }
    else//if dont have permission
    {
        return res.status(403)
                .json({
                    message:"Access Denied",
                    success:false
                })
    }    
}

module.exports = {
    canChangeUserRole,
    canMakeManager
}
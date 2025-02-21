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
    if(rolePermModel.permissions.canChangeUserRole &&  req.user.verified==true)//if have permission 
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

const canManageUsers = async(req,res,next)=>{
     
    //geting roler permission model
    const rolePermModel = await RolePermModel.findOne({role:req.user.role});


    // checking Permission
    if(rolePermModel.permissions.canManageUsers)//if have permission 
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


const canMonitorSystem = async(req,res,next)=>{
     
    //geting roler permission model
    const rolePermModel = await RolePermModel.findOne({role:req.user.role});


    // checking Permission
    if(rolePermModel.permissions.canMonitorSystem)//if have permission 
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

const canCreateDonation = async(req,res,next)=>{
     
    //geting roler permission model
    const rolePermModel = await RolePermModel.findOne({role:req.user.role});


    // checking Permission
    if(rolePermModel.permissions.canCreateDonation)//if have permission 
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

const canViewDonations = async(req,res,next)=>{
     
    //geting roler permission model
    const rolePermModel = await RolePermModel.findOne({role:req.user.role});


    // checking Permission
    if(rolePermModel.permissions.canViewDonations && req.user.verified==true)//if have permission 
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

const canClaimDonation = async(req,res,next)=>{
     
    //geting roler permission model
    const rolePermModel = await RolePermModel.findOne({role:req.user.role});

    console.log(req.user.role,req.user.verified)
    // checking Permission
    if(rolePermModel.permissions.canClaimDonation && req.user.verified ==true)//if have permission 
    {
            next();
    }
    else//if dont have permission
    {
        return res.status(403)
                .json({
                    message:"Access Denied No permission Or Not verified",
                    success:false
                })
    }    

}

const canDeleteDonation = async(req,res,next)=>{s
     
    //geting roler permission model
    const rolePermModel = await RolePermModel.findOne({role:req.user.role});

    console.log(req.user.role,req.user.verified)
    // checking Permission
    if(rolePermModel.permissions.canDeleteDonation)//if have permission 
    {
            next();
    }
    else//if dont have permission
    {
        return res.status(403)
                .json({
                    message:"Access Denied No permission Or Not verified",
                    success:false
                })
    }    

}

const canAssignVolunteers = async(req,res,next)=>{
     
    //geting roler permission model
    const rolePermModel = await RolePermModel.findOne({role:req.user.role});

    console.log(req.user.role,req.user.verified)
    // checking Permission
    if(rolePermModel.permissions.canAssignVolunteers && req.user.verified ==true)//if have permission 
    {
            next();
    }
    else//if dont have permission
    {
        return res.status(403)
                .json({
                    message:"Access Denied No permission Or Not verified",
                    success:false
                })
    }    

}
module.exports = {
    canChangeUserRole,
    canMakeManager,
    canManageUsers,
    canMonitorSystem,

    canCreateDonation,
    canViewDonations,
    canDeleteDonation,

    canClaimDonation,

    canAssignVolunteers
}
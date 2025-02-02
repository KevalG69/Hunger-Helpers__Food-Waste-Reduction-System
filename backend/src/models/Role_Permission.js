//Modules
const mongoose = require("mongoose");


const rolePermissionSchema = new mongoose.Schema({
    type:Map,
    of: Boolean,
    default:{
    //user
    canCreateDonation: false,
    canClaimDonation: false,
    canDeleteDonation: false,
    canEditDonation:false,
    canReport:false,
    //admin
    canManageUsers: false,
    canManageContent:false,
    canMakeManager:false,
    canManageDonation:false,
    canMonitorSystem:false,
    canChangePlatformSetting:false,

    //manager
    canCreateDonationPoint:false,
    
    //user
    canViewAnalytics: false,
    canViewDonations:false,
    canTrackDonation:false,
    canTrackDonationPoint:false,
    canRequestHelp: false,
    canAssignVolunteers: false,

    }
})
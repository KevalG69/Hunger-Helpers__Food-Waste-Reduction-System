const mongoose = require('mongoose');

const rolePermissionSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true
  },
  permissions: {
    canCreateDonation: { type: Boolean, default: false },
    canCreateDonationPoint: { type: Boolean, default: false },
    canMakeManager: { type: Boolean, default: false },
    
    canEditDonation: { type: Boolean, default: false },
    canChangeUserRole: { type: Boolean, default: false },
    canChangePlatformSetting: { type: Boolean, default: false },

    canManageContent: { type: Boolean, default: false },
    canManageDonation: { type: Boolean, default: false },
    canManageUsers: { type: Boolean, default: false },

    canClaimDonation: { type: Boolean, default: false },
    canReport: { type: Boolean, default: false },
    canRequestHelp: { type: Boolean, default: false },
    canAssignVolunteers: { type: Boolean, default: false },

    canGetUser: { type: Boolean, default: false },
    canMonitorSystem: { type: Boolean, default: false },
    canViewAnalytics: { type: Boolean, default: false },
    canViewDonations: { type: Boolean, default: false },

    canTrackDonation: { type: Boolean, default: false },
    canTrackDonationPoint: { type: Boolean, default: false },

    canDeleteDonation: { type: Boolean, default: false }
  }
});

module.exports = mongoose.model('Role_Permission', rolePermissionSchema);

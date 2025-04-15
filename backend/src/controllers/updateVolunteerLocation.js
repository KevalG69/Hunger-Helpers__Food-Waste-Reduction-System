// Add this new method to handle location updates
 const updateVolunteerLocation = async (req, res) => {
    try {
      const { donationBoxId, lat, lng } = req.body;
      
      // Update the donation box with new volunteer location
      await DonationBoxModel.findByIdAndUpdate(donationBoxId, {
        'volunteerLocation': { lat, lng },
        'locationUpdatedAt': new Date()
      });
  
      // Emit the new location to all interested clients
      const io = getIO();
      io.to(`tracking-${donationBoxId}`).emit('location-update', { lat, lng });
  
      res.status(200).json({
        success: true,
        message: "Location updated successfully"
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to update location"
      });
    }
  };

  module.exports = {
    updateVolunteerLocation
  }
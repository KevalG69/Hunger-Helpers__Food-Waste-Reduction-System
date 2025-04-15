const Donation = require('../models/Donation_Box');
const DonationData = require('../models/Donation_Data');

const calculateDailyDonationData = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const donations = await Donation.find({
    createdAt: { $gte: today }
  });

  let meals = 0, wasted = 0;
  const donors = new Set();
  const volunteers = new Set();

  for (const d of donations) {
    if (d.status === 'claimed') meals += d.quantity;
    else wasted += d.quantity;

    if (d.userId) donors.add(d.userId.toString());
    if (d.volunteerId) volunteers.add(d.volunteerId.toString());
  }

  await DonationData.findOneAndUpdate(
    { date: today },
    {
      date: today,
      total_meals_served: meals,
      total_donors: donors.size,
      total_volunteers: volunteers.size,
      total_food_wasted: wasted
    },
    { upsert: true }
  );

  console.log("✅ Daily Donation_Data updated.");
};

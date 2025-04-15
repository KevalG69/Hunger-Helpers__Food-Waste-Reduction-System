const AnalyticsData = require('../models/Analytics_Data');
const DonationData = require('../models/Donation_Data');
const Donation = require('../models/Donation_Box');

// Region-wise analytics calculation
const calculateRegionAnalytics = async () => {
  const donations = await Donation.find();

  const grouped = {};

  for (const d of donations) {
    const region = d.region;
    if (!grouped[region]) {
      grouped[region] = {
        meals: 0,
        wasted: 0,
        donors: new Set(),
        volunteers: new Set(),
        ngos: new Set(),
        claimedCount: 0,
        unclaimedCount: 0,
        times: [],
      };
    }

    const group = grouped[region];

    if (d.status === 'claimed') {
      group.meals += d.quantity;
      group.claimedCount++;
    } else {
      group.wasted += d.quantity;
      group.unclaimedCount++;
    }

    if (d.userId) group.donors.add(d.userId.toString());
    if (d.volunteerId) group.volunteers.add(d.volunteerId.toString());
    if (d.ngoId) group.ngos.add(d.ngoId.toString());

    if (d.createdAt && d.claimedAt) {
      const diffMins = (new Date(d.claimedAt) - new Date(d.createdAt)) / 60000;
      if (diffMins > 0) group.times.push(diffMins);
    }
  }

  for (const region in grouped) {
    const data = grouped[region];

    const avgTime = data.times.length
      ? data.times.reduce((a, b) => a + b, 0) / data.times.length
      : 0;

    const totalDonations = data.claimedCount + data.unclaimedCount;
    const successRate = totalDonations > 0
      ? Math.round((data.claimedCount / totalDonations) * 100)
      : 0;

    // Top Donor
    const topDonor = await Donation.aggregate([
      { $match: { region, status: 'claimed' } },
      { $group: { _id: "$userId", total: { $sum: "$quantity" } } },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);

    // Top Volunteer
    const topVolunteer = await Donation.aggregate([
      { $match: { region, status: 'claimed' } },
      { $group: { _id: "$volunteerId", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);

    await AnalyticsData.findOneAndUpdate(
      { region },
      {
        date: new Date(),
        region,
        total_meals_donated: data.meals,
        total_food_wasted: data.wasted,
        total_donors: data.donors.size,
        total_volunteers: data.volunteers.size,
        total_ngos: data.ngos.size,
        active_users: data.donors.size + data.volunteers.size,
        avg_donation_time: Math.round(avgTime),
        donation_success_rate: successRate,
        top_donors: topDonor[0]?._id || null,
        top_volunteers: topVolunteer[0]?._id || null,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
  }

  console.log("✅ Region-wise Analytics_Data updated.");
};

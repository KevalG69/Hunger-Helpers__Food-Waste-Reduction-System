const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');

const getToday = () => new Date().toISOString().split('T')[0];

const generateRanking = (users) =>
  users.map((user, index) => ({
    user_id: user._id,
    rank: index + 1,
    name: user.name,
    profilePhoto: user.profilePhoto || '',
    contribution_points: user.contribution_points || 0,
    donation_count: user.donation_count || 0,
    deliveries_completed: user.deliveries_completed || 0,
    badges: user.badges || [],
  }));

const updateLeaderboard = async (rankingType, filter, sortBy) => {
  try {
    const users = await User.find(filter)
      .sort({ [sortBy]: -1 })
      .limit(10);

    const rankings = generateRanking(users);
    const today = getToday();

    await Leaderboard.deleteOne({
      date: new Date(today),
      ranking_type: rankingType,
    });

    const leaderboard = new Leaderboard({
      date: new Date(today),
      ranking_type: rankingType,
      rankings,
    });

    await leaderboard.save();
    console.log(`✅ ${rankingType} leaderboard updated.`);
  } catch (err) {
    console.error(`❌ Error updating ${rankingType}:`, err.message);
  }
};

const updateAllLeaderboards = async () => {
  await updateLeaderboard("Top Donors", {}, "contribution_points");

  await updateLeaderboard("Top Volunteers", { role: 'volunteer', verified: true }, "deliveries_completed");

  await updateLeaderboard("Top Manager", { role: 'manager' }, "donation_count");
};

module.exports = updateAllLeaderboards;

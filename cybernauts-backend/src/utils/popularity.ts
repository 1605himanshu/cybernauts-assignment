import User from "../models/userModel";

/**
 * popularityScore = number of unique friends + (total hobbies shared with friends × 0.5)
 * Returns the computed popularity score (number).
 */
export const calculatePopularity = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return 0;

  const friends = await User.find({ _id: { $in: user.friends } });
  let sharedHobbies = 0;

  friends.forEach((friend) => {
    sharedHobbies += friend.hobbies.filter((h) => user.hobbies.includes(h)).length;
  });

  const popularity = user.friends.length + sharedHobbies * 0.5;
  user.popularityScore = popularity;
  await user.save();

  return popularity;
};

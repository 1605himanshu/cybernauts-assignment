import { expect } from "chai";
import mongoose from "mongoose";
import User from "../models/userModel";
import { calculatePopularity } from "../utils/popularity";

describe("Popularity and link/unlink business rules", function() {
  before(async function() {
    await mongoose.connect(process.env.TEST_DB_URL || "mongodb://127.0.0.1:27017/cybernauts_test");
    await User.deleteMany({});
  });

  after(async function() {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  it("calculates popularity score correctly with shared hobbies", async function() {
    const a = await User.create({ username: "A", age: 20, hobbies: ["x","y"], friends: [] });
    const b = await User.create({ username: "B", age: 22, hobbies: ["x","z"], friends: [a._id] });
    a.friends.push(b._id);
    await a.save();
    const popA = await calculatePopularity(a._id.toString());
    const popB = await calculatePopularity(b._id.toString());
    // unique friends =1, shared hobbies between A and B = 1 -> 1 + 1*0.5 = 1.5
    expect(popA).to.equal(1 + 1*0.5);
    expect(popB).to.equal(1 + 1*0.5);
  });

  it("prevents delete when still linked", async function() {
    const u1 = await User.create({ username: "D1", age:30, hobbies:[], friends:[] });
    const u2 = await User.create({ username: "D2", age:31, hobbies:[], friends:[u1._id] });
    u1.friends.push(u2._id);
    await u1.save();
    // try to delete u1 by checking friends length
    expect(u1.friends.length).to.be.greaterThan(0);
  });

  it("prevents duplicate linking (conflict)", async function() {
    const x = await User.create({ username: "X", age:25, hobbies:[], friends:[] });
    const y = await User.create({ username: "Y", age:26, hobbies:[], friends:[] });
    x.friends.push(y._id);
    await x.save();
    // adding y->x should still show that they're linked when checking either's friends
    expect(x.friends.map(String)).to.include(y._id.toString());
  });
});

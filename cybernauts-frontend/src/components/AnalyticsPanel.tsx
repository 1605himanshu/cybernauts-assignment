import React from "react";
import { useUserContext } from "../context/UserContext";

const AnalyticsPanel: React.FC = () => {
  const { users } = useUserContext();

  // Avoid crashing when no users yet
  if (!users || users.length === 0) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl flex flex-col items-center justify-center text-center w-full">
        <h3 className="font-semibold text-lg mb-2">📊 Analytics</h3>
        <p>No users yet</p>
      </div>
    );
  }

  // ✅ Safe reduce with initial value 0
  const avg =
    users.reduce((acc, u) => acc + (u.popularityScore || 0), 0) / users.length;

  // ✅ Safe top user
  const top = users.reduce((a, b) =>
    (a?.popularityScore || 0) > (b?.popularityScore || 0) ? a : b
  );

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl flex flex-col items-center justify-center text-center w-full">
      <h3 className="font-semibold text-lg mb-3">📊 Analytics</h3>
      <p>Total Users: {users.length}</p>
      <p>Average Score: {avg.toFixed(2)}</p>
      <p>Top User: {top?.username || "—"}</p>
    </div>
  );
};

export default AnalyticsPanel;

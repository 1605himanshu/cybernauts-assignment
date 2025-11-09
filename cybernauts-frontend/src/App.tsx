import React from "react";
import Graph from "./components/Graph";
import HobbySidebar from "./components/HobbySidebar";
import AddUserForm from "./components/AddUserForm";
import AnalyticsPanel from "./components/AnalyticsPanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiRefreshCcw } from "react-icons/fi";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-white via-slate-50 to-slate-100 overflow-x-hidden">
      {/* Header */}
      <header className="w-full bg-white/60 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="w-full px-8 py-3 flex items-center justify-between">
          {/* Brand Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
              CN
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Cybernauts — User Network
              </h1>
              <p className="text-sm text-gray-500">
                Interactive user relationships & hobby graph
              </p>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            title="Refresh"
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md focus:outline-none transition"
            onClick={() => window.location.reload()}
          >
            <FiRefreshCcw className="text-gray-600" />
            <span className="text-sm text-gray-700">Refresh</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 w-full overflow-hidden">
        <div className="w-full h-full px-8 py-6 grid grid-cols-12 gap-6 max-w-full">
          {/* Left: Hobby Sidebar */}
          <aside className="col-span-3 bg-white rounded-xl border border-gray-200 p-4 shadow-sm overflow-auto">
            <HobbySidebar />
          </aside>

          {/* Center: Graph */}
          <section className="col-span-6 bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-md font-medium text-gray-800">User Graph</h2>
              <p className="text-sm text-gray-500">
                Drag nodes to rearrange or connect users.
              </p>
            </div>
            <div className="flex-1 min-h-[500px]">
              <Graph />
            </div>
          </section>

          {/* Right: Manage Users + Analytics */}
          <aside className="col-span-3 flex flex-col gap-5">
            {/* Manage Users */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col items-center justify-center">
              <h3 className="font-semibold text-gray-800 mb-3 text-center">
                Manage Users
              </h3>
              <AddUserForm />
            </div>

            {/* Analytics */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-center">
              <AnalyticsPanel />
            </div>
          </aside>
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastContainer position="bottom-right" autoClose={2500} theme="light" />
    </div>
  );
};

export default App;

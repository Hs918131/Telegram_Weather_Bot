"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { auth, provider, signInWithPopup, signOut } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";


const AdminPanel = () => {
  const api = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({
    weatherApiKey: "",
    telegramBotToken: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem("adminToken", user.uid);
        fetchUsers();
        fetchSettings();
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("adminToken");
      }
    });
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${api}/users`);
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${api}/admin/settings`);
      if (response.data) {
        setSettings({
          weatherApiKey: response.data.weatherApiKey || "",
          telegramBotToken: response.data.telegramBotToken || "",
        });
      }
    } catch (err) {
      setError("Failed to fetch settings");
    }
  };

  const handleSaveSettings = async () => {
    try {
      await axios.put(`${api}/admin/settings`, settings);
      setSuccessMessage("Settings updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to save settings");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("adminToken", result.user.uid);
      setIsAuthenticated(true);
      fetchUsers();
      fetchSettings();
    } catch (error) {
      setError("Google Sign-in failed.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("adminToken");
      setIsAuthenticated(false);
    } catch (error) {
      setError("Logout failed.");
    }
  };

  const handleUserAction = async (chatId, action) => {
    try {
      await axios.post(`${api}/admin/users/${chatId}/${action}`);
      fetchUsers();
      setSuccessMessage(`User ${action}ed successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(`Failed to ${action} user`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-[400px] bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Telegram Bot Admin</h2>
            <p className="text-gray-600 mb-6">
              Sign in to access the admin panel
            </p>
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] ">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Telegram Bot</h1>
              <p className="text-sm text-gray-500">Administration Panel</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        <div className="space-y-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "users"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "settings"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Bot Settings
              </button>
            </nav>
          </div>

          {activeTab === "users" && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold">Users</h2>
                <p className="text-gray-600">
                  Manage user access and permissions
                </p>
              </div>
              <div className="space-y-4">
                {users.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No users found.
                  </p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-lg border bg-gray-50"
                    >
                      <div className="space-y-2">
                        <p className="font-medium">Chat ID: {user.chatId}</p>
                        <p className="text-sm text-gray-600">
                          Location: {user.location}
                        </p>
                        <p className="text-sm">
                          Status:{" "}
                          <span
                            className={
                              user.isActive ? "text-green-500" : "text-red-500"
                            }
                          >
                            {user.isActive ? "Active" : "Blocked"}
                          </span>
                        </p>
                      </div>
                      <div className="flex space-x-4 self-end sm:self-center">
                        {user.isActive ? (
                          <button
                            onClick={() =>
                              handleUserAction(user.chatId, "block")
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleUserAction(user.chatId, "unblock")
                            }
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Unblock
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleUserAction(user.chatId, "delete")
                          }
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold">Bot Settings</h2>
                <p className="text-gray-600">Configure API keys and tokens</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weather API Key</label>
                  <input
                    type="text"
                    value={settings.weatherApiKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        weatherApiKey: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2 gap-4">
                  <label className="text-sm font-medium">
                    Telegram Bot Token
                  </label>
                  <input
                    type="text"
                    value={settings.telegramBotToken}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        telegramBotToken: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleSaveSettings}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

import axios from "axios";

const API_BASE = "http://localhost:5000/api/users";

// ✅ Fetch all users
export const getUsersApi = () => axios.get(API_BASE);

// ✅ Get graph
export const getGraphApi = () => axios.get(`${API_BASE}/graph/all`);

// ✅ Create user
export const createUserApi = (data: { username: string; age: number; hobbies: string[] }) =>
  axios.post(API_BASE, data);

// ✅ Update user (PUT /api/users/:id)
export const updateUserApi = (id: string, data: Partial<any>) =>
  axios.put(`${API_BASE}/${id}`, data);

// ✅ Delete user (DELETE /api/users/:id)
export const deleteUserApi = (id: string) =>
  axios.delete(`${API_BASE}/${id}`);

// ✅ Link users (POST /api/users/:id/link)
export const linkUsersApi = (sourceId: string, targetId: string) =>
  axios.post(`${API_BASE}/${sourceId}/link`, { friendId: targetId });

// ✅ Unlink users (DELETE /api/users/:id/unlink)
export const unlinkUsersApi = (sourceId: string, targetId: string) =>
  axios.delete(`${API_BASE}/${sourceId}/unlink`, { data: { friendId: targetId } });

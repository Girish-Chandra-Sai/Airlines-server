// services/flightService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/flights';

export const getFlights = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getFlightById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const insertFlight = async (flightData) => {
  const response = await axios.post(API_URL, flightData, {
    headers: { 'x-auth-token': localStorage.getItem('adminToken') }
  });
  return response.data;
};

export const updateFlight = async (id, flightData) => {
  const response = await axios.put(`${API_URL}/${id}`, flightData, {
    headers: { 'x-auth-token': localStorage.getItem('adminToken') }
  });
  return response.data;
};

export const deleteFlight = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { 'x-auth-token': localStorage.getItem('adminToken') }
  });
  return response.data;
};
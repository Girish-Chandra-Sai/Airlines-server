import axios from 'axios';

// Function to handle user login
export const loginUser = async (formData) => {
  try {
    const response = await axios.post('https://airlines-server.onrender.com/api/airlineUser/login', formData);
    console.log('Login service response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login service error:', error.response?.data);
    throw error;
  }
};

// Function to handle user registration
export const register = async (formData) => {
  try {
    const response = await axios.post('https://airlines-server.onrender.com/api/airlineUser/register', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to check login status
export const checkLoginStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const response = await axios.get('https://airlines-server.onrender.com/api/airlineUser/check-auth', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.isLoggedIn;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

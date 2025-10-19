export const setUserToStorage = (userData) => {
  localStorage.setItem('authToken', userData.token);
  localStorage.setItem('userData', JSON.stringify(userData));
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const getUserFromStorage = () => {
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  window.location.href = '/';
};

export const clearUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

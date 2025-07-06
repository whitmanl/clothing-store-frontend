export const isEmail = (email?: string) => {
  if (!email) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  return true;
};

export const validPassword = (password?: string) => {
  if (!password) return false;
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password)) return false;
  return true;
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user: demoUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function init(){
      try{
        const profile = await authService.getProfile();
        if (mounted) setUser(profile);
      }catch(e){
        if (mounted) setUser(demoUser);
      }finally{ if (mounted) setLoading(false); }
    }
    init();
    return () => { mounted = false; };
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setUser(res.user || res);
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;

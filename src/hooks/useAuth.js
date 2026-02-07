import { useState, useEffect } from 'react';

export default function useAuth(){
  // Simple demo hook – returns a demo manager user
  const [user, setUser] = useState({ name: 'Demo Manager', email: 'demo@freshflow.dk', role: 'manager' });
  const [loading, setLoading] = useState(false);
  useEffect(() => { setLoading(false); }, []);
  return { user, loading };
}

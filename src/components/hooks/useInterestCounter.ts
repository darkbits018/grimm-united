import { useState, useEffect } from 'react';

export function useInterestCounter() {
  const [count, setCount] = useState<number>(1250); // Fallback base

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/stats`);
        if (response.ok) {
          const data = await response.json();
          setCount(data.interest_count);
        }
      } catch (error) {
        console.error('Failed to fetch interest count:', error);
      }
    };

    fetchCount();

    // Make it tick occasionally to feel alive
    const interval = setInterval(() => {
      setCount(prev => prev + (Math.random() > 0.8 ? 1 : 0));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return count;
}
// src/components/Callback.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { Alert, AlertDescription } from "../components/ui/alert";
import { Loader2 } from "lucide-react";

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (!code || !state) {
        setError('Missing required OAuth parameters');
        return;
      }

      try {
        const success = await authService.handleCallback(code, state);
        if (success) {
          navigate('/');
        } else {
          setError('Authentication failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex justify-center items-center">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Processing authentication...</span>
    </div>
  );
};

export default Callback;
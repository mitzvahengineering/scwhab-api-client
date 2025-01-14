// src/App.tsx
import React, { useState } from 'react';
import { Input } from './components/ui/input';
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Loader2 } from "lucide-react";

interface OptionsChainResponse {
  // Define the response type based on Schwab API documentation
  // This is a placeholder - update according to actual API response
  symbol: string;
  expiration: string;
  strike: number;
  callPrice: number;
  putPrice: number;
  // Add other fields as needed
}

const App: React.FC = () => {
  const [ticker, setTicker] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [optionsChain, setOptionsChain] = useState<OptionsChainResponse[]>([]);

  const fetchOptionsChain = async () => {
    if (!ticker) {
      setError('Please enter a ticker symbol');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Replace with actual API endpoint and authentication
      const response = await fetch(`YOUR_SCHWAB_API_ENDPOINT/options/${ticker}`, {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch options chain');
      }

      const data = await response.json();
      setOptionsChain(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Options Chain Viewer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Enter ticker symbol (e.g., AAPL)"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="max-w-xs"
            />
            <Button 
              onClick={fetchOptionsChain}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </>
              ) : (
                'Fetch Options'
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {optionsChain.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Options Chain for {ticker}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Strike</th>
                    <th className="text-left p-2">Expiration</th>
                    <th className="text-left p-2">Call Price</th>
                    <th className="text-left p-2">Put Price</th>
                  </tr>
                </thead>
                <tbody>
                  {optionsChain.map((option, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{option.strike}</td>
                      <td className="p-2">{option.expiration}</td>
                      <td className="p-2">{option.callPrice}</td>
                      <td className="p-2">{option.putPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default App;

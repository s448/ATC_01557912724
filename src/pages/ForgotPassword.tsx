
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
      toast.success('Reset link sent to your email');
    } catch (error) {
      toast.error('Failed to send reset link: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-container">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            {isSubmitted 
              ? 'Check your email for a reset link' 
              : 'Enter your email to receive a password reset link'}
          </CardDescription>
        </CardHeader>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}
              </Button>
              <p className="text-center text-sm text-gray-500">
                <Link to="/login" className="text-primary hover:underline">
                  Back to Login
                </Link>
              </p>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <p className="text-center text-green-800">
                If an account with that email exists, we've sent a password reset link.
                Please check your email inbox.
              </p>
            </div>
            <div className="text-center">
              <Link to="/login">
                <Button variant="outline" className="mt-4">
                  Return to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;

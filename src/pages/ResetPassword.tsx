
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();

  useEffect(() => {
    // Extract token from the URL query parameters
    const query = new URLSearchParams(location.search);
    const resetToken = query.get('token');
    
    if (resetToken) {
      setToken(resetToken);
    } else {
      toast.error('Invalid or missing reset token');
      navigate('/login');
    }
  }, [location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!token) {
      toast.error('Reset token is missing');
      return;
    }

    setIsResetting(true);

    try {
      await resetPassword(token, newPassword);
      setResetComplete(true);
      toast.success('Password has been reset successfully');
    } catch (error) {
      toast.error('Failed to reset password: ' + (error as Error).message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-container">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {resetComplete ? 'Password Reset Complete' : 'Reset Your Password'}
          </CardTitle>
          <CardDescription className="text-center">
            {resetComplete 
              ? 'Your password has been successfully reset' 
              : 'Create a new password for your account'}
          </CardDescription>
        </CardHeader>
        
        {!resetComplete ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isResetting}
              >
                {isResetting ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <p className="text-center text-green-800">
                Your password has been reset successfully.
              </p>
            </div>
            <div className="text-center">
              <Link to="/login">
                <Button className="mt-4">
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

export default ResetPassword;

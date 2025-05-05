
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe('pk_test_51RLTMmQ8kQHUoJdGIQRamtw9IeVnPyy9TEIJB03HfpxRGBPwDDVg3iSFo1FWLXyfj4PZR5F9eos1ERL79F7FXIvF0084SZi8Yu');

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePayment = async (amount: number) => {
    setLoading(true);
    try {
      // In a real implementation, this would call your Stripe backend endpoint
      // For demo purposes, we're simulating the process
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      // Simulate creating a payment session
      // In production, you would call your backend API to create a checkout session
      setTimeout(() => {
        toast({
          title: "Payment Successful",
          description: `You have successfully made a payment of $${amount.toFixed(2)}`,
        });
        setLoading(false);
        navigate('/my-bookings');
      }, 1500);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">Payment Options</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic</CardTitle>
            <CardDescription>Single Event Access</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$9.99</p>
            <p className="text-sm text-muted-foreground mt-2">Access to a single event of your choice</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handlePayment(9.99)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Premium</CardTitle>
            <CardDescription>Monthly Pass</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$49.99</p>
            <p className="text-sm text-muted-foreground mt-2">Access to all events for one month</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handlePayment(49.99)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ultimate</CardTitle>
            <CardDescription>Annual Pass</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$199.99</p>
            <p className="text-sm text-muted-foreground mt-2">Access to all events for a full year</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handlePayment(199.99)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8 bg-muted p-4 rounded-lg">
        <h3 className="font-medium mb-2">Payment Information</h3>
        <p className="text-sm text-muted-foreground">
          This is a demonstration of Stripe integration. In a production environment, 
          you would be redirected to Stripe's secure checkout page to complete your payment.
          For this demo, clicking "Pay Now" will simulate a successful payment.
        </p>
      </div>
    </div>
  );
};

export default Payment;

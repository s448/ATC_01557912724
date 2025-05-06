
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { useBookings } from '@/contexts/BookingContext';
import { supabase } from '@/lib/supabase';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe('pk_test_51RLTMmQ8kQHUoJdGIQRamtw9IeVnPyy9TEIJB03HfpxRGBPwDDVg3iSFo1FWLXyfj4PZR5F9eos1ERL79F7FXIvF0084SZi8Yu');

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { createBooking } = useBookings();
  
  // Get event details from location state
  const eventDetails = location.state || null;
  const [isEventPayment, setIsEventPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  useEffect(() => {
    // Check if this is an event payment
    if (eventDetails && eventDetails.eventId && eventDetails.eventPrice) {
      setIsEventPayment(true);
    }
  }, [eventDetails]);

  const handleEventPayment = async () => {
    if (!eventDetails) {
      toast.error("Missing event details. Please try again.");
      navigate('/');
      return;
    }
    
    setLoading(true);
    try {
      // Create payment record in Supabase
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          eventId: eventDetails.eventId,
          amount: eventDetails.eventPrice,
          status: 'completed',
          date: new Date().toISOString()
        }])
        .select();
        
      if (error) {
        throw new Error(error.message);
      }
      
      // After successful payment, create the booking
      createBooking(eventDetails.eventId);
      setPaymentCompleted(true);
      setLoading(false);
      toast.success(`Payment for ${eventDetails.eventName} successful!`);
    } catch (error: any) {
      toast.error("Payment failed: " + error.message);
      setLoading(false);
    }
  };

  const handlePackagePayment = async (amount: number) => {
    setLoading(true);
    try {
      // Create payment record in Supabase
      const { error } = await supabase
        .from('payments')
        .insert([{
          amount,
          status: 'completed',
          date: new Date().toISOString()
        }]);
        
      if (error) {
        throw new Error(error.message);
      }

      toast.success(`Payment of $${amount.toFixed(2)} successful!`);
      setLoading(false);
      navigate('/my-bookings');
    } catch (error: any) {
      toast.error("Payment failed: " + error.message);
      setLoading(false);
    }
  };

  // Payment success message after booking is completed
  if (isEventPayment && paymentCompleted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600 dark:text-green-400">Congratulations!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Your booking is confirmed!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You have successfully booked a ticket for {eventDetails?.eventName}.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                A confirmation has been saved to your account.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button onClick={() => navigate('/')}>
              Browse More Events
            </Button>
            <Button variant="outline" onClick={() => navigate('/my-bookings')}>
              View My Bookings
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Event payment page
  if (isEventPayment) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <h1 className="text-2xl font-bold mb-6">Complete Your Purchase</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Event</span>
                <span className="font-medium">{eventDetails?.eventName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Price</span>
                <span className="font-bold text-primary">${eventDetails?.eventPrice.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary">${eventDetails?.eventPrice.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleEventPayment}
              disabled={loading}
            >
              {loading ? "Processing..." : `Pay $${eventDetails?.eventPrice.toFixed(2)}`}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">Payment Information</h3>
          <p className="text-sm text-muted-foreground">
            This is a demonstration of Stripe integration. In a production environment, 
            you would be redirected to Stripe's secure checkout page to complete your payment.
            For this demo, clicking "Pay Now" will simulate a successful payment.
          </p>
        </div>
      </div>
    );
  }

  // Default package payment page
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
              onClick={() => handlePackagePayment(9.99)}
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
              onClick={() => handlePackagePayment(49.99)}
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
              onClick={() => handlePackagePayment(199.99)}
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


export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  resetToken?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
  date: string;
  venue: string;
  price: number;
  imageUrl: string;
  createdBy: string;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  bookingDate: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  count?: number;
}

export interface BookingTrend {
  name: string;
  bookings: number;
}

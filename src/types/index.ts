
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

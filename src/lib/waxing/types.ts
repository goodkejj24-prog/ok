export interface Customer {
  id?: number;
  name: string;
  phone: string;
  memo?: string;
  createdAt: string; // ISO string
}

export interface Reservation {
  id?: number;
  customerId: number;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  area: string;       // 시술 부위
  status: 'reserved' | 'completed' | 'cancelled' | 'noshow';
  completedAt?: string; // ISO string
  msgBooking: 'pending' | 'sent';
  msgDayBefore: 'pending' | 'sent' | 'na';
  msgAftercare: 'pending' | 'sent' | 'na';
  msgReminder: 'pending' | 'sent' | 'na';
  createdAt: string;
}

export type MessageType = 'booking' | 'dayBefore' | 'aftercare' | 'reminder';

export interface MessageTarget {
  type: MessageType;
  customer: Customer;
  reservation: Reservation;
  message: string;
}

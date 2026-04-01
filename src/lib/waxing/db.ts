import Dexie, { type EntityTable } from 'dexie';
import type { Customer, Reservation } from './types';

const db = new Dexie('WaxingCRM') as Dexie & {
  customers: EntityTable<Customer, 'id'>;
  reservations: EntityTable<Reservation, 'id'>;
};

db.version(3).stores({
  customers: '++id, name, phone, createdAt',
  reservations: '++id, customerId, date, status, createdAt',
});

export { db };

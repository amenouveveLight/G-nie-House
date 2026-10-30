import { createContext, useContext, useReducer, useCallback } from 'react';
import { normalizeCollections, dataScope } from '../Data/normalize';
import {
  appointments as initialAppointments,
  orders as initialOrders,
  transactions as initialTransactions,
  clients as initialClients,
  services as initialServices,
  products as initialProducts,
  professionals as initialProfessionals,
  stockMovements as initialMovements,
  notifications as initialNotifications,
  salonSettings as initialSettings,
} from '../Data/demoData';

const DataContext = createContext();

// Ces collections sont fournies par le serveur (base de données). Les écritures faites
// depuis l'interface restent pour l'instant en mémoire (non enregistrées en base).
// Les données privées démarrent vides ; le catalogue garde un repli de démonstration
// le temps que les props serveur soient appliquées.
function buildInitialState(page) {
  const base = {
    appointments: [],
    busySlots: [],
    orders: [],
    transactions: [],
    clients: [],
    stockMovements: [],
    services: initialServices,
    products: initialProducts,
    professionals: initialProfessionals,
    settings: initialSettings,
    notifications: initialNotifications,
    counters: { appointment: 0, order: 0, transaction: 0 },
    hydrated: {},
  };
  if (!page) return base;
  return hydrate(base, normalizeCollections(page.props), dataScope(page.component, page.props));
}

/** Applique les collections serveur, une seule fois par collection et par espace (scope),
 *  pour ne pas écraser les modifications locales pendant la navigation. */
function hydrate(state, payload, scope) {
  const next = { ...state, hydrated: { ...state.hydrated }, counters: { ...state.counters } };
  const counterKeys = { appointments: 'appointment', orders: 'order', transactions: 'transaction' };
  for (const [key, value] of Object.entries(payload)) {
    if (next.hydrated[key] === scope) continue;
    next[key] = value;
    next.hydrated[key] = scope;
    if (counterKeys[key]) next.counters[counterKeys[key]] = value.length;
  }
  return next;
}

function dataReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'HYDRATE':
      return hydrate(state, action.payload, action.scope);

    // === APPOINTMENTS ===
    case 'ADD_APPOINTMENT': {
      const counter = (state.counters.appointment || state.appointments.length) + 1;
      const ref = `RDV-2026-${String(counter).padStart(3, '0')}`;
      const appointment = { ...action.payload, id: Date.now(), reference: ref, createdAt: new Date().toISOString() };
      newState = {
        ...state,
        appointments: [...state.appointments, appointment],
        counters: { ...state.counters, appointment: counter },
        notifications: [
          {
            id: Date.now(),
            type: 'appointment_confirmed',
            message: `Nouveau rendez-vous ${ref} confirmé`,
            date: new Date().toISOString(),
            read: false
          },
          ...state.notifications,
        ]
      };
      break;
    }
    case 'UPDATE_APPOINTMENT':
      newState = {
        ...state,
        appointments: state.appointments.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload.data } : a
        ),
        notifications: [
          {
            id: Date.now(),
            type: 'appointment_modified',
            message: `Rendez-vous ${state.appointments.find(a => a.id === action.payload.id)?.reference || ''} modifié`,
            date: new Date().toISOString(),
            read: false
          },
          ...state.notifications,
        ]
      };
      break;
    case 'CANCEL_APPOINTMENT':
      newState = {
        ...state,
        appointments: state.appointments.map(a =>
          a.id === action.payload ? { ...a, status: 'cancelled' } : a
        ),
        notifications: [
          {
            id: Date.now(),
            type: 'appointment_cancelled',
            message: `Rendez-vous ${state.appointments.find(a => a.id === action.payload)?.reference || ''} annulé`,
            date: new Date().toISOString(),
            read: false
          },
          ...state.notifications,
        ]
      };
      break;

    // === ORDERS ===
    case 'ADD_ORDER': {
      const counter = (state.counters.order || state.orders.length) + 1;
      const ref = `CMD-2026-${String(counter).padStart(3, '0')}`;
      const order = { ...action.payload, id: Date.now(), reference: ref, createdAt: new Date().toISOString() };
      newState = {
        ...state,
        orders: [...state.orders, order],
        counters: { ...state.counters, order: counter },
      };
      break;
    }
    case 'UPDATE_ORDER':
      newState = {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.id ? { ...o, ...action.payload.data } : o
        ),
      };
      break;

    // === TRANSACTIONS ===
    case 'ADD_TRANSACTION': {
      const counter = (state.counters.transaction || state.transactions.length) + 1;
      const ref = `TXN-2026-${String(counter).padStart(3, '0')}`;
      const txn = { ...action.payload, id: Date.now(), reference: ref, date: new Date().toISOString() };
      newState = {
        ...state,
        transactions: [...state.transactions, txn],
        counters: { ...state.counters, transaction: counter },
      };
      break;
    }
    case 'UPDATE_TRANSACTION':
      newState = {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.data } : t
        ),
      };
      break;

    // === CLIENTS ===
    case 'ADD_CLIENT': {
      const client = { ...action.payload, id: Date.now(), createdAt: new Date().toISOString() };
      newState = { ...state, clients: [...state.clients, client] };
      break;
    }
    case 'UPDATE_CLIENT':
      newState = {
        ...state,
        clients: state.clients.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.data } : c
        ),
      };
      break;

    // === SERVICES ===
    case 'ADD_SERVICE': {
      const service = { ...action.payload, id: Date.now() };
      newState = { ...state, services: [...state.services, service] };
      break;
    }
    case 'UPDATE_SERVICE':
      newState = {
        ...state,
        services: state.services.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload.data } : s
        ),
      };
      break;
    case 'DELETE_SERVICE':
      newState = {
        ...state,
        services: state.services.filter(s => s.id !== action.payload),
      };
      break;

    // === PRODUCTS ===
    case 'ADD_PRODUCT': {
      const product = { ...action.payload, id: Date.now() };
      newState = { ...state, products: [...state.products, product] };
      break;
    }
    case 'UPDATE_PRODUCT':
      newState = {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.data } : p
        ),
      };
      break;
    case 'DELETE_PRODUCT':
      newState = {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };
      break;
    case 'UPDATE_STOCK': {
      const { productId, quantity, type, note } = action.payload;
      const movement = {
        id: Date.now(),
        productId,
        type,
        quantity,
        date: new Date().toISOString(),
        note: note || ''
      };
      newState = {
        ...state,
        products: state.products.map(p => {
          if (p.id !== productId) return p;
          let newStock = p.stock;
          if (type === 'entry') newStock += quantity;
          else if (type === 'exit' || type === 'order') newStock = Math.max(0, newStock - quantity);
          else if (type === 'adjustment') newStock = Math.max(0, quantity);
          return { ...p, stock: newStock };
        }),
        stockMovements: [...state.stockMovements, movement],
      };
      break;
    }

    // === PROFESSIONALS ===
    case 'ADD_PROFESSIONAL': {
      const prof = { ...action.payload, id: Date.now() };
      newState = { ...state, professionals: [...state.professionals, prof] };
      break;
    }
    case 'UPDATE_PROFESSIONAL':
      newState = {
        ...state,
        professionals: state.professionals.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.data } : p
        ),
      };
      break;

    // === SETTINGS ===
    case 'UPDATE_SETTINGS':
      newState = {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
      break;

    // === NOTIFICATIONS ===
    case 'MARK_NOTIFICATION_READ':
      newState = {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
      break;
    case 'MARK_ALL_NOTIFICATIONS_READ':
      newState = {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      };
      break;

    // === RESET ===
    case 'RESET_DATA':
      return buildInitialState(null);

    default:
      return state;
  }

  return newState;
}

export function DataProvider({ children, initialPage }) {
  const [state, dispatch] = useReducer(dataReducer, initialPage, buildInitialState);

  // Helper to find or create client
  const findOrCreateClient = useCallback((clientInfo) => {
    const existing = state.clients.find(c =>
      c.email === clientInfo.email || c.phone === clientInfo.phone
    );
    if (existing) {
      return existing;
    }
    const newClient = {
      ...clientInfo,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      preferences: '',
    };
    dispatch({ type: 'ADD_CLIENT', payload: newClient });
    return newClient;
  }, [state.clients]);

  // Check slot availability
  const isSlotAvailable = useCallback((professionalId, date, startTime, endTime, excludeAppointmentId = null) => {
    return ![...state.appointments, ...state.busySlots].some(apt =>
      apt.id !== excludeAppointmentId &&
      apt.professionalId === professionalId &&
      apt.date === date &&
      apt.status !== 'cancelled' &&
      ((startTime >= apt.startTime && startTime < apt.endTime) ||
       (endTime > apt.startTime && endTime <= apt.endTime) ||
       (startTime <= apt.startTime && endTime >= apt.endTime))
    );
  }, [state.appointments, state.busySlots]);

  const value = {
    ...state,
    dispatch,
    findOrCreateClient,
    isSlotAvailable,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}

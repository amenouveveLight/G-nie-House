// Adapte les données renvoyées par Laravel (snake_case, relations en objets)
// à la forme attendue par les composants du front (camelCase, relations en identifiants).

const ids = (list) => (list ?? []).map((item) => (item !== null && typeof item === 'object' ? item.id : item));
const day = (value) => (value ? String(value).slice(0, 10) : null);

export function normalizeService(service) {
  return { ...service, professionals: ids(service.professionals) };
}

export function normalizeProfessional(pro) {
  const { working_hours, days_off, blocked_slots, ...rest } = pro;
  return {
    ...rest,
    specialties: pro.specialties ?? [],
    services: ids(pro.services),
    workingHours: working_hours ?? {},
    breaks: pro.breaks ?? [],
    daysOff: days_off ?? [],
    blockedSlots: blocked_slots ?? [],
  };
}

export function normalizeProduct(product) {
  const { alert_threshold, ...rest } = product;
  return { ...rest, alertThreshold: alert_threshold };
}

export function normalizeClient(client) {
  const { last_visit, created_at, ...rest } = client;
  return { ...rest, lastVisit: day(last_visit), createdAt: created_at };
}

export function normalizeAppointment(apt) {
  const { client_id, service_id, professional_id, start_time, end_time, created_at, ...rest } = apt;
  return {
    ...rest,
    clientId: client_id,
    serviceId: service_id,
    professionalId: professional_id,
    startTime: start_time,
    endTime: end_time,
    createdAt: created_at,
  };
}

export function normalizeOrder(order) {
  const { client_id, shipping_fee, delivery_method, shipping_address, order_status, payment_status, payment_method, created_at, items, ...rest } = order;
  return {
    ...rest,
    clientId: client_id,
    shippingFee: shipping_fee,
    deliveryMethod: delivery_method,
    shippingAddress: shipping_address,
    orderStatus: order_status,
    paymentStatus: payment_status,
    paymentMethod: payment_method,
    createdAt: created_at,
    items: (items ?? []).map((i) => ({ productId: i.product_id, name: i.name, price: i.price, quantity: i.quantity })),
  };
}

export function normalizeTransaction(txn) {
  const { order_id, payment_method, failure_reason, created_at, ...rest } = txn;
  return { ...rest, orderId: order_id, paymentMethod: payment_method, failureReason: failure_reason, date: created_at };
}

export function normalizeStockMovement(movement) {
  const { product_id, created_at, ...rest } = movement;
  return { ...rest, productId: product_id, date: created_at };
}

const COLLECTIONS = {
  services: normalizeService,
  professionals: normalizeProfessional,
  products: normalizeProduct,
  clients: normalizeClient,
  appointments: normalizeAppointment,
  busySlots: normalizeAppointment,
  orders: normalizeOrder,
  transactions: normalizeTransaction,
  stockMovements: normalizeStockMovement,
};

/**
 * Extrait des props Inertia les collections connues et les convertit au format du front.
 * Seules les clés présentes dans les props sont renvoyées.
 */
export function normalizeCollections(props = {}) {
  const result = {};
  for (const [key, normalize] of Object.entries(COLLECTIONS)) {
    if (Array.isArray(props[key])) result[key] = props[key].map(normalize);
  }
  // Les réglages arrivent déjà au bon format (objet clé → valeur) ; un objet vide
  // (sérialisé en [] par PHP) est ignoré pour conserver les valeurs de repli.
  if (props.settings && !Array.isArray(props.settings) && Object.keys(props.settings).length) {
    result.settings = props.settings;
  }
  return result;
}

/** Espace de données d'une page : public, ou admin propre à l'utilisateur connecté. */
export function dataScope(component, props = {}) {
  return component?.startsWith('admin/') ? `admin:${props.auth?.user?.id ?? 'anon'}` : 'public';
}

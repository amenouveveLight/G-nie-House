import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import { useData } from '../../Contexts/DataContext';
import {
  TrendingUp,
  Calendar,
  Package,
  Users,
  AlertTriangle,
  AlertOctagon,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Scissors,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import './Dashboard.css';

const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount || 0) + ' FCFA';
};

export default function Dashboard() {
  const { user } = useAuth();
  const {
    appointments = [],
    orders = [],
    transactions = [],
    clients = [],
    services = [],
    products = [],
    professionals = []
  } = useData();

  const [period, setPeriod] = useState('month'); // 'today' | 'week' | 'month' | 'year'

  // Map helpers
  const clientMap = useMemo(() => {
    const map = {};
    clients.forEach((c) => { map[c.id] = c; });
    return map;
  }, [clients]);

  const serviceMap = useMemo(() => {
    const map = {};
    services.forEach((s) => { map[s.id] = s; });
    return map;
  }, [services]);

  const professionalMap = useMemo(() => {
    const map = {};
    professionals.forEach((p) => { map[p.id] = p; });
    return map;
  }, [professionals]);

  // Compute reference date for filter (use latest transaction/order date or current Date)
  const referenceDate = useMemo(() => {
    // If we have transactions or appointments, find the latest date to ensure demo data matches gracefully
    const allDates = [
      ...transactions.map(t => new Date(t.date).getTime()),
      ...appointments.map(a => new Date(a.date).getTime()),
      Date.now()
    ].filter(Boolean);
    const maxDate = new Date(Math.max(...allDates));
    return maxDate;
  }, [transactions, appointments]);

  // Period filtering logic
  const filteredData = useMemo(() => {
    const ref = referenceDate;
    const refYear = ref.getFullYear();
    const refMonth = ref.getMonth();
    const refDate = ref.getDate();

    const isMatch = (itemDateStr) => {
      if (!itemDateStr) return false;
      const d = new Date(itemDateStr);
      if (isNaN(d.getTime())) return false;

      if (period === 'today') {
        return (
          d.getFullYear() === refYear &&
          d.getMonth() === refMonth &&
          d.getDate() === refDate
        );
      }
      if (period === 'week') {
        const diffTime = Math.abs(ref.getTime() - d.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }
      if (period === 'month') {
        return d.getFullYear() === refYear && d.getMonth() === refMonth;
      }
      if (period === 'year') {
        return d.getFullYear() === refYear;
      }
      return true;
    };

    // Calculate revenue (strictly successful transactions)
    const validTransactions = transactions.filter(
      (t) => t.status === 'success' && isMatch(t.date)
    );
    const totalRevenue = validTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);

    // Appointments du jour (or period)
    const todayAppointmentsCount = appointments.filter((a) => {
      const isToday = isMatch(a.date);
      return isToday && a.status !== 'cancelled';
    }).length;

    // Commandes en attente (status 'pending' or 'processing')
    const pendingOrdersCount = orders.filter((o) =>
      o.orderStatus === 'pending' || o.orderStatus === 'processing'
    ).length;

    // Nouvelles clientes créées dans la période
    const newClientsCount = clients.filter((c) => isMatch(c.createdAt)).length;

    return {
      revenue: totalRevenue,
      todayAppointments: todayAppointmentsCount,
      pendingOrders: pendingOrdersCount,
      newClients: newClientsCount,
    };
  }, [transactions, appointments, orders, clients, period, referenceDate]);

  // Low stock products alert
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= (p.alertThreshold || 5));
  }, [products]);

  // Upcoming appointments (sort by date ascending, take 5)
  const upcomingAppointments = useMemo(() => {
    const sorted = [...appointments]
      .filter((a) => a.status !== 'cancelled')
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`);
        const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`);
        return dateA - dateB;
      });
    return sorted.slice(0, 5);
  }, [appointments]);

  // Recent orders (last 5)
  const recentOrders = useMemo(() => {
    const sorted = [...orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return sorted.slice(0, 5);
  }, [orders]);

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-info"><Clock size={12} /> Confirmé</span>;
      case 'completed':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> Terminé</span>;
      case 'pending':
        return <span className="badge badge-warning"><HelpCircle size={12} /> En attente</span>;
      case 'cancelled':
        return <span className="badge badge-error"><XCircle size={12} /> Annulé</span>;
      case 'delivered':
        return <span className="badge badge-success">Livrée</span>;
      case 'shipped':
        return <span className="badge badge-info">Expédiée</span>;
      case 'processing':
        return <span className="badge badge-warning">En traitement</span>;
      case 'ready_for_pickup':
        return <span className="badge badge-gold">Prête au retrait</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Welcome & Period Filter */}
      <div className="dashboard-header-row">
        <div>
          <h2 className="dashboard-welcome">Bonjour, {user?.name || 'Administrateur'} 👋</h2>
          <p className="dashboard-subtitle">
            Voici la vue d'ensemble des activités et performances de Glam'Or Beauty.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="period-selector">
          <button
            type="button"
            className={`period-btn ${period === 'today' ? 'active' : ''}`}
            onClick={() => setPeriod('today')}
          >
            Aujourd'hui
          </button>
          <button
            type="button"
            className={`period-btn ${period === 'week' ? 'active' : ''}`}
            onClick={() => setPeriod('week')}
          >
            Cette semaine
          </button>
          <button
            type="button"
            className={`period-btn ${period === 'month' ? 'active' : ''}`}
            onClick={() => setPeriod('month')}
          >
            Ce mois
          </button>
          <button
            type="button"
            className={`period-btn ${period === 'year' ? 'active' : ''}`}
            onClick={() => setPeriod('year')}
          >
            Cette année
          </button>
        </div>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="dashboard-stats-grid">
        {/* Card 1: Chiffre d'Affaires */}
        <div className="stat-card stat-gold">
          <div className="stat-card-header">
            <span className="stat-label">Chiffre d'affaires</span>
            <div className="stat-icon-wrap gold">
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="stat-value">{formatFCFA(filteredData.revenue)}</div>
          <div className="stat-footer">
            <span className="stat-trend positive">
              <ArrowUpRight size={14} /> Paiements encaissés
            </span>
            <span className="stat-period-note">Période sélectionnée</span>
          </div>
        </div>

        {/* Card 2: Rendez-vous du jour */}
        <div className="stat-card stat-rose">
          <div className="stat-card-header">
            <span className="stat-label">Rendez-vous du jour</span>
            <div className="stat-icon-wrap rose">
              <Calendar size={22} />
            </div>
          </div>
          <div className="stat-value">{filteredData.todayAppointments}</div>
          <div className="stat-footer">
            <Link to="/admin/rendez-vous" className="stat-link">
              Voir le planning <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Card 3: Commandes en attente */}
        <div className="stat-card stat-warning">
          <div className="stat-card-header">
            <span className="stat-label">Commandes à traiter</span>
            <div className="stat-icon-wrap warning">
              <Package size={22} />
            </div>
          </div>
          <div className="stat-value">{filteredData.pendingOrders}</div>
          <div className="stat-footer">
            <span className="stat-trend neutral">En préparation ou attente</span>
          </div>
        </div>

        {/* Card 4: Nouvelles Clientes */}
        <div className="stat-card stat-black">
          <div className="stat-card-header">
            <span className="stat-label">Nouvelles clientes</span>
            <div className="stat-icon-wrap black">
              <Users size={22} />
            </div>
          </div>
          <div className="stat-value">{filteredData.newClients}</div>
          <div className="stat-footer">
            <span className="stat-trend positive">Fidélisation active</span>
          </div>
        </div>
      </div>

      {/* Row 2: Sales Chart Placeholder & Stock Alerts */}
      <div className="dashboard-middle-grid">
        {/* Sales Chart Styled Card */}
        <div className="card dashboard-card sales-chart-card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-section-title">Graphique des Ventes</h3>
              <p className="card-section-subtitle">Évolution hebdomadaire des prestations et commandes</p>
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-dot gold"></span> Prestations</span>
              <span className="legend-item"><span className="legend-dot rose"></span> Boutique</span>
            </div>
          </div>

          <div className="mock-chart-container">
            <div className="mock-chart-bars">
              {[
                { day: 'Lun', services: 65, boutique: 35, val: '75 000 F' },
                { day: 'Mar', services: 40, boutique: 60, val: '50 000 F' },
                { day: 'Mer', services: 85, boutique: 45, val: '110 000 F' },
                { day: 'Jeu', services: 90, boutique: 70, val: '135 000 F' },
                { day: 'Ven', services: 100, boutique: 80, val: '160 000 F' },
                { day: 'Sam', services: 120, boutique: 95, val: '190 000 F' },
                { day: 'Dim', services: 30, boutique: 20, val: '35 000 F' },
              ].map((item, idx) => (
                <div key={idx} className="chart-column">
                  <div className="column-tooltip">{item.val}</div>
                  <div className="column-bars-stack">
                    <div className="bar bar-services" style={{ height: `${item.services}%` }}></div>
                    <div className="bar bar-boutique" style={{ height: `${item.boutique * 0.7}%` }}></div>
                  </div>
                  <span className="column-day">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card dashboard-card stock-alert-card">
          <div className="card-header-flex">
            <div className="stock-title-wrap">
              <AlertTriangle className="stock-alert-icon" size={20} />
              <h3 className="card-section-title">Alertes Stocks Faibles</h3>
            </div>
            <span className="badge badge-warning">{lowStockProducts.length} alerte(s)</span>
          </div>

          <p className="card-section-subtitle">Articles nécessitant un réapprovisionnement imminent :</p>

          <div className="stock-alerts-list">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((prod) => (
                <div key={prod.id} className="stock-alert-item">
                  <div className="stock-item-info">
                    <span className="stock-item-name">{prod.name}</span>
                    <span className="stock-threshold-note">Seuil d'alerte : {prod.alertThreshold || 5}</span>
                  </div>
                  <div className="stock-item-status">
                    {prod.stock === 0 ? (
                      <span className="badge badge-error">
                        <AlertOctagon size={12} /> Épuisé (0)
                      </span>
                    ) : (
                      <span className="badge badge-warning">
                        <AlertTriangle size={12} /> {prod.stock} restant(s)
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="stock-ok-state">
                <CheckCircle2 size={32} color="var(--color-success)" />
                <p>Tous les stocks de la boutique sont optimaux.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Upcoming Appointments & Recent Orders */}
      <div className="dashboard-bottom-grid">
        {/* Table 1: Prochains Rendez-vous */}
        <div className="card dashboard-card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-section-title">Prochains Rendez-vous</h3>
              <p className="card-section-subtitle">Les 5 prochaines réservations planifiées</p>
            </div>
            <Link to="/admin/rendez-vous" className="btn btn-outline btn-sm">
              Tout voir
            </Link>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date & Heure</th>
                  <th>Cliente</th>
                  <th>Prestation</th>
                  <th>Praticienne</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((apt) => {
                    const client = clientMap[apt.clientId];
                    const service = serviceMap[apt.serviceId];
                    const prof = professionalMap[apt.professionalId];
                    return (
                      <tr key={apt.id}>
                        <td>
                          <div className="td-date">
                            <strong>{apt.date}</strong>
                            <span>{apt.startTime} - {apt.endTime}</span>
                          </div>
                        </td>
                        <td>
                          <strong>{client?.name || `Cliente #${apt.clientId}`}</strong>
                        </td>
                        <td>
                          <div className="td-service">
                            <Scissors size={14} className="service-icon" />
                            <span>{service?.name || `Service #${apt.serviceId}`}</span>
                          </div>
                        </td>
                        <td>{prof?.name || 'Non assigné'}</td>
                        <td>{renderStatusBadge(apt.status)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="table-empty-cell">
                      Aucun rendez-vous à venir.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Commandes Récentes */}
        <div className="card dashboard-card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-section-title">Commandes Récentes</h3>
              <p className="card-section-subtitle">Derniers achats passés sur la boutique</p>
            </div>
            <span className="badge badge-gray">{orders.length} commandes au total</span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Date</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((ord) => {
                    const client = clientMap[ord.clientId];
                    return (
                      <tr key={ord.id}>
                        <td>
                          <strong className="order-ref">{ord.reference}</strong>
                        </td>
                        <td>
                          {new Date(ord.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                        <td>{client?.name || ord.shippingAddress?.recipient || 'Cliente'}</td>
                        <td>
                          <span className="order-total-badge">{formatFCFA(ord.total)}</span>
                        </td>
                        <td>{renderStatusBadge(ord.orderStatus)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="table-empty-cell">
                      Aucune commande enregistrée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Scissors,
  Sparkles,
  Footprints,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  AlertCircle,
  ShieldCheck,
  MapPin,
  RefreshCw,
  Users
} from 'lucide-react';
import { useData } from '../Contexts/DataContext';
import { useToast } from '../Contexts/ToastContext';
import './Booking.css';

const STEPS = [
  { id: 1, title: 'Catégorie', short: 'Catégorie' },
  { id: 2, title: 'Prestation', short: 'Prestation' },
  { id: 3, title: 'Spécialiste', short: 'Spécialiste' },
  { id: 4, title: 'Date', short: 'Date' },
  { id: 5, title: 'Horaire', short: 'Horaire' },
  { id: 6, title: 'Coordonnées', short: 'Client' },
  { id: 7, title: 'Récapitulatif', short: 'Récapitulatif' },
  { id: 8, title: 'Validation', short: 'Traitement' },
  { id: 9, title: 'Confirmation', short: 'Terminé' },
];

const CATEGORIES = [
  {
    id: 'coiffure',
    name: 'Coiffure & Soins Capillaires',
    shortName: 'Coiffure',
    icon: Scissors,
    description: 'Coupes personnalisées, brushings haute brillance, tresses artistiques et soins profonds.',
    badge: '6 prestations'
  },
  {
    id: 'manucure',
    name: 'Manucure & Beauté des Mains',
    shortName: 'Manucure',
    icon: Sparkles,
    description: 'Pose de gel UV, vernis semi-permanent, nail art sur mesure et soins réparateurs cuticules.',
    badge: '5 prestations'
  },
  {
    id: 'pedicure',
    name: 'Pédicure & Soins des Pieds',
    shortName: 'Pédicure',
    icon: Footprints,
    description: 'Pédicure spa, gommages aromatiques, bains de paraffine régénérants et vernis éclatant.',
    badge: '5 prestations'
  }
];

const DAY_NAMES_EN = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const WEEKDAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { services, professionals, settings, dispatch, findOrCreateClient, isSlotAvailable } = useData();
  const { success: toastSuccess, error: toastError } = useToast();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProId, setSelectedProId] = useState('any'); // 'any' or pro.id
  const [selectedDate, setSelectedDate] = useState(null); // 'YYYY-MM-DD'
  const [selectedSlot, setSelectedSlot] = useState(null); // { start: '09:00', end: '09:45' }

  // Calendar month state
  const [calendarMonth, setCalendarMonth] = useState(() => {
    // Default to current date or October 2026 if demo
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Client form state
  const [clientForm, setClientForm] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Created appointment result for step 9
  const [createdAppointment, setCreatedAppointment] = useState(null);

  // Active services & professionals
  const activeServices = useMemo(() => {
    return (services || []).filter(s => s.status === 'active');
  }, [services]);

  const activeProfessionals = useMemo(() => {
    return (professionals || []).filter(p => p.status === 'active');
  }, [professionals]);

  // Handle URL pre-selected service (e.g., /reservation?service=3 or ?serviceId=3)
  useEffect(() => {
    const serviceParam = searchParams.get('service') || searchParams.get('serviceId');
    if (serviceParam && activeServices.length > 0) {
      const match = activeServices.find(s => String(s.id) === String(serviceParam));
      if (match) {
        setSelectedCategory(match.category);
        setSelectedService(match);
        setCurrentStep(3); // Advance directly to professional selection
      }
    }
  }, [searchParams, activeServices]);

  // Price formatter helper
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  // Filter services by category
  const servicesForCategory = useMemo(() => {
    if (!selectedCategory) return [];
    return activeServices.filter(s => s.category === selectedCategory);
  }, [activeServices, selectedCategory]);

  // Available professionals for selected service
  const availableProsForService = useMemo(() => {
    if (!selectedService) return [];
    return activeProfessionals.filter(p => p.services && p.services.includes(selectedService.id));
  }, [activeProfessionals, selectedService]);

  // Resolved professional object
  const assignedProfessional = useMemo(() => {
    if (selectedProId === 'any') {
      return availableProsForService[0] || null;
    }
    return activeProfessionals.find(p => p.id === selectedProId) || null;
  }, [selectedProId, availableProsForService, activeProfessionals]);

  // Check if a specific date is closed or unavailable
  const isDateDisabled = (dateObj) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(dateObj);
    checkDate.setHours(0, 0, 0, 0);

    // Disable past dates
    if (checkDate < today) return true;

    const dateStr = formatDateToISO(checkDate);

    // Check salon closedDates
    if (settings?.closedDates && settings.closedDates.includes(dateStr)) {
      return true;
    }

    const dayIndex = checkDate.getDay();
    const dayKey = DAY_NAMES_EN[dayIndex];

    // Check salon opening hours
    if (settings?.openingHours && (!settings.openingHours[dayKey] || !settings.openingHours[dayKey].isOpen)) {
      return true;
    }

    // If specific pro selected, check pro's days off
    if (selectedProId !== 'any') {
      const pro = activeProfessionals.find(p => p.id === selectedProId);
      if (pro) {
        if (pro.daysOff && pro.daysOff.includes(dayKey)) return true;
        if (!pro.workingHours || !pro.workingHours[dayKey]) return true;
      }
    } else {
      // If 'any', ensure at least one capable pro is working that day
      const anyProWorking = availableProsForService.some(p => {
        const notDayOff = !p.daysOff || !p.daysOff.includes(dayKey);
        const hasHours = p.workingHours && p.workingHours[dayKey];
        return notDayOff && hasHours;
      });
      if (!anyProWorking) return true;
    }

    return false;
  };

  // Convert Date to 'YYYY-MM-DD'
  function formatDateToISO(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Parse ISO date string to Date in local time
  function parseISODate(isoStr) {
    if (!isoStr) return null;
    const [y, m, d] = isoStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  // Generate slots for selected date
  const availableSlots = useMemo(() => {
    if (!selectedDate || !selectedService) return [];

    const dateObj = parseISODate(selectedDate);
    if (!dateObj) return [];

    const dayKey = DAY_NAMES_EN[dateObj.getDay()];
    const duration = selectedService.duration || 30;
    const slotDuration = settings?.slotDuration || 30;

    // Determine target pros to check
    const candidatePros = selectedProId === 'any'
      ? availableProsForService
      : [activeProfessionals.find(p => p.id === selectedProId)].filter(Boolean);

    if (candidatePros.length === 0) return [];

    // Helper: minutes since midnight to HH:mm
    const toTimeStr = (totalMinutes) => {
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    // Helper: HH:mm to minutes
    const toMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    // Salon hours for the day
    const salonHours = settings?.openingHours?.[dayKey];
    if (!salonHours || !salonHours.isOpen) return [];

    const salonOpen = toMinutes(salonHours.open);
    const salonClose = toMinutes(salonHours.close);

    // Generate potential start times every slotDuration
    const slots = [];

    for (let time = salonOpen; time + duration <= salonClose; time += slotDuration) {
      const startTimeStr = toTimeStr(time);
      const endTimeStr = toTimeStr(time + duration);

      // Check if at least one pro is available for this slot
      let slotProFound = null;

      for (const pro of candidatePros) {
        // 1. Pro working hours for day
        const proHours = pro.workingHours?.[dayKey];
        if (!proHours) continue;

        const proStart = toMinutes(proHours.start);
        const proEnd = toMinutes(proHours.end);

        if (time < proStart || (time + duration) > proEnd) continue;

        // 2. Pro breaks
        const hasBreakConflict = (pro.breaks || []).some(b => {
          const bStart = toMinutes(b.start);
          const bEnd = toMinutes(b.end);
          return (time < bEnd && (time + duration) > bStart);
        });
        if (hasBreakConflict) continue;

        // 3. Pro blocked slots
        const hasBlockedConflict = (pro.blockedSlots || []).some(b => {
          if (b.date !== selectedDate) return false;
          const bStart = toMinutes(b.start);
          const bEnd = toMinutes(b.end);
          return (time < bEnd && (time + duration) > bStart);
        });
        if (hasBlockedConflict) continue;

        // 4. Existing appointments in DataContext
        const available = isSlotAvailable(pro.id, selectedDate, startTimeStr, endTimeStr);
        if (available) {
          slotProFound = pro;
          break;
        }
      }

      slots.push({
        start: startTimeStr,
        end: endTimeStr,
        isAvailable: Boolean(slotProFound),
        assignedPro: slotProFound
      });
    }

    return slots;
  }, [selectedDate, selectedService, selectedProId, availableProsForService, activeProfessionals, settings, isSlotAvailable]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!clientForm.name || clientForm.name.trim().length < 2) {
      errors.name = 'Veuillez saisir votre nom complet (au moins 2 caractères).';
    }
    const phoneClean = clientForm.phone.replace(/[\s.-]/g, '');
    if (!phoneClean || phoneClean.length < 8) {
      errors.phone = 'Veuillez renseigner un numéro de téléphone valide (min. 8 chiffres).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!clientForm.email || !emailRegex.test(clientForm.email)) {
      errors.email = 'Veuillez saisir une adresse email valide.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit client info
  const handleClientSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentStep(7);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Confirm booking process (Step 8 -> Step 9)
  const handleConfirmBooking = () => {
    setCurrentStep(8);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Use selected slot assigned pro or fallback
    const targetPro = selectedSlot?.assignedPro || assignedProfessional || availableProsForService[0];

    setTimeout(() => {
      try {
        // 1. Find or create client
        const client = findOrCreateClient({
          name: clientForm.name.trim(),
          phone: clientForm.phone.trim(),
          email: clientForm.email.trim(),
          address: 'Abidjan',
        });

        // 2. Build appointment
        const appointmentData = {
          clientId: client.id,
          clientName: client.name,
          clientPhone: client.phone,
          clientEmail: client.email,
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          category: selectedService.category,
          professionalId: targetPro ? targetPro.id : 1,
          professionalName: targetPro ? targetPro.name : 'Salon Glamour',
          date: selectedDate,
          startTime: selectedSlot.start,
          endTime: selectedSlot.end,
          duration: selectedService.duration,
          price: selectedService.price,
          status: 'confirmed',
          notes: clientForm.notes ? clientForm.notes.trim() : ''
        };

        dispatch({
          type: 'ADD_APPOINTMENT',
          payload: appointmentData
        });

        // Create display object for Step 9
        const counter = Math.floor(100 + Math.random() * 900);
        const ref = `RDV-2026-${counter}`;

        setCreatedAppointment({
          ...appointmentData,
          reference: ref,
          createdAt: new Date().toISOString()
        });

        toastSuccess(`Rendez-vous confirmé avec succès !`);
        setCurrentStep(9);
      } catch (err) {
        console.error(err);
        toastError('Une erreur est survenue lors de la réservation.');
        setCurrentStep(7);
      }
    }, 1500);
  };

  // French formatted date display
  const formatFrenchDate = (isoStr) => {
    if (!isoStr) return '';
    const dateObj = parseISODate(isoStr);
    if (!dateObj) return '';
    const formatted = dateObj.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  // Calendar days builder
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // In JS getDay(): 0 is Sunday. Shift so Monday is 0
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days = [];

    // Empty padding slots before first day
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ type: 'empty', id: `empty-${i}` });
    }

    // Real month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const current = new Date(year, month, d);
      const iso = formatDateToISO(current);
      const disabled = isDateDisabled(current);

      const today = new Date();
      const isToday = today.toDateString() === current.toDateString();

      days.push({
        type: 'day',
        dayNumber: d,
        iso,
        dateObj: current,
        disabled,
        isToday,
        isSelected: selectedDate === iso
      });
    }

    return days;
  }, [calendarMonth, selectedDate, selectedProId, availableProsForService, activeProfessionals, settings]);

  const handlePrevMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Reset wizard to start over
  const handleResetWizard = () => {
    setSelectedCategory(null);
    setSelectedService(null);
    setSelectedProId('any');
    setSelectedDate(null);
    setSelectedSlot(null);
    setClientForm({ name: '', phone: '', email: '', notes: '' });
    setFormErrors({});
    setCreatedAppointment(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="booking-page">
      {/* Hero Header */}
      <section className="booking-hero">
        <div className="booking-hero-content">
          <span className="booking-subtitle">Expérience Haute Beauté</span>
          <h1 className="booking-title">Réservez Votre Moment d'Exception</h1>
          <p className="booking-desc">
            Sélectionnez votre prestation, choisissez votre experte et convenez d'un créneau sur mesure en toute sérénité.
          </p>
        </div>
      </section>

      <div className="booking-container">
        {/* Progress Bar & Steps Indicator */}
        {currentStep < 8 && (
          <nav className="booking-stepper" aria-label="Progression de la réservation">
            <div className="stepper-track">
              {STEPS.slice(0, 7).map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <div
                    key={step.id}
                    className={`stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => {
                      if (isCompleted) {
                        setCurrentStep(step.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  >
                    <div className="stepper-circle">
                      {isCompleted ? <Check size={16} /> : step.id}
                    </div>
                    <span className="stepper-label">{step.short}</span>
                  </div>
                );
              })}
            </div>
            <div className="mobile-step-summary">
              Étape {currentStep} sur 7 : <strong>{STEPS[currentStep - 1]?.title}</strong>
            </div>
          </nav>
        )}

        {/* ======================================================== */}
        {/* STEP 1: CATEGORY SELECTION                                */}
        {/* ======================================================== */}
        {currentStep === 1 && (
          <div className="booking-step-content step-enter">
            <div className="step-header">
              <span className="step-badge">Étape 1</span>
              <h2>Choisissez votre univers de soin</h2>
              <p>Explorez nos trois univers signatures dédiés à votre mise en beauté</p>
            </div>

            <div className="categories-grid">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    className={`category-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedService(null);
                      setSelectedSlot(null);
                      setCurrentStep(2);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="category-card-icon">
                      <IconComponent size={36} />
                    </div>
                    <span className="category-card-badge">{cat.badge}</span>
                    <h3 className="category-card-title">{cat.name}</h3>
                    <p className="category-card-desc">{cat.description}</p>
                    <div className="category-card-action">
                      <span>Sélectionner cette catégorie</span>
                      <ArrowRight size={18} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: SERVICE SELECTION                                 */}
        {/* ======================================================== */}
        {currentStep === 2 && (
          <div className="booking-step-content step-enter">
            <div className="step-top-nav">
              <button
                type="button"
                className="btn-back"
                onClick={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <ChevronLeft size={20} />
                <span>Retour aux catégories</span>
              </button>
              <div className="active-category-pill">
                Catégorie : <strong>{CATEGORIES.find(c => c.id === selectedCategory)?.shortName}</strong>
              </div>
            </div>

            <div className="step-header">
              <span className="step-badge">Étape 2</span>
              <h2>Sélectionnez votre prestation</h2>
              <p>Des soins d'exception réalisés avec les meilleurs rituels et produits prestigieux</p>
            </div>

            <div className="services-grid">
              {servicesForCategory.map((service) => {
                const isSelected = selectedService?.id === service.id;
                return (
                  <div
                    key={service.id}
                    className={`service-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedService(service);
                      setSelectedSlot(null);
                      setCurrentStep(3);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {service.image && (
                      <div className="service-card-img-wrap">
                        <img src={service.image} alt={service.name} loading="lazy" />
                        <span className="service-duration-badge">
                          <Clock size={14} />
                          {service.duration} min
                        </span>
                      </div>
                    )}
                    <div className="service-card-body">
                      <div className="service-card-top">
                        <h3 className="service-card-name">{service.name}</h3>
                        <div className="service-card-price">{formatPrice(service.price)}</div>
                      </div>
                      <p className="service-card-desc">{service.description}</p>
                      <div className="service-card-footer">
                        <span className="service-select-btn">
                          {isSelected ? 'Sélectionné' : 'Choisir cette prestation'}
                          <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: PROFESSIONAL SELECTION                            */}
        {/* ======================================================== */}
        {currentStep === 3 && (
          <div className="booking-step-content step-enter">
            <div className="step-top-nav">
              <button
                type="button"
                className="btn-back"
                onClick={() => {
                  setCurrentStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <ChevronLeft size={20} />
                <span>Retour aux prestations</span>
              </button>
              <div className="active-service-summary">
                Prestation : <strong>{selectedService?.name}</strong> ({formatPrice(selectedService?.price)})
              </div>
            </div>

            <div className="step-header">
              <span className="step-badge">Étape 3</span>
              <h2>Choisissez votre experte</h2>
              <p>Confiez votre mise en beauté à nos professionnelles diplômées et passionnées</p>
            </div>

            <div className="professionals-grid">
              {/* Option: Aucune préférence */}
              <div
                className={`pro-card pro-card-any ${selectedProId === 'any' ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedProId('any');
                  setSelectedSlot(null);
                  setCurrentStep(4);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="pro-card-avatar pro-avatar-any">
                  <Sparkles size={32} />
                </div>
                <div className="pro-card-info">
                  <h3 className="pro-name">Aucune préférence</h3>
                  <span className="pro-role">Premier spécialiste disponible</span>
                  <p className="pro-bio">
                    Idéal si vous cherchez le créneau le plus rapide. Nous attribuerons le membre le plus qualifié disponible.
                  </p>
                </div>
                <div className="pro-card-select-hint">
                  <span>Choisir cette option</span>
                  <ArrowRight size={16} />
                </div>
              </div>

              {/* Specific professionals */}
              {availableProsForService.map((pro) => {
                const isSelected = selectedProId === pro.id;
                return (
                  <div
                    key={pro.id}
                    className={`pro-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedProId(pro.id);
                      setSelectedSlot(null);
                      setCurrentStep(4);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="pro-card-avatar">
                      <img src={pro.photo} alt={pro.name} />
                    </div>
                    <div className="pro-card-info">
                      <div className="pro-title-row">
                        <h3 className="pro-name">{pro.name}</h3>
                        <span className="pro-status-badge">Disponible</span>
                      </div>
                      <span className="pro-role">{pro.role}</span>
                      {pro.specialties && (
                        <div className="pro-specialties-chips">
                          {pro.specialties.slice(0, 3).map((spec, idx) => (
                            <span key={idx} className="pro-chip">{spec}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="pro-card-select-hint">
                      <span>Sélectionner {pro.name.split(' ')[0]}</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 4: DATE SELECTION                                    */}
        {/* ======================================================== */}
        {currentStep === 4 && (
          <div className="booking-step-content step-enter">
            <div className="step-top-nav">
              <button
                type="button"
                className="btn-back"
                onClick={() => {
                  setCurrentStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <ChevronLeft size={20} />
                <span>Retour au spécialiste</span>
              </button>
              <div className="active-service-summary">
                Spécialiste : <strong>{selectedProId === 'any' ? 'Premier disponible' : assignedProfessional?.name}</strong>
              </div>
            </div>

            <div className="step-header">
              <span className="step-badge">Étape 4</span>
              <h2>Sélectionnez la date</h2>
              <p>Choisissez le jour qui s'adapte parfaitement à votre agenda</p>
            </div>

            <div className="calendar-card">
              {/* Calendar header with month navigation */}
              <div className="calendar-header">
                <button
                  type="button"
                  className="cal-nav-btn"
                  onClick={handlePrevMonth}
                  aria-label="Mois précédent"
                >
                  <ChevronLeft size={20} />
                </button>
                <h3 className="cal-month-title">
                  {calendarMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  type="button"
                  className="cal-nav-btn"
                  onClick={handleNextMonth}
                  aria-label="Mois suivant"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Day names header */}
              <div className="calendar-weekdays">
                {WEEKDAYS_FR.map((w, idx) => (
                  <span key={idx} className="cal-weekday-label">{w}</span>
                ))}
              </div>

              {/* Days grid */}
              <div className="calendar-grid">
                {calendarDays.map((item) => {
                  if (item.type === 'empty') {
                    return <div key={item.id} className="cal-cell cal-empty" />;
                  }

                  const { dayNumber, iso, disabled, isToday, isSelected } = item;

                  return (
                    <button
                      key={iso}
                      type="button"
                      disabled={disabled}
                      className={`cal-cell cal-day ${disabled ? 'disabled' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedDate(iso);
                        setSelectedSlot(null);
                        setCurrentStep(5);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <span className="cal-day-num">{dayNumber}</span>
                      {isToday && <span className="cal-today-dot" title="Aujourd'hui" />}
                    </button>
                  );
                })}
              </div>

              {/* Calendar footer legend */}
              <div className="calendar-legend">
                <div className="legend-item">
                  <span className="legend-swatch available" />
                  <span>Disponible</span>
                </div>
                <div className="legend-item">
                  <span className="legend-swatch selected" />
                  <span>Sélectionné</span>
                </div>
                <div className="legend-item">
                  <span className="legend-swatch disabled" />
                  <span>Fermé / Indisponible</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 5: TIME SLOT SELECTION                               */}
        {/* ======================================================== */}
        {currentStep === 5 && (
          <div className="booking-step-content step-enter">
            <div className="step-top-nav">
              <button
                type="button"
                className="btn-back"
                onClick={() => {
                  setCurrentStep(4);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <ChevronLeft size={20} />
                <span>Changer de date</span>
              </button>
              <div className="active-date-badge">
                <CalendarIcon size={16} />
                <span>{formatFrenchDate(selectedDate)}</span>
              </div>
            </div>

            <div className="step-header">
              <span className="step-badge">Étape 5</span>
              <h2>Choisissez votre horaire</h2>
              <p>Durée de la prestation : <strong>{selectedService?.duration} minutes</strong></p>
            </div>

            {availableSlots.length === 0 ? (
              <div className="no-slots-box">
                <AlertCircle size={40} />
                <h3>Aucun créneau disponible pour cette journée</h3>
                <p>Le salon est complet ou notre experte n'a pas de disponibilité ce jour-là.</p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setCurrentStep(4)}
                >
                  Choisir une autre date
                </button>
              </div>
            ) : (
              <div className="slots-container">
                {/* Morning Slots */}
                <div className="slots-section">
                  <div className="slots-section-title">
                    <Clock size={18} />
                    <span>Créneaux du Matin (9h00 - 12h30)</span>
                  </div>
                  <div className="slots-grid">
                    {availableSlots
                      .filter(slot => {
                        const h = parseInt(slot.start.split(':')[0], 10);
                        return h < 13;
                      })
                      .map((slot, idx) => {
                        const isSelected = selectedSlot?.start === slot.start;
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={!slot.isAvailable}
                            className={`slot-btn ${slot.isAvailable ? 'available' : 'taken'} ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedSlot(slot);
                              setCurrentStep(6);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            <span className="slot-time">{slot.start}</span>
                            <span className="slot-sub">Fin {slot.end}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Afternoon Slots */}
                <div className="slots-section">
                  <div className="slots-section-title">
                    <Clock size={18} />
                    <span>Créneaux de l'Après-midi (13h30 - 19h00)</span>
                  </div>
                  <div className="slots-grid">
                    {availableSlots
                      .filter(slot => {
                        const h = parseInt(slot.start.split(':')[0], 10);
                        return h >= 13;
                      })
                      .map((slot, idx) => {
                        const isSelected = selectedSlot?.start === slot.start;
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={!slot.isAvailable}
                            className={`slot-btn ${slot.isAvailable ? 'available' : 'taken'} ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedSlot(slot);
                              setCurrentStep(6);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            <span className="slot-time">{slot.start}</span>
                            <span className="slot-sub">Fin {slot.end}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 6: CLIENT INFORMATION                                */}
        {/* ======================================================== */}
        {currentStep === 6 && (
          <div className="booking-step-content step-enter">
            <div className="step-top-nav">
              <button
                type="button"
                className="btn-back"
                onClick={() => {
                  setCurrentStep(5);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <ChevronLeft size={20} />
                <span>Modifier l'horaire</span>
              </button>
              <div className="slot-selected-pill">
                Créneau : <strong>{selectedSlot?.start} - {selectedSlot?.end}</strong> ({formatFrenchDate(selectedDate)})
              </div>
            </div>

            <div className="step-header">
              <span className="step-badge">Étape 6</span>
              <h2>Vos coordonnées</h2>
              <p>Renseignez vos informations pour recevoir votre confirmation et les rappels de rendez-vous</p>
            </div>

            <form className="booking-client-form" onSubmit={handleClientSubmit} noValidate>
              <div className="form-grid">
                {/* Nom */}
                <div className={`form-group ${formErrors.name ? 'has-error' : ''}`}>
                  <label htmlFor="client-name">
                    Nom complet <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <User size={18} className="input-icon" />
                    <input
                      id="client-name"
                      type="text"
                      placeholder="Ex: Aïcha Ouattara"
                      value={clientForm.name}
                      onChange={(e) => {
                        setClientForm({ ...clientForm, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                      }}
                    />
                  </div>
                  {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                </div>

                {/* Téléphone */}
                <div className={`form-group ${formErrors.phone ? 'has-error' : ''}`}>
                  <label htmlFor="client-phone">
                    Numéro de Téléphone (WhatsApp/SMS) <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <Phone size={18} className="input-icon" />
                    <input
                      id="client-phone"
                      type="tel"
                      placeholder="+225 07 00 11 22 33"
                      value={clientForm.phone}
                      onChange={(e) => {
                        setClientForm({ ...clientForm, phone: e.target.value });
                        if (formErrors.phone) setFormErrors({ ...formErrors, phone: null });
                      }}
                    />
                  </div>
                  {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
                </div>

                {/* Email */}
                <div className={`form-group full-width ${formErrors.email ? 'has-error' : ''}`}>
                  <label htmlFor="client-email">
                    Adresse Email <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <Mail size={18} className="input-icon" />
                    <input
                      id="client-email"
                      type="email"
                      placeholder="aicha.ouattara@example.com"
                      value={clientForm.email}
                      onChange={(e) => {
                        setClientForm({ ...clientForm, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: null });
                      }}
                    />
                  </div>
                  {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                </div>

                {/* Commentaire / Notes */}
                <div className="form-group full-width">
                  <label htmlFor="client-notes">
                    Demande particulière ou précisions (optionnel)
                  </label>
                  <div className="textarea-wrap">
                    <textarea
                      id="client-notes"
                      rows="3"
                      placeholder="Type de cheveux, sensibilité particulière, occasion spéciale..."
                      value={clientForm.notes}
                      onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary btn-large">
                  <span>Vérifier mon récapitulatif</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 7: SUMMARY / RECAP                                   */}
        {/* ======================================================== */}
        {currentStep === 7 && (
          <div className="booking-step-content step-enter">
            <div className="step-top-nav">
              <button
                type="button"
                className="btn-back"
                onClick={() => {
                  setCurrentStep(6);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <ChevronLeft size={20} />
                <span>Modifier mes coordonnées</span>
              </button>
            </div>

            <div className="step-header">
              <span className="step-badge">Étape 7</span>
              <h2>Récapitulatif de votre rendez-vous</h2>
              <p>Vérifiez scrupuleusement l'ensemble des détails avant de confirmer votre réservation</p>
            </div>

            <div className="recap-cards-container">
              {/* Prestation & Experte Card */}
              <div className="recap-box">
                <div className="recap-box-header">
                  <div className="recap-box-title">
                    <Scissors size={20} />
                    <span>Soin & Spécialiste</span>
                  </div>
                  <button
                    type="button"
                    className="recap-edit-btn"
                    onClick={() => {
                      setCurrentStep(2);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Modifier
                  </button>
                </div>
                <div className="recap-box-content">
                  <div className="recap-row">
                    <span className="recap-label">Prestation :</span>
                    <span className="recap-val highlight">{selectedService?.name}</span>
                  </div>
                  <div className="recap-row">
                    <span className="recap-label">Catégorie :</span>
                    <span className="recap-val">
                      {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                    </span>
                  </div>
                  <div className="recap-row">
                    <span className="recap-label">Durée estimée :</span>
                    <span className="recap-val">{selectedService?.duration} minutes</span>
                  </div>
                  <div className="recap-row">
                    <span className="recap-label">Experte dédiée :</span>
                    <span className="recap-val">
                      {selectedProId === 'any'
                        ? 'Premier spécialiste disponible (assignation automatique)'
                        : assignedProfessional?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date & Horaire Card */}
              <div className="recap-box">
                <div className="recap-box-header">
                  <div className="recap-box-title">
                    <CalendarIcon size={20} />
                    <span>Date & Horaire</span>
                  </div>
                  <button
                    type="button"
                    className="recap-edit-btn"
                    onClick={() => {
                      setCurrentStep(4);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Modifier
                  </button>
                </div>
                <div className="recap-box-content">
                  <div className="recap-row">
                    <span className="recap-label">Date du rendez-vous :</span>
                    <span className="recap-val highlight">{formatFrenchDate(selectedDate)}</span>
                  </div>
                  <div className="recap-row">
                    <span className="recap-label">Créneau horaire :</span>
                    <span className="recap-val highlight">
                      {selectedSlot?.start} à {selectedSlot?.end}
                    </span>
                  </div>
                  <div className="recap-row">
                    <span className="recap-label">Lieu :</span>
                    <span className="recap-val">{settings?.address || 'Cocody, Abidjan'}</span>
                  </div>
                </div>
              </div>

              {/* Client Info Card */}
              <div className="recap-box">
                <div className="recap-box-header">
                  <div className="recap-box-title">
                    <User size={20} />
                    <span>Coordonnées Client</span>
                  </div>
                  <button
                    type="button"
                    className="recap-edit-btn"
                    onClick={() => {
                      setCurrentStep(6);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Modifier
                  </button>
                </div>
                <div className="recap-box-content">
                  <div className="recap-row">
                    <span className="recap-label">Nom complet :</span>
                    <span className="recap-val">{clientForm.name}</span>
                  </div>
                  <div className="recap-row">
                    <span className="recap-label">Téléphone :</span>
                    <span className="recap-val">{clientForm.phone}</span>
                  </div>
                  <div className="recap-row">
                    <span className="recap-label">Email :</span>
                    <span className="recap-val">{clientForm.email}</span>
                  </div>
                  {clientForm.notes && (
                    <div className="recap-row">
                      <span className="recap-label">Notes :</span>
                      <span className="recap-val">{clientForm.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Confirmation */}
              <div className="recap-total-box">
                <div className="total-row">
                  <span className="total-label">Montant à régler sur place :</span>
                  <span className="total-amount">{formatPrice(selectedService?.price || 0)}</span>
                </div>
                <p className="total-hint">
                  <ShieldCheck size={16} />
                  Paiement sécurisé au salon le jour de votre rendez-vous (Espèces, Carte ou Mobile Money).
                </p>

                <div className="confirm-btn-wrap">
                  <button
                    type="button"
                    className="btn-confirm-booking"
                    onClick={handleConfirmBooking}
                  >
                    <CheckCircle size={22} />
                    <span>Confirmer définitivement le rendez-vous</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 8: CONFIRMATION PROCESSING                           */}
        {/* ======================================================== */}
        {currentStep === 8 && (
          <div className="booking-step-content step-processing">
            <div className="processing-card">
              <div className="processing-spinner-wrap">
                <div className="gold-spinner" />
                <Sparkles size={28} className="spinner-center-icon" />
              </div>
              <h2>Enregistrement de votre rendez-vous...</h2>
              <p>Nous vérifions la disponibilité auprès de notre équipe et préparons votre réservation.</p>
              <div className="processing-dots">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 9: CONFIRMATION SUCCESS PAGE                         */}
        {/* ======================================================== */}
        {currentStep === 9 && createdAppointment && (
          <div className="booking-step-content step-success">
            <div className="success-card">
              <div className="success-icon-badge">
                <CheckCircle size={56} />
              </div>

              <span className="success-pretitle">Réservation confirmée avec succès</span>
              <h2 className="success-title">Votre moment de détente est réservé</h2>

              <div className="reference-badge">
                <span className="ref-label">Référence :</span>
                <strong className="ref-number">{createdAppointment.reference}</strong>
              </div>

              {/* Complete Confirmation Recap */}
              <div className="success-recap-grid">
                <div className="success-item">
                  <span className="s-label">Prestation</span>
                  <span className="s-value">{createdAppointment.serviceName}</span>
                </div>
                <div className="success-item">
                  <span className="s-label">Experte</span>
                  <span className="s-value">{createdAppointment.professionalName}</span>
                </div>
                <div className="success-item">
                  <span className="s-label">Date</span>
                  <span className="s-value">{formatFrenchDate(createdAppointment.date)}</span>
                </div>
                <div className="success-item">
                  <span className="s-label">Horaire</span>
                  <span className="s-value">{createdAppointment.startTime} - {createdAppointment.endTime}</span>
                </div>
                <div className="success-item">
                  <span className="s-label">Client</span>
                  <span className="s-value">{createdAppointment.clientName}</span>
                </div>
                <div className="success-item">
                  <span className="s-label">Prix Total</span>
                  <span className="s-value price-green">{formatPrice(createdAppointment.price)}</span>
                </div>
              </div>

              {/* Salon Location Details */}
              <div className="success-salon-info">
                <MapPin size={20} />
                <div>
                  <strong>Glam'Or Beauty Salon & Spa</strong>
                  <p>{settings?.address || '12 Boulevard de la Beauté, Cocody Ambassades, Abidjan'}</p>
                  <p>Contact : {settings?.phone || '+225 01 23 45 67 89'}</p>
                </div>
              </div>

              {/* Important Demo Disclaimer */}
              <div className="demo-notice-box">
                <AlertCircle size={20} />
                <div>
                  <strong>Note de démonstration :</strong>
                  <p>
                    Ceci est une démonstration interactive. Aucun rendez-vous réel n'a été enregistré sur un serveur externe.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="success-actions">
                <Link to="/" className="btn-secondary">
                  Retour à l'accueil
                </Link>
                <Link to="/services" className="btn-secondary">
                  Voir nos services
                </Link>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleResetWizard}
                >
                  <RefreshCw size={16} />
                  <span>Nouveau rendez-vous</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

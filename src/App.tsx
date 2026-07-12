import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  Calendar, 
  Sparkles, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Shield, 
  Heart, 
  Sparkle, 
  Info, 
  Gift, 
  User, 
  Stethoscope, 
  MapPin, 
  Phone, 
  Video, 
  Mail, 
  ArrowRight, 
  Lock, 
  RefreshCw, 
  Star, 
  Share2, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Home
} from 'lucide-react';
import { BABY_NAMES, ZODIACS, FRUIT_SIZES, TESTIMONIALS, FAQ_ITEMS } from './data';
import { GenderType, StyleType, BabyName, ZodiacInfo } from './types';
import LegalModal from './components/LegalModal';

// Anchor helper function
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function App() {
  // --- Today's Reference Date (Fixed for Demo consistency as June 30, 2026) ---
  const today = new Date('2026-06-30');

  // --- Legal Modal State ---
  const [legalModalOpen, setLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<'impressum' | 'datenschutz' | null>(null);
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);

  const openLegal = (tab: 'impressum' | 'datenschutz') => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  // --- State Variables ---
  const [calculationTab, setCalculationTab] = useState<'dueDate' | 'lastPeriod'>('dueDate');
  const [dueDateString, setDueDateString] = useState<string>('2026-11-15');
  const [lastPeriodString, setLastPeriodString] = useState<string>('2026-02-08'); // 15.11.2026 - 280 days is 08.02.2026

  // Syncing "Letzte Periode" & "Geburtstermin"
  const handleDueDateChange = (val: string) => {
    setDueDateString(val);
    const dDate = new Date(val);
    if (!isNaN(dDate.getTime())) {
      const pDate = new Date(dDate.getTime() - 280 * 24 * 60 * 60 * 1000);
      setLastPeriodString(pDate.toISOString().split('T')[0]);
    }
  };

  const handleLastPeriodChange = (val: string) => {
    setLastPeriodString(val);
    const pDate = new Date(val);
    if (!isNaN(pDate.getTime())) {
      const dDate = new Date(pDate.getTime() + 280 * 24 * 60 * 60 * 1000);
      setDueDateString(dDate.toISOString().split('T')[0]);
    }
  };

  // Switch tabs in calculator
  const handleTabChange = (tab: 'dueDate' | 'lastPeriod') => {
    setCalculationTab(tab);
  };

  // Dynamic Date Calculations
  const selectedDueDate = new Date(dueDateString);
  const isInvalidDate = isNaN(selectedDueDate.getTime());
  
  let daysRemaining = 0;
  let weeksRemaining = 0;
  let currentSSW = 20; // fallback default
  
  if (!isInvalidDate) {
    const diffTime = selectedDueDate.getTime() - today.getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    weeksRemaining = Math.max(0, Math.ceil(daysRemaining / 7));
    // Standard pregnancy is 280 days. SSW is calculated as 40 - weeksRemaining
    currentSSW = Math.max(1, Math.min(40, 40 - Math.floor(daysRemaining / 7)));
  }

  // Dynamic Urgency Messages
  let urgencyText = '';
  let urgencyBg = '';
  let urgencyTextClass = '';
  
  if (isInvalidDate) {
    urgencyText = 'Bitte gib ein gültiges Datum ein.';
    urgencyBg = 'bg-red-50 text-red-950 border-red-200';
    urgencyTextClass = 'text-red-900 font-medium';
  } else if (daysRemaining <= 0) {
    urgencyText = '⚠️ Termin überschritten. Eine vorgeburtliche Anmeldung ist möglicherweise nicht mehr auf normalem Weg möglich. Kontaktiere uns umgehend für eine individuelle Abklärung.';
    urgencyBg = 'bg-red-50 text-red-950 border-red-300';
    urgencyTextClass = 'text-red-900 font-bold';
  } else if (weeksRemaining < 4) {
    urgencyText = 'Endspurt! Das Zeitfenster schliesst sich bald. Vorgeburtliche Anmeldung jetzt sofort prüfen, um die Fristen vor der Geburt nicht zu verpassen.';
    urgencyBg = 'bg-coral text-white border-transparent';
    urgencyTextClass = 'text-white font-bold';
  } else if (weeksRemaining >= 4 && weeksRemaining <= 12) {
    urgencyText = 'Zeitfenster wird kleiner. Jetzt nicht aufschieben, um dein Baby rechtzeitig absichern zu können.';
    urgencyBg = 'bg-amber-100 text-amber-950 border-amber-300';
    urgencyTextClass = 'text-amber-950 font-bold';
  } else if (weeksRemaining >= 13 && weeksRemaining <= 28) {
    urgencyText = 'Idealer Zeitpunkt für die vorgeburtliche Anmeldung. Jetzt entspannt erledigen, bevor der Endspurt beginnt.';
    urgencyBg = 'bg-white text-teal-deep border-teal/20';
    urgencyTextClass = 'text-teal-deep font-bold';
  } else {
    urgencyText = 'Ruhiger Zeitpunkt für die vorgeburtliche Anmeldung. Nutze die Zeit, um dich entspannt zu informieren.';
    urgencyBg = 'bg-white/15 text-white border-white/25';
    urgencyTextClass = 'text-white font-semibold';
  }

  // Fruit size lookup
  const currentFruit = FRUIT_SIZES.find(
    f => currentSSW >= f.weekMin && currentSSW <= f.weekMax
  ) || FRUIT_SIZES[FRUIT_SIZES.length - 1];

  // Helper to determine Zodiac Sign dynamically from Due Date
  const getZodiacFromDate = (date: Date): ZodiacInfo => {
    if (isNaN(date.getTime())) return ZODIACS[7]; // default to Scorpio
    const day = date.getDate();
    const month = date.getMonth() + 1; // 1-indexed

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIACS[0]; // Widder
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIACS[1]; // Stier
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIACS[2]; // Zwillinge
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIACS[3]; // Krebs
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIACS[4]; // Löwe
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIACS[5]; // Jungfrau
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIACS[6]; // Waage
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIACS[7]; // Skorpion
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIACS[8]; // Schütze
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIACS[9]; // Steinbock
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIACS[10]; // Wassermann
    return ZODIACS[11]; // Fische
  };

  const dynamicZodiac = getZodiacFromDate(selectedDueDate);

  // --- Dynamic Checklists based on Weeks ---
  let checklistItems: string[] = [];
  if (currentSSW < 12) {
    checklistItems = [
      'Erste Fragen zur Krankenkasse und Zusatzversicherung sammeln',
      'Errechneten Geburtstermin im Kalender für spätere Fristen festhalten',
      'Vorgeburtliche Anmeldung unverbindlich vormerken und vergleichen'
    ];
  } else if (currentSSW >= 12 && currentSSW <= 34) {
    checklistItems = [
      'Vorgeburtliche Krankenkassen-Anmeldung abschliessen (bester Zeitraum!)',
      'Organisatorisches im Blick behalten & Geburtsort/Spital festlegen',
      'Hebamme fürs Wochenbett und Mütterberatung frühzeitig anfragen'
    ];
  } else {
    checklistItems = [
      'Vorgeburtliche Anmeldung jetzt sofort prüfen (höchste Dringlichkeit)',
      'Kliniktasche, Dokumente & Krankenkassenkarten bereitlegen',
      'Rückruftermin für Beratung nicht mehr verschieben'
    ];
  }

  // --- Name Finder State ---
  const [nameGender, setNameGender] = useState<GenderType>('Beides');
  const [nameStyle, setNameStyle] = useState<StyleType>('Kurz');
  const [shuffledNames, setShuffledNames] = useState<BabyName[]>([]);

  // Function to filter and select 6 names
  const handleShuffleNames = () => {
    const filtered = BABY_NAMES.filter(
      item => (nameGender === 'Beides' || item.gender === nameGender) && item.style === nameStyle
    );
    
    // Ensure unique names in the output
    const unique: BabyName[] = [];
    const seen = new Set<string>();
    for (const item of filtered) {
      if (!seen.has(item.name)) {
        seen.add(item.name);
        unique.push(item);
      }
    }

    // Shuffle unique array
    const shuffled = [...unique].sort(() => 0.5 - Math.random());
    setShuffledNames(shuffled.slice(0, 6));
  };

  // Re-shuffle when gender/style changes
  useEffect(() => {
    handleShuffleNames();
  }, [nameGender, nameStyle]);

  // --- Sternzeichen-Widget State ---
  const [activeZodiac, setActiveZodiac] = useState<string>('Skorpion');
  const activeZodiacInfo = ZODIACS.find(z => z.name === activeZodiac) || ZODIACS[7];

  // --- FAQ State ---
  const [openFaqId, setOpenFaqId] = useState<number | null>(1); // first open by default

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  // --- Form State ---
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Form fields
  const [conType, setConType] = useState<'Telefon' | 'Video-Call' | 'Persönlich'>('Telefon');
  const [anrede, setAnrede] = useState<'Frau' | 'Herr'>('Frau');
  const [userEmail, setUserEmail] = useState<string>('');
  const [vorname, setVorname] = useState<string>('');
  const [nachname, setNachname] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [strasse, setStrasse] = useState<string>('');
  const [plz, setPlz] = useState<string>('');
  const [ort, setOrt] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [consent, setConsent] = useState<boolean>(false);
  const [marketingEinwilligung, setMarketingEinwilligung] = useState<boolean>(false);
  const [checklistRequested, setChecklistRequested] = useState<boolean>(false);

  // --- Tracking capture on mount ---
  interface TrackingData {
    utm_quelle: string | null;
    utm_medium: string | null;
    utm_kampagne: string | null;
    utm_inhalt: string | null;
    utm_suchbegriff: string | null;
    gclid: string | null;
    fbclid: string | null;
    einstiegsseite: string;
    verweisende_seite: string | null;
  }

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('lead_tracking');
      if (!stored) {
        const params = new URLSearchParams(window.location.search);
        const tracking: TrackingData = {
          utm_quelle: params.get('utm_source') || null,
          utm_medium: params.get('utm_medium') || null,
          utm_kampagne: params.get('utm_campaign') || null,
          utm_inhalt: params.get('utm_content') || null,
          utm_suchbegriff: params.get('utm_term') || null,
          gclid: params.get('gclid') || null,
          fbclid: params.get('fbclid') || null,
          einstiegsseite: window.location.href,
          verweisende_seite: document.referrer || null,
        };
        sessionStorage.setItem('lead_tracking', JSON.stringify(tracking));
      }
    } catch (e) {
      console.error('Fehler beim Speichern der Tracking-Parameter:', e);
    }
  }, []);

  // --- Telefonnummer normalisieren ---
  const normalizePhone = (rawPhone: string): string => {
    let cleaned = rawPhone.replace(/[\s()\-]/g, '');
    if (cleaned.startsWith('0') && !cleaned.startsWith('00')) {
      cleaned = '+41' + cleaned.substring(1);
    }
    if (cleaned.startsWith('0041')) {
      cleaned = '+41' + cleaned.substring(4);
    }
    return cleaned;
  };

  // Trigger from SSW checklist CTA
  const handleChecklistCta = () => {
    setChecklistRequested(true);
    scrollToSection('vorsorge-form');
    // Focus email if possible
    const emailInput = document.getElementById('form-email');
    if (emailInput) {
      emailInput.focus();
    }
  };

  // Next step in form (with Step 1 Validation)
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    
    if (!conType) {
      errors.beratungsart = 'Bitte wähle eine Beratungsart aus.';
    }
    if (!dueDateString) {
      errors.voraussichtlicher_geburtstermin = 'Bitte gib den voraussichtlichen Geburtstermin an.';
    }
    if (!userEmail) {
      errors.email = 'Bitte trage eine gültige E-Mail-Adresse ein.';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    setFormStep(2);
  };

  // Handle final form submit (with Step 2 Validation and API Proxy submission)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    setSubmitStatus('idle');
    
    if (!anrede) {
      errors.anrede = 'Bitte wähle eine Anrede aus.';
    }
    if (!vorname.trim()) {
      errors.vorname = 'Bitte gib deinen Vornamen an.';
    }
    if (!nachname.trim()) {
      errors.nachname = 'Bitte gib deinen Namen an.';
    }
    
    if (!phone.trim()) {
      errors.telefonnummer = 'Bitte gib eine gültige Telefonnummer an.';
    } else {
      const normalized = normalizePhone(phone);
      if (normalized.length < 9) {
        errors.telefonnummer = 'Bitte gib eine gültige Telefonnummer an.';
      }
    }
    
    if (conType === 'Persönlich') {
      if (!strasse.trim()) errors.strasse = 'Bitte gib deine Strasse und Hausnummer an.';
      if (!plz.trim()) errors.plz = 'Bitte gib deine PLZ an.';
      if (!ort.trim()) errors.ort = 'Bitte gib deinen Ort an.';
    } else {
      if (!location.trim()) {
        errors.wohnort_kanton = 'Bitte gib deinen Wohnort oder Kanton an.';
      }
    }
    
    if (!consent) {
      errors.datenschutz_akzeptiert = 'Bitte akzeptiere die Datenschutzerklärung.';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    setSubmitStatus('loading');
    
    let tracking: any = {};
    try {
      const stored = sessionStorage.getItem('lead_tracking');
      if (stored) {
        tracking = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Fehler beim Lesen des lead_tracking aus sessionStorage:', e);
    }

    const currentUrl = window.location.href;
    const referrer = document.referrer || null;

    const payload = {
      formularname: "Vorgeburtliche Anmeldung - Landingpage",
      quelle: "Webseite",
      beratungsart: conType,
      voraussichtlicher_geburtstermin: dueDateString,
      anrede: anrede,
      vorname: vorname,
      nachname: nachname,
      telefonnummer: normalizePhone(phone),
      phone: normalizePhone(phone),
      mobile: normalizePhone(phone),
      email: userEmail,
      wohnort_kanton: conType === 'Persönlich' ? `${strasse}, ${plz} ${ort}` : location,
      nachricht_bemerkung: message || null,
      utm_quelle: tracking.utm_quelle || null,
      utm_medium: tracking.utm_medium || null,
      utm_kampagne: tracking.utm_kampagne || null,
      utm_inhalt: tracking.utm_inhalt || null,
      utm_suchbegriff: tracking.utm_suchbegriff || null,
      gclid: tracking.gclid || null,
      fbclid: tracking.fbclid || null,
      einstiegsseite: tracking.einstiegsseite || currentUrl,
      aktuelle_seite: currentUrl,
      verweisende_seite: tracking.verweisende_seite || referrer,
      datenschutz_akzeptiert: consent,
      marketing_einwilligung: marketingEinwilligung,
      uebermittelt_am: new Date().toISOString()
    };
    
    try {
      const response = await fetch('/api/lead-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API-Fehler: ${response.status}`);
      }
      
      setSubmitStatus('success');
      setFormSubmitted(true);
    } catch (error: any) {
      console.error('Fehler bei der API-Formularübermittlung:', error.message || error);
      setSubmitStatus('error');
    }
  };

  const renderForm = (isModal: boolean = false) => {
    return (
      <div className="text-teal-deep text-left relative">
        {/* Check-list special helper badge */}
        {checklistRequested && (
          <div className="mb-4 p-3 bg-teal/10 border border-teal/20 text-teal-deep text-xs rounded-xl flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-teal animate-ping"></span>
            <span>Anfrage für die <strong>40-Wochen-Checkliste</strong> per E-Mail ist vorgemerkt!</span>
          </div>
        )}

        {!formSubmitted ? (
          <form onSubmit={formStep === 1 ? handleNextStep : handleFormSubmit} className="space-y-5">
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <span className="text-xs font-bold text-teal-deep/50 uppercase tracking-widest">
                Schritt {formStep} von 2
              </span>
              <div className="flex gap-1">
                <span className={`w-6 h-1.5 rounded-full transition-all ${formStep >= 1 ? 'bg-teal' : 'bg-gray-200'}`}></span>
                <span className={`w-6 h-1.5 rounded-full transition-all ${formStep >= 2 ? 'bg-teal' : 'bg-gray-200'}`}></span>
              </div>
            </div>

            {/* STEP 1 FIELDS */}
            {formStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                
                <div>
                  <label className="block text-xs font-bold text-teal-deep/80 uppercase tracking-wider mb-2">
                    Wie möchtest du beraten werden?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setConType('Telefon')}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 sm:p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${conType === 'Telefon' ? 'bg-teal/10 border-teal text-teal-deep shadow-sm' : 'border-gray-200 hover:bg-cream/40'}`}
                    >
                      <Phone className="w-4 h-4 text-teal shrink-0" /> <span>Telefon</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConType('Video-Call')}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 sm:p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${conType === 'Video-Call' ? 'bg-teal/10 border-teal text-teal-deep shadow-sm' : 'border-gray-200 hover:bg-cream/40'}`}
                    >
                      <Video className="w-4 h-4 text-teal shrink-0" /> <span>Video-Call</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConType('Persönlich')}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 sm:p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${conType === 'Persönlich' ? 'bg-teal/10 border-teal text-teal-deep shadow-sm' : 'border-gray-200 hover:bg-cream/40'}`}
                    >
                      <User className="w-4 h-4 text-teal shrink-0" /> <span>Persönlich</span>
                    </button>
                  </div>
                  {formErrors.beratungsart && <p className="text-coral text-xs font-semibold mt-1">{formErrors.beratungsart}</p>}
                  <span className="block text-[10px] text-teal-deep/50 mt-1.5">
                    * Du erhältst die komplette 40-Wochen-Checkliste per E-Mail und das Starter-Set zum Beratungstermin.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-deep/80 uppercase tracking-wider mb-1">
                    Voraussichtlicher Geburtstermin:
                  </label>
                  <input
                    type="date"
                    value={dueDateString}
                    onChange={(e) => handleDueDateChange(e.target.value)}
                    className="w-full bg-cream border border-gray-200 rounded-xl py-3 px-4 text-teal-deep focus:outline-none focus:ring-2 focus:ring-teal font-semibold"
                  />
                  {formErrors.voraussichtlicher_geburtstermin && <p className="text-coral text-xs font-semibold mt-1">{formErrors.voraussichtlicher_geburtstermin}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-deep/80 uppercase tracking-wider mb-1">
                    Deine E-Mail-Adresse: <span className="text-coral">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal/60" />
                    <input
                      type="email"
                      id={`${isModal ? 'modal-' : ''}form-email`}
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="beispiel@domain.ch"
                      className="w-full bg-cream border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-teal-deep focus:outline-none focus:ring-2 focus:ring-teal font-semibold"
                    />
                  </div>
                  {formErrors.email && <p className="text-coral text-xs font-semibold mt-1">{formErrors.email}</p>}
                </div>

                {/* Button Step 1 */}
                <button
                  type="submit"
                  className="w-full bg-coral hover:bg-coral/95 text-white font-bold py-4 rounded-xl mt-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                  id={`${isModal ? 'modal-' : ''}form-next-btn`}
                >
                  Weiter <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            )}

            {/* STEP 2 FIELDS */}
            {formStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                
                <div>
                  <label className="block text-xs font-bold text-teal-deep/80 uppercase tracking-wider mb-1.5">
                    Anrede: <span className="text-coral">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-xs">
                    <button
                      type="button"
                      onClick={() => setAnrede('Frau')}
                      className={`py-2 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer text-center ${anrede === 'Frau' ? 'bg-teal text-white border-teal shadow-sm' : 'border-gray-200 text-teal-deep hover:bg-cream/40'}`}
                    >
                      Frau
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnrede('Herr')}
                      className={`py-2 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer text-center ${anrede === 'Herr' ? 'bg-teal text-white border-teal shadow-sm' : 'border-gray-200 text-teal-deep hover:bg-cream/40'}`}
                    >
                      Herr
                    </button>
                  </div>
                  {formErrors.anrede && <p className="text-coral text-xs font-semibold mt-1">{formErrors.anrede}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-teal-deep/80 uppercase tracking-wider mb-1">
                      Vorname: <span className="text-coral">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={vorname}
                      onChange={(e) => setVorname(e.target.value)}
                      placeholder="Julia"
                      className="w-full bg-cream border border-gray-200 rounded-xl py-2.5 px-4 text-teal-deep focus:outline-none focus:ring-2 focus:ring-teal font-semibold"
                    />
                    {formErrors.vorname && <p className="text-coral text-xs font-semibold mt-1">{formErrors.vorname}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-teal-deep/80 uppercase tracking-wider mb-1">
                      Nachname: <span className="text-coral">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nachname}
                      onChange={(e) => setNachname(e.target.value)}
                      placeholder="Müller"
                      className="w-full bg-cream border border-gray-200 rounded-xl py-2.5 px-4 text-teal-deep focus:outline-none focus:ring-2 focus:ring-teal font-semibold"
                    />
                    {formErrors.nachname && <p className="text-coral text-xs font-semibold mt-1">{formErrors.nachname}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-deep/80 uppercase tracking-wider mb-1">
                    Telefonnummer: <span className="text-coral">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+41 79 123 45 67"
                    className="w-full bg-cream border border-gray-200 rounded-xl py-2.5 px-4 text-teal-deep focus:outline-none focus:ring-2 focus:ring-teal font-semibold"
                  />
                  {formErrors.telefonnummer && <p className="text-coral text-xs font-semibold mt-1">{formErrors.telefonnummer}</p>}
                </div>

                {conType === 'Persönlich' ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-teal-deep/80 uppercase tracking-wider mb-1">
                        Strasse & Hausnummer: <span className="text-coral">*</span>
                      </label>
                      <div className="relative">
                        <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal/60" />
                        <input
                          type="text"
                          required
                          value={strasse}
                          onChange={(e) => setStrasse(e.target.value)}
                          placeholder="Bahnhofstrasse 12"
                          className="w-full bg-cream border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-teal-deep focus:outline-none focus:ring-2 focus:ring-teal font-semibold"
                        />
                      </div>
                      {formErrors.strasse && <p className="text-coral text-xs font-semibold mt-1">{formErrors.strasse}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className="block text-xs font-bold text-teal-deep/80 uppercase tracking-wider mb-1 text-center">
                          PLZ: <span className="text-coral">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={plz}
                          onChange={(e) => setPlz(e.target.value)}
                          placeholder="8000"
                          className="w-full bg-cream border border-gray-200 rounded-xl py-2.5 px-3 text-teal-deep focus:outline-none focus:ring-2 focus:ring-teal font-semibold text-center"
                        />
                        {formErrors.plz && <p className="text-coral text-xs font-semibold mt-1">{formErrors.plz}</p>}
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-teal-deep/80 uppercase tracking-wider mb-1">
                          Ort: <span className="text-coral">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal/60" />
                          <input
                            type="text"
                            required
                            value={ort}
                            onChange={(e) => setOrt(e.target.value)}
                            placeholder="Zürich"
                            className="w-full bg-cream border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-teal-deep focus:outline-none focus:ring-2 focus:ring-teal font-semibold"
                          />
                        </div>
                        {formErrors.ort && <p className="text-coral text-xs font-semibold mt-1">{formErrors.ort}</p>}
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-teal-deep/80 uppercase tracking-wider mb-1">
                      Wohnort / Kanton: <span className="text-coral">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal/60" />
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="St. Gallen (SG)"
                        className="w-full bg-cream border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-teal-deep focus:outline-none focus:ring-2 focus:ring-teal font-semibold"
                      />
                    </div>
                    {formErrors.wohnort_kanton && <p className="text-coral text-xs font-semibold mt-1">{formErrors.wohnort_kanton}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-teal-deep/80 uppercase tracking-wider mb-1">
                    Nachricht / Bemerkung (Optional):
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Zusätzliche Fragen oder Wünsche..."
                    rows={2}
                    className="w-full bg-cream border border-gray-200 rounded-xl py-2.5 px-4 text-teal-deep focus:outline-none focus:ring-2 focus:ring-teal text-sm font-semibold"
                  />
                </div>

                {/* Consent Checkboxes */}
                <div className="flex flex-col gap-3 pt-1">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={`${isModal ? 'modal-' : ''}form-consent`}
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 text-teal border-gray-300 rounded focus:ring-teal cursor-pointer"
                    />
                    <label htmlFor={`${isModal ? 'modal-' : ''}form-consent`} className="text-[11px] text-teal-deep/70 leading-relaxed cursor-pointer select-none">
                      Ich bin einverstanden, dass FINWIWO mich zum Baby-Vorsorge-Check kontaktiert und meine Angaben gemäss der <span className="underline hover:text-teal font-semibold cursor-pointer" onClick={() => openLegal('datenschutz')}>Datenschutzerklärung</span> verarbeitet. <span className="text-coral">*</span>
                    </label>
                  </div>
                  {formErrors.datenschutz_akzeptiert && <p className="text-coral text-xs font-semibold">{formErrors.datenschutz_akzeptiert}</p>}

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={`${isModal ? 'modal-' : ''}form-marketing`}
                      checked={marketingEinwilligung}
                      onChange={(e) => setMarketingEinwilligung(e.target.checked)}
                      className="mt-1 w-4 h-4 text-teal border-gray-300 rounded focus:ring-teal cursor-pointer"
                    />
                    <label htmlFor={`${isModal ? 'modal-' : ''}form-marketing`} className="text-[11px] text-teal-deep/70 leading-relaxed cursor-pointer select-none">
                      Ich möchte zukünftig per E-Mail oder Telefon über Angebote, News und nützliche Tipps rund um die Familienvorsorge informiert werden (optional).
                    </label>
                  </div>
                </div>

                {/* Actions & Errors */}
                {submitStatus === 'error' && (
                  <div className="p-3 bg-red-50 border border-red-200 text-coral text-xs font-semibold rounded-xl leading-relaxed">
                    Die Anmeldung konnte leider nicht übermittelt werden. Bitte versuche es erneut oder kontaktiere uns direkt.
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={submitStatus === 'loading'}
                    onClick={() => setFormStep(1)}
                    className="flex-1 bg-cream hover:bg-gray-100 text-teal-deep border border-gray-200 font-bold py-3.5 rounded-xl transition-all cursor-pointer text-xs disabled:opacity-50"
                  >
                    Zurück
                  </button>
                  <button
                    type="submit"
                    disabled={submitStatus === 'loading'}
                    className="flex-[2] bg-coral hover:bg-coral/95 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    id={`${isModal ? 'modal-' : ''}form-submit-btn`}
                  >
                    {submitStatus === 'loading' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Übermittelt...</span>
                      </>
                    ) : (
                      'Baby-Check sichern'
                    )}
                  </button>
                </div>

              </div>
            )}

          </form>
        ) : (
          // SUCCESS SCREEN
          <div className="text-center py-8 space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-teal/15 text-teal rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black font-display text-teal-deep">
                Anfrage übermittelt!
              </h3>
              <p className="text-sm text-teal-deep/80 leading-relaxed max-w-sm mx-auto">
                Herzlichen Dank, <strong>{vorname}</strong>! Deine Anfrage für den kostenlosen Baby-Vorsorge-Check ist erfolgreich eingegangen.
              </p>
            </div>

            <div className="bg-cream/50 rounded-2xl p-5 border border-teal/5 text-xs text-teal-deep/80 text-left space-y-2.5 max-w-sm mx-auto">
              <div className="font-bold text-teal uppercase tracking-wider text-center border-b border-gray-100 pb-1.5 mb-1.5">
                Nächste Schritte:
              </div>
              <p className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                Wir prüfen deine Angaben bezüglich des errechneten Termins ({new Date(dueDateString).toLocaleDateString('de-CH')}).
              </p>
              <p className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                Wir melden uns innert 24 Stunden per Telefon oder E-Mail für die Terminabstimmung.
              </p>
              <p className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                {checklistRequested || userEmail ? (
                  <span>Deine persönliche <strong>40-Wochen-Schwangerschaftscheckliste</strong> wird an <strong>{userEmail}</strong> gesendet.</span>
                ) : (
                  <span>Die Checkliste senden wir direkt an deine hinterlegte E-Mail-Adresse.</span>
                )}
              </p>
            </div>

            <p className="text-[11px] text-teal-deep/50 italic max-w-xs mx-auto leading-normal">
              * Deine Anfrage wurde verschlüsselt und sicher übermittelt.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cream font-sans selection:bg-coral selection:text-white relative pb-16 md:pb-0">
      
      {/* 1. Stichtag-Leiste oben */}
      <div id="top-banner" className="bg-teal-deep text-white text-xs md:text-sm py-2 px-4 text-center font-medium border-b border-teal/10 tracking-wide z-50 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-block w-2 h-2 rounded-full bg-coral animate-ping"></span>
          <span>
            <strong>Vorgeburtliche Anmeldung:</strong> dein Baby ohne Gesundheitsprüfung absichern. Nur vor der Geburt möglich.
          </span>
        </div>
      </div>

      {/* 2. Header / Navigation */}
      <header className="bg-cream/90 backdrop-blur-md sticky top-0 z-40 border-b border-teal-deep/5 py-4 px-4 sm:px-6 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src="https://finwiwo.ch/wp-content/uploads/2024/03/FINWIWO1.png" 
              alt="FINWIWO Logo" 
              className="h-8 sm:h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Independent Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-teal/10 rounded-full text-teal-deep text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-teal"></span>
            Unabhängig · FINMA Nr. 35704
          </div>

          {/* Primary Action Button */}
          <div>
            <button 
              onClick={() => scrollToSection('vorsorge-form')}
              className="bg-coral hover:bg-coral/90 text-white font-bold py-2.5 px-5 rounded-full shadow-md hover:shadow-lg transition-all text-xs sm:text-sm cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              id="header-cta"
            >
              Baby-Check sichern
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero-Sektion */}
      <section className="py-12 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copywriting */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block py-1 px-3 bg-teal/10 rounded-full text-teal text-xs font-bold tracking-wider uppercase">
              Für werdende Eltern
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-teal-deep leading-tight">
              Das Beste für dein Baby. Schon <span className="text-coral underline decoration-wavy decoration-teal underline-offset-8">vor der ersten Sekunde.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-teal-deep/80 leading-relaxed font-normal">
              Meldest du dein Baby vor der Geburt an, kommt es <strong>ohne Gesundheitsprüfung</strong> in die guten Zusatzversicherungen. Halbprivat, privat, Komplementärmedizin, Zahn. Dazu <strong>bis zu CHF 3'500 Geburtspauschale</strong>. Nach der Geburt kann eine Gesundheitsprüfung genau das verhindern.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => scrollToSection('vorteile')}
                className="bg-coral hover:bg-coral/90 text-white font-bold text-base py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
                id="hero-secondary-cta"
              >
                Was dein Baby bekommt <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center gap-3 text-sm text-teal-deep/70 pt-4">
              <Shield className="w-5 h-5 text-teal shrink-0" />
              <span><strong>Unabhängig.</strong> Wir vergleichen alle Kassen der Schweiz und übernehmen die gesamte Anmeldung kostenlos für dich.</span>
            </div>
          </div>

          {/* Right Column: Calculator Widget */}
          <div className="lg:col-span-5" id="schwangerschafts-rechner">
            <div className="bg-teal-deep text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-white/5 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="text-center space-y-2 mb-6">
                <span className="text-gold text-xs font-bold tracking-widest uppercase block">
                  Dein Schwangerschafts-Check
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                  Wann ist es so weit?
                </h2>
              </div>

              {/* Tabs */}
              <div className="flex bg-white/10 p-1 rounded-xl mb-6">
                <button
                  onClick={() => handleTabChange('dueDate')}
                  className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${calculationTab === 'dueDate' ? 'bg-white text-teal-deep shadow' : 'text-white/80 hover:text-white'}`}
                >
                  Geburtstermin
                </button>
                <button
                  onClick={() => handleTabChange('lastPeriod')}
                  className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${calculationTab === 'lastPeriod' ? 'bg-white text-teal-deep shadow' : 'text-white/80 hover:text-white'}`}
                >
                  Letzte Periode
                </button>
              </div>

              {/* Input section */}
              <div className="space-y-4 mb-6">
                {calculationTab === 'dueDate' ? (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-white/70">
                      Voraussichtlicher Geburtstermin
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal" />
                      <input
                        type="date"
                        value={dueDateString}
                        onChange={(e) => handleDueDateChange(e.target.value)}
                        className="w-full bg-white/10 text-white font-semibold rounded-xl py-3 pl-12 pr-4 border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal focus:bg-teal-deep transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-white/70">
                      Erster Tag der letzten Periode
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal" />
                      <input
                        type="date"
                        value={lastPeriodString}
                        onChange={(e) => handleLastPeriodChange(e.target.value)}
                        className="w-full bg-white/10 text-white font-semibold rounded-xl py-3 pl-12 pr-4 border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal focus:bg-teal-deep transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Output block */}
              <div className="bg-white/5 rounded-2xl p-5 space-y-4 border border-white/10">
                <div className="grid grid-cols-2 gap-4 divide-x divide-white/10">
                  {/* Weeks Remaining */}
                  <div className="text-center">
                    <span className="text-xs text-white/60 block font-medium">Bis zur Geburt</span>
                    <span className="text-2xl sm:text-3xl font-black text-gold block">
                      {isInvalidDate ? '--' : `${weeksRemaining}`}
                    </span>
                    <span className="text-xs text-white/80 font-semibold block">Wochen</span>
                  </div>
                  {/* Current SSW */}
                  <div className="text-center">
                    <span className="text-xs text-white/60 block font-medium">Aktuelle Woche</span>
                    <span className="text-2xl sm:text-3xl font-black text-gold block">
                      {isInvalidDate ? '--' : `SSW ${currentSSW}`}
                    </span>
                    <span className="text-xs text-white/80 font-semibold block">Schwangerschaft</span>
                  </div>
                </div>

                {/* Fruit comparison & Zodiac */}
                {!isInvalidDate && (
                  <div className="space-y-3 pt-3 border-t border-white/10 text-sm">
                    {/* Fruit comparison */}
                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl">
                      <span className="text-2xl">{currentFruit.emoji}</span>
                      <div>
                        <span className="text-white/60 text-xs block font-medium">Dein Baby ist etwa so gross wie eine:</span>
                        <span className="font-bold text-white text-sm">{currentFruit.fruit} <span className="text-white/60 font-normal">({currentFruit.size}, {currentFruit.weight})</span></span>
                      </div>
                    </div>
                    
                    {/* Zodiac */}
                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl">
                      <span className="text-2xl text-gold">{dynamicZodiac.icon}</span>
                      <div>
                        <span className="text-white/60 text-xs block font-medium">Sternzeichen des Babys:</span>
                        <span className="font-bold text-white text-sm">
                          {dynamicZodiac.name} <span className="text-gold/90 font-normal">({dynamicZodiac.personality})</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Urgency message */}
                <div className={`p-4 rounded-xl border text-xs leading-relaxed transition-all ${urgencyBg}`}>
                  <p className={urgencyTextClass}>
                    {urgencyText}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setFormModalOpen(true)}
                className="w-full bg-coral hover:bg-coral/95 text-white font-bold py-4 rounded-xl mt-6 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                id="rechner-cta"
              >
                Vorgeburtliche Anmeldung sichern <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Sektion „Darum vor der Geburt“ */}
      <section className="bg-teal-deep text-white py-16 md:py-24 px-4 sm:px-6" id="warum-vorab">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Box: Informational Copy */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-gold text-xs font-bold tracking-widest uppercase block">
                Das Zeitfenster schliesst sich mit der Geburt
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-white leading-tight">
                Warum die Anmeldung unbedingt vor der Geburt erfolgen muss
              </h2>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal">
                Vor der Geburt nehmen die Krankenkassen dein Baby <strong>ohne jede Gesundheitsprüfung</strong> in viele wichtige Zusatzversicherungen auf. Wartest du hingegen bis nach der Geburt, folgt fast immer eine lückenlose Gesundheitsprüfung. Weist dein Baby dann auch nur kleinste Befunde, Allergien oder einen unruhigen Start auf, kann es abgelehnt werden oder erhält schmerzhafte Vorbehalte.
              </p>

              {/* Bulletpoints */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <strong className="text-white">Ohne Geburtseintrag:</strong> Anmeldung in viele tolle Zusatzversicherungen garantiert ohne Gesundheitsprüfungsfragen.
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <strong className="text-white">Idealer Zeitraum:</strong> Empfohlen etwa zwischen dem 4. und 8. Schwangerschaftsmonat (13. bis 32. SSW).
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-coral flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <strong className="text-white">Nach der Geburt:</strong> Risiko für Ausschlüsse, Ablehnung oder hohe Vorbehalte steigt drastisch an.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Box: Finwiwo Trust Card */}
            <div className="lg:col-span-5">
              <div className="bg-white text-teal-deep rounded-3xl p-6 sm:p-8 shadow-xl border-t-4 border-teal relative">
                <div className="absolute top-4 right-4 text-teal opacity-10">
                  <Sparkles className="w-16 h-16" />
                </div>
                <h3 className="text-xl font-bold font-display text-teal-deep mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-teal" />
                  Nicht jede Kasse ist gleich.
                </h3>
                <p className="text-sm text-teal-deep/80 leading-relaxed space-y-3">
                  Gerade bei den begehrten Spitalkategorien wie <strong>halbprivat</strong> und <strong>privat</strong> unterscheiden sich die Schweizer Kassen massiv in ihren Bestimmungen und Tarifen. 
                  <br /><br />
                  Wir wissen genau, welche Anbieter die vorgeburtliche Anmeldung unkompliziert behandeln, bei welchen Kassen welcher Schutz möglich ist und wo es später zu unnötigen Ausschlüssen kommen kann. Nutze unser Fachwissen für den optimalen Start deines Babys.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-teal">
                  <span className="w-2 h-2 rounded-full bg-teal animate-pulse"></span>
                  Vollkommen neutraler Marktvergleich
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Sektion „Was dein Baby bekommt“ (6 Vorteilskarten) */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto" id="vorteile">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-teal text-xs font-bold tracking-widest uppercase block">
            Was dein Baby bekommt
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-teal-deep">
            Ein Schutz, der ein Leben lang bleibt
          </h2>
          <p className="text-base sm:text-lg text-teal-deep/80 leading-relaxed">
            Wir holen für dich raus, was dein Kind leisten darf. Ohne dass du jede Schweizer Kasse einzeln anfragen und mühsame Kleingedruckte vergleichen musst.
          </p>
        </div>

        {/* 3x2 Grid for Desktop, 1 Column for Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Geburtspauschale */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-teal/5 relative group hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-teal-deep mb-3">
              bis zu CHF 3'500 Geburtspauschale
            </h3>
            <p className="text-sm text-teal-deep/70 leading-relaxed">
              Eine wertvolle finanzielle Unterstützung direkt rund um die Geburt, zum Beispiel über das CSS Spital Baby. Gilt überall dort, wo das entsprechende Produkt zur Verfügung steht.
            </p>
          </div>

          {/* Card 2: Halbprivat/Privat */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-teal/5 relative group hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center text-teal mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-teal-deep mb-3">
              Halbprivat oder privat im Spital
            </h3>
            <p className="text-sm text-teal-deep/70 leading-relaxed">
              Beste medizinische Behandlung durch Chefarzt oder Oberärztin. Bei Wahl der passenden Kasse und rechtzeitiger Voranmeldung komplett ohne spätere Gesundheitsfragen möglich.
            </p>
          </div>

          {/* Card 3: Komplementärmedizin */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-teal/5 relative group hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center text-coral mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-teal-deep mb-3">
              Komplementärmedizin
            </h3>
            <p className="text-sm text-teal-deep/70 leading-relaxed">
              Kostenübernahme für sanfte Heilmethoden wie Osteopathie, Homöopathie und Babymassagen – für eine liebevolle Begleitung deines Babys von Anfang an.
            </p>
          </div>

          {/* Card 4: Zahnversicherung */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-teal/5 relative group hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
              <Sparkle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-teal-deep mb-3">
              Kinder-Zahnversicherung
            </h3>
            <p className="text-sm text-teal-deep/70 leading-relaxed">
              Spätere Zahnspangen und Kieferkorrekturen kosten schnell mehrere tausend Franken. Extrem beruhigend, wenn diese Kosten frühzeitig und ohne Hürden gedeckt sind.
            </p>
          </div>

          {/* Card 5: Familienrabatt */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-teal/5 relative group hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center text-teal mb-6 group-hover:scale-110 transition-transform">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-teal-deep mb-3">
              Attraktiver Familienrabatt
            </h3>
            <p className="text-sm text-teal-deep/70 leading-relaxed">
              Wer die gesamte Familie geschickt bei einer Kasse bündelt, spart oft massiv ab dem zweiten Kind. Bei einigen Kassen ist das erste Kind in bestimmten Zusatzversicherungen sogar gratis.
            </p>
          </div>

          {/* Card 6: Komplikationen */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-teal/5 relative group hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center text-coral mb-6 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-teal-deep mb-3">
              Schutz bei Komplikationen
            </h3>
            <p className="text-sm text-teal-deep/70 leading-relaxed">
              Kommt dein Baby wider Erwarten zu früh oder mit einem gesundheitlichen Befund zur Welt, ist ein späterer Abschluss von Zusatzversicherungen meist unmöglich. Schütze dein Kind davor.
            </p>
          </div>

        </div>

        {/* Legal Disclaimer Compliance */}
        <div className="mt-8 text-center text-xs text-teal-deep/60 max-w-xl mx-auto italic">
          * Wichtiger Hinweis: Es gelten stets die jeweiligen Allgemeinen Versicherungsbedingungen (AVB) der Kassen. Ein Anspruch auf Leistungen besteht nur bei erfolgreicher, fristgerechter Aufnahme und Abschluss der entsprechenden Produkte.
        </div>
      </section>

      {/* 6. SSW-Checkliste / Wochenmodul */}
      <section className="bg-teal/5 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-teal/10 text-teal-deep space-y-6">
            
            <div className="text-center space-y-2">
              <span className="text-teal text-xs font-bold tracking-widest uppercase block">
                Deine Woche
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display">
                Das ist in Woche {isInvalidDate ? '20' : currentSSW} wichtig
              </h2>
              <p className="text-sm text-teal-deep/70 max-w-lg mx-auto">
                Basierend auf deinem errechneten Geburtstermin haben wir die wichtigsten To-Dos für deine aktuelle Schwangerschaftsphase zusammengefasst.
              </p>
            </div>

            {/* Checklist Container */}
            <div className="bg-cream/40 rounded-2xl p-6 border border-teal/5 space-y-4">
              {checklistItems.map((todo, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-teal text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold leading-relaxed text-teal-deep/90">
                    {todo}
                  </span>
                </div>
              ))}
            </div>

            {/* Action buttons and medical disclaimer */}
            <div className="text-center pt-2 space-y-4">
              <button
                onClick={handleChecklistCta}
                className="inline-flex bg-teal hover:bg-teal/90 text-white font-bold py-3.5 px-8 rounded-full shadow-md hover:shadow-lg transition-all items-center gap-2 cursor-pointer text-sm"
                id="checklist-cta"
              >
                Komplette 40-Wochen-Checkliste per E-Mail <Mail className="w-4 h-4" />
              </button>
              
              <p className="text-[11px] text-teal-deep/60 italic">
                * Zur Orientierung, ersetzt keine medizinische, rechtliche oder professionelle Versicherungsberatung.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Baby-Namen-Finder */}
      <section className="bg-blush py-20 px-4 sm:px-6" id="namen-finder">
        <div className="max-w-5xl mx-auto text-teal-deep">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <span className="text-coral text-xs font-bold tracking-widest uppercase block">
              Allein Anders
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-teal-deep">
              Der Baby-Namen-Finder
            </h2>
            <p className="text-base text-teal-deep/80 leading-relaxed">
              Schon den perfekten Namen im Kopf? Oder noch auf der Suche nach Inspiration? Wähle dein Wunsch-Geschlecht sowie den passenden Stil und finde tolle Ideen.
            </p>
          </div>

          {/* Filter Tabs Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-coral/10 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Gender selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-teal-deep/70 mb-3">
                  Gewünschtes Geschlecht:
                </label>
                <div className="flex bg-cream p-1 rounded-xl gap-1">
                  {(['Mädchen', 'Junge', 'Beides'] as GenderType[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setNameGender(g)}
                      className={`flex-1 text-center py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${nameGender === g ? 'bg-teal text-white shadow' : 'text-teal-deep/70 hover:text-teal-deep'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-teal-deep/70 mb-3">
                  Namen-Stil:
                </label>
                <div className="grid grid-cols-4 gap-1 bg-cream p-1 rounded-xl">
                  {(['Klassisch', 'Modern', 'Kurz', 'Selten'] as StyleType[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setNameStyle(s)}
                      className={`text-center py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${nameStyle === s ? 'bg-teal text-white shadow' : 'text-teal-deep/70 hover:text-teal-deep'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Shuffled output names cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              {shuffledNames.map((n, idx) => (
                <div key={idx} className="bg-cream/40 rounded-2xl p-4 border border-coral/5 text-center shadow-sm relative overflow-hidden group hover:border-coral/20 hover:bg-white transition-all duration-300">
                  <span className={`absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${n.gender === 'Mädchen' ? 'bg-pink-100 text-pink-700' : n.gender === 'Junge' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {n.gender === 'Mädchen' ? '♀' : n.gender === 'Junge' ? '♂' : '⚦'}
                  </span>
                  <div className="text-xl font-black text-teal-deep font-display mb-1 group-hover:scale-105 transition-transform">
                    {n.name}
                  </div>
                  <div className="text-xs text-teal-deep/60">
                    {n.meaning}
                  </div>
                </div>
              ))}
            </div>

            {/* Shuffle button */}
            <div className="text-center pt-4">
              <button
                onClick={handleShuffleNames}
                className="bg-coral hover:bg-coral/90 text-white font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 text-sm cursor-pointer"
                id="name-shuffle-btn"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" /> Neue Vorschläge
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 8. Sternzeichen-Widget */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto" id="sternzeichen-sektion">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-teal/10 text-teal-deep">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
            <span className="text-gold text-xs font-bold tracking-widest uppercase block">
              Nur zum Schmunzeln
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display">
              So bist du schwanger, laut deinem Sternzeichen
            </h2>
            <p className="text-sm text-teal-deep/70">
              Wähle dein eigenes Sternzeichen aus und finde heraus, wie sich deine typischen Charaktereigenschaften in der magischen Zeit der Schwangerschaft zeigen.
            </p>
          </div>

          {/* Grid of 12 Zodiac buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-8">
            {ZODIACS.map((z) => (
              <button
                key={z.name}
                onClick={() => setActiveZodiac(z.name)}
                className={`py-3 px-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${activeZodiac === z.name ? 'bg-teal-deep text-white border-teal-deep shadow' : 'bg-cream/40 border-teal-deep/5 hover:bg-cream hover:border-teal/20 text-teal-deep'}`}
              >
                <span className="text-2xl">{z.icon}</span>
                <span className="text-xs font-bold">{z.name}</span>
                <span className="text-[9px] opacity-60 font-medium">{z.dateRange}</span>
              </button>
            ))}
          </div>

          {/* Active quote bubble */}
          <div className="bg-cream rounded-2xl p-6 border border-teal/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-bold">
                {activeZodiacInfo.icon} Sternzeichen {activeZodiacInfo.name}
              </span>
              <p className="text-base sm:text-lg font-bold leading-relaxed italic text-teal-deep/90">
                {activeZodiacInfo.pregnancyQuote}
              </p>
              <p className="text-xs text-teal-deep/60">
                Charaktertyp: {activeZodiacInfo.name}s sind {activeZodiacInfo.personality}.
              </p>
            </div>

            {/* Sharing link */}
            <div className="shrink-0">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${activeZodiacInfo.pregnancyQuote} Gefunden beim Baby-Vorsorge-Check auf FINWIWO.ch! 🤰✨`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-5 rounded-full shadow transition-all inline-flex items-center gap-2 text-xs cursor-pointer"
                id="whatsapp-share-btn"
              >
                <Share2 className="w-4 h-4" /> Mit WhatsApp teilen
              </a>
            </div>
          </div>

          <p className="text-center text-[10px] text-teal-deep/40 mt-4 italic">
            * Reiner Spass zur Unterhaltung, keine medizinische, astrologische oder fachliche Beratung.
          </p>

        </div>
      </section>

      {/* 9. Stimmen / Social Proof */}
      <section className="bg-cream py-16 px-4 sm:px-6" id="stimmen-proof">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-teal text-xs font-bold tracking-widest uppercase block">
              Stimmen
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-teal-deep">
              Gut begleitet in eine grosse Zeit
            </h2>
            <p className="text-sm sm:text-base text-teal-deep/70 max-w-xl mx-auto">
              Lese die Erfahrungen von echten Hebammen und werdenden Eltern, die den kostenlosen Baby-Vorsorge-Check bereits erfolgreich genutzt haben.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-teal/5 flex flex-col justify-between space-y-6 relative">
                
                {/* Decorative Quote mark */}
                <span className="text-6xl text-teal/10 font-serif absolute top-4 left-4 pointer-events-none">„</span>
                
                <p className="text-sm sm:text-base text-teal-deep/80 leading-relaxed italic z-10">
                  {t.quote}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.isHebamme ? 'bg-teal/10 text-teal' : 'bg-coral/10 text-coral'}`}>
                    {t.isHebamme ? <Stethoscope className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-teal-deep text-sm">{t.author}</div>
                    <div className="text-xs text-teal-deep/60">{t.role}, {t.location}</div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="text-center text-xs text-teal-deep/40 italic">
            * Hinweis zur Transparenz: Die obenstehenden Zitate sind zur Veranschaulichung typischer Eltern- und Hebammen-Erfahrungen redaktionell aufbereitet und dienen als auswechselbare Platzhalter.
          </div>

        </div>
      </section>

      {/* 9.5 Vertrauensteil / Über uns */}
      <section className="bg-white border-y border-teal-deep/5 py-16 md:py-24 px-4 sm:px-6" id="co-pilot-team">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side: Profile Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-cream rounded-3xl p-6 sm:p-8 border border-teal/10 shadow-lg text-teal-deep w-full max-w-md relative overflow-hidden group hover:border-teal/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal/5 rounded-full blur-3xl pointer-events-none"></div>
                
                {/* Photo */}
                <div className="relative mb-6 rounded-2xl overflow-hidden aspect-[4/5] shadow-md border border-teal/5">
                  <img 
                    src="https://finwiwo.ch/wp-content/uploads/2026/03/Alessandro-2SO202361.jpg" 
                    alt="Alessandro Palermo" 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Profile Details */}
                <div className="space-y-4">
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-black font-display text-teal-deep">Alessandro Palermo</h3>
                    <p className="text-sm text-teal font-semibold">Leiter Finanzberatung</p>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-teal/10">
                    <a 
                      href="tel:+41766805646" 
                      className="flex items-center gap-3 p-3 bg-white hover:bg-teal/5 rounded-xl border border-teal-deep/5 text-sm font-semibold transition-all group/link"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center shrink-0 group-hover/link:bg-teal group-hover/link:text-white transition-all">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="text-teal-deep group-hover/link:text-teal transition-all">+41 76 680 56 46</span>
                    </a>

                    <a 
                      href="mailto:alessandro@finwiwo.ch" 
                      className="flex items-center gap-3 p-3 bg-white hover:bg-teal/5 rounded-xl border border-teal-deep/5 text-sm font-semibold transition-all group/link"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center shrink-0 group-hover/link:bg-teal group-hover/link:text-white transition-all">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="text-teal-deep group-hover/link:text-teal transition-all">alessandro@finwiwo.ch</span>
                    </a>
                  </div>

                  <div className="pt-3 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal/10 text-teal text-[11px] font-bold">
                      <Shield className="w-3.5 h-3.5" /> FINMA registriert · 100% Neutral
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Right side: Philosophy text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-coral text-xs font-bold tracking-widest uppercase block">
                Verlässlicher Partner
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-teal-deep leading-tight">
                Ihr Co-Pilot, ein Leben lang
              </h2>
              
              <p className="text-base sm:text-lg text-teal-deep/80 leading-relaxed font-normal">
                Finanzen sind vielschichtig und das Leben wartet nicht. Deshalb haben wir unser Servicespektrum so aufgebaut, dass wir für jede Situation, in jeder Lebensphase, mit echter Kompetenz zur Seite stehen.
              </p>
              
              <p className="text-base sm:text-lg text-teal-deep/80 leading-relaxed font-normal">
                Um dieses Spektrum vollständig abdecken zu können, haben wir gezielte Partnerschaften mit Versicherungen, Banken, Hypothekenanbietern, Notaren und Anwälten aufgebaut. Diese Netzwerke ermöglichen es uns, für jede Situation die beste Lösung zu finden – nicht die nächste verfügbare.
              </p>
              
              <p className="text-base sm:text-lg text-teal-deep/80 leading-relaxed font-normal">
                Dabei gilt ein Grundsatz ohne Ausnahme: <strong>Wir sind unabhängig.</strong> Wir sind keiner Bank, keiner Versicherung und keinem Produktgeber verpflichtet. Unsere einzige Verpflichtung gilt unseren Klienten.
              </p>

              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-bold text-teal-deep">Unabhängige Beratung</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-bold text-teal-deep">Gezieltes Partnernetzwerk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-bold text-teal-deep">Kompetent & Nah</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. Werte-Sektion */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto" id="werte">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-teal-deep">
          
          {/* Wert 1: Unabhängig */}
          <div className="bg-white/60 rounded-2xl p-6 border border-teal/5 space-y-3">
            <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-teal-deep">
              Unabhängig & Neutral
            </h3>
            <p className="text-sm text-teal-deep/70 leading-relaxed">
              Wir sind an keinerlei Krankenkasse oder Versicherungskonzern gebunden und vergleichen alle. Wir finden neutral die beste Kasse, die dein Baby ohne Vorbehalt aufnimmt.
            </p>
          </div>

          {/* Wert 2: Entlastung */}
          <div className="bg-white/60 rounded-2xl p-6 border border-teal/5 space-y-3">
            <div className="w-10 h-10 rounded-full bg-coral text-white flex items-center justify-center shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-teal-deep">
              Wir nehmen dir die Arbeit ab
            </h3>
            <p className="text-sm text-teal-deep/70 leading-relaxed">
              Wir übernehmen die gesamte Korrespondenz und Anmeldung bei den Kassen, damit du nach der Geburt jede Sekunde vollkommen entspannt für dein Baby da sein kannst.
            </p>
          </div>

          {/* Wert 3: Kostenlos */}
          <div className="bg-white/60 rounded-2xl p-6 border border-teal/5 space-y-3">
            <div className="w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center shadow-sm">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-teal-deep">
              Kostenlos und ehrlich
            </h3>
            <p className="text-sm text-teal-deep/70 leading-relaxed">
              Unsere professionelle Beratung kostet dich keinen Rappen. Du siehst völlig klar, welche Lösung dir und deinem Kind echte Vorteile bringt und welche Produkte überflüssig sind.
            </p>
          </div>

        </div>
      </section>

      {/* 11. Baby-Starter-Set Geschenk */}
      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto" id="starter-set">
        <div className="bg-blush rounded-3xl p-6 sm:p-10 shadow-lg border border-coral/10 text-teal-deep relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left description */}
            <div className="md:col-span-8 space-y-4">
              <span className="text-coral text-xs font-bold tracking-widest uppercase block">
                Unser Geschenk
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-teal-deep">
                Das FINWIWO Baby-Starter-Set
              </h2>
              <p className="text-sm sm:text-base text-teal-deep/80 leading-relaxed">
                Als kleines Dankeschön für dein Vertrauen schenken wir dir zum kostenlosen Baby-Vorsorge-Check das liebevoll zusammengestellte <strong>FINWIWO Baby-Starter-Set</strong>. 
                Du erhältst dieses physisch bei unserem Beratungstermin überreicht.
              </p>
              <ul className="text-xs text-teal-deep/70 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal shrink-0" />
                  Keinerlei Kaufverpflichtung oder Mindestvertragslaufzeiten
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal shrink-0" />
                  Einfach als kleines Geschenk fürs persönliche Kennenlernen
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal shrink-0" />
                  Prall gefüllt mit tollen Erstlings-Utensilien für dein Neugeborenes
                </li>
              </ul>
            </div>

            {/* Right decorative Gift Box Mockup */}
            <div className="md:col-span-4 bg-white/95 rounded-2xl p-5 text-center border border-coral/15 shadow-sm relative group hover:border-coral/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gold/15 text-gold flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Gift className="w-6 h-6" />
              </div>
              <div className="font-bold text-sm text-teal-deep uppercase tracking-wider">
                Baby-Starter-Set
              </div>
              <div className="text-xs text-gold font-bold mt-1">
                Geschenk zum Beratungstermin
              </div>
              <div className="text-[10px] text-teal-deep/50 mt-3 pt-2 border-t border-gray-100">
                Kein Gewinnspiel, garantierte Übergabe beim stattgefundenen Termin.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 12. Abschlussformular für Baby-Vorsorge-Check */}
      <section className="bg-teal-deep text-white py-16 md:py-24 px-4 sm:px-6" id="vorsorge-form">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Form Details & Info */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-gold text-xs font-bold tracking-widest uppercase block">
                Baby-Vorsorge-Check
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-white leading-tight">
                Sichere die vorgeburtliche Anmeldung deines Babys
              </h2>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal">
                Trage dich kurz in unser Formular ein. In einem kurzen, unverbindlichen Gespräch vergleichen wir alle Schweizer Kassen für dich, finden die perfekte Lösung und übernehmen kostenlos die gesamte Anmeldung vor der Geburt.
              </p>

              {/* Countdown information derived from state */}
              {!isInvalidDate && (
                <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-2">
                  <div className="text-xs text-white/60 font-bold uppercase tracking-wider">
                    Dein eingegebener Schwangerschafts-Countdown
                  </div>
                  <p className="text-sm font-semibold">
                    Errechneter Termin: <span className="text-gold font-black">{selectedDueDate.toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </p>
                  <p className="text-sm">
                    Das bedeutet: noch <span className="text-gold font-black">{weeksRemaining} Wochen ({daysRemaining} Tage)</span> verbleibende Zeit bis zur Geburt.
                  </p>
                </div>
              )}

              {/* Bulletpoints */}
              <div className="space-y-4 pt-2 text-sm sm:text-base">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Vollständig kostenlos und unverbindlich</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Antwort und Vergleichsvorschläge innert 24 Stunden</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Ganz entspannt per Telefon, Video-Call oder bei dir vor Ort</span>
                </div>
              </div>
            </div>

            {/* Right Column: Two-Step Interactive Form Card */}
            <div className="lg:col-span-6">
              <div className="bg-white text-teal-deep rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal/10 relative">
                
                {renderForm(false)}

                {/* Privacy and lock icon */}
                <div className="absolute -bottom-10 left-0 right-0 text-center flex items-center justify-center gap-1.5 text-xs text-white/70">
                  <Lock className="w-3.5 h-3.5" />
                  Deine Daten sind gemäss DSGVO/DSG der Schweiz absolut sicher verschlüsselt.
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 13. XL-FAQ */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto" id="faq">
        
        <div className="text-center space-y-3 mb-12">
          <span className="text-teal text-xs font-bold tracking-widest uppercase block">
            Häufige Fragen
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-teal-deep">
            Was werdende Eltern oft fragen
          </h2>
          <p className="text-sm sm:text-base text-teal-deep/70 max-w-lg mx-auto">
            Die wichtigsten Antworten rund um vorgeburtliche Anmeldung, Spitalabteilungen und den Ablauf des FINWIWO Baby-Checks.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openFaqId === item.id;
            return (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-teal-deep/5 shadow-sm overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full text-left py-5 px-6 font-bold font-display text-teal-deep flex items-center justify-between gap-4 cursor-pointer hover:bg-cream/10 transition-colors"
                >
                  <span className="text-sm sm:text-base">{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-teal shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-teal shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-teal-deep/80 leading-relaxed border-t border-gray-50 bg-cream/5 animate-slideDown">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* 14. Footer */}
      <footer className="bg-teal-deep text-white/80 py-16 px-4 sm:px-6 border-t border-white/5" id="impressum-footer">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/10 pb-10">
            
            {/* Logo */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <img 
                  src="https://finwiwo.ch/wp-content/uploads/2024/03/FINWIWO1.png" 
                  alt="FINWIWO Logo" 
                  className="h-8 w-auto object-contain brightness-0 invert"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-xs text-white/60">
                Die unabhängigen Experten für deine Familienabsicherung.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-6 text-sm font-semibold text-white">
              <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => openLegal('impressum')}>Impressum</span>
              <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => openLegal('datenschutz')}>Datenschutz</span>
            </div>

          </div>

          {/* Legal Texts & Register info */}
          <div className="space-y-6 text-xs text-white/50 leading-relaxed">
            
            <p>
              <strong>FINWIWO AG · Unabhängige Versicherungs- und Finanzberatung · St. Gallen · FINMA Register Nr. 35704</strong>
            </p>
            
            <p>
              Rechtlicher Hinweis: Die gezeigten Leistungen, Deckungen und Beträge (wie z. B. bis zu CHF 3'500 Geburtspauschale) können je nach gewählter Kasse, Produktvereinbarungen, Kantonsbestimmungen und persönlicher Situation variieren. Die auf dieser Landingpage bereitgestellten Online-Rechner, To-Do-Checklisten und sonstigen Tools dienen ausschliesslich der Orientierung, Illustration und Unterhaltung und ersetzen keinesfalls eine professionelle medizinische, rechtliche oder formelle Versicherungsberatung. Das FINWIWO Baby-Starter-Set ist ein kostenloses Geschenk zum stattgefundenen Beratungstermin und ist in keiner Weise an den tatsächlichen Abschluss einer Versicherungspolice gekoppelt (keine Koppelung im Sinne der schweizerischen Lauterkeitsregeln).
            </p>

            <p className="text-center pt-4 border-t border-white/5 text-[10px] tracking-wide text-white/30">
              © {new Date().getFullYear()} FINWIWO AG. Alle Rechte vorbehalten. Design & Entwicklung optimiert für werdende Eltern in der Schweiz.
            </p>

          </div>

        </div>
      </footer>

      {/* 15. Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl p-3 flex justify-between items-center z-40 animate-slideUp">
        <div className="space-y-0.5 pl-2 text-teal-deep">
          <div className="text-xs font-bold uppercase tracking-wider opacity-90 leading-none">
            Baby absichern
          </div>
          <div className="text-[11px] font-semibold text-teal leading-none">
            noch {isInvalidDate ? '20' : weeksRemaining} Wochen übrig
          </div>
        </div>
        
        <button
          onClick={() => scrollToSection('vorsorge-form')}
          className="bg-coral hover:bg-coral/95 text-white font-bold py-3 px-6 rounded-full shadow text-xs cursor-pointer tracking-wider uppercase transform active:scale-95 transition-all"
          id="sticky-mobile-cta-btn"
        >
          Check sichern
        </button>
      </div>


      {/* 15. Legal Documents Modal */}
      <LegalModal 
        isOpen={legalModalOpen} 
        initialTab={legalModalTab} 
        onClose={() => setLegalModalOpen(false)} 
      />

      {/* 17. Formular Overlay Modal */}
      {formModalOpen && (
        <div className="fixed inset-0 bg-teal-deep/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-teal/10 my-8">
            
            {/* Close Button */}
            <button 
              onClick={() => setFormModalOpen(false)}
              className="absolute top-4 right-4 text-teal-deep/50 hover:text-teal-deep transition-colors p-1.5 rounded-full hover:bg-cream z-10 cursor-pointer"
              id="form-modal-close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="text-center pb-2">
                <span className="text-teal text-xs font-bold tracking-widest uppercase block mb-1">
                  Kostenloser Baby-Vorsorge-Check
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-teal-deep">
                  Vorgeburtliche Anmeldung sichern
                </h3>
              </div>

              {renderForm(true)}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

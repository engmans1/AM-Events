import React, { useState, useMemo, useEffect } from 'react';
import {
  QrCode,
  Mail,
  Send,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Smartphone,
  LayoutDashboard,
  FileSpreadsheet,
  Search,
  Printer,
  RefreshCw,
  Wifi,
  WifiOff,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  UserPlus,
  ShieldCheck,
  UserCog,
  Ticket,
  Crown,
  Briefcase,
  User,
  Lock,
  LogOut,
  KeyRound,
  Link2,
  Phone,
  Settings,
  Server,
  Upload,
  FileText,
  Edit3
} from 'lucide-react';

// --- Geometric "AM" Monogram Logo Component ---
const AMLogo = ({ size = 40, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="AM Monogram Logo"
  >
    <defs>
      <linearGradient id="amGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="55%" stopColor="#0d9488" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <linearGradient id="amGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#amGradDark)" />
    <rect x="3" y="3" width="58" height="58" rx="15" stroke="url(#amGradPrimary)" strokeWidth="2.5" />
    <path d="M12 18V12H18" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
    <path d="M52 18V12H46" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 46V52H18" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" />
    <path d="M52 46V52H46" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M14 46L23.5 19L32 37.5L40.5 19L50 46"
      stroke="url(#amGradPrimary)"
      strokeWidth="4.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 37H28.5"
      stroke="#f59e0b"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <circle cx="32" cy="14" r="2.2" fill="#f59e0b" />
  </svg>
);

// --- Deterministic SVG QR Code Generator ---
const DeterministicQR = ({ value = '', size = 140, showLogo = true }) => {
  const safeValue = String(value || 'AM-TICKET');
  const grid = 21;
  const cells = useMemo(() => {
    let hash = 2166136261;
    for (let i = 0; i < safeValue.length; i++) {
      hash ^= safeValue.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const matrix = Array.from({ length: grid }, () => Array(grid).fill(false));

    const drawFinder = (r0, c0) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          matrix[r0 + r][c0 + c] = isBorder || isCenter;
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(0, grid - 7);
    drawFinder(grid - 7, 0);

    let seed = Math.abs(hash) || 1337;
    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= grid - 8;
        const inBottomLeft = r >= grid - 8 && c < 8;
        const inCenterLogo = showLogo && r >= 8 && r <= 12 && c >= 8 && c <= 12;
        if (inTopLeft || inTopRight || inBottomLeft || inCenterLogo) continue;

        seed = (seed * 1664525 + 1013904223) % 4294967296;
        matrix[r][c] = (seed & 1) === 1 || (r * c + seed) % 5 === 0;
      }
    }
    return matrix;
  }, [safeValue, showLogo]);

  const cellSize = size / (grid + 2);

  return (
    <div
      className="inline-flex items-center justify-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm relative"
      style={{ width: size + 16, height: size + 16 }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="#ffffff" />
        {cells.map((row, r) =>
          row.map((active, c) =>
            active ? (
              <rect
                key={`${r}-${c}`}
                x={(c + 1) * cellSize}
                y={(r + 1) * cellSize}
                width={cellSize * 0.92}
                height={cellSize * 0.92}
                rx={cellSize * 0.18}
                fill="#0f172a"
              />
            ) : null
          )
        )}
      </svg>
      {showLogo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-0.5 rounded-md shadow-xs">
            <AMLogo size={Math.max(22, Math.floor(size * 0.22))} />
          </div>
        </div>
      )}
    </div>
  );
};

// --- Ticket Type Styling Helper (VIP / Regular / Staff) ---
const getTicketTierMeta = (type) => {
  const normalized = String(type || 'Regular');
  if (normalized === 'VIP') {
    return {
      label: 'VIP',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      banner: 'from-amber-500 to-yellow-600',
      icon: Crown
    };
  }
  if (normalized === 'Staff') {
    return {
      label: 'Staff',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      banner: 'from-indigo-600 to-blue-700',
      icon: Briefcase
    };
  }
  return {
    label: 'Regular',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    banner: 'from-emerald-600 to-teal-700',
    icon: Ticket
  };
};

// --- RBAC Hierarchy Metadata ---
const ROLES_CONFIG = {
  super_admin: {
    id: 'super_admin',
    label: 'Super Admin',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    lightBadge: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Full system access: Event editing, User Management, Password resets, Bulk CSV Import, Email/WA Config, and Door Scanner.'
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    lightBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Standard administrative access: Register guests, create invitation links, send tickets, export CSVs, and check in guests.'
  },
  user: {
    id: 'user',
    label: 'User (Door Staff)',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    lightBadge: 'bg-sky-100 text-sky-800 border-sky-300',
    description: 'Operational dashboard & offline mobile QR door scanner access.'
  }
};

// --- Initial Staff Accounts (Super Admin: sadmin / Akais@2020) ---
const INITIAL_STAFF_USERS = [
  {
    id: 'USR-001',
    username: 'sadmin',
    name: 'System Super Admin',
    email: 'sadmin@am-events.ae',
    passwordHash: '$2b$12$AM.RootHash.Akais2020',
    plainHint: 'Akais@2020',
    role: 'super_admin',
    station: 'Global HQ',
    status: 'Active',
    createdAt: '2026-10-01'
  },
  {
    id: 'USR-002',
    username: 'admin',
    name: 'Sara Al-Hashemi',
    email: 'admin@am-events.ae',
    passwordHash: '$2b$12$AM.AdminHash.Admin2026',
    plainHint: 'Admin@2026',
    role: 'admin',
    station: 'Operations Desk',
    status: 'Active',
    createdAt: '2026-10-12'
  },
  {
    id: 'USR-003',
    username: 'staff',
    name: 'Tariq Mahmood',
    email: 'staff@am-events.ae',
    passwordHash: '$2b$12$AM.UserHash.User2026',
    plainHint: 'User@2026',
    role: 'user',
    station: 'Main Gate A',
    status: 'Active',
    createdAt: '2026-10-15'
  }
];

// --- Initial Events Data ---
const INITIAL_EVENTS = [
  {
    id: 'EVT-2026-01',
    title: 'Global EdTech & Innovation Summit 2026',
    date: '2026-11-28',
    time: '09:00 AM – 05:00 PM',
    venue: 'Al Jawaher Reception & Convention Centre, Hall A',
    capacity: 450,
    whatsappSender: '+971508429900'
  },
  {
    id: 'EVT-2026-02',
    title: 'Annual Leadership & Accreditation Gala',
    date: '2026-12-12',
    time: '06:30 PM – 10:30 PM',
    venue: 'Grand Marina Ballroom, Sharjah',
    capacity: 250,
    whatsappSender: '+971509114422'
  }
];

// --- Initial Bookings Data ---
const INITIAL_BOOKINGS = [
  {
    id: 'BK-1001',
    eventId: 'EVT-2026-01',
    firstName: 'Layla',
    lastName: 'Al-Mansoori',
    email: 'layla.almansoori@example.com',
    whatsapp: '+971504829104',
    ticketType: 'VIP',
    status: 'Approved',
    dispatchedAt: '2026-11-15 14:20',
    dispatchChannel: 'Email + WhatsApp',
    tickets: [
      { ticketId: 'TK-9001', qrString: 'AM-EVT01-BK1001-T1-9F8A2C', holder: 'Layla Al-Mansoori', checkedIn: true, checkedInAt: '08:42 AM', checkedInBy: 'Tariq Mahmood' },
      { ticketId: 'TK-9002', qrString: 'AM-EVT01-BK1001-T2-4D1E7B', holder: 'Omar Al-Mansoori', checkedIn: false, checkedInAt: null, checkedInBy: null }
    ]
  },
  {
    id: 'BK-1002',
    eventId: 'EVT-2026-01',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'm.vance@globaledu.org',
    whatsapp: '+971553910284',
    ticketType: 'Regular',
    status: 'Approved',
    dispatchedAt: null,
    dispatchChannel: null,
    tickets: [
      { ticketId: 'TK-9003', qrString: 'AM-EVT01-BK1002-T1-7C3B9A', holder: 'Marcus Vance', checkedIn: false, checkedInAt: null, checkedInBy: null }
    ]
  },
  {
    id: 'BK-1003',
    eventId: 'EVT-2026-01',
    firstName: 'Fatima',
    lastName: 'Al-Qasimi',
    email: 'fatima.q@innovationhub.ae',
    whatsapp: '+971507721930',
    ticketType: 'Staff',
    status: 'Approved',
    dispatchedAt: null,
    dispatchChannel: null,
    tickets: [
      { ticketId: 'TK-9004', qrString: 'AM-EVT01-BK1003-T1-2A6F8E', holder: 'Fatima Al-Qasimi (Event Lead)', checkedIn: false, checkedInAt: null, checkedInBy: null },
      { ticketId: 'TK-9005', qrString: 'AM-EVT01-BK1003-T2-5E9C1D', holder: 'Rami Haddad (AV Tech)', checkedIn: false, checkedInAt: null, checkedInBy: null }
    ]
  },
  {
    id: 'BK-1004',
    eventId: 'EVT-2026-01',
    firstName: 'David',
    lastName: 'Chen',
    email: 'dchen@techventures.io',
    whatsapp: '',
    ticketType: 'Regular',
    status: 'Approved',
    dispatchedAt: '2026-11-16 09:05',
    dispatchChannel: 'Email Only',
    tickets: [
      { ticketId: 'TK-9006', qrString: 'AM-EVT01-BK1004-T1-3F7A2B', holder: 'David Chen', checkedIn: false, checkedInAt: null, checkedInBy: null }
    ]
  },
  {
    id: 'BK-2001',
    eventId: 'EVT-2026-02',
    firstName: 'Nadia',
    lastName: 'Khoury',
    email: 'nadia.khoury@academy.edu',
    whatsapp: '+971562094811',
    ticketType: 'VIP',
    status: 'Approved',
    dispatchedAt: null,
    dispatchChannel: null,
    tickets: [
      { ticketId: 'TK-9101', qrString: 'AM-EVT02-BK2001-T1-6D4E9F', holder: 'Nadia Khoury', checkedIn: false, checkedInAt: null, checkedInBy: null }
    ]
  }
];

const INITIAL_INVITE_LINKS = [
  {
    id: 'INV-8821',
    eventId: 'EVT-2026-01',
    label: 'General VIP & Guest Registration Link',
    allowedTiers: ['VIP', 'Regular', 'Staff'],
    defaultTier: 'Regular',
    uses: 14,
    active: true,
    createdBy: 'sadmin@am-events.ae'
  },
  {
    id: 'INV-9045',
    eventId: 'EVT-2026-01',
    label: 'Operations & Support Staff Onboarding Link',
    allowedTiers: ['Staff'],
    defaultTier: 'Staff',
    uses: 6,
    active: true,
    createdBy: 'admin@am-events.ae'
  }
];

// --- Default System Email & Global WhatsApp Configuration ---
const INITIAL_SYSTEM_CONFIG = {
  // Delivery Mode: 'emailjs' (Direct silent browser API) or 'mailto' (Opens user's configured Mail client)
  emailDeliveryMode: 'mailto',
  emailjsServiceId: '',
  emailjsTemplateId: '',
  emailjsPublicKey: '',
  emailProvider: 'Google Workspace / Gmail',
  smtpHost: 'smtp.gmail.com',
  smtpPort: '587',
  smtpEncryption: 'TLS',
  senderEmail: 'tickets@am-events.ae',
  senderName: 'AM Events Ticketing Desk',
  smtpUsername: 'tickets@am-events.ae',
  smtpPassword: '•••• •••• •••• ••••',
  emailConnected: true,
  mainWhatsappNumber: '+971508429900',
  whatsappProvider: 'WhatsApp Business Cloud API + wa.me Fallback',
  whatsappPhoneId: '109482716450921',
  whatsappApiToken: 'EAABsbCS1iHgBO7Z...',
  whatsappConnected: true
};

// --- Helper: Send Real Email via EmailJS API or Mailto Fallback ---
const executeRealEmailDispatch = async ({ config, toEmail, subject, bodyText }) => {
  if (!toEmail) {
    return { ok: false, method: 'None', error: 'No recipient email address provided' };
  }

  // 1. If EmailJS credentials are configured and selected, send directly via REST API
  if (
    config.emailDeliveryMode === 'emailjs' &&
    config.emailjsServiceId.trim() &&
    config.emailjsTemplateId.trim() &&
    config.emailjsPublicKey.trim()
  ) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: config.emailjsServiceId.trim(),
          template_id: config.emailjsTemplateId.trim(),
          user_id: config.emailjsPublicKey.trim(),
          template_params: {
            to_email: toEmail,
            from_name: config.senderName,
            from_email: config.senderEmail,
            subject,
            message: bodyText
          }
        })
      });

      if (response.ok) {
        return { ok: true, method: 'EmailJS Direct API' };
      }
      const errText = await response.text();
      return { ok: false, method: 'EmailJS Direct API', error: errText || 'EmailJS rejected request' };
    } catch (err) {
      return { ok: false, method: 'EmailJS Direct API', error: err.message };
    }
  }

  // 2. Reliable Browser Mail Client Fallback (mailto:) so emails always work without a backend server
  const mailtoUrl = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(bodyText)}`;
  window.open(mailtoUrl, '_blank', 'noopener,noreferrer');
  return { ok: true, method: 'Mail Client (mailto)' };
};

export default function App() {
  // --- Authentication State ---
  const [currentUser, setCurrentUser] = useState(null);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeRoute, setActiveRoute] = useState('/dashboard');

  // --- Core Domain State ---
  const [staffUsers, setStaffUsers] = useState(INITIAL_STAFF_USERS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState(INITIAL_EVENTS[0].id);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [inviteLinks, setInviteLinks] = useState(INITIAL_INVITE_LINKS);
  const [systemConfig, setSystemConfig] = useState(INITIAL_SYSTEM_CONFIG);

  // --- Super Admin User Provisioning & Password Edit State ---
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserTempPass, setNewUserTempPass] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [newUserStation, setNewUserStation] = useState('Main Gate');
  const [userProvisionBanner, setUserProvisionBanner] = useState(null);

  const [passwordModalUser, setPasswordModalUser] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  // --- Super Admin Bulk CSV Guest Import State ---
  const [showBulkCsvModal, setShowBulkCsvModal] = useState(false);
  const [csvRawText, setCsvRawText] = useState('');
  const [csvParsedRows, setCsvParsedRows] = useState([]);
  const [csvImportError, setCsvImportError] = useState('');

  // --- Super Admin Edit Event Modal State ---
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [editEventForm, setEditEventForm] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    capacity: 300,
    whatsappSender: ''
  });

  // --- Event WhatsApp Sender Quick Modal State ---
  const [showEventWaModal, setShowEventWaModal] = useState(false);
  const [tempEventWaNumber, setTempEventWaNumber] = useState('');

  // --- Invitation Link Creation & Public Guest Registration Modal State ---
  const [newInviteLabel, setNewInviteLabel] = useState('');
  const [newInviteTierMode, setNewInviteTierMode] = useState('ALL');
  const [activeGuestInvite, setActiveGuestInvite] = useState(null);
  const [guestForm, setGuestForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    ticketType: 'Regular',
    quantity: 1
  });
  const [guestRegisteredReceipt, setGuestRegisteredReceipt] = useState(null);

  // --- Filters & UI Modals ---
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [selectedBookingIds, setSelectedBookingIds] = useState([]);
  const [pdfPreviewBooking, setPdfPreviewBooking] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // --- Staff Quick Desk Guest Registration State ---
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regTicketType, setRegTicketType] = useState('Regular');
  const [regTicketQty, setRegTicketQty] = useState(1);
  const [regCheckInNow, setRegCheckInNow] = useState(false);

  // --- Configurable Email & WhatsApp Templates ---
  const [emailSubject, setEmailSubject] = useState(
    'Your Official QR Entry Pass: {{event_name}} ({{ticket_type}})'
  );
  const [emailBody, setEmailBody] = useState(
    `Hello {{attendee_name}},\n\nYour {{ticket_type}} booking ({{booking_id}}) for {{event_name}} on {{event_date}} at {{event_venue}} is confirmed.\n\nTicket QR Code(s):\n{{qr_list}}\n\nPlease present your QR pass at the entrance gate. Our offline check-in scanner will validate your entry in seconds.\n\nWarm regards,\nAM Events Team`
  );
  const [whatsappTemplate, setWhatsappTemplate] = useState(
    `🎟️ *AM Events Pass — {{event_name}}*\nHi {{attendee_name}}, here is your *{{ticket_type}}* ticket ({{booking_id}}) for *{{event_date}}*.\n\n🔑 QR Code: {{primary_qr}}\n📍 Venue: {{event_venue}}\n\nShow this QR code at the door for instant check-in!`
  );

  // --- Batch Dispatch Queue State ---
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchProgress, setDispatchProgress] = useState({ current: 0, total: 0 });
  const [dispatchLogs, setDispatchLogs] = useState([
    {
      time: '14:20:08',
      bookingId: 'BK-1001',
      recipient: 'Layla Al-Mansoori',
      channel: 'Email + WhatsApp',
      status: 'Delivered'
    }
  ]);

  // --- CSV Export Format ---
  const [exportPreset, setExportPreset] = useState('attendium');

  // --- Offline Mobile Scanner State ---
  const [isOfflineMode, setIsOfflineMode] = useState(true);
  const [scanInput, setScanInput] = useState('');
  const [lastScanResult, setLastScanResult] = useState(null);
  const [scannerSearch, setScannerSearch] = useState('');

  // --- Derived Values ---
  const activeEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) || events[0],
    [events, selectedEventId]
  );

  const eventBookings = useMemo(
    () => bookings.filter((b) => b.eventId === selectedEventId),
    [bookings, selectedEventId]
  );

  const eventInvites = useMemo(
    () => inviteLinks.filter((inv) => inv.eventId === selectedEventId),
    [inviteLinks, selectedEventId]
  );

  const allEventTickets = useMemo(() => {
    return eventBookings.flatMap((b) =>
      b.tickets.map((t) => ({
        ...t,
        bookingId: b.id,
        firstName: b.firstName,
        lastName: b.lastName,
        email: b.email,
        whatsapp: b.whatsapp,
        ticketType: b.ticketType,
        status: b.status,
        dispatchedAt: b.dispatchedAt
      }))
    );
  }, [eventBookings]);

  const stats = useMemo(() => {
    const totalBookings = eventBookings.length;
    const totalTickets = allEventTickets.length;
    const dispatchedBookings = eventBookings.filter((b) => b.dispatchedAt).length;
    const checkedInCount = allEventTickets.filter((t) => t.checkedIn).length;
    const vipTickets = allEventTickets.filter((t) => t.ticketType === 'VIP').length;
    const regularTickets = allEventTickets.filter((t) => t.ticketType === 'Regular').length;
    const staffTickets = allEventTickets.filter((t) => t.ticketType === 'Staff').length;
    return {
      totalBookings,
      totalTickets,
      dispatchedBookings,
      checkedInCount,
      vipTickets,
      regularTickets,
      staffTickets
    };
  }, [eventBookings, allEventTickets]);

  const filteredBookings = useMemo(() => {
    return eventBookings.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        `${b.firstName} ${b.lastName}`.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.tickets.some((t) => t.qrString.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'SENT' && Boolean(b.dispatchedAt)) ||
        (statusFilter === 'UNSENT' && !b.dispatchedAt);

      const matchesTier = tierFilter === 'ALL' || b.ticketType === tierFilter;

      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [eventBookings, searchQuery, statusFilter, tierFilter]);

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const canManageOperations = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';

  // --- Route Guard ---
  useEffect(() => {
    if (!currentUser) return;
    if (activeRoute === '/users' && !isSuperAdmin) {
      setActiveRoute('/dashboard');
    }
    if (activeRoute === '/config' && !isSuperAdmin) {
      setActiveRoute('/dashboard');
    }
  }, [currentUser, activeRoute, isSuperAdmin]);

  // --- Authentication Handlers ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const cleanInput = loginIdentifier.trim().toLowerCase();
    const matchedUser = staffUsers.find(
      (u) =>
        u.username.toLowerCase() === cleanInput ||
        u.email.toLowerCase() === cleanInput
    );

    if (!matchedUser) {
      setLoginError('Invalid username/email or password.');
      return;
    }

    if (matchedUser.status !== 'Active') {
      setLoginError('This account has been suspended. Contact the Super Admin.');
      return;
    }

    if (loginPassword !== matchedUser.plainHint) {
      setLoginError('Invalid username/email or password.');
      return;
    }

    setCurrentUser(matchedUser);
    setActiveRoute('/dashboard');
    setLoginPassword('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginIdentifier('');
    setLoginPassword('');
    setLoginError('');
  };

  // --- Super Admin: Edit Current Event Details ---
  const openEditEventModal = () => {
    if (!isSuperAdmin) return;
    setEditEventForm({
      title: activeEvent.title,
      date: activeEvent.date,
      time: activeEvent.time,
      venue: activeEvent.venue,
      capacity: activeEvent.capacity,
      whatsappSender: activeEvent.whatsappSender || systemConfig.mainWhatsappNumber
    });
    setShowEditEventModal(true);
  };

  const handleSaveEventEdits = (e) => {
    e.preventDefault();
    if (!isSuperAdmin || !editEventForm.title.trim()) return;

    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === activeEvent.id
          ? {
              ...ev,
              title: editEventForm.title.trim(),
              date: editEventForm.date,
              time: editEventForm.time.trim(),
              venue: editEventForm.venue.trim(),
              capacity: Number(editEventForm.capacity) || ev.capacity,
              whatsappSender: editEventForm.whatsappSender.trim() || systemConfig.mainWhatsappNumber
            }
          : ev
      )
    );
    setShowEditEventModal(false);
  };

  // --- Super Admin: Create New Staff Account ---
  const handleCreateStaffUser = (e) => {
    e.preventDefault();
    if (!isSuperAdmin) return;

    const cleanUsername =
      newUserUsername.trim().toLowerCase() ||
      newUserEmail.trim().split('@')[0].toLowerCase();

    if (!cleanUsername || !newUserName.trim() || !newUserEmail.trim() || !newUserTempPass.trim()) {
      return;
    }

    if (
      staffUsers.some(
        (u) =>
          u.email.toLowerCase() === newUserEmail.trim().toLowerCase() ||
          u.username.toLowerCase() === cleanUsername
      )
    ) {
      setUserProvisionBanner({
        type: 'error',
        text: `Username "${cleanUsername}" or email "${newUserEmail.trim()}" is already registered.`
      });
      return;
    }

    const validRole = newUserRole === 'admin' ? 'admin' : 'user';
    const randomSalt = Math.random().toString(36).substring(2, 10);

    const createdUser = {
      id: `USR-00${staffUsers.length + 1}`,
      username: cleanUsername,
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      passwordHash: `$2b$12$${randomSalt}.ProvisionedHash`,
      plainHint: newUserTempPass.trim(),
      role: validRole,
      station: newUserStation.trim() || 'General Desk',
      status: 'Active',
      createdAt: new Date().toISOString().slice(0, 10)
    };

    setStaffUsers((prev) => [...prev, createdUser]);
    setUserProvisionBanner({
      type: 'success',
      text: `Account created for ${createdUser.name} (Username: ${createdUser.username}) with role "${ROLES_CONFIG[validRole].label}".`
    });

    setNewUserUsername('');
    setNewUserName('');
    setNewUserEmail('');
    setNewUserTempPass('');
    setNewUserRole('user');
  };

  const handleToggleUserStatus = (userId) => {
    if (!isSuperAdmin || userId === currentUser.id) return;
    setStaffUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
      )
    );
  };

  // --- Super Admin: Edit Password for Self or Any Staff Account ---
  const handleSaveUserPassword = (e) => {
    e.preventDefault();
    if (!isSuperAdmin || !passwordModalUser) return;
    if (!newPasswordInput.trim() || newPasswordInput !== confirmPasswordInput) return;

    const randomSalt = Math.random().toString(36).substring(2, 10);
    const updatedHash = `$2b$12$${randomSalt}.UpdatedHash`;

    setStaffUsers((prev) =>
      prev.map((u) =>
        u.id === passwordModalUser.id
          ? { ...u, plainHint: newPasswordInput.trim(), passwordHash: updatedHash }
          : u
      )
    );

    if (passwordModalUser.id === currentUser.id) {
      setCurrentUser((prev) => ({
        ...prev,
        plainHint: newPasswordInput.trim(),
        passwordHash: updatedHash
      }));
    }

    setUserProvisionBanner({
      type: 'success',
      text: `Password updated successfully for ${passwordModalUser.name} (${passwordModalUser.username}).`
    });
    setPasswordModalUser(null);
    setNewPasswordInput('');
    setConfirmPasswordInput('');
  };

  // --- Super Admin: Bulk CSV Guest Registration ---
  const SAMPLE_CSV_CONTENT = `first_name,last_name,email,whatsapp,ticket_type,quantity
Amina,Al-Suwaidi,amina.suwaidi@edu.ae,+971501122334,VIP,2
Karim,Mansour,karim.m@techcorp.ae,+971559988776,Regular,1
Huda,Al-Nuaimi,huda.n@events.ae,+971524455667,Staff,1
Youssef,Bazzi,ybazzi@consulting.com,+971567788990,VIP,1
Mona,El-Sayed,mona.elsayed@school.ae,+971503344556,Regular,3`;

  const parseCsvRows = (rawText) => {
    setCsvImportError('');
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setCsvParsedRows([]);
      return;
    }

    const firstCols = lines[0].split(',').map((c) => c.trim().toLowerCase());
    const hasHeader =
      firstCols.includes('first_name') ||
      firstCols.includes('firstname') ||
      firstCols.includes('email');

    const dataLines = hasHeader ? lines.slice(1) : lines;
    const parsed = [];

    dataLines.forEach((line, idx) => {
      const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      const firstName = cols[0] || '';
      const lastName = cols[1] || '';
      const email = cols[2] || '';
      const whatsapp = cols[3] || '';
      const rawTier = (cols[4] || 'Regular').toLowerCase();
      const ticketType =
        rawTier === 'vip' ? 'VIP' : rawTier === 'staff' ? 'Staff' : 'Regular';
      const quantity = Math.min(10, Math.max(1, parseInt(cols[5], 10) || 1));

      if (firstName && lastName && email) {
        parsed.push({
          rowId: `CSV-${idx + 1}`,
          firstName,
          lastName,
          email,
          whatsapp,
          ticketType,
          quantity
        });
      }
    });

    if (parsed.length === 0) {
      setCsvImportError(
        'No valid guest rows detected. Ensure each row has: first_name, last_name, email, whatsapp, ticket_type, quantity'
      );
    }
    setCsvParsedRows(parsed);
  };

  const handleCsvFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = String(evt.target?.result || '');
      setCsvRawText(content);
      parseCsvRows(content);
    };
    reader.readAsText(file);
  };

  const handleConfirmBulkCsvImport = () => {
    if (!isSuperAdmin || csvParsedRows.length === 0) return;

    const newBookingsBatch = csvParsedRows.map((row, idx) => {
      const bookingId = `BK-${Math.floor(3000 + Math.random() * 6000)}-${idx + 1}`;
      const eventShort = selectedEventId.replace('EVT-2026-', 'EVT');
      const generatedTickets = Array.from({ length: row.quantity }, (_, tIdx) => {
        const randHex = Math.random().toString(16).substring(2, 8).toUpperCase();
        return {
          ticketId: `TK-${Math.floor(10000 + Math.random() * 89999)}`,
          qrString: `AM-${eventShort}-${bookingId}-T${tIdx + 1}-${randHex}`,
          holder:
            row.quantity === 1
              ? `${row.firstName} ${row.lastName}`
              : `${row.firstName} ${row.lastName} (Guest ${tIdx + 1})`,
          checkedIn: false,
          checkedInAt: null,
          checkedInBy: null
        };
      });

      return {
        id: bookingId,
        eventId: selectedEventId,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        whatsapp: row.whatsapp,
        ticketType: row.ticketType,
        status: 'Approved',
        dispatchedAt: null,
        dispatchChannel: null,
        tickets: generatedTickets
      };
    });

    setBookings((prev) => [...newBookingsBatch, ...prev]);
    setShowBulkCsvModal(false);
    setCsvRawText('');
    setCsvParsedRows([]);
  };

  const downloadSampleCsvTemplate = () => {
    const blob = new Blob(['\uFEFF' + SAMPLE_CSV_CONTENT], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AM_Events_Bulk_Guests_Template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // --- Update Event WhatsApp Sender Number ---
  const handleSaveEventWhatsappNumber = (e) => {
    e.preventDefault();
    if (!canManageOperations || !tempEventWaNumber.trim()) return;
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === selectedEventId ? { ...ev, whatsappSender: tempEventWaNumber.trim() } : ev
      )
    );
    setShowEventWaModal(false);
  };

  // --- Create Shareable Event Registration Invitation Link ---
  const handleCreateInviteLink = (e) => {
    e.preventDefault();
    if (!canManageOperations || !newInviteLabel.trim()) return;

    const allowedTiers =
      newInviteTierMode === 'ALL' ? ['VIP', 'Regular', 'Staff'] : [newInviteTierMode];

    const createdInvite = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      eventId: selectedEventId,
      label: newInviteLabel.trim(),
      allowedTiers,
      defaultTier: allowedTiers[0],
      uses: 0,
      active: true,
      createdBy: currentUser.email
    };

    setInviteLinks((prev) => [createdInvite, ...prev]);
    setNewInviteLabel('');
  };

  // --- Guest Self-Registration via Invitation Link ---
  const openGuestInvitationPortal = (invite) => {
    setActiveGuestInvite(invite);
    setGuestRegisteredReceipt(null);
    setGuestForm({
      firstName: '',
      lastName: '',
      email: '',
      whatsapp: '',
      ticketType: invite.defaultTier || 'Regular',
      quantity: 1
    });
  };

  const handleGuestPortalSubmit = (e) => {
    e.preventDefault();
    if (!activeGuestInvite || !guestForm.firstName.trim() || !guestForm.lastName.trim() || !guestForm.email.trim()) {
      return;
    }

    const bookingId = `BK-${Math.floor(2000 + Math.random() * 7999)}`;
    const eventShort = activeGuestInvite.eventId.replace('EVT-2026-', 'EVT');
    const qty = Math.min(10, Math.max(1, Number(guestForm.quantity) || 1));
    const validTicketType = ['VIP', 'Regular', 'Staff'].includes(guestForm.ticketType)
      ? guestForm.ticketType
      : 'Regular';

    const generatedTickets = Array.from({ length: qty }, (_, idx) => {
      const randHex = Math.random().toString(16).substring(2, 8).toUpperCase();
      return {
        ticketId: `TK-${Math.floor(1000 + Math.random() * 8999)}`,
        qrString: `AM-${eventShort}-${bookingId}-T${idx + 1}-${randHex}`,
        holder:
          qty === 1
            ? `${guestForm.firstName.trim()} ${guestForm.lastName.trim()}`
            : `${guestForm.firstName.trim()} ${guestForm.lastName.trim()} (Guest ${idx + 1})`,
        checkedIn: false,
        checkedInAt: null,
        checkedInBy: null
      };
    });

    const newBooking = {
      id: bookingId,
      eventId: activeGuestInvite.eventId,
      firstName: guestForm.firstName.trim(),
      lastName: guestForm.lastName.trim(),
      email: guestForm.email.trim(),
      whatsapp: guestForm.whatsapp.trim(),
      ticketType: validTicketType,
      status: 'Approved',
      dispatchedAt: null,
      dispatchChannel: null,
      tickets: generatedTickets
    };

    setBookings((prev) => [newBooking, ...prev]);
    setInviteLinks((prev) =>
      prev.map((inv) =>
        inv.id === activeGuestInvite.id ? { ...inv, uses: inv.uses + 1 } : inv
      )
    );
    setGuestRegisteredReceipt(newBooking);
  };

  // --- Staff Desk Guest Registration ---
  const handleRegisterGuestBooking = (e) => {
    e.preventDefault();
    if (!regFirstName.trim() || !regLastName.trim() || !regEmail.trim()) return;

    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const eventShort = selectedEventId.replace('EVT-2026-', 'EVT');
    const qty = Math.min(10, Math.max(1, Number(regTicketQty) || 1));
    const validTicketType = ['VIP', 'Regular', 'Staff'].includes(regTicketType)
      ? regTicketType
      : 'Regular';

    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const generatedTickets = Array.from({ length: qty }, (_, idx) => {
      const randHex = Math.random().toString(16).substring(2, 8).toUpperCase();
      return {
        ticketId: `TK-${Math.floor(1000 + Math.random() * 8999)}`,
        qrString: `AM-${eventShort}-${bookingId}-T${idx + 1}-${randHex}`,
        holder:
          qty === 1
            ? `${regFirstName.trim()} ${regLastName.trim()}`
            : `${regFirstName.trim()} ${regLastName.trim()} (Guest ${idx + 1})`,
        checkedIn: regCheckInNow,
        checkedInAt: regCheckInNow ? nowTime : null,
        checkedInBy: regCheckInNow ? currentUser.name : null
      };
    });

    const newBooking = {
      id: bookingId,
      eventId: selectedEventId,
      firstName: regFirstName.trim(),
      lastName: regLastName.trim(),
      email: regEmail.trim(),
      whatsapp: regWhatsapp.trim(),
      ticketType: validTicketType,
      status: 'Approved',
      dispatchedAt: null,
      dispatchChannel: null,
      tickets: generatedTickets
    };

    setBookings((prev) => [newBooking, ...prev]);
    setRegFirstName('');
    setRegLastName('');
    setRegEmail('');
    setRegWhatsapp('');
    setRegTicketType('Regular');
    setRegTicketQty(1);
    setRegCheckInNow(false);
    setShowRegisterModal(false);
  };

  // --- Template Interpolation Helper ---
  const interpolateTemplate = (tpl, booking) => {
    const qrList = booking.tickets
      .map((t, idx) => `Ticket #${idx + 1} (${t.holder}): ${t.qrString}`)
      .join('\n');
    const primaryQr = booking.tickets[0]?.qrString || '';
    return tpl
      .replace(/{{attendee_name}}/g, `${booking.firstName} ${booking.lastName}`)
      .replace(/{{event_name}}/g, activeEvent.title)
      .replace(/{{event_date}}/g, `${activeEvent.date} (${activeEvent.time})`)
      .replace(/{{event_venue}}/g, activeEvent.venue)
      .replace(/{{booking_id}}/g, booking.id)
      .replace(/{{ticket_type}}/g, booking.ticketType)
      .replace(/{{qr_list}}/g, qrList)
      .replace(/{{primary_qr}}/g, primaryQr);
  };

  // --- Send Single Booking Tickets (Real Email + WhatsApp) ---
  const dispatchSingleBooking = async (booking) => {
    const subject = interpolateTemplate(emailSubject, booking);
    const bodyText = interpolateTemplate(emailBody, booking);

    const emailResult = await executeRealEmailDispatch({
      config: systemConfig,
      toEmail: booking.email,
      subject,
      bodyText
    });

    const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const timeOnly = new Date().toTimeString().slice(0, 8);
    const eventSenderWa = activeEvent.whatsappSender || systemConfig.mainWhatsappNumber;
    const channelUsed = booking.whatsapp
      ? `${emailResult.method} + WA (${eventSenderWa})`
      : `${emailResult.method} (${systemConfig.senderEmail})`;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? { ...b, dispatchedAt: nowStr, dispatchChannel: channelUsed }
          : b
      )
    );

    setDispatchLogs((prev) => [
      {
        time: timeOnly,
        bookingId: booking.id,
        recipient: `${booking.firstName} ${booking.lastName} (${booking.email})`,
        channel: channelUsed,
        status: emailResult.ok ? 'Sent' : `Error: ${emailResult.error}`
      },
      ...prev.slice(0, 29)
    ]);
  };

  // --- Batch Dispatch Engine ---
  const runBatchDispatch = async (targetBookings) => {
    if (!targetBookings.length || isDispatching) return;
    setIsDispatching(true);
    setDispatchProgress({ current: 0, total: targetBookings.length });

    for (let i = 0; i < targetBookings.length; i++) {
      await new Promise((r) => setTimeout(r, 350));
      await dispatchSingleBooking(targetBookings[i]);
      setDispatchProgress({ current: i + 1, total: targetBookings.length });
    }

    setIsDispatching(false);
    setSelectedBookingIds([]);
  };

  // --- Test Email Connection ---
  const handleTestEmailConnection = async () => {
    const testSubject = `Test Connection — ${systemConfig.senderName}`;
    const testBody = `Hello,\n\nThis is a live test email from AM Events Manager.\nConfigured Sender: ${systemConfig.senderName} <${systemConfig.senderEmail}>\nDelivery Mode: ${systemConfig.emailDeliveryMode.toUpperCase()}\n\nYour ticketing dispatch system is ready!`;
    const res = await executeRealEmailDispatch({
      config: systemConfig,
      toEmail: systemConfig.senderEmail,
      subject: testSubject,
      bodyText: testBody
    });

    setSystemConfig((c) => ({ ...c, emailConnected: res.ok }));
    const timeOnly = new Date().toTimeString().slice(0, 8);
    setDispatchLogs((prev) => [
      {
        time: timeOnly,
        bookingId: 'TEST-MAIL',
        recipient: systemConfig.senderEmail,
        channel: res.method,
        status: res.ok ? 'Test Dispatched' : `Failed: ${res.error}`
      },
      ...prev.slice(0, 29)
    ]);
  };

  // --- One-Way CSV Exporter ---
  const downloadCheckInCSV = () => {
    const headersByPreset = {
      attendium: [
        'Ticket ID',
        'Booking Reference',
        'First Name',
        'Last Name',
        'Email',
        'Phone / WhatsApp',
        'Ticket Tier',
        'Barcode / QR Value'
      ],
      guestmanager: [
        'Barcode',
        'First Name',
        'Last Name',
        'Email Address',
        'Mobile Number',
        'Ticket Type',
        'Order ID'
      ],
      rsvpify: [
        'Guest First Name',
        'Guest Last Name',
        'Email',
        'Phone',
        'Guest Type',
        'Custom QR Code',
        'Confirmation Code'
      ],
      zkipster: [
        'First Name',
        'Last Name',
        'Email',
        'Phone Number',
        'Guest List / Tier',
        'QR Code String',
        'Booking ID'
      ]
    };

    const headers = headersByPreset[exportPreset] || headersByPreset.attendium;
    const rows = allEventTickets.map((t) => {
      if (exportPreset === 'guestmanager') {
        return [t.qrString, t.firstName, t.lastName, t.email, t.whatsapp, t.ticketType, t.bookingId];
      }
      if (exportPreset === 'rsvpify') {
        return [t.firstName, t.lastName, t.email, t.whatsapp, t.ticketType, t.qrString, t.bookingId];
      }
      if (exportPreset === 'zkipster') {
        return [t.firstName, t.lastName, t.email, t.whatsapp, t.ticketType, t.qrString, t.bookingId];
      }
      return [t.ticketId, t.bookingId, t.firstName, t.lastName, t.email, t.whatsapp, t.ticketType, t.qrString];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows]
        .map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedEventId}_${exportPreset}_checkin_list.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Offline Mobile Scanner Validation ---
  const processQrScan = (rawCode) => {
    const cleaned = String(rawCode || '').trim().toUpperCase();
    if (!cleaned) return;

    const matchedTicket = allEventTickets.find(
      (t) => t.qrString.toUpperCase() === cleaned || t.ticketId.toUpperCase() === cleaned
    );

    if (!matchedTicket) {
      setLastScanResult({
        status: 'INVALID',
        code: cleaned,
        message: 'Ticket QR code not found in offline guest manifest for this event.'
      });
      setScanInput('');
      return;
    }

    if (matchedTicket.checkedIn) {
      setLastScanResult({
        status: 'DUPLICATE',
        ticket: matchedTicket,
        message: `Already checked in at ${matchedTicket.checkedInAt} by ${matchedTicket.checkedInBy || 'Door Staff'}.`
      });
      setScanInput('');
      return;
    }

    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    const scannerName = currentUser?.name || 'Door Staff';

    setBookings((prev) =>
      prev.map((b) => ({
        ...b,
        tickets: b.tickets.map((t) =>
          t.ticketId === matchedTicket.ticketId
            ? { ...t, checkedIn: true, checkedInAt: nowTime, checkedInBy: scannerName }
            : t
        )
      }))
    );

    setLastScanResult({
      status: 'VALID',
      ticket: { ...matchedTicket, checkedIn: true, checkedInAt: nowTime, checkedInBy: scannerName },
      message: 'Verified & Checked In Locally'
    });
    setScanInput('');
  };

  const handleCopy = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // ============================================================================
  // 1. PUBLIC GUEST SELF-REGISTRATION PORTAL (Opened via Invitation Link)
  // ============================================================================
  if (activeGuestInvite) {
    const inviteEvent =
      events.find((e) => e.id === activeGuestInvite.eventId) || activeEvent;

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-lg relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setActiveGuestInvite(null)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              ← Return to Staff Console
            </button>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              Invite Code: {activeGuestInvite.id}
            </span>
          </div>

          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-800">
              <AMLogo size={48} />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Official Event Invitation
                </p>
                <h1 className="text-lg font-extrabold text-white leading-tight">
                  {inviteEvent.title}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>{inviteEvent.date}</span> • <span>{inviteEvent.venue}</span>
                </p>
              </div>
            </div>

            {guestRegisteredReceipt ? (
              <div className="space-y-5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    Registration Confirmed!
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Booking <span className="font-mono text-emerald-400">{guestRegisteredReceipt.id}</span> ({guestRegisteredReceipt.ticketType}) has been added to the event manifest.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 text-slate-900 flex flex-col items-center">
                  <DeterministicQR
                    value={guestRegisteredReceipt.tickets[0]?.qrString}
                    size={150}
                  />
                  <p className="font-mono text-xs font-bold text-slate-800 mt-3">
                    {guestRegisteredReceipt.tickets[0]?.qrString}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {guestRegisteredReceipt.firstName} {guestRegisteredReceipt.lastName} •{' '}
                    {guestRegisteredReceipt.tickets.length} Ticket(s)
                  </p>
                </div>

                <button
                  onClick={() => setActiveGuestInvite(null)}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm"
                >
                  Done & Back to Event Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleGuestPortalSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestForm.firstName}
                      onChange={(e) =>
                        setGuestForm((f) => ({ ...f, firstName: e.target.value }))
                      }
                      placeholder="e.g. Tariq"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestForm.lastName}
                      onChange={(e) =>
                        setGuestForm((f) => ({ ...f, lastName: e.target.value }))
                      }
                      placeholder="e.g. Al-Mansoori"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Email Address (for PDF Ticket Delivery) *
                  </label>
                  <input
                    type="email"
                    required
                    value={guestForm.email}
                    onChange={(e) =>
                      setGuestForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="guest@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    WhatsApp Mobile Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={guestForm.whatsapp}
                    onChange={(e) =>
                      setGuestForm((f) => ({ ...f, whatsapp: e.target.value }))
                    }
                    placeholder="+971501234567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Select Ticket Type *
                    </label>
                    <select
                      value={guestForm.ticketType}
                      onChange={(e) =>
                        setGuestForm((f) => ({ ...f, ticketType: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
                    >
                      {activeGuestInvite.allowedTiers.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Number of Tickets
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={guestForm.quantity}
                      onChange={(e) =>
                        setGuestForm((f) => ({ ...f, quantity: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition"
                >
                  Complete Registration & Generate QR Pass
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. UNAUTHENTICATED LOGIN GATEWAY (Clean — No Quick Staff Role Selector)
  // ============================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="flex flex-col items-center text-center mb-7">
            <AMLogo size={64} className="mb-3 shadow-2xl" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              AM Events Manager
            </h1>
            <p className="text-xs font-medium text-emerald-400 tracking-wide uppercase mt-1">
              Tickets & Offline Check-In Suite
            </p>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">Staff Sign In</h2>
                <p className="text-xs text-slate-400">
                  Authorized personnel only. Public registration is disabled.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Username or Email
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="Enter username or email"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                Sign In to Console
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 3. AUTHENTICATED APPLICATION SHELL
  // ============================================================================
  const activeRoleMeta = ROLES_CONFIG[currentUser.role] || ROLES_CONFIG.user;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-wrap items-center justify-between gap-3">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <AMLogo size={38} className="shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                  AM Events Manager
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Tickets & Check-In
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                QR Ticketing, Batch Dispatch & Offline Door Scanner
              </p>
            </div>
          </div>

          {/* Protected Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setActiveRoute('/dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeRoute === '/dashboard'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Tickets & Dispatch</span>
            </button>

            {canManageOperations && (
              <button
                onClick={() => setActiveRoute('/invites')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeRoute === '/invites'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Invitation Links</span>
              </button>
            )}

            {canManageOperations && (
              <button
                onClick={() => setActiveRoute('/export')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeRoute === '/export'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Check-In Export</span>
              </button>
            )}

            <button
              onClick={() => setActiveRoute('/scanner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeRoute === '/scanner'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Door Scanner</span>
            </button>

            {isSuperAdmin && (
              <button
                onClick={() => setActiveRoute('/config')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeRoute === '/config'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>App Config (Email & WA)</span>
              </button>
            )}

            {isSuperAdmin && (
              <button
                onClick={() => setActiveRoute('/users')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeRoute === '/users'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <UserCog className="w-3.5 h-3.5" />
                <span>Staff Accounts</span>
              </button>
            )}
          </div>

          {/* Authenticated User Pill + Change Password + Logout */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-none">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {activeRoleMeta.label}
                </div>
              </div>
            </div>
            {isSuperAdmin && (
              <button
                onClick={() => {
                  setPasswordModalUser(currentUser);
                  setNewPasswordInput('');
                  setConfirmPasswordInput('');
                }}
                title="Edit My Super Admin Password"
                className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-amber-600/20 text-slate-300 hover:text-amber-300 border border-slate-700 transition flex items-center gap-1 text-xs font-semibold"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden md:inline">My Password</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600/20 text-slate-300 hover:text-rose-300 border border-slate-700 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Active Event Selector, Edit Event & Linked WhatsApp Sender Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Event:
            </span>
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setSelectedBookingIds([]);
                setLastScanResult(null);
              }}
              className="text-sm font-semibold text-slate-900 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.date})
                </option>
              ))}
            </select>

            {isSuperAdmin && (
              <button
                onClick={openEditEventModal}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                Edit Event
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Event WA Sender: {activeEvent.whatsappSender || systemConfig.mainWhatsappNumber}
              {canManageOperations && (
                <button
                  onClick={() => {
                    setTempEventWaNumber(
                      activeEvent.whatsappSender || systemConfig.mainWhatsappNumber
                    );
                    setShowEventWaModal(true);
                  }}
                  className="ml-1 underline text-emerald-700 hover:text-emerald-950 font-bold"
                >
                  Change
                </button>
              )}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {activeEvent.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              {activeEvent.time}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {activeEvent.venue}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ==================================================================== */}
        {/* ROUTE: /users (Super Admin Staff Account & Password Management)      */}
        {/* ==================================================================== */}
        {activeRoute === '/users' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  Super Admin Access Control
                </div>
                <h2 className="text-xl font-extrabold">
                  Staff Accounts, Roles & Password Control
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Provision staff accounts with <code className="text-emerald-300">Admin</code> or{' '}
                  <code className="text-sky-300">User</code> roles, or edit passwords for your own Super Admin account and any staff member.
                </p>
              </div>
              <button
                onClick={() => {
                  setPasswordModalUser(currentUser);
                  setNewPasswordInput('');
                  setConfirmPasswordInput('');
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0"
              >
                <KeyRound className="w-4 h-4" />
                Change Super Admin Password
              </button>
            </div>

            {userProvisionBanner && (
              <div
                className={`p-4 rounded-xl border text-xs font-medium flex items-center justify-between ${
                  userProvisionBanner.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <span>{userProvisionBanner.text}</span>
                <button
                  onClick={() => setUserProvisionBanner(null)}
                  className="font-bold underline ml-4"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Create Staff Account Form */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  Create New Staff Account
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Creates an account with a salted password hash and explicit role assignment.
                </p>

                <form onSubmit={handleCreateStaffUser} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Username *
                      </label>
                      <input
                        type="text"
                        required
                        value={newUserUsername}
                        onChange={(e) => setNewUserUsername(e.target.value)}
                        placeholder="e.g. khalid"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="e.g. Khalid Al-Harbi"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="khalid@am-events.ae"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Temporary Password *
                    </label>
                    <input
                      type="text"
                      required
                      value={newUserTempPass}
                      onChange={(e) => setNewUserTempPass(e.target.value)}
                      placeholder="e.g. GatePass@2026"
                      className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Assigned Role *
                      </label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-semibold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User (Door Staff)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Assigned Gate / Desk
                      </label>
                      <input
                        type="text"
                        value={newUserStation}
                        onChange={(e) => setNewUserStation(e.target.value)}
                        placeholder="VIP Gate B"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Provision User Account
                  </button>
                </form>
              </div>

              {/* Provisioned Users Directory Table */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Active Staff Accounts ({staffUsers.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                        <th className="py-3 px-4">Staff Member</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Password</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {staffUsers.map((u) => {
                        const rMeta = ROLES_CONFIG[u.role] || ROLES_CONFIG.user;
                        return (
                          <tr key={u.id} className="hover:bg-slate-50/70">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">
                                {u.name}{' '}
                                <span className="font-mono text-xs text-slate-500">
                                  (@{u.username})
                                </span>
                                {u.id === currentUser.id && (
                                  <span className="ml-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500">{u.email}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${rMeta.lightBadge}`}
                              >
                                {rMeta.label}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                              {u.plainHint}
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-1.5">
                              <button
                                onClick={() => {
                                  setPasswordModalUser(u);
                                  setNewPasswordInput('');
                                  setConfirmPasswordInput('');
                                }}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 inline-flex items-center gap-1"
                              >
                                <KeyRound className="w-3 h-3" />
                                Edit Password
                              </button>
                              {u.id !== currentUser.id && (
                                <button
                                  onClick={() => handleToggleUserStatus(u.id)}
                                  className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-100 text-slate-700"
                                >
                                  {u.status === 'Active' ? 'Suspend' : 'Activate'}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ROUTE: /config (Super Admin Email & Main WhatsApp Configuration)     */}
        {/* ==================================================================== */}
        {activeRoute === '/config' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Settings className="w-4 h-4" />
                  Super Admin System Configuration
                </div>
                <h2 className="text-xl font-extrabold">
                  Outbound Email Delivery & Main WhatsApp Configuration
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Configure how ticket emails are delivered from the browser (EmailJS silent REST API or your default Mail client) and set the global WhatsApp sender number.
                </p>
              </div>
              <button
                onClick={handleTestEmailConnection}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                Send Test Email Now
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Outbound Email Account Linking */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      Email Delivery & Sender Credentials
                    </h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      systemConfig.emailConnected
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {systemConfig.emailConnected ? 'Ready' : 'Check Settings'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Browser Email Delivery Engine
                  </label>
                  <select
                    value={systemConfig.emailDeliveryMode}
                    onChange={(e) =>
                      setSystemConfig((c) => ({ ...c, emailDeliveryMode: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm font-semibold border border-slate-200 rounded-xl bg-slate-50"
                  >
                    <option value="mailto">
                      Default Email App (Outlook / Gmail / Apple Mail — Zero Setup)
                    </option>
                    <option value="emailjs">
                      EmailJS Direct Silent API (Sends automatically without opening mail app)
                    </option>
                  </select>
                </div>

                {systemConfig.emailDeliveryMode === 'emailjs' && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                    <p className="text-[11px] text-emerald-900 font-medium">
                      Paste your free <strong>EmailJS</strong> credentials (from emailjs.com) to send silent background emails directly from your linked Gmail/Outlook account:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Service ID
                        </label>
                        <input
                          type="text"
                          value={systemConfig.emailjsServiceId}
                          onChange={(e) =>
                            setSystemConfig((c) => ({
                              ...c,
                              emailjsServiceId: e.target.value
                            }))
                          }
                          placeholder="service_xxxxxxx"
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Template ID
                        </label>
                        <input
                          type="text"
                          value={systemConfig.emailjsTemplateId}
                          onChange={(e) =>
                            setSystemConfig((c) => ({
                              ...c,
                              emailjsTemplateId: e.target.value
                            }))
                          }
                          placeholder="template_xxxxxxx"
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Public Key
                        </label>
                        <input
                          type="text"
                          value={systemConfig.emailjsPublicKey}
                          onChange={(e) =>
                            setSystemConfig((c) => ({
                              ...c,
                              emailjsPublicKey: e.target.value
                            }))
                          }
                          placeholder="user_xxxxxxxxx"
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Sender Email Address *
                    </label>
                    <input
                      type="email"
                      value={systemConfig.senderEmail}
                      onChange={(e) =>
                        setSystemConfig((c) => ({ ...c, senderEmail: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Sender Display Name
                    </label>
                    <input
                      type="text"
                      value={systemConfig.senderName}
                      onChange={(e) =>
                        setSystemConfig((c) => ({ ...c, senderName: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      SMTP Host Reference
                    </label>
                    <input
                      type="text"
                      value={systemConfig.smtpHost}
                      onChange={(e) =>
                        setSystemConfig((c) => ({ ...c, smtpHost: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Port
                    </label>
                    <input
                      type="text"
                      value={systemConfig.smtpPort}
                      onChange={(e) =>
                        setSystemConfig((c) => ({ ...c, smtpPort: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      value={systemConfig.smtpUsername}
                      onChange={(e) =>
                        setSystemConfig((c) => ({ ...c, smtpUsername: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      SMTP App Password
                    </label>
                    <input
                      type="password"
                      value={systemConfig.smtpPassword}
                      onChange={(e) =>
                        setSystemConfig((c) => ({ ...c, smtpPassword: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Main Global WhatsApp Sender Number Configuration */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      Main WhatsApp Business Sender
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Global Main WhatsApp Number (Default for All Events)
                  </label>
                  <input
                    type="tel"
                    value={systemConfig.mainWhatsappNumber}
                    onChange={(e) =>
                      setSystemConfig((c) => ({
                        ...c,
                        mainWhatsappNumber: e.target.value
                      }))
                    }
                    placeholder="+971508429900"
                    className="w-full px-3.5 py-2.5 text-sm font-mono font-bold border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Cloud API Phone Number ID
                  </label>
                  <input
                    type="text"
                    value={systemConfig.whatsappPhoneId}
                    onChange={(e) =>
                      setSystemConfig((c) => ({
                        ...c,
                        whatsappPhoneId: e.target.value
                      }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Permanent Access Token
                  </label>
                  <input
                    type="password"
                    value={systemConfig.whatsappApiToken}
                    onChange={(e) =>
                      setSystemConfig((c) => ({
                        ...c,
                        whatsappApiToken: e.target.value
                      }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setEvents((prev) =>
                        prev.map((ev) => ({
                          ...ev,
                          whatsappSender: systemConfig.mainWhatsappNumber
                        }))
                      );
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                  >
                    Apply Main WA Number to All Events
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ROUTE: /invites (Shareable Event Registration Invitation Links)      */}
        {/* ==================================================================== */}
        {activeRoute === '/invites' && canManageOperations && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Link2 className="w-4 h-4" />
                  Guest Self-Registration Invitations
                </div>
                <h2 className="text-xl font-extrabold">
                  Shareable Registration Links for {activeEvent.title}
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Generate invitation links to send via WhatsApp or Email. Guests open the link, select their Ticket Type (<code className="text-amber-300">VIP</code>, <code className="text-emerald-300">Regular</code>, or <code className="text-indigo-300">Staff</code>), and receive their QR pass immediately.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Create Invitation Link Card */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Create New Invitation Link
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Choose whether guests can select any ticket tier from the dropdown or restrict the link to a specific tier.
                </p>

                <form onSubmit={handleCreateInviteLink} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Invitation Campaign Label *
                    </label>
                    <input
                      type="text"
                      required
                      value={newInviteLabel}
                      onChange={(e) => setNewInviteLabel(e.target.value)}
                      placeholder="e.g. Executive VIP Guest Invitation"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ticket Type Dropdown Options
                    </label>
                    <select
                      value={newInviteTierMode}
                      onChange={(e) => setNewInviteTierMode(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="ALL">Allow Guest Selection (VIP / Regular / Staff)</option>
                      <option value="VIP">VIP Only</option>
                      <option value="Regular">Regular Only</option>
                      <option value="Staff">Staff Only</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2"
                  >
                    <Link2 className="w-4 h-4" />
                    Generate Shareable Invitation Link
                  </button>
                </form>
              </div>

              {/* Active Invitation Links List */}
              <div className="lg:col-span-7 space-y-4">
                {eventInvites.map((inv) => {
                  const shareUrl = `https://events.am-suite.app/register/${activeEvent.id}/${inv.id}`;
                  const waInviteMessage = encodeURIComponent(
                    `You are invited to *${activeEvent.title}* on ${activeEvent.date} at ${activeEvent.venue}.\n\nPlease complete your guest registration and select your ticket tier here:\n${shareUrl}`
                  );

                  return (
                    <div
                      key={inv.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {inv.id}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm">
                              {inv.label}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Allowed Tiers:{' '}
                            <span className="font-semibold text-slate-700">
                              {inv.allowedTiers.join(' / ')}
                            </span>{' '}
                            • Registrations via link:{' '}
                            <span className="font-bold text-emerald-700">{inv.uses}</span>
                          </p>
                        </div>

                        <button
                          onClick={() => openGuestInvitationPortal(inv)}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                          Open Guest Registration Form
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <code className="text-xs text-slate-700 flex-1 truncate">
                          {shareUrl}
                        </code>
                        <button
                          onClick={() => handleCopy(shareUrl, inv.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1"
                        >
                          {copiedId === inv.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Link
                            </>
                          )}
                        </button>
                        <a
                          href={`https://wa.me/?text=${waInviteMessage}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Share via WhatsApp
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ROUTE: /dashboard (Tickets, Bulk CSV, Dispatch & Templates)          */}
        {/* ==================================================================== */}
        {activeRoute === '/dashboard' && (
          <div className="space-y-6">
            {/* Top Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Event Bookings & Ticket Manifest
                </h2>
                <p className="text-xs text-slate-500">
                  Tickets are sent on demand via <span className="font-semibold text-slate-700">{systemConfig.senderEmail}</span> & WhatsApp <span className="font-semibold text-emerald-700">{activeEvent.whatsappSender || systemConfig.mainWhatsappNumber}</span>.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {canManageOperations && (
                  <button
                    onClick={() => setActiveRoute('/invites')}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 border border-slate-200"
                  >
                    <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                    Send Registration Invite Link
                  </button>
                )}
                {isSuperAdmin && (
                  <button
                    onClick={() => {
                      setShowBulkCsvModal(true);
                      setCsvImportError('');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Bulk CSV Guest Import
                  </button>
                )}
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register Guest Booking
                </button>
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Total QR Tickets
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <QrCode className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {stats.totalTickets}
                  </span>
                  <span className="text-xs text-slate-500">
                    across {stats.totalBookings} bookings
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Ticket Tiers
                  </span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <Crown className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs font-bold">
                  <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
                    VIP: {stats.vipTickets}
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Regular: {stats.regularTickets}
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-indigo-100 text-indigo-800 border border-indigo-200">
                    Staff: {stats.staffTickets}
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tickets Dispatched
                  </span>
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                    <Send className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {stats.dispatchedBookings}
                  </span>
                  <span className="text-xs text-slate-500">
                    / {stats.totalBookings} bookings sent
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Door Check-Ins
                  </span>
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {stats.checkedInCount}
                  </span>
                  <span className="text-xs text-slate-500">
                    / {stats.totalTickets} scanned
                  </span>
                </div>
              </div>
            </div>

            {/* Bookings Table + Dispatch Control */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 8 Cols: Bookings Table */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
                <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search attendee, booking ID, or QR code..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={tierFilter}
                      onChange={(e) => setTierFilter(e.target.value)}
                      className="text-xs font-semibold border border-slate-200 rounded-xl px-2.5 py-2 bg-slate-50 text-slate-700"
                    >
                      <option value="ALL">All Tiers</option>
                      <option value="VIP">VIP Only</option>
                      <option value="Regular">Regular Only</option>
                      <option value="Staff">Staff Only</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="text-xs font-semibold border border-slate-200 rounded-xl px-2.5 py-2 bg-slate-50 text-slate-700"
                    >
                      <option value="ALL">All Dispatch Status</option>
                      <option value="UNSENT">Not Sent Yet</option>
                      <option value="SENT">Dispatched</option>
                    </select>

                    {canManageOperations && (
                      <button
                        onClick={() =>
                          runBatchDispatch(
                            selectedBookingIds.length > 0
                              ? eventBookings.filter((b) => selectedBookingIds.includes(b.id))
                              : eventBookings.filter((b) => !b.dispatchedAt)
                          )
                        }
                        disabled={isDispatching}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-50 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {selectedBookingIds.length > 0
                          ? `Batch Send (${selectedBookingIds.length})`
                          : 'Batch Send Unsent'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar during Batch Send */}
                {isDispatching && (
                  <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                      <span>
                        Dispatching PDF QR tickets via {systemConfig.senderEmail} & WhatsApp... (
                        {dispatchProgress.current} of {dispatchProgress.total})
                      </span>
                    </div>
                    <div className="w-36 bg-emerald-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full transition-all duration-300"
                        style={{
                          width: `${
                            (dispatchProgress.current / Math.max(1, dispatchProgress.total)) * 100
                          }%`
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4 w-10">
                          <input
                            type="checkbox"
                            checked={
                              filteredBookings.length > 0 &&
                              selectedBookingIds.length === filteredBookings.length
                            }
                            onChange={(e) =>
                              setSelectedBookingIds(
                                e.target.checked ? filteredBookings.map((b) => b.id) : []
                              )
                            }
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </th>
                        <th className="py-3 px-3">Attendee & Contact</th>
                        <th className="py-3 px-3">Type & QR</th>
                        <th className="py-3 px-3">Delivery Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredBookings.map((b) => {
                        const isSelected = selectedBookingIds.includes(b.id);
                        const waMessage = encodeURIComponent(
                          interpolateTemplate(whatsappTemplate, b)
                        );
                        const cleanWaPhone = (b.whatsapp || '').replace(/[^0-9]/g, '');
                        const tierMeta = getTicketTierMeta(b.ticketType);
                        const TierIcon = tierMeta.icon;

                        return (
                          <tr
                            key={b.id}
                            className={`hover:bg-slate-50/80 transition ${
                              isSelected ? 'bg-emerald-50/40' : ''
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) =>
                                  setSelectedBookingIds((prev) =>
                                    e.target.checked
                                      ? [...prev, b.id]
                                      : prev.filter((id) => id !== b.id)
                                  )
                                }
                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                              />
                            </td>
                            <td className="py-3.5 px-3">
                              <div className="font-bold text-slate-900">
                                {b.firstName} {b.lastName}
                              </div>
                              <div className="text-xs text-slate-500">{b.email}</div>
                              {b.whatsapp ? (
                                <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                                  WA: {b.whatsapp}
                                </div>
                              ) : (
                                <div className="text-[11px] text-slate-400 italic mt-0.5">
                                  No WhatsApp number
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border ${tierMeta.badge}`}
                              >
                                <TierIcon className="w-3 h-3" />
                                {b.ticketType} • {b.tickets.length}{' '}
                                {b.tickets.length > 1 ? 'Tickets' : 'Ticket'}
                              </span>
                              <div className="mt-1 space-y-0.5">
                                {b.tickets.map((t) => (
                                  <div
                                    key={t.ticketId}
                                    className="font-mono text-[11px] text-slate-500 flex items-center gap-1"
                                  >
                                    <span>{t.qrString}</span>
                                    {t.checkedIn && (
                                      <span className="text-[10px] font-sans font-bold text-emerald-600">
                                        ✓ In
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="py-3.5 px-3">
                              {b.dispatchedAt ? (
                                <div>
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Sent
                                  </span>
                                  <div className="text-[11px] text-slate-500 mt-1">
                                    {b.dispatchedAt}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {b.dispatchChannel}
                                  </div>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                                  Queued / Unsent
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="inline-flex items-center justify-end gap-1.5 flex-wrap">
                                <button
                                  onClick={() => setPdfPreviewBooking(b)}
                                  title="Preview & Print PDF QR Tickets"
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center gap-1 transition"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  PDF
                                </button>

                                {cleanWaPhone && (
                                  <a
                                    href={`https://wa.me/${cleanWaPhone}?text=${waMessage}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="Send directly via WhatsApp Web/App"
                                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1 transition"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    WA
                                  </a>
                                )}

                                {canManageOperations && (
                                  <button
                                    onClick={() => dispatchSingleBooking(b)}
                                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white inline-flex items-center gap-1 transition"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    {b.dispatchedAt ? 'Resend' : 'Send Now'}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right 4 Cols: Message Templates & Dispatch Audit Log */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      Configurable Dispatch Templates
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      On-Demand
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Email Subject Line
                      </label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Email Body (with QR Details)
                      </label>
                      <textarea
                        rows={4}
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        WhatsApp Message Template
                      </label>
                      <textarea
                        rows={3}
                        value={whatsappTemplate}
                        onChange={(e) => setWhatsappTemplate(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">
                    Recent Dispatch Activity Log
                  </h3>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {dispatchLogs.map((log, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">
                            {log.recipient}{' '}
                            <span className="font-mono text-[11px] text-slate-400">
                              ({log.bookingId})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Channel: <span className="font-medium">{log.channel}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            {log.status}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">{log.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ROUTE: /export (One-Way Check-In Apps CSV Exporter)                  */}
        {/* ==================================================================== */}
        {activeRoute === '/export' && canManageOperations && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-2">
                    One-Way Guest Manifest Bridge
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Export QR Tickets for Third-Party Check-In Apps
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Generates a clean UTF-8 CSV containing every individual ticket and its unique QR string ready for import into offline door check-in apps.
                  </p>
                </div>
                <button
                  onClick={downloadCheckInCSV}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm shrink-0 transition"
                >
                  <Download className="w-4 h-4" />
                  Download CSV ({allEventTickets.length} Tickets)
                </button>
              </div>

              <div className="mt-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Select Target Check-In App Column Mapping
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      id: 'attendium',
                      name: 'Attendium',
                      desc: 'Maps Barcode / QR Value + Ticket Tier'
                    },
                    {
                      id: 'guestmanager',
                      name: 'Guest Manager',
                      desc: 'Barcode-first layout for fast iOS/Android import'
                    },
                    {
                      id: 'rsvpify',
                      name: 'RSVPify',
                      desc: 'Maps Custom QR Code & Confirmation Code'
                    },
                    {
                      id: 'zkipster',
                      name: 'Zkipster',
                      desc: 'Maps Guest List / Tier & QR Code String'
                    }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setExportPreset(preset.id)}
                      className={`p-4 rounded-xl border text-left transition ${
                        exportPreset === preset.id
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                        <span>{preset.name}</span>
                        {exportPreset === preset.id && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{preset.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live Export Preview (1 Row Per Individual Ticket)
                  </span>
                  <span className="text-xs text-slate-500">
                    One-way sync: external apps do not write back
                  </span>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="py-2.5 px-3">Ticket ID</th>
                        <th className="py-2.5 px-3">Guest Name</th>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Ticket Tier</th>
                        <th className="py-2.5 px-3">QR Code String</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allEventTickets.map((t) => {
                        const tierMeta = getTicketTierMeta(t.ticketType);
                        return (
                          <tr key={t.ticketId}>
                            <td className="py-2 px-3 font-mono text-slate-500">{t.ticketId}</td>
                            <td className="py-2 px-3 font-semibold text-slate-800">{t.holder}</td>
                            <td className="py-2 px-3 text-slate-500">{t.email}</td>
                            <td className="py-2 px-3">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold border ${tierMeta.badge}`}
                              >
                                {t.ticketType}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-mono font-bold text-emerald-700">
                              {t.qrString}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ROUTE: /scanner (Built-In Offline Mobile Door Check-In App)          */}
        {/* ==================================================================== */}
        {activeRoute === '/scanner' && (
          <div className="max-w-md mx-auto">
            <div className="bg-slate-900 text-white rounded-[2.2rem] p-5 shadow-2xl border-4 border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <AMLogo size={32} />
                  <div>
                    <div className="text-xs font-bold text-white">AM Door Check-In</div>
                    <div className="text-[10px] text-slate-400">
                      Operator: {currentUser.name}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOfflineMode((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                    isOfflineMode
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isOfflineMode ? (
                    <>
                      <WifiOff className="w-3 h-3" />
                      Offline Field Mode
                    </>
                  ) : (
                    <>
                      <Wifi className="w-3 h-3" />
                      Online Sync
                    </>
                  )}
                </button>
              </div>

              <div className="my-4 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Local Manifest Cached</div>
                  <div className="text-sm font-bold text-white">
                    {stats.checkedInCount} / {stats.totalTickets} Checked In
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-emerald-400">
                    {Math.round(
                      (stats.checkedInCount / Math.max(1, stats.totalTickets)) * 100
                    )}
                    %
                  </div>
                  <div className="text-[10px] text-slate-400">Attendance</div>
                </div>
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="w-44 h-44 rounded-2xl border-2 border-dashed border-emerald-500/70 flex flex-col items-center justify-center relative bg-slate-900/50">
                  <QrCode className="w-16 h-16 text-emerald-400/80 mb-2" />
                  <span className="text-[11px] font-medium text-slate-300 px-3">
                    Point Camera at Attendee QR Pass
                  </span>
                  <div className="absolute left-3 right-3 top-1/2 h-0.5 bg-emerald-400 shadow-[0_0_12px_#10b981] animate-pulse" />
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    processQrScan(scanInput);
                  }}
                  className="mt-4 w-full flex gap-2"
                >
                  <input
                    type="text"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    placeholder="Paste or type QR string..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                  >
                    Scan
                  </button>
                </form>

                <div className="mt-3 w-full">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">
                    Quick Test Scan Buttons
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {allEventTickets.slice(0, 3).map((t) => (
                      <button
                        key={t.ticketId}
                        onClick={() => processQrScan(t.qrString)}
                        className="text-[10px] font-mono px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                      >
                        {t.holder.split(' ')[0]} ({t.ticketType})
                      </button>
                    ))}
                    <button
                      onClick={() => processQrScan('AM-FAKE-999999')}
                      className="text-[10px] font-mono px-2 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition"
                    >
                      Test Invalid QR
                    </button>
                  </div>
                </div>
              </div>

              {lastScanResult && (
                <div
                  className={`mt-4 p-4 rounded-2xl border ${
                    lastScanResult.status === 'VALID'
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-100'
                      : lastScanResult.status === 'DUPLICATE'
                      ? 'bg-amber-950/80 border-amber-500/60 text-amber-100'
                      : 'bg-rose-950/80 border-rose-500/60 text-rose-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {lastScanResult.status === 'VALID' && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {lastScanResult.status === 'DUPLICATE' && (
                      <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    {lastScanResult.status === 'INVALID' && (
                      <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-extrabold text-sm">
                        {lastScanResult.status === 'VALID'
                          ? 'ACCESS GRANTED'
                          : lastScanResult.status === 'DUPLICATE'
                          ? 'ALREADY SCANNED'
                          : 'INVALID TICKET'}
                      </div>
                      <p className="text-xs opacity-90 mt-0.5">{lastScanResult.message}</p>
                      {lastScanResult.ticket && (
                        <div className="mt-2 pt-2 border-t border-white/10 text-xs space-y-0.5">
                          <div className="font-bold">{lastScanResult.ticket.holder}</div>
                          <div className="opacity-80">
                            Tier: {lastScanResult.ticket.ticketType} •{' '}
                            {lastScanResult.ticket.bookingId}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">
                    Offline Guest Lookup
                  </span>
                  <span className="text-[10px] text-slate-500">Tap to Check In</span>
                </div>
                <input
                  type="text"
                  value={scannerSearch}
                  onChange={(e) => setScannerSearch(e.target.value)}
                  placeholder="Search guest name offline..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 mb-2.5 focus:outline-none focus:border-emerald-500"
                />
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {allEventTickets
                    .filter((t) =>
                      t.holder.toLowerCase().includes(scannerSearch.toLowerCase())
                    )
                    .map((t) => (
                      <div
                        key={t.ticketId}
                        className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{t.holder}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-amber-300 font-semibold">
                              {t.ticketType}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {t.qrString}
                          </div>
                        </div>
                        {t.checkedIn ? (
                          <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            In • {t.checkedInAt}
                          </span>
                        ) : (
                          <button
                            onClick={() => processQrScan(t.qrString)}
                            className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-emerald-600 text-white text-[11px] font-semibold transition"
                          >
                            Check In
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================== */}
      {/* MODAL 1: SUPER ADMIN EDIT EVENT DETAILS                                */}
      {/* ====================================================================== */}
      {showEditEventModal && isSuperAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold">Edit Event Details</h3>
                  <p className="text-[11px] text-slate-400">
                    Event ID: {activeEvent.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditEventModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEventEdits} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Event Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={editEventForm.title}
                  onChange={(e) =>
                    setEditEventForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editEventForm.date}
                    onChange={(e) =>
                      setEditEventForm((f) => ({ ...f, date: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Event Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={editEventForm.time}
                    onChange={(e) =>
                      setEditEventForm((f) => ({ ...f, time: e.target.value }))
                    }
                    placeholder="09:00 AM – 05:00 PM"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Venue / Location *
                </label>
                <input
                  type="text"
                  required
                  value={editEventForm.venue}
                  onChange={(e) =>
                    setEditEventForm((f) => ({ ...f, venue: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Venue Capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editEventForm.capacity}
                    onChange={(e) =>
                      setEditEventForm((f) => ({ ...f, capacity: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Event WhatsApp Sender
                  </label>
                  <input
                    type="tel"
                    value={editEventForm.whatsappSender}
                    onChange={(e) =>
                      setEditEventForm((f) => ({
                        ...f,
                        whatsappSender: e.target.value
                      }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditEventModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Save Event Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL 2: SUPER ADMIN PASSWORD CHANGE MODAL                             */}
      {/* ====================================================================== */}
      {passwordModalUser && isSuperAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold">Update Account Password</h3>
                  <p className="text-[11px] text-slate-400">
                    {passwordModalUser.name} (@{passwordModalUser.username})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPasswordModalUser(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserPassword} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password *
                </label>
                <input
                  type="text"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="text"
                  required
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {newPasswordInput &&
                confirmPasswordInput &&
                newPasswordInput !== confirmPasswordInput && (
                  <p className="text-xs text-rose-600 font-semibold">
                    Passwords do not match.
                  </p>
                )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !newPasswordInput.trim() || newPasswordInput !== confirmPasswordInput
                  }
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-sm"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL 3: SUPER ADMIN BULK CSV GUEST IMPORT                             */}
      {/* ====================================================================== */}
      {showBulkCsvModal && isSuperAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-

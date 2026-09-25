import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "public" | "caseworker" | "staff";
type View = "home" | "donate" | "signin" | "cw-furniture" | "cw-requests" | "dashboard" | "offers" | "inventory" | "req-alloc";
type ReqAllocTab = "requests" | "allocations";
type InventoryStatus = "To assess" | "Available" | "Reserved" | "Allocated" | "Collected" | "Unavailable";
type OfferStatus = "Submitted" | "Under review" | "Accepted" | "Declined" | "Collection arranged";
type RequestStatus = "Submitted" | "Under review" | "Approved" | "Fulfilled" | "Closed";

interface DemoUser { role: Role; name: string; title: string; initials: string; email: string; }

interface OfferItem {
  type: string; description: string; condition: string;
  dimensions: string; safeToMove: boolean; concerns: string;
}

interface Offer {
  id: string; donor: string;
  contact: string; contactMethod: "email" | "phone";
  suburb: string; date: string; status: OfferStatus;
  canDropOff: boolean; availability: string; access: string;
  items: OfferItem[];
  reviewNotes: string; reviewer: string; reviewedAt: string;
  image: string;
}

interface Item {
  id: string; name: string; category: string; condition: string;
  status: InventoryStatus; location: string; image: string;
  dimensions: string; description: string; colour: string; material: string;
  concerns: string; sourceOfferId: string;
}

interface Request {
  id: string; client: string; caseworker: string; organisation: string;
  items: string; itemId?: string; itemName?: string;
  urgency: "Urgent" | "Standard"; status: RequestStatus;
  submitted: string; suburb?: string; priorityNotes?: string; constraints?: string; outcome?: string;
}

interface Allocation {
  id: string; client: string; item: string;
  itemId?: string; requestId?: string;
  caseworker: string; organisation: string;
  date: string; completed: boolean;
  confirmedBy: string; confirmedAt: string;
}

interface DonateFormItem {
  id: string; type: string; description: string; condition: string;
  width: string; depth: string; height: string; safeToMove: boolean; concerns: string;
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const demoUsers: DemoUser[] = [
  { role: "staff",      name: "Claire Morgan", title: "Operations coordinator",    initials: "CM", email: "claire@rehome.org.au" },
  { role: "caseworker", name: "Aisha Khan",    title: "Northside Family Services", initials: "AK", email: "aisha@northside.org.au" },
  { role: "caseworker", name: "Tom O'Brien",   title: "Bridge Housing Support",    initials: "TO", email: "tom@bridge.org.au" },
];

const photos = {
  sofa:     "https://images.unsplash.com/photo-1693578616322-c8abe6c7393d?auto=format&fit=crop&w=900&q=82",
  table:    "https://images.unsplash.com/photo-1785535573598-e51933f1fd20?auto=format&fit=crop&w=900&q=82",
  chair:    "https://images.unsplash.com/photo-1742560437319-21b7d3cadd22?auto=format&fit=crop&w=900&q=82",
  room:     "https://images.unsplash.com/photo-1679558879563-335ee6932106?auto=format&fit=crop&w=1200&q=82",
  hero:     "https://images.unsplash.com/photo-1772797583328-f83bc3f94f80?auto=format&fit=crop&w=960&q=82",
  dining:   "https://images.unsplash.com/photo-1772442363851-738a548f6c5c?auto=format&fit=crop&w=900&q=82",
  bookcase: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=82",
  drawers:  "https://images.unsplash.com/photo-1705719615955-41887e3a5750?auto=format&fit=crop&w=900&q=82",
  coffee:   "https://images.unsplash.com/photo-1688728147390-6925695b443f?auto=format&fit=crop&w=900&q=82",
  bed:      "https://images.unsplash.com/photo-1560184897-502a475f7a0d?auto=format&fit=crop&w=900&q=82",
};

const initialOffers: Offer[] = [
  {
    id: "OF-1048", donor: "Lina Patel",
    contact: "lina.patel@email.com", contactMethod: "email",
    suburb: "Preston", date: "Today, 9:42 am", status: "Submitted",
    canDropOff: false, availability: "Weekday mornings",
    access: "Ground floor apartment, no stairs",
    reviewNotes: "", reviewer: "", reviewedAt: "", image: photos.sofa,
    items: [
      { type: "Sofa / couch", description: "Three-seater in warm sand-coloured fabric. All cushions present.", condition: "Very good", dimensions: "W220 × D90 × H80 cm", safeToMove: true, concerns: "" }
    ]
  },
  {
    id: "OF-1047", donor: "Mark Ellison",
    contact: "04xx xxx xxx", contactMethod: "phone",
    suburb: "Coburg", date: "Yesterday", status: "Submitted",
    canDropOff: true, availability: "Weekend mornings preferred",
    access: "",
    reviewNotes: "", reviewer: "", reviewedAt: "", image: photos.table,
    items: [
      { type: "Dining table", description: "Solid oak with extension leaf (+45 cm).", condition: "Good", dimensions: "W180 × D90 × H75 cm", safeToMove: true, concerns: "Heavy — two people required" },
      { type: "Dining chairs (set)", description: "6 matching chairs with padded fabric seats.", condition: "Good", dimensions: "W45 × D50 × H90 cm", safeToMove: true, concerns: "" }
    ]
  },
  {
    id: "OF-1046", donor: "Sophie Nguyen",
    contact: "sophie.n@email.com", contactMethod: "email",
    suburb: "Thornbury", date: "12 Jun", status: "Under review",
    canDropOff: true, availability: "Any time — very flexible",
    access: "",
    reviewNotes: "Confirmed via email. Items appear in good condition from photos provided.",
    reviewer: "Claire Morgan", reviewedAt: "12 Jun, 2:30 pm", image: photos.drawers,
    items: [
      { type: "Chest of drawers", description: "Matching pair of white two-drawer bedside tables.", condition: "Good", dimensions: "W45 × D40 × H55 cm", safeToMove: true, concerns: "Small chip on rear corner of one unit" }
    ]
  },
  {
    id: "OF-1045", donor: "David Ford",
    contact: "d.ford@email.com", contactMethod: "email",
    suburb: "Brunswick", date: "11 Jun", status: "Accepted",
    canDropOff: false, availability: "After 5 pm weekdays",
    access: "Second floor — no lift. Items must be carried down.",
    reviewNotes: "Good quality timber bookcase. Collection confirmed for Fri 14 Jun.",
    reviewer: "Claire Morgan", reviewedAt: "11 Jun, 4:10 pm", image: photos.bookcase,
    items: [
      { type: "Bookcase", description: "Five-shelf pine bookcase with adjustable shelves.", condition: "Good", dimensions: "W90 × D30 × H180 cm", safeToMove: true, concerns: "Wall fixing required — not free-standing" }
    ]
  },
];

const initialItems: Item[] = [
  {
    id: "RH-0383", name: "Timber bookcase (5-shelf)", category: "Storage",
    condition: "Good", status: "To assess", location: "Intake", image: photos.bookcase,
    dimensions: "W90 × D30 × H180 cm", colour: "Light pine", material: "Timber",
    description: "Five-shelf pine bookcase with adjustable shelves. Received from donor D. Ford.",
    concerns: "Wall fixing required — do not leave free-standing", sourceOfferId: "OF-1045"
  },
  {
    id: "RH-0382", name: "Sand-coloured 3-seat sofa", category: "Lounge",
    condition: "Very good", status: "Available", location: "Bay A3", image: photos.sofa,
    dimensions: "W220 × D90 × H80 cm", colour: "Sand", material: "Fabric",
    description: "Three-seat sofa in warm sand-coloured fabric. Minor wear on one armrest. All cushions present.",
    concerns: "", sourceOfferId: ""
  },
  {
    id: "RH-0381", name: "Oak dining table with 6 chairs", category: "Dining",
    condition: "Good", status: "Allocated", location: "Bay C1", image: photos.table,
    dimensions: "W180 × D90 × H75 cm", colour: "Natural oak", material: "Timber",
    description: "Solid timber dining table with extension leaf (+45 cm). Six matching chairs with padded seats. Small scratch to one end.",
    concerns: "", sourceOfferId: ""
  },
  {
    id: "RH-0380", name: "Upholstered armchair", category: "Lounge",
    condition: "Good", status: "Available", location: "Bay A7", image: photos.chair,
    dimensions: "W85 × D80 × H90 cm", colour: "Charcoal", material: "Fabric",
    description: "Tub-style armchair in charcoal-grey woven fabric. Firm seating, no tears.",
    concerns: "", sourceOfferId: ""
  },
  {
    id: "RH-0379", name: "Upholstered armchair (olive)", category: "Lounge",
    condition: "Good", status: "Available", location: "Bay A6", image: photos.chair,
    dimensions: "W85 × D80 × H90 cm", colour: "Olive green", material: "Fabric",
    description: "Tub-style armchair in olive-green woven fabric. Firm seating, no tears or stains.",
    concerns: "", sourceOfferId: ""
  },
  {
    id: "RH-0378", name: "Low timber coffee table", category: "Living",
    condition: "Very good", status: "Collected", location: "Delivered", image: photos.coffee,
    dimensions: "W120 × D60 × H40 cm", colour: "Walnut", material: "Timber",
    description: "Low-profile coffee table with lower shelf storage. Minor surface marks on top.",
    concerns: "", sourceOfferId: ""
  },
  {
    id: "RH-0376", name: "White bedside drawers", category: "Bedroom",
    condition: "Good", status: "Available", location: "Bay B4", image: photos.drawers,
    dimensions: "W45 × D40 × H55 cm (each)", colour: "White", material: "MDF",
    description: "Pair of matching two-drawer bedside tables. Handles intact. One has a small chip on the rear corner.",
    concerns: "", sourceOfferId: ""
  },
  {
    id: "RH-0374", name: "Four-seat dining set", category: "Dining",
    condition: "Fair", status: "Available", location: "Bay C3", image: photos.table,
    dimensions: "W120 × D80 × H75 cm", colour: "Beige / timber", material: "Timber / fabric",
    description: "Round dining table with four upholstered chairs. Table has surface marks and light ring stains. Chairs are solid.",
    concerns: "", sourceOfferId: ""
  },
  {
    id: "RH-0373", name: "Timber bookcase", category: "Storage",
    condition: "Good", status: "Available", location: "Bay D2", image: photos.bookcase,
    dimensions: "W90 × D30 × H180 cm", colour: "Light timber", material: "Timber",
    description: "Five-shelf bookcase in light pine. Adjustable shelves. Minor scuffs on the base.",
    concerns: "", sourceOfferId: ""
  },
  {
    id: "RH-0371", name: "Upholstered double bed frame", category: "Bedroom",
    condition: "Very good", status: "Available", location: "Bay B1", image: photos.bed,
    dimensions: "W155 × D210 × H100 cm", colour: "Charcoal grey", material: "Fabric / timber",
    description: "Double bed frame with padded fabric headboard. Timber slat base included. No mattress.",
    concerns: "", sourceOfferId: ""
  },
];

const initialRequests: Request[] = [
  {
    id: "RQ-0291", client: "Client A. Mercer", caseworker: "Aisha Khan",
    organisation: "Northside Family Services",
    items: "3-seat sofa", itemId: "RH-0382", itemName: "Sand-coloured 3-seat sofa",
    urgency: "Urgent", status: "Submitted", submitted: "Today, 8:15 am",
    suburb: "Coburg",
    priorityNotes: "Client moving in this week. Priority for living room items.",
    constraints: "Ground floor access only. Can receive delivery weekdays."
  },
  {
    id: "RQ-0290", client: "Client J. Wilson", caseworker: "Tom O'Brien",
    organisation: "Bridge Housing Support",
    items: "3-seat sofa", itemId: "RH-0382", itemName: "Sand-coloured 3-seat sofa",
    urgency: "Standard", status: "Submitted", submitted: "Yesterday",
    suburb: "Brunswick", priorityNotes: "", constraints: "No stairs. Pickup preferred."
  },
  {
    id: "RQ-0289", client: "Client R. Singh", caseworker: "Maya Chen",
    organisation: "Safe Steps Community",
    items: "Dining table and chairs", itemId: "RH-0381", itemName: "Oak dining table with 6 chairs",
    urgency: "Standard", status: "Approved", submitted: "11 Jun",
    suburb: "Thornbury",
    outcome: "Oak dining table with 6 chairs (RH-0381) confirmed. Contact the ReHome team to arrange collection."
  },
  {
    id: "RQ-0288", client: "Client M. Torres", caseworker: "Sam Wright",
    organisation: "Community Housing Link",
    items: "Double bed frame", itemId: "RH-0371", itemName: "Upholstered double bed frame",
    urgency: "Urgent", status: "Submitted", submitted: "10 Jun",
    suburb: "Fitzroy",
    priorityNotes: "Family with young children — urgent need for bedroom furniture.",
    constraints: "Delivery only — no vehicle available."
  },
  {
    id: "RQ-0287", client: "Client B. Lee", caseworker: "Maya Chen",
    organisation: "Safe Steps Community",
    items: "Wardrobe",
    urgency: "Standard", status: "Closed", submitted: "8 Jun",
    suburb: "Collingwood",
    outcome: "Closed — no matching wardrobe available. Caseworker notified to resubmit when stock improves."
  },
  {
    id: "RQ-0286", client: "Client E. Jones", caseworker: "Sam Wright",
    organisation: "Community Housing Link",
    items: "Coffee table", itemId: "RH-0378", itemName: "Low timber coffee table",
    urgency: "Standard", status: "Fulfilled", submitted: "2 Jun",
    suburb: "Footscray",
    outcome: "Low timber coffee table (RH-0378) collected 10 Jun. Allocation complete."
  },
];

const initialAllocations: Allocation[] = [
  {
    id: "AL-0188", client: "Client R. Singh", item: "Oak dining table with 6 chairs",
    itemId: "RH-0381", requestId: "RQ-0289",
    caseworker: "Maya Chen", organisation: "Safe Steps Community",
    date: "13 Jun", completed: false, confirmedBy: "Claire Morgan", confirmedAt: "13 Jun, 10:15 am"
  },
  {
    id: "AL-0187", client: "Client E. Jones", item: "Low timber coffee table",
    itemId: "RH-0378", requestId: "RQ-0286",
    caseworker: "Sam Wright", organisation: "Community Housing Link",
    date: "10 Jun", completed: true, confirmedBy: "Claire Morgan", confirmedAt: "10 Jun, 3:40 pm"
  },
  {
    id: "AL-0182", client: "Client K. Brown", item: "Double bed frame",
    caseworker: "Aisha Khan", organisation: "Northside Family Services",
    date: "4 Jun", completed: true, confirmedBy: "Claire Morgan", confirmedAt: "4 Jun, 11:20 am"
  },
  {
    id: "AL-0179", client: "Client P. Tran", item: "Sand-coloured 2-seat sofa",
    caseworker: "Tom O'Brien", organisation: "Bridge Housing Support",
    date: "1 Jun", completed: true, confirmedBy: "Claire Morgan", confirmedAt: "1 Jun, 2:00 pm"
  },
];

// ─── Shared components ────────────────────────────────────────────────────────

function BrandMark({ size = 28, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 28 28"
      fill="none" stroke={color} strokeWidth="2.1"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Chair back — tall panel with gabled top */}
      <path d="M10 22V10L14 6L18 10V22" />
      {/* Left armrest */}
      <path d="M6 16H10" />
      {/* Right armrest */}
      <path d="M18 16H22" />
      {/* Left side down to seat */}
      <path d="M6 16V21" />
      {/* Right side down to seat */}
      <path d="M22 16V21" />
      {/* Seat */}
      <path d="M6 21H22" />
      {/* Legs */}
      <path d="M8 21V24.5M20 21V24.5" />
    </svg>
  );
}

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    grid:    <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    inbox:   <><path d="M4 4h16v15H4z" /><path d="M4 14h4l2 3h4l2-3h4" /></>,
    sofa:    <><path d="M5 12V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" /><path d="M4 11a2 2 0 0 0-2 2v5h20v-5a2 2 0 0 0-2-2" /><path d="M5 18v2M19 18v2" /></>,
    file:    <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></>,
    check:   <path d="m5 12 4 4L19 6" />,
    search:  <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell:    <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    plus:    <path d="M12 5v14M5 12h14" />,
    arrow:   <path d="m9 18 6-6-6-6" />,
    people:  <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2" /><path d="M16 4a3 3 0 0 1 0 6M18 13a5 5 0 0 1 3 5v2" /></>,
    menu:    <path d="M4 7h16M4 12h16M4 17h16" />,
    close:   <path d="m6 6 12 12M18 6 6 18" />,
    pin:     <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2" /></>,
    signout: <><path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>,
    list:    <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="3" cy="6" r="1" /><circle cx="3" cy="12" r="1" /><circle cx="3" cy="18" r="1" /></>,
    donate:  <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></>,
    user:    <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    image:   <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
    edit:    <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    warn:    <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    lock:    <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

type PillTone = "green" | "orange" | "red" | "blue" | "grey";

function Pill({ children, tone = "grey" }: { children: ReactNode; tone?: PillTone }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

// Shared thumbnail: a missing photo must not collapse the row or show a broken image.
function FurnitureThumb({ src }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(false);
  return <span className="furniture-thumb" aria-hidden="true">
    {src && !failed ? <img src={src} alt="" width="48" height="48" loading="lazy" onError={() => setFailed(true)} /> : <Icon name="sofa" size={22} />}
  </span>;
}

function Empty({ text }: { text: string }) {
  return (
    <div className="empty">
      <div className="empty-icon"><Icon name="check" /></div>
      <strong>Nothing here</strong>
      <span>{text}</span>
    </div>
  );
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const itemTone = (s: InventoryStatus): PillTone =>
  s === "Available" ? "green" :
  s === "Allocated" ? "blue"  :
  s === "Collected" || s === "Unavailable" ? "grey" : "orange";

const offerTone = (s: OfferStatus): PillTone =>
  s === "Accepted"            ? "green" :
  s === "Collection arranged" ? "blue"  :
  s === "Declined"            ? "grey"  : "orange";

const reqTone = (s: RequestStatus): PillTone =>
  s === "Fulfilled" ? "green" :
  s === "Approved"  ? "blue"  :
  s === "Closed"    ? "grey"  : "orange";

// ─── Nav definitions ──────────────────────────────────────────────────────────

const staffNav = [
  { id: "dashboard" as View, label: "Overview",   icon: "grid"  },
  { id: "offers"    as View, label: "Offers",      icon: "inbox" },
  { id: "inventory" as View, label: "Inventory",   icon: "sofa"  },
  { id: "req-alloc" as View, label: "Requests",   icon: "list"  },
];
const caseworkerNav = [
  { id: "cw-furniture" as View, label: "Available furniture", icon: "sofa" },
  { id: "cw-requests"  as View, label: "My requests",         icon: "file" },
];

const ITEM_TYPES = ["Sofa / couch","Armchair","Dining table","Dining chairs (set)","Coffee table","Bed frame","Wardrobe","Chest of drawers","Bookcase","Desk","Other"];
const emptyDI = (): DonateFormItem => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  type: "", description: "", condition: "", width: "", depth: "", height: "",
  safeToMove: true, concerns: ""
});

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {

  // ── Core ──────────────────────────────────────────────────────────────────────
  const [role, setRole]               = useState<Role>("public");
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [view, setView]               = useState<View>("home");
  const [reqAllocTab, setReqAllocTab] = useState<ReqAllocTab>("requests");
  const [offers, setOffers]           = useState(initialOffers);
  const [items, setItems]             = useState(initialItems);
  const [requests, setRequests]       = useState(initialRequests);
  const [allocations, setAllocations] = useState(initialAllocations);
  const [search, setSearch]           = useState("");
  const [offerFilter, setOfferFilter] = useState<OfferStatus | "All">("All");
  const [itemFilter, setItemFilter]   = useState<InventoryStatus | "All">("All");
  const [mobileNav, setMobileNav]     = useState(false);
  const [toast, setToast]             = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // ── Sign in page ──────────────────────────────────────────────────────────────
  const [signInEmail,    setSignInEmail]    = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError,    setSignInError]    = useState("");
  const [showPw,         setShowPw]         = useState(false);
  const [demoOpen,       setDemoOpen]       = useState(false);
  const [demoRole,       setDemoRole]       = useState<"caseworker" | null>(null);

  // ── P1 donate form ────────────────────────────────────────────────────────────
  const [donateForm, setDonateForm] = useState({
    name: "", contactMethod: "email" as "email" | "phone",
    email: "", phone: "", suburb: "", canDropOff: "", availability: "", access: ""
  });
  const [donateItems, setDonateItems]     = useState<DonateFormItem[]>([emptyDI()]);
  const [itemPhotos,  setItemPhotos]      = useState<Record<string, string>>({});
  const [donateErrors, setDonateErrors]   = useState<Record<string, string>>({});
  const [donateConfirm, setDonateConfirm] = useState<{ ref: string } | null>(null);

  // ── P3/P4 caseworker furniture ────────────────────────────────────────────────
  const [furnitureFilter, setFurnitureFilter] = useState("All");
  const [furnitureItem,   setFurnitureItem]   = useState<Item | null>(null);
  const [reqForm,         setReqForm]         = useState({
    client: "", suburb: "", priorityNotes: "", constraints: "", urgency: "Standard" as "Standard" | "Urgent"
  });
  const [reqErrors,  setReqErrors]  = useState<Record<string, string>>({});
  const [reqConfirm, setReqConfirm] = useState<{ ref: string } | null>(null);

  // ── P5 expandable requests ────────────────────────────────────────────────────
  const [expandedReqId, setExpandedReqId] = useState<string | null>(null);

  // ── P8 offer review sheet ─────────────────────────────────────────────────────
  const [reviewOffer, setReviewOffer] = useState<Offer | null>(null);
  const [offerStatus, setOfferStatus] = useState<OfferStatus>("Submitted");
  const [offerNotes,  setOfferNotes]  = useState("");

  // ── P9 inventory item detail ──────────────────────────────────────────────────
  const [editItem,     setEditItem]     = useState<Item | null>(null);
  const [editDesc,     setEditDesc]     = useState("");
  const [editConcerns, setEditConcerns] = useState("");

  // ── P10 request detail & allocation modal ─────────────────────────────────────
  const [reqDetail,     setReqDetail]     = useState<Request | null>(null);
  const [declineNote,   setDeclineNote]   = useState("");
  const [reviewRequest, setReviewRequest] = useState<Request | null>(null);
  const [selectedItem,  setSelectedItem]  = useState("");
  const [allocError,    setAllocError]    = useState("");

  // ── Helpers ───────────────────────────────────────────────────────────────────

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const signIn = (user: DemoUser) => {
    setCurrentUser(user); setRole(user.role);
    setView(user.role === "staff" ? "dashboard" : "cw-furniture");
    setDemoOpen(false); setDemoRole(null); setMobileNav(false);
    setSignInEmail(""); setSignInPassword(""); setSignInError(""); setShowPw(false);
  };

  const signOut = () => {
    setCurrentUser(null); setRole("public"); setView("home");
    setMobileNav(false); setSearch("");
  };

  const go = (next: View) => { setView(next); setSearch(""); setMobileNav(false); window.scrollTo(0, 0); };

  // Keep keyboard navigation inside the active overlay and return to its trigger.
  const overlayKey = demoOpen ? `demo-${demoRole}` : reviewRequest ? `allocation-${reviewRequest.id}` : reqDetail ? `request-${reqDetail.id}` : reviewOffer ? `offer-${reviewOffer.id}` : editItem ? `item-${editItem.id}` : furnitureItem ? `furniture-${furnitureItem.id}` : "";
  useEffect(() => {
    if (!overlayKey) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    if (!dialog) return;
    const controls = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]')).filter(el => el.getClientRects().length && !el.className.includes("scrim"));
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    controls()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dialog.querySelector<HTMLButtonElement>('button[aria-label^="Close"]')?.click();
      }
      if (event.key === "Tab") {
        const list = controls();
        const first = list[0], last = list[list.length - 1];
        if (!first) { event.preventDefault(); return; }
        if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = oldOverflow;
      if (previous?.isConnected) previous.focus();
    };
  }, [overlayKey]);

  // ── Computed ──────────────────────────────────────────────────────────────────

  const submittedOfferCount = offers.filter(o => o.status === "Submitted").length;
  const acceptedItemCount   = offers.filter(o => o.status === "Accepted" || o.status === "Collection arranged").reduce((sum, o) => sum + o.items.length, 0);
  const availableCount      = items.filter(i => i.status === "Available").length;
  const openReqCount        = requests.filter(r => r.status === "Submitted" || r.status === "Under review").length;
  const completedCount      = allocations.filter(a => a.completed).length;
  const activeAllocCount    = allocations.filter(a => !a.completed).length;

  const myRequests = currentUser ? requests.filter(r => r.caseworker === currentUser.name) : [];

  const filteredOffers = offers.filter(o =>
    (offerFilter === "All" || o.status === offerFilter) &&
    `${o.donor} ${o.id} ${o.suburb} ${o.items.map(i => i.type).join(" ")}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredItems = items.filter(i =>
    (itemFilter === "All" || i.status === itemFilter) &&
    `${i.name} ${i.id} ${i.category} ${i.sourceOfferId}`.toLowerCase().includes(search.toLowerCase())
  );
  const filteredRequests = requests.filter(r => `${r.id} ${r.itemName || r.items} ${r.caseworker} ${r.organisation}`.toLowerCase().includes(search.toLowerCase()));
  const filteredAllocations = allocations.filter(a => `${a.id} ${a.requestId} ${a.item} ${a.caseworker} ${a.organisation}`.toLowerCase().includes(search.toLowerCase()));

  const furnitureCategories = ["All", ...Array.from(new Set(
    items.filter(i => i.status === "Available").map(i => i.category)
  ))];

  const availableForCaseworker = items.filter(i =>
    i.status === "Available" &&
    (furnitureFilter === "All" || i.category === furnitureFilter) &&
    `${i.name} ${i.id} ${i.category}`.toLowerCase().includes(search.toLowerCase())
  );

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const openOfferReview = (offer: Offer) => {
    setReviewOffer(offer); setOfferStatus(offer.status); setOfferNotes(offer.reviewNotes);
  };

  const saveOfferReview = () => {
    if (!reviewOffer || !currentUser) return;
    const isNewAccept = offerStatus === "Accepted" && reviewOffer.status !== "Accepted";
    setOffers(all => all.map(o => o.id === reviewOffer.id ? {
      ...o, status: offerStatus, reviewNotes: offerNotes,
      reviewer: offerStatus !== "Submitted" ? currentUser.name : o.reviewer,
      reviewedAt: offerStatus !== "Submitted" ? "Just now" : o.reviewedAt,
    } : o));
    if (isNewAccept) {
      const baseId = 383 + items.length;
      setItems(all => [
        ...reviewOffer.items.map((oi, i) => ({
          id: `RH-${String(baseId + i).padStart(4, "0")}`,
          name: oi.type,
          category:
            /sofa|couch|armchair/.test(oi.type.toLowerCase()) ? "Lounge" :
            /bed/.test(oi.type.toLowerCase()) ? "Bedroom" :
            /dining|table/.test(oi.type.toLowerCase()) ? "Dining" :
            /bookcase|wardrobe|drawer/.test(oi.type.toLowerCase()) ? "Storage" : "Living",
          condition: oi.condition, status: "To assess" as InventoryStatus,
          location: "Intake", image: reviewOffer.image,
          dimensions: oi.dimensions, description: oi.description,
          colour: "—", material: "—",
          concerns: oi.concerns, sourceOfferId: reviewOffer.id,
        })),
        ...all,
      ]);
      notify(`${reviewOffer.items.length} item${reviewOffer.items.length > 1 ? "s" : ""} added to inventory as "To assess"`);
    } else {
      notify(`Offer ${reviewOffer.id} updated to "${offerStatus}"`);
    }
    setReviewOffer(null);
  };

  const openItemDetail = (item: Item) => {
    setEditItem(item); setEditDesc(item.description); setEditConcerns(item.concerns);
  };

  const saveItemDetail = () => {
    if (!editItem) return;
    setItems(all => all.map(i => i.id === editItem.id ? { ...i, description: editDesc, concerns: editConcerns } : i));
    setEditItem(null);
    notify("Item details saved");
  };

  const changeItemStatus = (status: InventoryStatus) => {
    if (!editItem) return;
    setItems(all => all.map(i => i.id === editItem.id ? {
      ...i, status,
      location: status === "Available" ? (editItem.location === "Intake" ? "Bay —" : editItem.location) : editItem.location,
    } : i));
    notify(`${editItem.name} marked as ${status}`);
    setEditItem(null);
  };

  const openReqDetail = (r: Request) => { setReqDetail(r); setDeclineNote(""); };

  const setReqStatus = (r: Request, status: RequestStatus) => {
    setRequests(all => all.map(req => req.id === r.id ? { ...req, status } : req));
    notify(`Request ${r.id} — status updated to "${status}"`);
    if (reqDetail?.id === r.id) setReqDetail(prev => prev ? { ...prev, status } : null);
  };

  const declineReq = () => {
    if (!reqDetail) return;
    const outcome = `Closed — ${declineNote.trim() || "declined by staff"}. Caseworker notified.`;
    setRequests(all => all.map(r => r.id === reqDetail.id ? { ...r, status: "Closed", outcome } : r));
    notify(`Request ${reqDetail.id} closed`);
    setReqDetail(null);
  };

  const openAllocModal = (req: Request) => {
    setReviewRequest(req); setSelectedItem(req.itemId || ""); setAllocError("");
  };

  const confirmAllocation = () => {
    if (!reviewRequest || !selectedItem) return;
    const item = items.find(i => i.id === selectedItem);
    if (!item) return;
    if (item.status !== "Available") {
      setAllocError(`${item.name} (${item.id}) is already ${item.status.toLowerCase()}. Select a different item or close this request.`);
      return;
    }
    setItems(all => all.map(i => i.id === selectedItem ? { ...i, status: "Allocated" } : i));
    setRequests(all => all.map(r => r.id === reviewRequest.id ? {
      ...r, status: "Approved", itemId: item.id, itemName: item.name,
      outcome: `${item.name} (${item.id}) allocated. Caseworker contacted to arrange collection.`,
    } : r));
    setAllocations(all => [{
      id: `AL-${190 + all.length}`,
      client: reviewRequest.client, item: item.name,
      itemId: item.id, requestId: reviewRequest.id,
      caseworker: reviewRequest.caseworker, organisation: reviewRequest.organisation,
      date: "Today", completed: false,
      confirmedBy: currentUser?.name || "Staff", confirmedAt: "Just now",
    }, ...all]);
    setReviewRequest(null); setSelectedItem(""); setAllocError("");
    notify("Allocation confirmed — item marked as Allocated");
  };

  const markComplete = (id: string) => {
    const alloc = allocations.find(a => a.id === id);
    if (!alloc) return;
    setAllocations(all => all.map(a => a.id === id ? { ...a, completed: true } : a));
    if (alloc.itemId)    setItems(all => all.map(i => i.id === alloc.itemId ? { ...i, status: "Collected", location: "Delivered" } : i));
    if (alloc.requestId) {
      const outcome = `Collected ${new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short" })}. Allocation complete.`;
      setRequests(all => all.map(r => r.id === alloc.requestId ? { ...r, status: "Fulfilled", outcome } : r));
    }
    notify("Allocation completed — item marked as Collected, request Fulfilled");
  };

  const setDF = (k: keyof typeof donateForm, v: string) => {
    setDonateForm(f => ({ ...f, [k]: v }));
    setDonateErrors(e => { const n = { ...e }; delete n[k]; return n; });
  };
  const setDI = (id: string, k: string, v: string | boolean) =>
    setDonateItems(all => all.map(i => i.id === id ? { ...i, [k]: v } : i));

  const handleItemPhoto = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) setItemPhotos(p => ({ ...p, [id]: ev.target!.result as string })); };
    reader.readAsDataURL(file);
  };

  const submitDonate = (e: FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!donateForm.name.trim())   errors.name = "Your name is required";
    if (donateForm.contactMethod === "email" && !donateForm.email.trim()) errors.contact = "Email address is required";
    if (donateForm.contactMethod === "phone" && !donateForm.phone.trim()) errors.contact = "Phone number is required";
    if (!donateForm.suburb.trim()) errors.suburb = "Suburb is required";
    if (!donateForm.canDropOff)    errors.dropoff = "Please indicate whether you can drop off";
    const validItems = donateItems.filter(i => i.type && i.condition);
    if (!validItems.length) errors.items = "Please complete at least one item with a type and condition";
    if (Object.keys(errors).length) { setDonateErrors(errors); return; }
    setDonateErrors({});
    const ref = `OF-${1049 + offers.length}`;
    setOffers(all => [{
      id: ref, donor: donateForm.name, suburb: donateForm.suburb,
      contact: donateForm.contactMethod === "email" ? donateForm.email : donateForm.phone,
      contactMethod: donateForm.contactMethod,
      date: "Just now", status: "Submitted",
      canDropOff: donateForm.canDropOff === "yes",
      availability: donateForm.availability, access: donateForm.access,
      reviewNotes: "", reviewer: "", reviewedAt: "", image: photos.sofa,
      items: validItems.map(i => ({
        type: i.type, description: i.description, condition: i.condition,
        dimensions: [i.width && `W${i.width}`, i.depth && `D${i.depth}`, i.height && `H${i.height}`].filter(Boolean).join(" × ") + (i.width ? " cm" : ""),
        safeToMove: i.safeToMove, concerns: i.concerns,
      })),
    }, ...all]);
    setDonateConfirm({ ref });
  };

  const resetDonate = () => {
    setDonateForm({ name: "", contactMethod: "email", email: "", phone: "", suburb: "", canDropOff: "", availability: "", access: "" });
    setDonateItems([emptyDI()]); setItemPhotos({}); setDonateConfirm(null); setDonateErrors({});
  };

  const handleSignInForm = (e: FormEvent) => {
    e.preventDefault();
    const user = demoUsers.find(u => u.email.toLowerCase() === signInEmail.trim().toLowerCase());
    if (user) { signIn(user); }
    else { setSignInError("No account found for that email address."); }
  };

  const submitItemRequest = (e: FormEvent) => {
    e.preventDefault();
    if (!furnitureItem || !currentUser) return;
    const errors: Record<string, string> = {};
    if (!reqForm.client.trim()) errors.client = "Client reference is required";
    if (!reqForm.suburb.trim()) errors.suburb  = "Suburb is required";
    if (Object.keys(errors).length) { setReqErrors(errors); return; }
    setReqErrors({});
    const ref = `RQ-${292 + requests.length}`;
    setRequests(all => [{
      id: ref, client: reqForm.client, caseworker: currentUser.name,
      organisation: currentUser.title, items: furnitureItem.name,
      itemId: furnitureItem.id, itemName: furnitureItem.name,
      urgency: reqForm.urgency, status: "Submitted", submitted: "Just now",
      suburb: reqForm.suburb, priorityNotes: reqForm.priorityNotes, constraints: reqForm.constraints,
    }, ...all]);
    setReqConfirm({ ref });
  };

  const closeSheet = () => {
    setFurnitureItem(null);
    setReqForm({ client: "", suburb: "", priorityNotes: "", constraints: "", urgency: "Standard" });
    setReqConfirm(null); setReqErrors({});
  };

  // ── Page titles ───────────────────────────────────────────────────────────────

  const pageTitles: Partial<Record<View, string>> = {
    dashboard: "Overview", offers: "Donation offers", inventory: "Furniture inventory",
    "req-alloc": "Requests & allocations", "cw-furniture": "Available furniture", "cw-requests": "My requests",
  };

  // ── Sidebar (auth only) ───────────────────────────────────────────────────────

  const Sidebar = () => (
    <aside className={`sidebar${mobileNav ? " sidebar-open" : ""}`} aria-label="Main navigation">
      <div className="brand">
        <BrandMark size={24} color="var(--forest)" />
        <span className="brand-wordmark">ReHome</span>
        <button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="Close navigation menu">
          <Icon name="close" size={18} />
        </button>
      </div>
      <nav>
        {(role === "staff" ? staffNav : caseworkerNav).map(n => (
          <button key={n.id} className={`nav-item${view === n.id ? " active" : ""}`}
            onClick={() => go(n.id)}
            aria-current={view === n.id ? "page" : undefined}>
            <Icon name={n.icon} size={20} /><span>{n.label}</span>
            {n.id === "offers" && submittedOfferCount > 0 &&
              <b className="nav-badge" aria-label={`${submittedOfferCount} new`}>{submittedOfferCount}</b>}
            {n.id === "cw-requests" && myRequests.filter(r => r.status !== "Fulfilled" && r.status !== "Closed").length > 0 &&
              <b className="nav-badge">{myRequests.filter(r => r.status !== "Fulfilled" && r.status !== "Closed").length}</b>}
          </button>
        ))}
      </nav>
      {currentUser && (
        <div className="user-card">
          <div className="avatar" aria-hidden="true">{currentUser.initials}</div>
          <div className="user-card-text">
            <strong>{currentUser.name}</strong>
            <small>{currentUser.title}</small>
          </div>
          <button className="user-signout" onClick={signOut} aria-label="Sign out">
            <Icon name="signout" size={16} />
          </button>
        </div>
      )}
    </aside>
  );

  // ── Public top nav ────────────────────────────────────────────────────────────

  const PubNav = () => (
    <header className="pub-nav" role="banner">
      <div className="pub-nav-inner">
        <button className="pub-brand" onClick={() => go("home")} aria-label="ReHome Furniture Collective — go to home">
          <BrandMark size={26} color="var(--forest)" />
          <span className="brand-wordmark">ReHome</span>
        </button>
        <nav className="pub-nav-links" aria-label="Public navigation">
          <button
            className="pub-nav-link"
            onClick={() => {
              if (view !== "home") { go("home"); window.setTimeout(() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }), 60); }
              else { document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); }
            }}>
            About
          </button>
          <button
            className={`pub-nav-donate${view === "donate" ? " active" : ""}`}
            onClick={() => go("donate")}
            aria-current={view === "donate" ? "page" : undefined}>
            Donate furniture
          </button>
        </nav>
        <button
          className={`pub-nav-signin${view === "signin" ? " pub-nav-signin-active" : ""}`}
          onClick={() => go("signin")}
          aria-current={view === "signin" ? "page" : undefined}>
          Sign in
        </button>
      </div>
    </header>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // Public layout
  // ─────────────────────────────────────────────────────────────────────────────

  if (role === "public") {
    return (
      <div className="app-shell shell-public">
        <PubNav />

        {/* ══ Home page ═══════════════════════════════════════════════════════════ */}
        {view === "home" && (
          <div className="home-page">

            {/* Hero */}
            <section className="hero" aria-label="Introduction">
              <div className="hero-copy">
                <p className="pub-eyebrow">Melbourne furniture collective</p>
                <h1 className="hero-heading">Give good furniture<br />a new home.</h1>
                <p className="hero-intro">
                  ReHome connects generous donors with households rebuilding after hardship or housing insecurity. Good furniture, passed on with care.
                </p>
                <button className="pub-cta" onClick={() => go("donate")}>
                  Donate furniture <Icon name="arrow" size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="hero-photo-wrap">
                <img
                  src={photos.hero}
                  alt="A sunlit living room with natural wood furniture and upholstered seating"
                  className="hero-photo" />
              </div>
            </section>

            {/* About */}
            <section id="about" className="about-section" aria-label="About ReHome">
              <div className="about-layout">
              <div className="about-inner">
                <p className="pub-eyebrow">About ReHome</p>
                <h2 className="about-heading">A small not-for-profit with a practical purpose.</h2>
                <div className="about-body">
                  <p>
                    ReHome collects usable second-hand furniture and passes it on, at no cost, through approved caseworkers to households after hardship or housing insecurity. We work with social services, housing support providers and community organisations across Melbourne.
                  </p>
                  <p>
                    Every item is reviewed by our small team. Caseworkers submit requests on behalf of their clients, and we match what we have where we can.
                  </p>
                </div>
              </div>
              <div className="about-photo-wrap">
                <img src={photos.dining} alt="A dining table with chairs in morning light" className="about-photo" />
              </div>
              </div>
            </section>

            {/* How it works */}
            <section className="steps-section" aria-label="How donating works">
              <div className="steps-inner">
                <p className="pub-eyebrow">How it works</p>
                <h2 className="steps-heading">Donating in three steps.</h2>
                <div className="steps-grid">
                  <div className="step">
                    <span className="step-num" aria-hidden="true">1</span>
                    <h3>Submit an offer</h3>
                    <p>Tell us what you have — type, condition, and whether you can drop it off or need collection arranged.</p>
                  </div>
                  <div className="step-divider" aria-hidden="true" />
                  <div className="step">
                    <span className="step-num" aria-hidden="true">2</span>
                    <h3>Staff review</h3>
                    <p>Our team will review your offer and contact you about next steps.</p>
                  </div>
                  <div className="step-divider" aria-hidden="true" />
                  <div className="step">
                    <span className="step-num" aria-hidden="true">3</span>
                    <h3>Arrange collection</h3>
                    <p>Accepted items are collected or dropped off at a time that suits you. There is no charge to donors.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* What we accept */}
            <section className="types-section" aria-label="Types of furniture we accept">
              <div className="types-inner">
                <p className="pub-eyebrow">What we accept</p>
                <h2 className="types-heading">Everyday furniture in good condition.</h2>
                <p className="types-sub">We focus on practical household items that caseworkers request most often. The examples below show typical donation types.</p>
                <div className="types-grid">
                  {[
                    { label: "Sofas & armchairs",    img: photos.sofa,     desc: "2-seat, 3-seat and single chairs" },
                    { label: "Dining sets",           img: photos.dining,   desc: "Tables and matching chairs" },
                    { label: "Bedroom furniture",     img: photos.bed,      desc: "Bed frames, wardrobes, drawers" },
                    { label: "Storage & shelving",    img: photos.bookcase, desc: "Bookcases, chest of drawers" },
                  ].map(({ label, img, desc }) => (
                    <div key={label} className="type-card">
                      <div className="type-photo-wrap">
                        <img src={img} alt={`Example: ${label}`} loading="lazy" />
                      </div>
                      <div className="type-info">
                        <strong>{label}</strong>
                        <span>{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="types-note">
                  Items should be clean and in good, fair or very good condition. We assess each offer individually — if in doubt, submit and we will let you know. Images shown are examples of typical donation types.
                </p>
              </div>
            </section>

            {/* Final CTA */}
            <section className="pub-cta-section" aria-label="Call to donate">
              <div className="pub-cta-inner">
                <h2>Have furniture to pass on?</h2>
                <p>It takes a few minutes to submit a donation offer. Our team will review your offer and contact you about next steps.</p>
                <button className="pub-cta pub-cta-lg pub-cta-on-forest" onClick={() => go("donate")}>
                  Start a donation offer <Icon name="arrow" size={18} aria-hidden="true" />
                </button>
              </div>
            </section>

            {/* Footer */}
            <footer className="pub-footer">
              <div className="pub-footer-inner">
                <div className="pub-footer-brand">
                  <BrandMark size={22} color="rgba(255,255,255,0.7)" />
                  <div>
                    <strong>ReHome Furniture Collective</strong>
                    <span>Melbourne, Victoria</span>
                  </div>
                </div>
                <p className="pub-footer-note">
                  Furniture matched with households after hardship, at no cost. Caseworker and staff access via Sign in.
                </p>
              </div>
            </footer>
          </div>
        )}

        {/* ══ Donate page (public) ════════════════════════════════════════════════ */}
        {view === "donate" && (
          <div className="pub-page-wrap">
            <div className="donate-page">
              <div className="donate-form-card">
                {donateConfirm ? (
                  <div className="donate-confirm">
                    <div className="donate-confirm-icon" aria-hidden="true"><Icon name="check" size={24} /></div>
                    <h2>Offer received</h2>
                    <p>Thank you, {donateForm.name}. We have your donation offer and will be in touch soon.</p>
                    <div className="donate-confirm-ref" aria-label={`Reference number: ${donateConfirm.ref}`}>{donateConfirm.ref}</div>
                    <div className="donate-confirm-steps">
                      <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: 13 }}>What happens next</p>
                      <ul>
                        <li>Our team will review your offer and contact you about next steps</li>
                        <li>We will contact you to arrange collection or confirm a drop-off time</li>
                        <li>Items in good condition are matched with a household in need</li>
                      </ul>
                    </div>
                    <button className="pub-cta" onClick={resetDonate}>Submit another offer <Icon name="arrow" size={16} /></button>
                  </div>
                ) : (
                  <>
                    <div className="donate-top">
                      <h1 className="donate-top-h1">Give good furniture a new home.</h1>
                      <p className="donate-top-sub">Our team will review your offer and contact you about next steps.</p>
                    </div>
                    <form onSubmit={submitDonate} noValidate aria-label="Donate furniture form">
                      <div className="form-heading"><span>Your details</span></div>

                      <div className="d-field">
                        <label className="d-label" htmlFor="d-name">Full name <span className="d-req" aria-hidden="true">*</span></label>
                        <input id="d-name" className={`d-input${donateErrors.name ? " input-error" : ""}`}
                          required aria-required="true"
                          aria-describedby={donateErrors.name ? "err-name" : undefined}
                          value={donateForm.name} onChange={e => setDF("name", e.target.value)}
                          placeholder="e.g. Jamie Williams" />
                        {donateErrors.name && <span id="err-name" className="field-error" role="alert"><Icon name="warn" size={12} />{donateErrors.name}</span>}
                      </div>

                      <div className="d-field">
                        <div className="d-label" id="cmethod-lbl">Contact method <span className="d-req" aria-hidden="true">*</span></div>
                        <div className="contact-toggle" role="group" aria-labelledby="cmethod-lbl">
                          <button type="button" className={donateForm.contactMethod === "email" ? "active" : ""}
                            aria-pressed={donateForm.contactMethod === "email"}
                            onClick={() => setDF("contactMethod", "email")}>Email</button>
                          <button type="button" className={donateForm.contactMethod === "phone" ? "active" : ""}
                            aria-pressed={donateForm.contactMethod === "phone"}
                            onClick={() => setDF("contactMethod", "phone")}>Phone</button>
                        </div>
                        {donateForm.contactMethod === "email" ? (
                          <input type="email" className={`d-input${donateErrors.contact ? " input-error" : ""}`}
                            aria-required="true" aria-label="Email address"
                            aria-describedby={donateErrors.contact ? "err-contact" : undefined}
                            value={donateForm.email} onChange={e => setDF("email", e.target.value)}
                            placeholder="your@email.com" />
                        ) : (
                          <input type="tel" className={`d-input${donateErrors.contact ? " input-error" : ""}`}
                            aria-required="true" aria-label="Phone number"
                            aria-describedby={donateErrors.contact ? "err-contact" : undefined}
                            value={donateForm.phone} onChange={e => setDF("phone", e.target.value)}
                            placeholder="04xx xxx xxx" />
                        )}
                        {donateErrors.contact && <span id="err-contact" className="field-error" role="alert"><Icon name="warn" size={12} />{donateErrors.contact}</span>}
                      </div>

                      <div className="d-row">
                        <div className="d-field">
                          <label className="d-label" htmlFor="d-suburb">Suburb <span className="d-req" aria-hidden="true">*</span></label>
                          <input id="d-suburb" className={`d-input${donateErrors.suburb ? " input-error" : ""}`}
                            required aria-required="true"
                            aria-describedby={donateErrors.suburb ? "err-suburb" : undefined}
                            value={donateForm.suburb} onChange={e => setDF("suburb", e.target.value)}
                            placeholder="e.g. Preston" />
                          {donateErrors.suburb && <span id="err-suburb" className="field-error" role="alert"><Icon name="warn" size={12} />{donateErrors.suburb}</span>}
                        </div>
                        <div className="d-field">
                          <div className="d-label" id="dropoff-lbl">Can you drop off? <span className="d-req" aria-hidden="true">*</span></div>
                          <div className="radio-group" role="group" aria-labelledby="dropoff-lbl"
                            aria-describedby={donateErrors.dropoff ? "err-dropoff" : undefined}>
                            <label className="radio-label"><input type="radio" name="dropoff" value="yes" checked={donateForm.canDropOff === "yes"} onChange={() => setDF("canDropOff", "yes")} /> Yes</label>
                            <label className="radio-label"><input type="radio" name="dropoff" value="no"  checked={donateForm.canDropOff === "no"}  onChange={() => setDF("canDropOff", "no")}  /> No</label>
                          </div>
                          {donateErrors.dropoff && <span id="err-dropoff" className="field-error" role="alert"><Icon name="warn" size={12} />{donateErrors.dropoff}</span>}
                        </div>
                      </div>

                      <div className="d-field">
                        <label className="d-label" htmlFor="d-avail">Availability <span className="d-opt">(optional)</span></label>
                        <textarea id="d-avail" className="d-input d-textarea" value={donateForm.availability}
                          onChange={e => setDF("availability", e.target.value)} placeholder="e.g. Weekday mornings" rows={2} />
                      </div>
                      <div className="d-field">
                        <label className="d-label" htmlFor="d-access">Access notes <span className="d-opt">(optional)</span></label>
                        <input id="d-access" className="d-input" value={donateForm.access}
                          onChange={e => setDF("access", e.target.value)} placeholder="e.g. No lift — 2 flights of stairs" />
                      </div>

                      <div className="form-heading" style={{ marginTop: 6 }}>
                        <span>Furniture items</span><strong>At least one required</strong>
                      </div>
                      {donateErrors.items && <span className="field-error" role="alert" style={{ marginBottom: 10 }}><Icon name="warn" size={12} />{donateErrors.items}</span>}

                      {donateItems.map((item, idx) => (
                        <div className="donate-item-block" key={item.id}>
                          <div className="donate-item-head">
                            <span className="donate-item-num">Item {idx + 1}{item.type ? ` — ${item.type}` : ""}</span>
                            {donateItems.length > 1 && (
                              <button type="button" className="donate-item-remove"
                                onClick={() => setDonateItems(all => all.filter(i => i.id !== item.id))}
                                aria-label={`Remove item ${idx + 1}`}>
                                <Icon name="close" size={13} aria-hidden="true" /> Remove
                              </button>
                            )}
                          </div>
                          <div className="donate-item-body">
                            <div className="d-row">
                              <div className="d-field">
                                <label className="d-label" htmlFor={`d-type-${item.id}`}>Item type <span className="d-req" aria-hidden="true">*</span></label>
                                <select id={`d-type-${item.id}`} className="d-input" value={item.type}
                                  onChange={e => setDI(item.id, "type", e.target.value)}>
                                  <option value="">Select type…</option>
                                  {ITEM_TYPES.map(t => <option key={t}>{t}</option>)}
                                </select>
                              </div>
                              <div className="d-field">
                                <label className="d-label" htmlFor={`d-cond-${item.id}`}>Condition <span className="d-req" aria-hidden="true">*</span></label>
                                <select id={`d-cond-${item.id}`} className="d-input" value={item.condition}
                                  onChange={e => setDI(item.id, "condition", e.target.value)}>
                                  <option value="">Select…</option>
                                  <option>Excellent</option><option>Very good</option><option>Good</option><option>Fair</option>
                                </select>
                              </div>
                            </div>
                            <div className="d-field">
                              <label className="d-label" htmlFor={`d-desc-${item.id}`}>Description <span className="d-opt">(optional)</span></label>
                              <textarea id={`d-desc-${item.id}`} className="d-input d-textarea" value={item.description}
                                onChange={e => setDI(item.id, "description", e.target.value)}
                                placeholder="Colour, fabric, any marks or damage…" rows={2} />
                            </div>
                            <div className="d-field">
                              <div className="d-label" id={`dims-lbl-${item.id}`}>Approximate dimensions <span className="d-opt">(optional)</span></div>
                              <div className="dim-row" aria-labelledby={`dims-lbl-${item.id}`}>
                                <label className="dim-label" aria-label="Width in cm">W<input className="d-input dim-input" value={item.width} onChange={e => setDI(item.id, "width", e.target.value)} placeholder="cm" /></label>
                                <span className="dim-x" aria-hidden="true">×</span>
                                <label className="dim-label" aria-label="Depth in cm">D<input className="d-input dim-input" value={item.depth} onChange={e => setDI(item.id, "depth", e.target.value)} placeholder="cm" /></label>
                                <span className="dim-x" aria-hidden="true">×</span>
                                <label className="dim-label" aria-label="Height in cm">H<input className="d-input dim-input" value={item.height} onChange={e => setDI(item.id, "height", e.target.value)} placeholder="cm" /></label>
                              </div>
                            </div>
                            <div className="d-row" style={{ alignItems: "flex-start" }}>
                              <div className="d-field">
                                <label className="safe-label d-label">
                                  <input type="checkbox" checked={item.safeToMove}
                                    onChange={e => setDI(item.id, "safeToMove", e.target.checked)} />
                                  Safe for volunteers to move
                                </label>
                              </div>
                              <div className="d-field">
                                <label className="d-label" htmlFor={`d-concerns-${item.id}`}>Concerns <span className="d-opt">(optional)</span></label>
                                <input id={`d-concerns-${item.id}`} className="d-input" value={item.concerns}
                                  onChange={e => setDI(item.id, "concerns", e.target.value)}
                                  placeholder="e.g. Disassembly required" />
                              </div>
                            </div>
                            <div className="d-field">
                              <div className="d-label">Photo <span className="d-opt">(optional)</span></div>
                              <div className="photo-upload-row">
                                <div className="photo-example-wrap" aria-hidden="true">
                                  <img src={photos.sofa} alt="" />
                                  <span>Example</span>
                                </div>
                                {itemPhotos[item.id] ? (
                                  <div className="photo-preview">
                                    <img src={itemPhotos[item.id]} alt="Preview" />
                                    <button type="button" className="photo-remove"
                                      onClick={() => setItemPhotos(p => { const n = { ...p }; delete n[item.id]; return n; })}
                                      aria-label="Remove photo"><Icon name="close" size={10} aria-hidden="true" /></button>
                                  </div>
                                ) : (
                                  <label className="upload-field" aria-label="Upload photo (optional)">
                                    <Icon name="image" size={18} aria-hidden="true" />
                                    <span><strong>Add photo</strong><small>JPG or PNG, up to 10 MB</small></span>
                                    <input type="file" accept="image/*" onChange={e => handleItemPhoto(item.id, e)} />
                                  </label>
                                )}
                              </div>
                              <p className="photo-tip-text">Shows the whole item clearly — helps staff assess condition.</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button type="button" className="add-item-btn"
                        onClick={() => setDonateItems(all => [...all, emptyDI()])}>
                        <Icon name="plus" size={16} aria-hidden="true" /> Add another item
                      </button>
                      <div style={{ marginTop: 20 }}>
                        <button type="submit" className="pub-cta form-submit">
                          Send offer <Icon name="arrow" size={18} aria-hidden="true" />
                        </button>
                        <p className="privacy">Your details are used only to assess and arrange this donation.</p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ Sign in page ════════════════════════════════════════════════════════ */}
        {view === "signin" && (
          <div className="signin-page">
            <div className="signin-photo-col" aria-hidden="true">
              <img src={photos.sofa} alt="" />
            </div>
            <div className="signin-form-col">
              <div className="signin-form-inner">
                <h1 className="signin-page-title">Sign in</h1>
                <p className="signin-page-sub">For ReHome staff and approved caseworkers.</p>
                <form onSubmit={handleSignInForm} noValidate aria-label="Sign in">
                  <div className="d-field">
                    <label className="d-label" htmlFor="si-email">Email address</label>
                    <input id="si-email" type="email" className="d-input" autoComplete="email" autoFocus
                      value={signInEmail} onChange={e => { setSignInEmail(e.target.value); setSignInError(""); }}
                      placeholder="your@email.com" required aria-required="true"
                      aria-describedby={signInError ? "si-error" : undefined} />
                  </div>
                  <div className="d-field">
                    <label className="d-label" htmlFor="si-pw">Password</label>
                    <div className="pw-field">
                      <input id="si-pw" type={showPw ? "text" : "password"} className="d-input" autoComplete="current-password"
                        value={signInPassword} onChange={e => setSignInPassword(e.target.value)}
                        placeholder="••••••••" required aria-required="true" />
                      <button type="button" className="pw-toggle" onClick={() => setShowPw(p => !p)}
                        aria-label={showPw ? "Hide password" : "Show password"}>
                        {showPw
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        }
                      </button>
                    </div>
                  </div>
                  {signInError && <p id="si-error" className="signin-error" role="alert">{signInError}</p>}
                  <button type="submit" className="signin-submit">Sign in</button>
                </form>
                <div className="signin-explore-wrap">
                  <button className="demo-explore-link" onClick={() => { setDemoOpen(true); setDemoRole(null); }}>
                    Explore the prototype
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ Demo access dialog ═══════════════════════════════════════════════════ */}
        {demoOpen && (
          <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="demo-dialog-title">
            <button className="modal-scrim" onClick={() => { setDemoOpen(false); setDemoRole(null); }} aria-label="Close demo access dialog" />
            <div className="demo-dialog">
              <button className="modal-close" onClick={() => { setDemoOpen(false); setDemoRole(null); }} aria-label="Close"><Icon name="close" size={16} /></button>
              {demoRole === null ? (
                <>
                  <h2 id="demo-dialog-title" className="demo-dialog-title">Explore the prototype</h2>
                  <p className="demo-dialog-sub">Choose a role to continue.</p>
                  <div className="demo-role-rows">
                    <button className="demo-role-row"
                      onClick={() => signIn(demoUsers.find(u => u.role === "staff")!)}>
                      <div className="demo-role-avatar" aria-hidden="true">CM</div>
                      <div className="demo-role-info">
                        <strong>Staff</strong>
                        <small>Operations coordinator — full workspace access</small>
                      </div>
                      <Icon name="arrow" size={16} aria-hidden="true" />
                    </button>
                    <button className="demo-role-row" onClick={() => setDemoRole("caseworker")}>
                      <div className="demo-role-avatar" style={{ background: "#3a6070" }} aria-hidden="true">CW</div>
                      <div className="demo-role-info">
                        <strong>Caseworker</strong>
                        <small>Browse furniture and submit requests — 2 accounts</small>
                      </div>
                      <Icon name="arrow" size={16} aria-hidden="true" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button className="demo-back-btn" onClick={() => setDemoRole(null)}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(180deg)" }} aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg> Back
                  </button>
                  <h2 id="demo-dialog-title" className="demo-dialog-title">Select an account</h2>
                  <p className="demo-dialog-sub">Caseworker accounts share the same data.</p>
                  <div className="demo-role-rows">
                    {demoUsers.filter(u => u.role === "caseworker").map(u => (
                      <button key={u.name} className="demo-role-row" onClick={() => signIn(u)}>
                        <div className="avatar" aria-hidden="true">{u.initials}</div>
                        <div className="demo-role-info">
                          <strong>{u.name}</strong>
                          <small>{u.title}</small>
                        </div>
                        <Icon name="arrow" size={16} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {toast && (
          <div className={`toast${toast.type === "error" ? " toast-error" : ""}`}
            role="status" aria-live="polite" aria-atomic="true">
            <span aria-hidden="true"><Icon name={toast.type === "error" ? "warn" : "check"} size={16} /></span>
            {toast.msg}
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Auth layout (staff + caseworker)
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="app-shell shell-auth">
      <Sidebar />
      {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}

      <main>
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileNav(true)} aria-label="Open navigation menu"><Icon name="menu" /></button>
          {(role === "staff" || view !== "cw-furniture") && (
            <div className="global-search" role="search">
              <Icon name="search" size={18} aria-hidden="true" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={role === "staff" ? "Search this workspace…" : "Search furniture…"} aria-label={role === "staff" ? "Search this workspace" : "Search furniture"} />
            </div>
          )}
          <div className="top-actions">
            {role === "staff" && (
              <button className="icon-button" aria-label="Notifications">
                <Icon name="bell" /><i aria-hidden="true" />
              </button>
            )}
          </div>
        </header>

        <div className="content">

          {/* Shared heading for auth views */}
          {view !== "cw-furniture" && view !== "dashboard" && (
            <section className="page-heading">
              <h1>{pageTitles[view]}</h1>
            </section>
          )}

          {/* ══ P6: Dashboard ══════════════════════════════════════════════════════ */}
          {view === "dashboard" && <>
            <section className="page-heading"><h1>Overview</h1></section>
            <div className="overview-stats" role="list" aria-label="Key counts">
              {([
                { label: "Offers awaiting review", count: submittedOfferCount, action: () => { setOfferFilter("Submitted"); go("offers"); } },
                { label: "Accepted items",           count: acceptedItemCount,   action: () => { setOfferFilter("Accepted"); go("offers"); } },
                { label: "Available items",          count: availableCount,      action: () => { setItemFilter("Available"); go("inventory"); } },
                { label: "Open requests",            count: openReqCount,        action: () => { setReqAllocTab("requests"); go("req-alloc"); } },
                { label: "Completed allocations",    count: completedCount,      action: () => { setReqAllocTab("allocations"); go("req-alloc"); } },
              ] as const).map(({ label, count, action }) => (
                <button key={label} className="overview-stat" onClick={action} role="listitem">
                  <span className={`overview-stat-num${count === 0 ? " dim" : ""}`}>{count}</span>
                  <span className="overview-stat-label">{label}</span>
                </button>
              ))}
            </div>
            <div className="overview-activity">
              <div className="panel">
                <div className="panel-head">
                  <h2>Recent offers</h2>
                  <button onClick={() => { setOfferFilter("All"); go("offers"); }}>All offers <Icon name="arrow" size={15} /></button>
                </div>
                {offers.slice(0, 5).map(o => (
                  <button key={o.id} className="activity-row" onClick={() => { go("offers"); openOfferReview(o); }}>
                    <FurnitureThumb src={o.image} name={o.items[0]?.type || "Furniture"} />
                    <div className="activity-row-info">
                      <strong>{o.donor}</strong>
                      <span>{o.id} · {o.items.length} item{o.items.length > 1 ? "s" : ""} · {o.suburb}</span>
                    </div>
                    <div className="activity-row-meta">
                      <Pill tone={offerTone(o.status)}>{o.status}</Pill>
                      <span style={{ color: "var(--muted)", fontSize: 11.5 }}>{o.date}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="panel">
                <div className="panel-head">
                  <h2>Recent requests</h2>
                  <button onClick={() => { setReqAllocTab("requests"); go("req-alloc"); }}>All requests <Icon name="arrow" size={15} /></button>
                </div>
                {requests.slice(0, 5).map(r => (
                  <button key={r.id} className="activity-row" onClick={() => { go("req-alloc"); setReqAllocTab("requests"); openReqDetail(r); }}>
                    <FurnitureThumb src={items.find(i => i.id === r.itemId)?.image} name={r.itemName || r.items} />
                    <div className="activity-row-info">
                      <strong>{r.itemName || r.items}</strong>
                      <span>{r.id} · {r.caseworker}</span>
                    </div>
                    <div className="activity-row-meta">
                      <Pill tone={reqTone(r.status)}>{r.status}</Pill>
                      {r.urgency === "Urgent" && <Pill tone="red">Urgent</Pill>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>}

          {/* ══ P7: Donation offers table ═══════════════════════════════════════════ */}
          {view === "offers" && (
            <section className="panel list-panel">
              <div className="toolbar">
                <div className="filter-tabs" role="group" aria-label="Filter by offer status">
                  {(["All", "Submitted", "Under review", "Accepted", "Declined", "Collection arranged"] as const).map(f => (
                    <button key={f} className={offerFilter === f ? "active" : ""}
                      onClick={() => setOfferFilter(f)} aria-pressed={offerFilter === f}>
                      {f === "Submitted" ? "New" : f === "Under review" ? "In review" : f === "Collection arranged" ? "Arranged" : f}
                      {f === "Submitted" && submittedOfferCount > 0 && <b>{submittedOfferCount}</b>}
                    </button>
                  ))}
                </div>
                <span>{filteredOffers.length} offer{filteredOffers.length !== 1 ? "s" : ""}</span>
              </div>
              <table className="data-table" aria-label="Donation offers">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: 56 }}><span className="sr-only">Photo</span></th>
                    <th scope="col">Reference</th>
                    <th scope="col">Donor</th>
                    <th scope="col">Suburb</th>
                    <th scope="col">Submitted</th>
                    <th scope="col">Items</th>
                    <th scope="col">Status</th>
                    <th scope="col" style={{ width: 90 }}><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOffers.map(offer => (
                    <tr key={offer.id} onClick={() => openOfferReview(offer)} tabIndex={0}
                      onKeyDown={e => e.key === "Enter" && openOfferReview(offer)}>
                      <td>
                        <div className="offer-thumb-wrap">
                          <img className="offer-thumb" src={offer.image} alt="" aria-hidden="true" />
                          {offer.items.length > 1 && <span className="offer-thumb-count">+{offer.items.length - 1}</span>}
                        </div>
                      </td>
                      <td><strong>{offer.id}</strong></td>
                      <td><strong>{offer.donor}</strong><span className="sub">{offer.contact}</span></td>
                      <td className="muted-cell">{offer.suburb}</td>
                      <td className="muted-cell">{offer.date}</td>
                      <td>{offer.items.length} {offer.items.length === 1 ? "item" : "items"}</td>
                      <td><Pill tone={offerTone(offer.status)}>{offer.status}</Pill></td>
                      <td>
                        <div className="table-actions">
                          <button className="small-primary" aria-label={`Review offer ${offer.id}`}
                            onClick={e => { e.stopPropagation(); openOfferReview(offer); }}>Review</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!filteredOffers.length && (
                    <tr><td colSpan={8}><Empty text="No offers match this filter." /></td></tr>
                  )}
                </tbody>
              </table>
            </section>
          )}

          {/* ══ P9: Inventory table ═════════════════════════════════════════════════ */}
          {view === "inventory" && <>
            <div className="inventory-toolbar">
              <div className="filter-tabs" role="group" aria-label="Filter by item status">
                {(["All", "To assess", "Available", "Reserved", "Allocated", "Collected"] as const).map(f => (
                  <button key={f} className={itemFilter === f ? "active" : ""} onClick={() => setItemFilter(f)} aria-pressed={itemFilter === f}>
                    {f}
                    {f === "To assess" && items.filter(i => i.status === "To assess").length > 0 && <b>{items.filter(i => i.status === "To assess").length}</b>}
                  </button>
                ))}
              </div>
              <span style={{ color: "var(--muted)", fontSize: 12.5 }}>{filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}</span>
            </div>
            <section className="panel list-panel">
              <table className="data-table" aria-label="Furniture inventory">
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Condition</th>
                    <th scope="col">Status</th>
                    <th scope="col">Source offer</th>
                    <th scope="col" style={{ width: 90 }}><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => (
                    <tr key={item.id} onClick={() => openItemDetail(item)} tabIndex={0}
                      onKeyDown={e => e.key === "Enter" && openItemDetail(item)}>
                      <td><div className="item-cell"><FurnitureThumb src={item.image} name={item.name} /><div><strong>{item.name}</strong><span className="sub">{item.id} · {item.category}</span></div></div></td>
                      <td>{item.condition}</td>
                      <td><Pill tone={itemTone(item.status)}>{item.status}</Pill></td>
                      <td className="muted-cell">{item.sourceOfferId || "—"}</td>
                      <td>
                        <div className="table-actions">
                          <button className="row-button" aria-label={`Open details for ${item.name}`}
                            onClick={e => { e.stopPropagation(); openItemDetail(item); }}>Details</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!filteredItems.length && (
                    <tr><td colSpan={5}><Empty text="No items match this filter." /></td></tr>
                  )}
                </tbody>
              </table>
            </section>
          </>}

          {/* ══ P10: Requests & allocations ══════════════════════════════════════════ */}
          {view === "req-alloc" && (
            <section className="panel list-panel">
              <div className="reqalloc-tabs" role="tablist">
                <button role="tab" aria-selected={reqAllocTab === "requests"}
                  className={reqAllocTab === "requests" ? "active" : ""} onClick={() => setReqAllocTab("requests")}>
                  Requests <span className="tab-count">{openReqCount} open</span>
                </button>
                <button role="tab" aria-selected={reqAllocTab === "allocations"}
                  className={reqAllocTab === "allocations" ? "active" : ""} onClick={() => setReqAllocTab("allocations")}>
                  Allocations <span className="tab-count">{activeAllocCount} active</span>
                </button>
              </div>

              {reqAllocTab === "requests" && (
                <table className="data-table" aria-label="Requests">
                  <thead>
                    <tr>
                      <th scope="col">Item requested</th>
                      <th scope="col">Caseworker</th>
                      <th scope="col">Submitted</th>
                      <th scope="col">Status</th>
                      <th scope="col" style={{ width: 90 }}><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.length === 0 && <tr><td colSpan={5} className="empty-state">No requests match your search.</td></tr>}
                    {filteredRequests.map(r => (
                      <tr key={r.id} onClick={() => openReqDetail(r)} tabIndex={0}
                        onKeyDown={e => e.key === "Enter" && openReqDetail(r)}>
                        <td><div className="item-cell"><FurnitureThumb src={items.find(i => i.id === r.itemId)?.image} name={r.itemName || r.items} /><div><strong>{r.itemName || r.items}</strong><span className="sub">{r.id}{r.urgency === "Urgent" && <> · <span className="urgent-label">Urgent</span></>}</span></div></div></td>
                        <td><strong>{r.caseworker}</strong><span className="sub">{r.organisation}</span></td>
                        <td className="muted-cell">{r.submitted}</td>
                        <td><Pill tone={reqTone(r.status)}>{r.status}</Pill></td>
                        <td>
                          <div className="table-actions">
                            {r.status !== "Approved" && r.status !== "Fulfilled" && r.status !== "Closed" ? (
                              <button className="small-primary" aria-label={`Review request ${r.id}`}
                                onClick={e => { e.stopPropagation(); openReqDetail(r); }}>Review</button>
                            ) : (
                              <button className="row-button" aria-label={`View request ${r.id}`}
                                onClick={e => { e.stopPropagation(); openReqDetail(r); }}>View</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {reqAllocTab === "allocations" && (
                <table className="data-table" aria-label="Allocations">
                  <thead>
                    <tr>
                      <th scope="col">Reference</th>
                      <th scope="col">Request</th>
                      <th scope="col">Item</th>
                      <th scope="col">Caseworker</th>
                      <th scope="col">Date</th>
                      <th scope="col">Confirmed by</th>
                      <th scope="col">Status</th>
                      <th scope="col" style={{ width: 110 }}><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAllocations.length === 0 && <tr><td colSpan={8} className="empty-state">No allocations match your search.</td></tr>}
                    {filteredAllocations.map(a => (
                      <tr key={a.id} style={{ opacity: a.completed ? .7 : 1 }}>
                        <td><strong>{a.id}</strong></td>
                        <td>{a.requestId || "—"}</td>
                        <td>{a.item}</td>
                        <td><strong>{a.caseworker}</strong><span className="sub">{a.organisation}</span></td>
                        <td className="muted-cell">{a.date}</td>
                        <td><strong>{a.confirmedBy}</strong><span className="sub">{a.confirmedAt}</span></td>
                        <td><Pill tone={a.completed ? "green" : "blue"}>{a.completed ? "Completed" : "Awaiting collection"}</Pill></td>
                        <td>
                          <div className="table-actions">
                            {!a.completed && (
                              <button className="row-button" onClick={() => markComplete(a.id)}
                                aria-label={`Mark allocation ${a.id} as complete`}>Mark complete</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          )}

          {/* ══ P3: Available furniture ═══════════════════════════════════════════ */}
          {view === "cw-furniture" && <>
            <section className="page-heading"><h1>Available furniture</h1></section>
            <div className="cw-toolbar">
              <div className="global-search cw-search" role="search">
                <Icon name="search" size={18} aria-hidden="true" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search available furniture…" aria-label="Search furniture" />
              </div>
              <div className="filter-tabs" role="group" aria-label="Filter by category">
                {furnitureCategories.map(cat => (
                  <button key={cat} className={furnitureFilter === cat ? "active" : ""}
                    onClick={() => setFurnitureFilter(cat)} aria-pressed={furnitureFilter === cat}>{cat}</button>
                ))}
              </div>
              <span className="cw-count" aria-live="polite">{availableForCaseworker.length} available</span>
            </div>
            {availableForCaseworker.length === 0 ? (
              <div style={{ background: "#fff", border: "1px solid var(--stone)", borderRadius: 8 }}>
                <Empty text="No available items match your search." />
              </div>
            ) : (
              <section className="furniture-grid" aria-label="Available furniture">
                {availableForCaseworker.map(item => (
                  <button key={item.id} className="furniture-card"
                    onClick={() => { setFurnitureItem(item); setReqConfirm(null); }}
                    aria-label={`${item.name} — ${item.condition}. Select to request.`}>
                    <div className="furniture-photo-wrap">
                      <img src={item.image} alt={item.name} onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }} />
                      <div className="furniture-photo-fallback" aria-hidden="true"><Icon name="sofa" size={36} /></div>
                    </div>
                    <div className="furniture-info">
                      <div className="furniture-meta">{item.category}</div>
                      <h3 className="furniture-name">{item.name}</h3>
                      <div className="furniture-detail">
                        <span>{item.condition}</span>
                        {item.dimensions && <span>{item.dimensions}</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </section>
            )}
          </>}

          {/* ══ P5: My requests ════════════════════════════════════════════════════ */}
          {view === "cw-requests" && (
            <section className="panel list-panel">
              <div className="toolbar">
                <button className="text-action" onClick={() => go("cw-furniture")}>Browse furniture <Icon name="arrow" size={15} /></button>
                <span>{myRequests.filter(r => r.status !== "Fulfilled" && r.status !== "Closed").length} pending</span>
              </div>
              {myRequests.length === 0 ? (
                <Empty text="You have no requests yet. Browse available furniture to submit one." />
              ) : (
                <div className="cw-req-list" role="list">
                  {myRequests.map(r => (
                    <div key={r.id} className="cw-req-item" role="listitem">
                      <div className="cw-req-main">
                        <FurnitureThumb src={items.find(i => i.id === r.itemId)?.image} name={r.itemName || r.items} />
                        <div className="cw-req-info">
                          <div className="cw-req-top">
                            <span className="cw-req-ref">{r.id}</span>
                            <Pill tone={r.urgency === "Urgent" ? "red" : "grey"}>{r.urgency}</Pill>
                          </div>
                          <strong className="cw-req-name">{r.itemName || r.items}</strong>
                          <span className="cw-req-date">Submitted {r.submitted}</span>
                        </div>
                        <div className="cw-req-status">
                          <Pill tone={reqTone(r.status)}>{r.status}</Pill>
                          <button
                            className={`cw-expand-btn${expandedReqId === r.id ? " expanded" : ""}`}
                            onClick={() => setExpandedReqId(expandedReqId === r.id ? null : r.id)}
                            aria-expanded={expandedReqId === r.id}
                            aria-label={expandedReqId === r.id ? `Collapse details for ${r.id}` : `Expand details for ${r.id}`}>
                            <Icon name="arrow" size={15} />
                          </button>
                        </div>
                      </div>
                      {expandedReqId === r.id && (
                        <div className="cw-req-expand" role="region" aria-label={`Details for ${r.id}`}>
                          {r.suburb && <div className="cw-expand-field"><small>Household suburb</small><span>{r.suburb}</span></div>}
                          {r.priorityNotes && <div className="cw-expand-field"><small>Priority notes</small><span>{r.priorityNotes}</span></div>}
                          {r.constraints && <div className="cw-expand-field"><small>Constraints</small><span>{r.constraints}</span></div>}
                          {r.outcome && <div className="cw-expand-field cw-expand-full"><small>Outcome</small><span>{r.outcome}</span></div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>{/* /content */}
      </main>

      {/* ══ P10 request detail sheet ═════════════════════════════════════════════ */}
      {reqDetail && (
        <div className="sheet-layer" role="dialog" aria-modal="true" aria-label={`Request ${reqDetail.id}`}>
          <button className="sheet-scrim" onClick={() => setReqDetail(null)} aria-label="Close request detail" />
          <div className="sheet">
            <div className="sheet-head">
              <div>
                <span className="sheet-title">{reqDetail.id}</span>
                <span style={{ marginLeft: 10 }}><Pill tone={reqTone(reqDetail.status)}>{reqDetail.status}</Pill></span>
              </div>
              <button className="sheet-close-btn" onClick={() => setReqDetail(null)} aria-label="Close"><Icon name="close" size={17} /></button>
            </div>
            <div className="sheet-body">
              <div className="sheet-meta" style={{ paddingTop: 20 }}>
                <small>Request details</small>
                <h2 style={{ fontSize: 17, marginBottom: 14 }}>{reqDetail.items}</h2>
                <div className="sheet-specs">
                  <div className="sheet-spec"><small>Client</small><span>{reqDetail.client}</span></div>
                  <div className="sheet-spec"><small>Urgency</small><span><Pill tone={reqDetail.urgency === "Urgent" ? "red" : "grey"}>{reqDetail.urgency}</Pill></span></div>
                  <div className="sheet-spec"><small>Caseworker</small><span>{reqDetail.caseworker}</span></div>
                  <div className="sheet-spec"><small>Agency</small><span>{reqDetail.organisation}</span></div>
                  {reqDetail.suburb && <div className="sheet-spec"><small>Suburb</small><span>{reqDetail.suburb}</span></div>}
                  <div className="sheet-spec"><small>Submitted</small><span>{reqDetail.submitted}</span></div>
                </div>
                {reqDetail.priorityNotes && (
                  <div style={{ marginTop: 14 }}>
                    <div className="sheet-spec"><small>Priority notes</small><span style={{ fontStyle: "italic" }}>{reqDetail.priorityNotes}</span></div>
                  </div>
                )}
                {reqDetail.constraints && (
                  <div style={{ marginTop: 10 }}>
                    <div className="sheet-spec"><small>Pickup / delivery constraints</small><span>{reqDetail.constraints}</span></div>
                  </div>
                )}
                {reqDetail.outcome && (
                  <div className="req-outcome-box" style={{ marginTop: 14 }}>
                    <small>Outcome</small><p>{reqDetail.outcome}</p>
                  </div>
                )}
              </div>
              {reqDetail.status !== "Approved" && reqDetail.status !== "Fulfilled" && reqDetail.status !== "Closed" && (
                <div className="sheet-req-form">
                  <h3 className="sheet-req-title">Actions</h3>
                  <div className="review-action-row">
                    {reqDetail.status !== "Under review" && (
                      <button className="status-btn" onClick={() => setReqStatus(reqDetail, "Under review")}>Mark under review</button>
                    )}
                    <button className="status-btn active"
                      onClick={() => { openAllocModal(reqDetail); setReqDetail(null); }}>
                      Approve &amp; allocate
                    </button>
                  </div>
                  <div className="d-field" style={{ marginTop: 16 }}>
                    <label className="d-label" htmlFor="decline-note">Decline reason</label>
                    <input id="decline-note" className="d-input" value={declineNote}
                      onChange={e => setDeclineNote(e.target.value)}
                      placeholder="Brief reason — will be recorded as outcome" />
                  </div>
                  <button className="decline-btn" onClick={declineReq}>Close request (decline)</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══ Allocation modal ══════════════════════════════════════════════════════ */}
      {reviewRequest && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-label="Confirm allocation">
          <button className="modal-scrim" onClick={() => { setReviewRequest(null); setSelectedItem(""); setAllocError(""); }} aria-label="Close allocation dialog" />
          <div className="modal compact-modal">
            <button className="modal-close" onClick={() => { setReviewRequest(null); setSelectedItem(""); setAllocError(""); }} aria-label="Close"><Icon name="close" /></button>
            <p className="eyebrow">Approve &amp; allocate</p>
            <h2>Confirm allocation</h2>
            <div className="request-summary">
              <div className="req-sum-row"><small>Request</small><strong>{reviewRequest.id}</strong></div>
              <div className="req-sum-row"><small>Furniture requested</small><span>{reviewRequest.itemName || reviewRequest.items}</span></div>
              <div className="req-sum-row"><small>Caseworker</small><span>{reviewRequest.caseworker} · {reviewRequest.organisation}</span></div>
              {reviewRequest.suburb && <div className="req-sum-row"><small>Suburb</small><span>{reviewRequest.suburb}</span></div>}
              {reviewRequest.priorityNotes && <div className="req-sum-row"><small>Notes</small><span>{reviewRequest.priorityNotes}</span></div>}
              <div className="req-sum-row"><small>Urgency</small><Pill tone={reviewRequest.urgency === "Urgent" ? "red" : "grey"}>{reviewRequest.urgency}</Pill></div>
            </div>
            {(() => {
              const ri = reviewRequest.itemId ? items.find(i => i.id === reviewRequest.itemId) : null;
              if (ri && ri.status !== "Available") {
                return (
                  <div className="conflict-banner" role="alert">
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <Icon name="warn" size={16} aria-hidden="true" />
                      <strong>This item has already been allocated.</strong>
                    </div>
                    <p>{ri.name} ({ri.id}) is currently {ri.status.toLowerCase()}. Select a different available item or close this request.</p>
                  </div>
                );
              }
              return null;
            })()}
            {allocError && (
              <div className="conflict-banner" role="alert">
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <Icon name="warn" size={16} aria-hidden="true" />
                  <strong>Cannot allocate this item</strong>
                </div>
                <p>{allocError}</p>
              </div>
            )}
            <label htmlFor="alloc-item-select">Select an available item to allocate</label>
            <select id="alloc-item-select" value={selectedItem}
              onChange={e => { setSelectedItem(e.target.value); setAllocError(""); }}>
              <option value="">Choose furniture…</option>
              {items.filter(i => i.status === "Available").map(i => (
                <option key={i.id} value={i.id}>{i.name} — {i.id} ({i.location})</option>
              ))}
            </select>
            {items.filter(i => i.status === "Available").length === 0 && (
              <p className="modal-note" style={{ color: "#8b2020" }}>
                No available items in inventory. Items must be marked Available in Inventory before allocation.
              </p>
            )}
            <p className="modal-note">The item will be marked Allocated and an allocation record created. The caseworker will be notified.</p>
            <button className="primary form-submit" disabled={!selectedItem} onClick={confirmAllocation}>
              Confirm allocation <Icon name="check" size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* ══ P8: Offer review sheet ════════════════════════════════════════════════ */}
      {reviewOffer && (
        <div className="sheet-layer" role="dialog" aria-modal="true" aria-label={`Review offer ${reviewOffer.id}`}>
          <button className="sheet-scrim" onClick={() => setReviewOffer(null)} aria-label="Close offer review" />
          <div className="sheet sheet-wide">
            <div className="sheet-head">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="sheet-title">{reviewOffer.id}</span>
                <Pill tone={offerTone(reviewOffer.status)}>{reviewOffer.status}</Pill>
              </div>
              <button className="sheet-close-btn" onClick={() => setReviewOffer(null)} aria-label="Close"><Icon name="close" size={17} /></button>
            </div>
            <div className="sheet-body">
              {reviewOffer.image && (
                <div className="review-offer-photo" aria-hidden="true">
                  <img src={reviewOffer.image} alt="" />
                </div>
              )}
              <div className="sheet-meta">
                <small>Donor</small>
                <h2>{reviewOffer.donor}</h2>
                <div className="sheet-donor-grid">
                  <div className="sheet-donor-cell"><small>Contact</small><span>{reviewOffer.contact}</span></div>
                  <div className="sheet-donor-cell"><small>Method</small><span style={{ textTransform: "capitalize" }}>{reviewOffer.contactMethod}</span></div>
                  <div className="sheet-donor-cell"><small>Suburb</small><span>{reviewOffer.suburb}</span></div>
                  <div className="sheet-donor-cell"><small>Drop-off</small><span>{reviewOffer.canDropOff ? "Yes" : "No — needs collection"}</span></div>
                  {reviewOffer.availability && <div className="sheet-donor-cell sheet-donor-full"><small>Availability</small><span>{reviewOffer.availability}</span></div>}
                  {reviewOffer.access && <div className="sheet-donor-cell sheet-donor-full"><small>Access notes</small><span>{reviewOffer.access}</span></div>}
                </div>
              </div>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--stone)" }}>
                <p className="eyebrow" style={{ marginBottom: 10 }}>Offered items ({reviewOffer.items.length})</p>
                <div className="offer-items-list">
                  {reviewOffer.items.map((oi, idx) => (
                    <div key={idx} className="offer-item-row">
                      <h4>{oi.type}</h4>
                      <div className="offer-item-meta">
                        <div className="cw-expand-field"><small>Condition</small><span>{oi.condition || "—"}</span></div>
                        <div className="cw-expand-field"><small>Dimensions</small><span>{oi.dimensions || "—"}</span></div>
                        <div className="cw-expand-field"><small>Safe to move</small><span>{oi.safeToMove ? "Yes" : "No"}</span></div>
                      </div>
                      {oi.description && <p style={{ fontSize: 13, color: "var(--muted)", margin: "6px 0 0", lineHeight: 1.5 }}>{oi.description}</p>}
                      {oi.concerns && (
                        <p style={{ fontSize: 12.5, margin: "5px 0 0", display: "flex", gap: 5, alignItems: "flex-start" }}>
                          <Icon name="warn" size={14} aria-hidden="true" /><span style={{ color: "#8b4010" }}>{oi.concerns}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="sheet-req-form">
                <h3 className="sheet-req-title">Review</h3>
                {reviewOffer.reviewer && (
                  <div className="reviewer-info">
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }} aria-hidden="true">
                      {reviewOffer.reviewer.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span>Reviewed by <strong>{reviewOffer.reviewer}</strong> · {reviewOffer.reviewedAt}</span>
                  </div>
                )}
                <div className="d-field" style={{ marginTop: reviewOffer.reviewer ? 14 : 0 }}>
                  <div className="d-label" id="offer-status-lbl">Status</div>
                  <div className="status-btn-group" role="group" aria-labelledby="offer-status-lbl">
                    {(["Submitted", "Under review", "Accepted", "Declined", "Collection arranged"] as OfferStatus[]).map(s => (
                      <button key={s} type="button"
                        className={`status-btn${offerStatus === s ? " active" : ""}`}
                        aria-pressed={offerStatus === s}
                        onClick={() => setOfferStatus(s)}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="d-field">
                  <label className="d-label" htmlFor="offer-notes">Review notes</label>
                  <textarea id="offer-notes" className="d-input d-textarea" value={offerNotes}
                    onChange={e => setOfferNotes(e.target.value)}
                    placeholder="Add notes — visible to staff only" rows={3} />
                </div>
                {offerStatus === "Accepted" && reviewOffer.status !== "Accepted" && (
                  <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 12px", padding: "8px 11px", background: "#f0f7f3", border: "1px solid #b8d9c8", borderRadius: 6 }}>
                    Accepting this offer will add {reviewOffer.items.length} item{reviewOffer.items.length > 1 ? "s" : ""} to inventory as "To assess".
                  </p>
                )}
                <button className="primary form-submit" onClick={saveOfferReview}>
                  Save review <Icon name="check" size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ P9: Item detail sheet ═════════════════════════════════════════════════ */}
      {editItem && (
        <div className="sheet-layer" role="dialog" aria-modal="true" aria-label={editItem.name}>
          <button className="sheet-scrim" onClick={() => setEditItem(null)} aria-label="Close item detail" />
          <div className="sheet">
            <div className="sheet-head">
              <div>
                <span className="sheet-title">{editItem.id}</span>
                <span style={{ marginLeft: 10 }}><Pill tone={itemTone(editItem.status)}>{editItem.status}</Pill></span>
              </div>
              <button className="sheet-close-btn" onClick={() => setEditItem(null)} aria-label="Close"><Icon name="close" size={17} /></button>
            </div>
            <div className="sheet-body">
              <div className="sheet-photo-wrap">
                <img src={editItem.image} alt={editItem.name} className="sheet-photo"
                  onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }} />
                <div className="sheet-photo-fallback" aria-hidden="true"><Icon name="sofa" size={40} /></div>
              </div>
              <div className="sheet-meta">
                <small>{editItem.category}</small>
                <h2>{editItem.name}</h2>
                <div className="sheet-specs">
                  <div className="sheet-spec"><small>Condition</small><span>{editItem.condition}</span></div>
                  <div className="sheet-spec"><small>Location</small><span>{editItem.location}</span></div>
                  <div className="sheet-spec"><small>Dimensions</small><span>{editItem.dimensions || "—"}</span></div>
                  <div className="sheet-spec"><small>Colour</small><span>{editItem.colour || "—"}</span></div>
                  <div className="sheet-spec"><small>Material</small><span>{editItem.material || "—"}</span></div>
                  {editItem.sourceOfferId && <div className="sheet-spec"><small>Source offer</small><span>{editItem.sourceOfferId}</span></div>}
                </div>
              </div>
              <div className="sheet-req-form">
                <h3 className="sheet-req-title">Item notes</h3>
                <div className="d-field">
                  <label className="d-label" htmlFor="edit-desc">Description</label>
                  <textarea id="edit-desc" className="d-input d-textarea" value={editDesc}
                    onChange={e => setEditDesc(e.target.value)} rows={3} />
                </div>
                <div className="d-field">
                  <label className="d-label" htmlFor="edit-concerns">Movement concerns</label>
                  <input id="edit-concerns" className="d-input" value={editConcerns}
                    onChange={e => setEditConcerns(e.target.value)}
                    placeholder="e.g. Disassembly required, heavy" />
                </div>
                <button className="primary" style={{ width: "100%", justifyContent: "center", marginBottom: 16 }} onClick={saveItemDetail}>
                  Save notes <Icon name="check" size={16} aria-hidden="true" />
                </button>
                {editItem.status !== "Allocated" && editItem.status !== "Collected" && (
                  <>
                    <h3 className="sheet-req-title">Change status</h3>
                    <div className="status-btn-group" role="group" aria-label="Change item status">
                      {(editItem.status === "To assess" || editItem.status === "Reserved" || editItem.status === "Unavailable") && (
                        <button className="status-btn active" onClick={() => changeItemStatus("Available")} aria-label="Mark as Available">Mark Available</button>
                      )}
                      {editItem.status === "Available" && (
                        <button className="status-btn" onClick={() => changeItemStatus("Reserved")} aria-label="Mark as Reserved">Mark Reserved</button>
                      )}
                      {(editItem.status === "Available" || editItem.status === "Reserved" || editItem.status === "To assess") && (
                        <button className="status-btn" style={{ color: "#8b2020" }} onClick={() => changeItemStatus("Unavailable")} aria-label="Mark as Unavailable">Mark Unavailable</button>
                      )}
                    </div>
                    {editItem.status === "To assess" && (
                      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>
                        "Mark Available" makes this item visible to caseworkers.
                      </p>
                    )}
                  </>
                )}
                {(editItem.status === "Allocated" || editItem.status === "Collected") && (
                  <p style={{ fontSize: 12.5, color: "var(--muted)", padding: "10px 12px", background: "var(--canvas)", border: "1px solid var(--stone)", borderRadius: 6 }}>
                    Status is managed by the allocation flow and cannot be changed manually.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ P4: Caseworker item detail sheet ══════════════════════════════════════ */}
      {furnitureItem && (
        <div className="sheet-layer" role="dialog" aria-modal="true" aria-label={furnitureItem.name}>
          <button className="sheet-scrim" onClick={closeSheet} aria-label="Close item detail" />
          <div className="sheet">
            <div className="sheet-head">
              <span className="sheet-title">Item details</span>
              <button className="sheet-close-btn" onClick={closeSheet} aria-label="Close"><Icon name="close" size={17} /></button>
            </div>
            <div className="sheet-body">
              <div className="sheet-photo-wrap">
                <img src={furnitureItem.image} alt={furnitureItem.name} className="sheet-photo"
                  onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }} />
                <div className="sheet-photo-fallback" aria-hidden="true"><Icon name="sofa" size={40} /></div>
                <div style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}><Pill tone="green">Available</Pill></div>
              </div>
              <div className="sheet-meta">
                <small>{furnitureItem.id} · {furnitureItem.category}</small>
                <h2>{furnitureItem.name}</h2>
                <div className="sheet-specs">
                  <div className="sheet-spec"><small>Condition</small><span>{furnitureItem.condition}</span></div>
                  <div className="sheet-spec"><small>Dimensions</small><span>{furnitureItem.dimensions || "—"}</span></div>
                  <div className="sheet-spec"><small>Colour</small><span>{furnitureItem.colour || "—"}</span></div>
                  <div className="sheet-spec"><small>Material</small><span>{furnitureItem.material || "—"}</span></div>
                </div>
                {furnitureItem.description && <p className="sheet-desc">{furnitureItem.description}</p>}
              </div>
              <div className="sheet-req-form">
                {reqConfirm ? (
                  <div className="req-confirm-box" role="status">
                    <div className="req-confirm-icon" aria-hidden="true"><Icon name="check" size={20} /></div>
                    <strong>Request submitted</strong>
                    <div className="req-confirm-ref">{reqConfirm.ref}</div>
                    <p>Your request has been sent to the ReHome team. This item has not been reserved — they will contact you to confirm.</p>
                    <button className="primary" style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => { closeSheet(); go("cw-requests"); }}>
                      View my requests <Icon name="arrow" size={16} aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="sheet-req-title">Request this item</h3>
                    <div className="sheet-req-who">
                      <div className="cw-expand-field"><small>Caseworker</small><span>{currentUser?.name}</span></div>
                      <div className="cw-expand-field"><small>Agency</small><span>{currentUser?.title}</span></div>
                    </div>
                    <form onSubmit={submitItemRequest} noValidate aria-label="Item request form">
                      <div className="d-field">
                        <label className="d-label" htmlFor="req-client">
                          Client reference (initials only) <span className="d-req" aria-hidden="true">*</span>
                        </label>
                        <input id="req-client" className={`d-input${reqErrors.client ? " input-error" : ""}`}
                          autoFocus value={reqForm.client}
                          onChange={e => { setReqForm(f => ({ ...f, client: e.target.value })); setReqErrors(er => { const n = { ...er }; delete n.client; return n; }); }}
                          placeholder="e.g. Client J. A."
                          aria-describedby={reqErrors.client ? "err-req-client" : undefined} />
                        {reqErrors.client && <span id="err-req-client" className="field-error" role="alert"><Icon name="warn" size={12} />{reqErrors.client}</span>}
                      </div>
                      <div className="d-field">
                        <label className="d-label" htmlFor="req-suburb">
                          Household suburb <span className="d-req" aria-hidden="true">*</span>
                        </label>
                        <input id="req-suburb" className={`d-input${reqErrors.suburb ? " input-error" : ""}`}
                          value={reqForm.suburb}
                          onChange={e => { setReqForm(f => ({ ...f, suburb: e.target.value })); setReqErrors(er => { const n = { ...er }; delete n.suburb; return n; }); }}
                          placeholder="e.g. Fitzroy"
                          aria-describedby={reqErrors.suburb ? "err-req-suburb" : undefined} />
                        {reqErrors.suburb && <span id="err-req-suburb" className="field-error" role="alert"><Icon name="warn" size={12} />{reqErrors.suburb}</span>}
                      </div>
                      <div className="d-field">
                        <label className="d-label" htmlFor="req-notes">Priority notes <span className="d-opt">(optional)</span></label>
                        <textarea id="req-notes" className="d-input d-textarea" value={reqForm.priorityNotes}
                          onChange={e => setReqForm(f => ({ ...f, priorityNotes: e.target.value }))}
                          placeholder="Reason for urgency or specific needs…" rows={2} />
                      </div>
                      <div className="d-field">
                        <label className="d-label" htmlFor="req-constraints">Pickup / delivery constraints <span className="d-opt">(optional)</span></label>
                        <input id="req-constraints" className="d-input" value={reqForm.constraints}
                          onChange={e => setReqForm(f => ({ ...f, constraints: e.target.value }))}
                          placeholder="e.g. Ground floor only" />
                      </div>
                      <div className="d-field">
                        <div className="d-label" id="req-urgency-lbl">Urgency</div>
                        <div className="radio-group" role="group" aria-labelledby="req-urgency-lbl">
                          <label className="radio-label"><input type="radio" name="sheet-urgency" value="Standard" checked={reqForm.urgency === "Standard"} onChange={() => setReqForm(f => ({ ...f, urgency: "Standard" }))} /> Standard</label>
                          <label className="radio-label"><input type="radio" name="sheet-urgency" value="Urgent"   checked={reqForm.urgency === "Urgent"}   onChange={() => setReqForm(f => ({ ...f, urgency: "Urgent" }))}   /> Urgent</label>
                        </div>
                      </div>
                      <p className="modal-note">Submitting does not reserve the item. The ReHome team will confirm availability.</p>
                      <button type="submit" className="primary form-submit">
                        Submit request <Icon name="arrow" size={16} aria-hidden="true" />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ─────────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`toast${toast.type === "error" ? " toast-error" : ""}`}
          role="status" aria-live="polite" aria-atomic="true">
          <span aria-hidden="true"><Icon name={toast.type === "error" ? "warn" : "check"} size={16} /></span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

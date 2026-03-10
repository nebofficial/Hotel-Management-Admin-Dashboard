"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Home,
  Calendar,
  DoorOpen,
  Users,
  BarChart3,
  Settings,
  ChevronDown,
  UtensilsCrossed,
  Package,
  Wallet,
  FileText,
  Megaphone,
  Building2,
  HelpCircle,
  LayoutGrid,
  List,
  PlusCircle,
  Activity,
  Sparkles,
  ClipboardList,
  Wrench,
  Layers,
} from "lucide-react"
import { useSidebar } from "@/app/sidebar-context"
import { useAuth } from "@/app/auth-context"
import { useLanguage } from "@/app/language-context"

// Menu items with permission mapping and translation keys (tk) for subItems
const allMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    permission: "Dashboard",
    subItems: [
      { label: "Overview / KPIs", href: "/dashboard/overview", tk: "overview" },
      { label: "Today's Check-ins/Check-outs", href: "/dashboard/checkins", tk: "checkins" },
      { label: "Occupancy Rate", href: "/dashboard/occupancy", tk: "occupancy" },
      { label: "Revenue Summary", href: "/dashboard/revenue", tk: "revenue" },
      { label: "Alerts & Notifications", href: "/dashboard/alerts", tk: "alerts" },
    ],
  },
  {
    id: "reservations",
    label: "Reservations & Front Office",
    icon: Calendar,
    href: "/reservations/dashboard",
    permission: "Reservations & Front Office",
    subItems: [
      { label: "Dashboard", href: "/reservations/dashboard", tk: "dashboard" },
      { label: "New Reservation", href: "/reservations/new", tk: "new" },
      { label: "Reservation List", href: "/reservations/list", tk: "list" },
      { label: "Group Bookings", href: "/reservations/groups", tk: "groups" },
      { label: "Walk-in Booking", href: "/reservations/walkin/new-walkin", tk: "walkin_new" },
      { label: "Walk-in List", href: "/reservations/walkin/walkin-list", tk: "walkin_list" },
      { label: "Room Availability Calendar", href: "/reservations/availability-calendar", tk: "availability" },
      { label: "Check-In", href: "/reservations/checkin", tk: "checkin" },
      { label: "Check-Out", href: "/reservations/checkout", tk: "checkout" },
      { label: "Early Check-In / Late Check-Out", href: "/reservations/early-late", tk: "early_late" },
      { label: "Cancellation / No-Show", href: "/cancellations", tk: "cancellation" },
    ],
  },
  {
    id: "rooms",
    label: "Rooms & Property",
    icon: DoorOpen,
    href: "/rooms/list",
    permission: "Rooms & Property",
    subItems: [
      { label: "Room Types", href: "/rooms/types", icon: LayoutGrid, tk: "types" },
      { label: "Add Room", href: "/rooms/add", icon: PlusCircle, tk: "add" },
      { label: "Room List", href: "/rooms/list", icon: List, tk: "list" },
      { label: "Room Status", href: "/rooms/status", icon: Activity, tk: "status" },
      { label: "Housekeeping Assignment", href: "/rooms/housekeeping", icon: ClipboardList, tk: "housekeeping" },
      { label: "Maintenance Requests", href: "/rooms/maintenance", icon: Wrench, tk: "maintenance" },
      { label: "Floor Management", href: "/rooms/floors", icon: Layers, tk: "floors" },
      { label: "Amenities Management", href: "/rooms/amenities", icon: Sparkles, tk: "amenities" },
    ],
  },
  {
    id: "guests",
    label: "Guests & CRM",
    icon: Users,
    href: "/guests",
    permission: "Guests & CRM",
    subItems: [
      { label: "Guest Profiles", href: "/guests/profiles", tk: "profiles" },
      { label: "Guest History", href: "/guests/history", tk: "history" },
      { label: "VIP / Blacklist", href: "/guests/vip", tk: "vip" },
      { label: "Preferences & Notes", href: "/guests/preferences", tk: "preferences" },
      { label: "Loyalty Program", href: "/guests/loyalty", tk: "loyalty" },
      { label: "Feedback / Complaints", href: "/guests/feedback", tk: "feedback" },
    ],
  },
  {
    id: "housekeeping",
    label: "Housekeeping",
    icon: DoorOpen,
    href: "/housekeeping",
    permission: "Housekeeping",
    subItems: [
      { label: "Daily Cleaning Schedule", href: "/housekeeping/schedule", tk: "schedule" },
      { label: "Room Inspection", href: "/housekeeping/inspection", tk: "inspection" },
      { label: "Laundry Management", href: "/housekeeping/laundry", tk: "laundry" },
      { label: "Linen Inventory", href: "/housekeeping/linen", tk: "linen" },
      { label: "Staff Assignment", href: "/housekeeping/staff", tk: "staff" },
    ],
  },
  {
    id: "restaurant",
    label: "Restaurant / POS",
    icon: UtensilsCrossed,
    href: "/restaurant",
    permission: "Restaurant / POS",
    subItems: [
      { label: "POS Billing", href: "/restaurant/billing", tk: "billing" },
      { label: "Table Management", href: "/restaurant/tables", tk: "tables" },
      { label: "Menu Management", href: "/restaurant/menu", tk: "menu" },
      { label: "Combo / Offers", href: "/restaurant/offers", tk: "offers" },
      { label: "Kitchen Order Tickets (KOT)", href: "/restaurant/kot", tk: "kot" },
      { label: "Bar Order Tracking (BOT)", href: "/restaurant/bot", tk: "bot" },
      { label: "Room Service Orders", href: "/restaurant/roomservice", tk: "roomservice" },
      { label: "Takeaway / Delivery", href: "/restaurant/takeaway", tk: "takeaway" },
      { label: "Happy Hour Pricing", href: "/restaurant/happy-hour-pricing", tk: "happyhour" },
    ],
  },
  {
    id: "inventory",
    label: "Inventory & Store",
    icon: Package,
    href: "/inventory",
    permission: "Inventory & Store",
    subItems: [
      { label: "Item Categories", href: "/inventory/categories", tk: "categories" },
      { label: "Stock Items", href: "/inventory/items", tk: "items" },
      { label: "Purchase Orders", href: "/inventory/orders", tk: "orders" },
      { label: "Supplier Management", href: "/inventory/suppliers", tk: "suppliers" },
      { label: "GRN (Goods Received Note)", href: "/inventory/grn", tk: "grn" },
      { label: "Stock Transfer", href: "/inventory/transfer", tk: "transfer" },
      { label: "Stock Adjustment", href: "/inventory/adjustment", tk: "adjustment" },
      { label: "Minimum Stock Alerts", href: "/inventory/alerts", tk: "alerts" },
    ],
  },
  {
    id: "accounting",
    label: "Accounting & Finance",
    icon: Wallet,
    href: "/accounting",
    permission: "Accounting & Finance",
    subItems: [
      { label: "Finance Dashboard", href: "/accounting/finance-dashboard", tk: "dashboard" },
      { label: "Chart of Accounts", href: "/accounting/chart-of-accounts", tk: "chart" },
      { label: "Guest Ledger", href: "/accounting/guest-ledger", tk: "ledger" },
      { label: "Cash & Bank / BRS", href: "/accounting/cash-bank", tk: "cash" },
      { label: "Day Closing", href: "/accounting/dayclosing", tk: "dayclosing" },
      { label: "Invoices", href: "/accounting/invoices", tk: "invoices" },
      { label: "Payments & Receipts", href: "/accounting/payments", tk: "payments" },
      { label: "Expenses", href: "/accounting/expenses", tk: "expenses" },
      { label: "Taxes (GST / VAT / Service Charge)", href: "/accounting/taxes", tk: "taxes" },
      { label: "Journal Entries", href: "/accounting/journal-entries", tk: "journal" },
      { label: "Profit & Loss", href: "/accounting/profit-loss", tk: "pl" },
      { label: "Balance Sheet", href: "/accounting/balance-sheet", tk: "balance" },
      { label: "Trial Balance", href: "/accounting/trial", tk: "trial" },
    ],
  },
  {
    id: "billing",
    label: "Billing & Invoicing",
    icon: FileText,
    href: "/billing/dashboard",
    permission: "Billing & Invoicing",
    subItems: [
      { label: "Dashboard", href: "/billing/dashboard", tk: "dashboard" },
      { label: "Room Bills", href: "/billing/roombills", tk: "roombills" },
      { label: "Restaurant Bills", href: "/billing/restaurant/bills", tk: "restbills" },
      { label: "Combined Bills", href: "/billing/combined", tk: "combined" },
      { label: "Advance Payments", href: "/billing/advance", tk: "advance" },
      { label: "Refunds", href: "/billing/refunds", tk: "refunds" },
      { label: "Credit Notes", href: "/billing/credit-notes", tk: "credit" },
      { label: "Corporate Billing", href: "/billing/corporate-billing", tk: "corporate" },
    ],
  },
  {
    id: "staff",
    label: "Staff & HR",
    icon: Users,
    href: "/staff/dashboard",
    permission: "Staff & HR",
    subItems: [
      { label: "HR Dashboard", href: "/staff/dashboard", tk: "dashboard" },
      { label: "Staff List", href: "/staff/list", tk: "list" },
      { label: "Roles & Permissions", href: "/staff/roles-permissions", tk: "roles" },
      { label: "Attendance", href: "/staff/attendance", tk: "attendance" },
      { label: "Shift Management", href: "/staff/shift-management", tk: "shifts" },
      { label: "Payroll", href: "/staff/payroll", tk: "payroll" },
      { label: "Commission Setup", href: "/staff/commission-setup", tk: "commission" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    href: "/reports",
    permission: "Reports",
    subItems: [
      { label: "Occupancy Report", href: "/reports/occupancy", tk: "occupancy" },
      { label: "Revenue Report", href: "/reports/revenue", tk: "revenue" },
      { label: "Room Revenue", href: "/reports/roomrevenue", tk: "room_revenue" },
      { label: "Restaurant Sales", href: "/reports/sales", tk: "sales" },
      { label: "Tax Report", href: "/reports/tax", tk: "tax" },
      { label: "Expense Report", href: "/reports/expense", tk: "expense" },
      { label: "Inventory Report", href: "/reports/inventory", tk: "inventory" },
      { label: "Staff Performance", href: "/reports/staff", tk: "staff" },
      { label: "Audit Logs", href: "/reports/audit", tk: "audit" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing & OTA",
    icon: Megaphone,
    href: "/marketing/dashboard",
    permission: "Marketing & OTA",
    subItems: [
      { label: "Marketing & OTA Dashboard", href: "/marketing/dashboard", tk: "dashboard" },
      { label: "Rate Plans", href: "/rate-plans", tk: "rates" },
      { label: "Seasonal Pricing", href: "/seasonal-pricing", tk: "seasonal" },
      { label: "Promo Codes", href: "/promo-codes", tk: "promos" },
      { label: "Email / SMS Campaigns", href: "/marketing/campaigns", tk: "campaigns" },
    ],
  },
  {
    id: "multi-property",
    label: "Multi-Property",
    icon: Building2,
    href: "/multi-property",
    permission: "Multi-Property",
    subItems: [
      { label: "Multi-Property Dashboard", href: "/multi-property", tk: "dashboard" },
      { label: "Property List", href: "/multi-property/properties", tk: "list" },
      { label: "Central Dashboard", href: "/multi-property/central", tk: "central" },
      { label: "Property-wise Reports", href: "/multi-property/reports", tk: "reports" },
      { label: "User Access Control", href: "/multi-property/access", tk: "access" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
    permission: "Settings",
    subItems: [
      { label: "Hotel Profile", href: "/settings/profile", tk: "profile" },
      { label: "Check-in / Check-out Rules", href: "/settings/rules", tk: "rules" },
      { label: "Currency & Language", href: "/settings/currency", tk: "currency" },
      { label: "Taxes & Charges", href: "/settings/taxes", tk: "taxes" },
      { label: "Payment Methods", href: "/settings/payment", tk: "payment" },
      { label: "Invoice Templates", href: "/settings/templates", tk: "templates" },
      { label: "POS Settings", href: "/settings/pos", tk: "pos" },
      { label: "Integration Settings", href: "/settings/integration", tk: "integration" },
      { label: "Themes", href: "/settings/themes", tk: "themes" },
    ],
  },
  {
    id: "help",
    label: "Help & System",
    icon: HelpCircle,
    href: "/help",
    permission: "Help & System",
    subItems: [
      { label: "User Guide", href: "/help/guide", tk: "guide" },
      { label: "Support Tickets", href: "/help/tickets", tk: "tickets" },
      { label: "Activity Logs", href: "/help/logs", tk: "logs" },
      { label: "Backup & Restore", href: "/help/backup", tk: "backup" },
      { label: "System Updates", href: "/help/updates", tk: "updates" },
    ],
  },
]

function menuKey(id: string) {
  return id.replace(/-/g, "_")
}

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const { isCollapsed, isMobileOpen, closeMobileSidebar } = useSidebar()
  const { user, plan, loading } = useAuth()
  const { t } = useLanguage()

  // Filter menu items based on plan permissions
  const getFilteredMenuItems = () => {
    // If no user, return empty array (sidebar will be hidden)
    if (!user) {
      return []
    }

    // If user is super_admin, show all menu items
    if (user.role === "super_admin") {
      return allMenuItems
    }

    // If no plan or no permissions, show only Dashboard and Settings
    if (!plan || !plan.permissions || plan.permissions.length === 0) {
      return allMenuItems.filter(
        (item) => item.permission === "Dashboard" || item.permission === "Settings"
      )
    }

    // Filter menu items based on plan permissions
    return allMenuItems.filter((item) => plan.permissions.includes(item.permission))
  }

  const menuItems = getFilteredMenuItems()

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      // Accordion behavior: if clicking the same item, close it; otherwise, open only this one
      if (prev.includes(id)) {
        return [] // Close the currently open menu
      } else {
        return [id] // Open only this menu, closing all others
      }
    })
  }

  // Don't show sidebar if user is not logged in
  if (loading || !user) {
    return null
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-linear-to-b from-red-900 to-red-950 text-white z-30 overflow-y-auto transition-all duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 md:flex ${
          isCollapsed ? "md:w-20" : "md:w-64"
        }`}
      >
        <nav className="p-4 space-y-2">
          {menuItems.length === 0 ? (
            <div className="text-amber-100 text-sm p-4">
              {t("menu.no_items")}
            </div>
          ) : (
            menuItems.map((item) => {
              const hasSubItems = item.subItems.length > 0
              const isExpanded = expandedItems.includes(item.id)
              const mKey = menuKey(item.id)
              const itemLabel = t(`menu.${mKey}`)

              return (
                <div key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      toggleExpand(item.id)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-700/50 transition-colors text-left"
                    title={itemLabel}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="font-medium flex-1">{itemLabel}</span>
                        {hasSubItems && (
                          <ChevronDown
                            className={`w-5 h-5 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </>
                    )}
                  </Link>

                  {/* Sub-menu items */}
                  {hasSubItems && isExpanded && !isCollapsed && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-amber-400/30 pl-4">
                      {item.subItems.map((subItem, idx) => {
                        const SubIcon = "icon" in subItem ? (subItem as { icon?: React.ComponentType<{ className?: string }> }).icon : undefined
                        const subTk = "tk" in subItem ? (subItem as { tk: string }).tk : ""
                        const subLabel = subTk ? t(`menu.${mKey}_${subTk}`) : subItem.label
                        return (
                          <Link
                            key={idx}
                            href={subItem.href}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-amber-100 hover:text-white hover:bg-red-700/30 transition-colors"
                          >
                            {SubIcon && <SubIcon className="w-4 h-4 shrink-0 opacity-90" />}
                            {subLabel}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </nav>
      </aside>
    </>
  )
}

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

// Menu items with permission mapping
const allMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    permission: "Dashboard",
    subItems: [
      { label: "Overview / KPIs", href: "/dashboard/overview" },
      { label: "Today's Check-ins/Check-outs", href: "/dashboard/checkins" },
      { label: "Occupancy Rate", href: "/dashboard/occupancy" },
      { label: "Revenue Summary", href: "/dashboard/revenue" },
      { label: "Alerts & Notifications", href: "/dashboard/alerts" },
    ],
  },
  {
    id: "reservations",
    label: "Reservations & Front Office",
    icon: Calendar,
    href: "/reservations/dashboard",
    permission: "Reservations & Front Office",
    subItems: [
      { label: "Dashboard", href: "/reservations/dashboard" },
      { label: "New Reservation", href: "/reservations/new" },
      { label: "Reservation List", href: "/reservations/list" },
      { label: "Group Bookings", href: "/reservations/groups" },
      { label: "Walk-in Booking", href: "/reservations/walkin/new-walkin" },
      { label: "Walk-in List", href: "/reservations/walkin/walkin-list" },
      { label: "Room Availability Calendar", href: "/reservations/availability-calendar" },
      { label: "Check-In", href: "/reservations/checkin" },
      { label: "Check-Out", href: "/reservations/checkout" },
      { label: "Early Check-In / Late Check-Out", href: "/reservations/early-late" },
      { label: "Cancellation / No-Show", href: "/cancellations" },
    ],
  },
  {
    id: "rooms",
    label: "Rooms & Property",
    icon: DoorOpen,
    href: "/rooms/list",
    permission: "Rooms & Property",
    subItems: [
      { label: "Room Types", href: "/rooms/types", icon: LayoutGrid },
      { label: "Add Room", href: "/rooms/add", icon: PlusCircle },
      { label: "Room List", href: "/rooms/list", icon: List },
      { label: "Room Status", href: "/rooms/status", icon: Activity },
      { label: "Housekeeping Assignment", href: "/rooms/housekeeping", icon: ClipboardList },
      { label: "Maintenance Requests", href: "/rooms/maintenance", icon: Wrench },
      { label: "Floor Management", href: "/rooms/floors", icon: Layers },
      { label: "Amenities Management", href: "/rooms/amenities", icon: Sparkles },
    ],
  },
  {
    id: "guests",
    label: "Guests & CRM",
    icon: Users,
    href: "/guests",
    permission: "Guests & CRM",
    subItems: [
      { label: "Guest Profiles", href: "/guests/profiles" },
      { label: "Guest History", href: "/guests/history" },
      { label: "VIP / Blacklist", href: "/guests/vip" },
      { label: "Preferences & Notes", href: "/guests/preferences" },
      { label: "Loyalty Program", href: "/guests/loyalty" },
      { label: "Feedback / Complaints", href: "/guests/feedback" },
    ],
  },
  {
    id: "housekeeping",
    label: "Housekeeping",
    icon: DoorOpen,
    href: "/housekeeping",
    permission: "Housekeeping",
    subItems: [
      { label: "Daily Cleaning Schedule", href: "/housekeeping/schedule" },
      { label: "Room Inspection", href: "/housekeeping/inspection" },
      { label: "Laundry Management", href: "/housekeeping/laundry" },
      { label: "Linen Inventory", href: "/housekeeping/linen" },
      { label: "Staff Assignment", href: "/housekeeping/staff" },
    ],
  },
  {
    id: "restaurant",
    label: "Restaurant / POS",
    icon: UtensilsCrossed,
    href: "/restaurant",
    permission: "Restaurant / POS",
    subItems: [
      { label: "POS Billing", href: "/restaurant/billing" },
      { label: "Table Management", href: "/restaurant/tables" },
      { label: "Menu Management", href: "/restaurant/menu" },
      { label: "Combo / Offers", href: "/restaurant/offers" },
      { label: "Kitchen Order Tickets (KOT)", href: "/restaurant/kot" },
      { label: "Bar Order Tracking (BOT)", href: "/restaurant/bot" },
      { label: "Room Service Orders", href: "/restaurant/roomservice" },
      { label: "Takeaway / Delivery", href: "/restaurant/takeaway" },
      { label: "Happy Hour Pricing", href: "/restaurant/happy-hour-pricing" },
    ],
  },
  {
    id: "inventory",
    label: "Inventory & Store",
    icon: Package,
    href: "/inventory",
    permission: "Inventory & Store",
    subItems: [
      { label: "Item Categories", href: "/inventory/categories" },
      { label: "Stock Items", href: "/inventory/items" },
      { label: "Purchase Orders", href: "/inventory/orders" },
      { label: "Supplier Management", href: "/inventory/suppliers" },
      { label: "GRN (Goods Received Note)", href: "/inventory/grn" },
      { label: "Stock Transfer", href: "/inventory/transfer" },
      { label: "Stock Adjustment", href: "/inventory/adjustment" },
      { label: "Minimum Stock Alerts", href: "/inventory/alerts" },
    ],
  },
  {
    id: "accounting",
    label: "Accounting & Finance",
    icon: Wallet,
    href: "/accounting",
    permission: "Accounting & Finance",
    subItems: [
      { label: "Finance Dashboard", href: "/accounting/finance-dashboard" },
      { label: "Chart of Accounts", href: "/accounting/chart-of-accounts" },
      { label: "Guest Ledger", href: "/accounting/guest-ledger" },
      { label: "Cash & Bank / BRS", href: "/accounting/cash-bank" },
      { label: "Day Closing", href: "/accounting/dayclosing" },
      { label: "Invoices", href: "/accounting/invoices" },
      { label: "Payments & Receipts", href: "/accounting/payments" },
      { label: "Expenses", href: "/accounting/expenses" },
      { label: "Taxes (GST / VAT / Service Charge)", href: "/accounting/taxes" },
      { label: "Journal Entries", href: "/accounting/journal-entries" },
      { label: "Profit & Loss", href: "/accounting/profit-loss" },
      { label: "Balance Sheet", href: "/accounting/balance-sheet" },
      { label: "Trial Balance", href: "/accounting/trial" },
    ],
  },
  {
    id: "billing",
    label: "Billing & Invoicing",
    icon: FileText,
    href: "/billing/dashboard",
    permission: "Billing & Invoicing",
    subItems: [
      { label: "Dashboard", href: "/billing/dashboard" },
      { label: "Room Bills", href: "/billing/roombills" },
      { label: "Restaurant Bills", href: "/billing/restaurant/bills" },
      { label: "Combined Bills", href: "/billing/combined" },
      { label: "Advance Payments", href: "/billing/advance" },
      { label: "Refunds", href: "/billing/refunds" },
      { label: "Credit Notes", href: "/billing/credit-notes" },
      { label: "Corporate Billing", href: "/billing/corporate-billing" },
    ],
  },
  {
    id: "staff",
    label: "Staff & HR",
    icon: Users,
    href: "/staff",
    permission: "Staff & HR",
    subItems: [
      { label: "Staff List", href: "/staff/list" },
      { label: "Roles & Permissions", href: "/staff/roles" },
      { label: "Attendance", href: "/staff/attendance" },
      { label: "Shift Management", href: "/staff/shifts" },
      { label: "Payroll", href: "/staff/payroll" },
      { label: "Commission Setup", href: "/staff/commission" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    href: "/reports",
    permission: "Reports",
    subItems: [
      { label: "Occupancy Report", href: "/reports/occupancy" },
      { label: "Revenue Report", href: "/reports/revenue" },
      { label: "Room Revenue", href: "/reports/roomrevenue" },
      { label: "Restaurant Sales", href: "/reports/sales" },
      { label: "Tax Report", href: "/reports/tax" },
      { label: "Expense Report", href: "/reports/expense" },
      { label: "Inventory Report", href: "/reports/inventory" },
      { label: "Staff Performance", href: "/reports/staff" },
      { label: "Audit Logs", href: "/reports/audit" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing & OTA",
    icon: Megaphone,
    href: "/marketing",
    permission: "Marketing & OTA",
    subItems: [
      { label: "Rate Plans", href: "/marketing/rates" },
      { label: "Seasonal Pricing", href: "/marketing/seasonal" },
      { label: "Promo Codes", href: "/marketing/promos" },
      { label: "Email / SMS Campaigns", href: "/marketing/campaigns" },
    ],
  },
  {
    id: "multi-property",
    label: "Multi-Property",
    icon: Building2,
    href: "/multi-property",
    permission: "Multi-Property",
    subItems: [
      { label: "Property List", href: "/multi-property/list" },
      { label: "Central Dashboard", href: "/multi-property/central" },
      { label: "Property-wise Reports", href: "/multi-property/reports" },
      { label: "User Access Control", href: "/multi-property/access" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
    permission: "Settings",
    subItems: [
      { label: "Hotel Profile", href: "/settings/profile" },
      { label: "Check-in / Check-out Rules", href: "/settings/rules" },
      { label: "Currency & Language", href: "/settings/currency" },
      { label: "Taxes & Charges", href: "/settings/taxes" },
      { label: "Payment Methods", href: "/settings/payment" },
      { label: "Invoice Templates", href: "/settings/templates" },
      { label: "POS Settings", href: "/settings/pos" },
      { label: "Integration Settings", href: "/settings/integration" },
      { label: "Themes", href: "/settings/themes" },
    ],
  },
  {
    id: "help",
    label: "Help & System",
    icon: HelpCircle,
    href: "/help",
    permission: "Help & System",
    subItems: [
      { label: "User Guide", href: "/help/guide" },
      { label: "Support Tickets", href: "/help/tickets" },
      { label: "Activity Logs", href: "/help/logs" },
      { label: "Backup & Restore", href: "/help/backup" },
      { label: "System Updates", href: "/help/updates" },
    ],
  },
]

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const { isCollapsed, isMobileOpen, closeMobileSidebar } = useSidebar()
  const { user, plan, loading } = useAuth()

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
              No menu items available. Please contact your administrator.
            </div>
          ) : (
            menuItems.map((item) => {
              const hasSubItems = item.subItems.length > 0
              const isExpanded = expandedItems.includes(item.id)

              return (
                <div key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      toggleExpand(item.id)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-700/50 transition-colors text-left"
                    title={item.label}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="font-medium flex-1">{item.label}</span>
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
                        return (
                          <Link
                            key={idx}
                            href={subItem.href}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-amber-100 hover:text-white hover:bg-red-700/30 transition-colors"
                          >
                            {SubIcon && <SubIcon className="w-4 h-4 shrink-0 opacity-90" />}
                            {subItem.label}
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

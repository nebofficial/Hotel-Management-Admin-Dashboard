import { Phone, MessageCircle, Mail, Heart } from "lucide-react"

export function TopContactBar() {
  const contactMethods = [
    {
      id: "phone",
      label: "Call Us",
      icon: Phone,
      bgColor: "bg-yellow-400",
      textColor: "text-yellow-900",
      href: "tel:+15551234567",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      bgColor: "bg-green-500",
      textColor: "text-white",
      href: "https://wa.me/15551234567",
    },
    {
      id: "email",
      label: "Email",
      icon: Mail,
      bgColor: "bg-rose-400",
      textColor: "text-white",
      href: "mailto:contact@littleguru.com",
    },
    {
      id: "inquiry",
      label: "Inquiry",
      icon: Heart,
      bgColor: "bg-amber-500",
      textColor: "text-amber-900",
      href: "#contact",
    },
  ]

  return (
    <div className="flex flex-col gap-0">
      {contactMethods.map((method) => {
        const Icon = method.icon
        return (
          <a
            key={method.id}
            href={method.href}
            target={method.id === "whatsapp" ? "_blank" : undefined}
            rel={method.id === "whatsapp" ? "noopener noreferrer" : undefined}
            className={`${method.bgColor} ${method.textColor} px-4 py-2.5 flex items-center gap-2 hover:opacity-90 transition-opacity`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs md:text-sm font-medium">{method.label}</span>
          </a>
        )
      })}
    </div>
  )
}

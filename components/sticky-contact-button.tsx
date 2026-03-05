"use client"

import { Phone, MessageCircle, Mail, Heart, X } from "lucide-react"
import { useState } from "react"

export function StickyContactButton() {
  const [isOpen, setIsOpen] = useState(false)

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
    <>
      {/* Popup modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black/20"
            onClick={() => setIsOpen(false)}
          />

          {/* Popup container */}
          <div className="relative bg-white rounded-lg shadow-2xl w-40 z-50">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-red-950 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Contact buttons */}
            <div className="flex flex-col gap-0">
              {contactMethods.map((method) => {
                const Icon = method.icon
                return (
                  <a
                    key={method.id}
                    href={method.href}
                    target={method.id === "whatsapp" ? "_blank" : undefined}
                    rel={method.id === "whatsapp" ? "noopener noreferrer" : undefined}
                    className={`${method.bgColor} ${method.textColor} px-4 py-3 hover:opacity-90 transition-opacity flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-semibold">{method.label}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Heart button - always visible */}
      <div className="fixed right-4 bottom-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-amber-500 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart className="w-6 h-6 fill-white" />
        </button>
      </div>
    </>
  )
}

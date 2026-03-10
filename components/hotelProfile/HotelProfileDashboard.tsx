"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/auth-context";
import {
  fetchHotelProfile,
  updateHotelProfile,
  uploadHotelLogo,
} from "@/services/api/hotelProfileApi";
import { HotelProfileHeader } from "./HotelProfileHeader";
import { HotelIdentityOverview } from "./HotelIdentityOverview";
import { HotelBasicInfoForm } from "./HotelBasicInfoForm";
import { HotelLogoUploader } from "./HotelLogoUploader";
import { HotelContactInfoForm } from "./HotelContactInfoForm";
import { HotelAddressForm } from "./HotelAddressForm";
import { SocialMediaLinksPanel } from "./SocialMediaLinksPanel";
import { OperationalHoursPanel } from "./OperationalHoursPanel";
import { SaveProfileButton } from "./SaveProfileButton";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ProfileState = {
  name: string;
  description: string;
  logoUrl: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  plan?: string;
  currency?: string;
  language?: string;
  timezone?: string;
  dateFormat?: string;
  timeFormat?: string;
  currencySymbol?: string;
  openingTime: string;
  closingTime: string;
  specialHolidayHours: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
};

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

export default function HotelProfileDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [street, city, state, country, zip] = useMemo(() => {
    const location = profile?.location || "";
    const parts = location.split(",").map((p) => p.trim());
    return [
      parts[0] || "",
      parts[1] || "",
      parts[2] || "",
      parts[3] || "",
      parts[4] || "",
    ];
  }, [profile?.location]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user?.hotelId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchHotelProfile(API_BASE, user.hotelId);
        if (cancelled) return;
        const incoming = "profile" in data ? data.profile : data;
        setProfile((prev) => ({
          name: incoming.name || prev?.name || "",
          description: incoming.description || prev?.description || "",
          logoUrl: incoming.logoUrl || prev?.logoUrl || "https://via.placeholder.com/150",
          phone: incoming.phone || prev?.phone || "",
          email: incoming.email || prev?.email || "",
          website: incoming.website || prev?.website || "",
          location: incoming.location || prev?.location || "",
          plan: incoming.plan || prev?.plan,
          currency: incoming.currency || prev?.currency,
          language: incoming.language || prev?.language,
          timezone: incoming.timezone || prev?.timezone,
          dateFormat: incoming.dateFormat || prev?.dateFormat,
          timeFormat: incoming.timeFormat || prev?.timeFormat,
          currencySymbol: incoming.currencySymbol || prev?.currencySymbol,
          openingTime: incoming.openingTime || prev?.openingTime || "",
          closingTime: incoming.closingTime || prev?.closingTime || "",
          specialHolidayHours:
            incoming.specialHolidayHours || prev?.specialHolidayHours || "",
          facebookUrl: incoming.facebookUrl || prev?.facebookUrl || "",
          instagramUrl: incoming.instagramUrl || prev?.instagramUrl || "",
          twitterUrl: incoming.twitterUrl || prev?.twitterUrl || "",
          linkedinUrl: incoming.linkedinUrl || prev?.linkedinUrl || "",
        }));
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || "Failed to load hotel profile");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user?.hotelId]);

  const handleChange = (field: keyof ProfileState, value: string) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!user?.hotelId || !profile) return;
    try {
      setSaving(true);
      setError(null);

      const locationParts = [street, city, state, country, zip]
        .map((p) => p.trim())
        .filter(Boolean);

      const payload = {
        ...profile,
        location: locationParts.join(", "),
      };

      const data = await updateHotelProfile(API_BASE, user.hotelId, payload);
      const updated = "profile" in data ? data.profile : data;
      setProfile((prev) => ({
        ...(prev || profile),
        ...updated,
      }));
    } catch (e: any) {
      setError(e.message || "Failed to save hotel profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!user?.hotelId) return;
    const data = await uploadHotelLogo(API_BASE, user.hotelId, file);
    if (data.logoUrl) {
      setProfile((prev) => (prev ? { ...prev, logoUrl: data.logoUrl } : prev));
    }
    return data.logoUrl;
  };

  if (!profile) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <HotelProfileHeader />
        {error && (
          <Alert variant="destructive" className="max-w-xl">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-muted-foreground">
          {loading ? "Loading hotel profile..." : "No hotel profile data available. Sign in with a hotel account or ensure your account is assigned to a property."}
        </p>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-4">
      <HotelProfileHeader />

      {error && (
        <Alert variant="destructive" className="max-w-xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <HotelIdentityOverview
        logoUrl={profile.logoUrl}
        name={profile.name}
        description={profile.description}
      />

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <HotelBasicInfoForm
            name={profile.name}
            description={profile.description}
            openingTime={profile.openingTime}
            closingTime={profile.closingTime}
            onChange={(field, value) => handleChange(field as keyof ProfileState, value)}
          />

          <HotelContactInfoForm
            phone={profile.phone}
            email={profile.email}
            website={profile.website}
            onChange={(field, value) => handleChange(field as keyof ProfileState, value)}
          />

          <HotelAddressForm
            street={street}
            city={city}
            state={state}
            country={country}
            zip={zip}
            onChange={(field, value) => {
              const nextLocationParts = {
                street,
                city,
                state,
                country,
                zip,
                [field]: value,
              } as any;
              const loc = [
                nextLocationParts.street,
                nextLocationParts.city,
                nextLocationParts.state,
                nextLocationParts.country,
                nextLocationParts.zip,
              ]
                .map((p: string) => (p || "").trim())
                .filter(Boolean)
                .join(", ");
              setProfile((prev) => (prev ? { ...prev, location: loc } : prev));
            }}
          />

          <SocialMediaLinksPanel
            facebookUrl={profile.facebookUrl}
            instagramUrl={profile.instagramUrl}
            twitterUrl={profile.twitterUrl}
            linkedinUrl={profile.linkedinUrl}
            onChange={(field, value) =>
              handleChange(field as keyof ProfileState, value)
            }
          />

          <OperationalHoursPanel
            specialHolidayHours={profile.specialHolidayHours}
            onChange={(value) => handleChange("specialHolidayHours", value)}
          />

          <SaveProfileButton saving={saving} onSave={handleSave} />
        </div>

        <div className="space-y-4">
          <HotelLogoUploader logoUrl={profile.logoUrl} onUpload={handleLogoUpload} />
        </div>
      </div>
    </main>
  );
}


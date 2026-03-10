"use client";

export function HotelProfileHeader() {
  return (
    <div className="mb-4">
      <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
        Hotel Profile
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your hotel&rsquo;s identity, contact information, and operational details.
      </p>
    </div>
  );
}


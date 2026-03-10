"use client";

export function RulesHeader() {
  return (
    <div className="mb-4">
      <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
        Check-in / Check-out Rules
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Configure hotel check-in and check-out policies, charges, and guest instructions.
      </p>
    </div>
  );
}

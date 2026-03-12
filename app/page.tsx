import { redirect } from "next/navigation";

export const metadata = {
  title: "Hotel Manager - Dashboard",
  description:
    "Hotel management system dashboard with reservations, rooms, occupancy, and revenue tracking.",
};

export default function Home() {
  // When user hits the root URL, send them to the
  // authenticated dashboard home page.
  redirect("/dashboard");
}


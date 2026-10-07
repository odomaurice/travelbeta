import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/forms"

export const metadata: Metadata = {
  title: "Log in — TravelBeta",
  description: "Log in to your TravelBeta account to manage your bookings.",
}

export default function LoginPage() {
  return <LoginForm />
}

import type { Metadata } from "next"
import { SignupForm } from "@/components/auth/forms"

export const metadata: Metadata = {
  title: "Create account — TravelBeta",
  description: "Create a TravelBeta account to book faster and keep all your trips in one place.",
}

export default function SignupPage() {
  return <SignupForm />
}

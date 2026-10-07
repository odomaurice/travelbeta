import type { Metadata } from "next"
import { ForgotPasswordForm } from "@/components/auth/forms"

export const metadata: Metadata = {
  title: "Reset your password — TravelBeta",
  description: "Get a link to reset your TravelBeta account password.",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}

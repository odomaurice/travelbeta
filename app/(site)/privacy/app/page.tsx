import { redirect } from "next/navigation"

// The original site served the policy at /privacy/app; keep old links working.
export default function PrivacyAppRedirect() {
  redirect("/privacy")
}

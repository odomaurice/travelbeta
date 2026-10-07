"use client"

import Link from "next/link"
import { AuthForm } from "@/components/auth/auth-form"
import { PasswordField } from "@/components/auth/password-field"
import { TextField } from "@/components/forms/form-kit"
import { Checkbox } from "@/components/ui/checkbox"
import { CONTACT } from "@/lib/data/site"

const link = "font-semibold text-brand-blue-strong underline-offset-4 hover:underline"

// Shown after submit until the accounts API is connected. Kept honest and low-key.
const PREVIEW_NOTICE = `Sign-in isn't connected yet in this preview. Please check back soon, or call us on ${CONTACT.main.display} for help with a booking.`

export function LoginForm() {
  return (
    <AuthForm
      title="Log in"
      description="Welcome back. Log in to manage your bookings."
      submitLabel="Log in"
      pendingLabel="Logging in…"
      notice={PREVIEW_NOTICE}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/user/signup" className={link}>
            Create account
          </Link>
        </>
      }
    >
      <TextField label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      <PasswordField
        labelAside={
          <Link href="/user/forgot-password" className={`text-sm ${link}`}>
            Forgot password?
          </Link>
        }
      />
      <label className="flex items-center gap-3 text-sm text-muted-foreground">
        <Checkbox name="remember" />
        Remember me
      </label>
    </AuthForm>
  )
}

export function SignupForm() {
  return (
    <AuthForm
      title="Create account"
      description="Book faster and keep all your trips in one place."
      submitLabel="Create account"
      pendingLabel="Creating account…"
      notice="Account sign-up isn't connected yet in this preview. Please check back soon — you can still book with our team by phone or email."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/user/login" className={link}>
            Log in
          </Link>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="First name" name="firstName" autoComplete="given-name" required />
        <TextField label="Last name" name="lastName" autoComplete="family-name" required />
      </div>
      <TextField label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      <PasswordField autoComplete="new-password" minLength={8} showStrength />
      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <Checkbox name="consent" required className="mt-0.5" />
        <span>
          By proceeding, I acknowledge that I have read and agreed to Travelbeta&apos;s{" "}
          <Link href="/terms" className={link}>
            Flight booking terms &amp; conditions
          </Link>
          .
        </span>
      </label>
    </AuthForm>
  )
}

export function ForgotPasswordForm() {
  return (
    <AuthForm
      title="Forgot password?"
      description="Enter the email address on your account and we'll send you a link to reset your password."
      submitLabel="Send reset link"
      pendingLabel="Sending…"
      success={(data) => ({
        title: "Check your email",
        body: (
          <p>
            If an account exists for <strong className="font-semibold break-all text-foreground">{String(data.get("email") ?? "")}</strong>,
            you&apos;ll receive a password reset link shortly. Don&apos;t forget to check your spam folder.
          </p>
        ),
      })}
      footer={
        <>
          Remembered it?{" "}
          <Link href="/user/login" className={link}>
            Back to log in
          </Link>
        </>
      }
    >
      <TextField label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
    </AuthForm>
  )
}

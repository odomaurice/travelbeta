"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { type TravelMode, cityById, getModeOptions, recommendMode } from "@/components/trip/trips"

export type TripType = "round" | "oneway" | "multi"

export type Leg = {
  id: number
  fromId: string | null
  toId: string | null
  date?: Date
  /** Mode the user picked; null means "use the recommendation". */
  modeOverride: TravelMode | null
}

export const MAX_LEGS = 5

type TripState = { tripType: TripType; legs: Leg[]; returnDate?: Date }

type TripContextValue = TripState & {
  /** Resolved travel mode per leg (null until both ends are chosen). */
  modes: (TravelMode | null)[]
  setTripType: (t: TripType) => void
  updateLeg: (id: number, patch: Partial<Omit<Leg, "id">>) => void
  addLeg: () => void
  removeLeg: (id: number) => void
  swapLeg: (id: number) => void
  setReturnDate: (d?: Date) => void
  /** Fill a single route and bring the planner into view. */
  planRoute: (fromId: string, toId: string) => void
}

const TripContext = createContext<TripContextValue | null>(null)

export const PLANNER_ID = "plan"

let nextId = 1
const newLeg = (fromId: string | null = null, toId: string | null = null): Leg => ({
  id: nextId++,
  fromId,
  toId,
  modeOverride: null,
})

export function resolveMode(leg: Pick<Leg, "fromId" | "toId" | "modeOverride">): TravelMode | null {
  const a = leg.fromId ? cityById(leg.fromId) : undefined
  const b = leg.toId ? cityById(leg.toId) : undefined
  if (!a || !b || a.id === b.id) return null
  const options = getModeOptions(a, b)
  if (leg.modeOverride && options.some((o) => o.mode === leg.modeOverride)) return leg.modeOverride
  return recommendMode(a, b, options)
}

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TripState>(() => ({ tripType: "round", legs: [{ id: 0, fromId: null, toId: null, modeOverride: null }] }))

  const setTripType = useCallback(
    (tripType: TripType) =>
      setState((s) => {
        if (tripType !== "multi") return { ...s, tripType, legs: s.legs.slice(0, 1) }
        // Start the second leg where the first one ends.
        const legs = s.legs.length >= 2 ? s.legs : [...s.legs, newLeg(s.legs[0].toId)]
        return { ...s, tripType, legs }
      }),
    []
  )

  const updateLeg = useCallback(
    (id: number, patch: Partial<Omit<Leg, "id">>) =>
      setState((s) => {
        const idx = s.legs.findIndex((l) => l.id === id)
        if (idx < 0) return s
        const legs = [...s.legs]
        // Picking new cities drops a mode the user chose for the old route.
        const resetMode = ("fromId" in patch || "toId" in patch) && !("modeOverride" in patch)
        legs[idx] = { ...legs[idx], ...patch, ...(resetMode ? { modeOverride: null } : {}) }
        // In multi-city, an empty next origin follows this leg's destination.
        const next = legs[idx + 1]
        if (next && "toId" in patch && !next.fromId) legs[idx + 1] = { ...next, fromId: patch.toId ?? null }
        return { ...s, legs }
      }),
    []
  )

  const addLeg = useCallback(
    () =>
      setState((s) => (s.legs.length >= MAX_LEGS ? s : { ...s, legs: [...s.legs, newLeg(s.legs[s.legs.length - 1].toId)] })),
    []
  )
  const removeLeg = useCallback(
    (id: number) => setState((s) => (s.legs.length <= 2 ? s : { ...s, legs: s.legs.filter((l) => l.id !== id) })),
    []
  )
  const swapLeg = useCallback(
    (id: number) =>
      setState((s) => ({
        ...s,
        legs: s.legs.map((l) => (l.id === id ? { ...l, fromId: l.toId, toId: l.fromId } : l)),
      })),
    []
  )
  const setReturnDate = useCallback((returnDate?: Date) => setState((s) => ({ ...s, returnDate })), [])

  const planRoute = useCallback((fromId: string, toId: string) => {
    setState((s) => ({
      ...s,
      tripType: s.tripType === "multi" ? "round" : s.tripType,
      legs: [{ ...newLeg(fromId, toId), date: s.legs[0]?.date }],
    }))
    document.getElementById(PLANNER_ID)?.scrollIntoView({ block: "start" })
  }, [])

  const modes = useMemo(() => state.legs.map(resolveMode), [state.legs])

  const value = useMemo(
    () => ({ ...state, modes, setTripType, updateLeg, addLeg, removeLeg, swapLeg, setReturnDate, planRoute }),
    [state, modes, setTripType, updateLeg, addLeg, removeLeg, swapLeg, setReturnDate, planRoute]
  )

  return <TripContext value={value}>{children}</TripContext>
}

export function useTrip() {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error("useTrip must be used inside <TripProvider>")
  return ctx
}

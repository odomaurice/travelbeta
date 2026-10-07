"use client"

import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

/** Large, scrollable dialog with a navy header that hosts a RequestForm. */
export function FormDialog({
  trigger,
  title,
  description,
  children,
}: {
  /** Element rendered as the trigger (e.g. a <Button />). */
  trigger: React.ReactElement
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto rounded-3xl p-0 sm:max-w-2xl"
      >
        <div className="relative bg-brand-navy px-6 pt-7 pb-6 pr-16 text-white sm:px-8">
          <DialogTitle className="text-2xl leading-tight font-extrabold text-white">{title}</DialogTitle>
          {description && <DialogDescription className="mt-1.5 text-white/75">{description}</DialogDescription>}
          <DialogClose className="absolute top-5 right-5 grid size-10 place-items-center rounded-full bg-white/10 text-white transition outline-none hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-brand-amber">
            <Icon icon={Cancel01Icon} size={20} />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon, MaximizeScreenIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export function PackageGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const total = images.length
  const go = (step: number) => setIndex((i) => (i + step + total) % total)
  const alt = (i: number) => `${title} — photo ${i + 1} of ${total}`

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block aspect-[16/10] w-full overflow-hidden rounded-3xl bg-brand-mist outline-none focus-visible:ring-3 focus-visible:ring-brand-blue/50"
        aria-label={`Open photo ${index + 1} of ${total} full screen`}
      >
        <Image
          src={images[index]}
          alt={alt(index)}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 720px, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
        />
        <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
          <Icon icon={MaximizeScreenIcon} size={14} />
          {index + 1} / {total}
        </span>
      </button>

      {total > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-8" aria-label="Photos">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-brand-blue/50",
                  i === index ? "ring-3 ring-brand-amber" : "opacity-70 hover:opacity-100"
                )}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[calc(100%-1rem)] gap-0 border-0 bg-black p-0 ring-0 sm:max-w-5xl"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1)
            if (e.key === "ArrowLeft") go(-1)
          }}
        >
          <DialogTitle className="sr-only">{title} photos</DialogTitle>
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
            <Image src={images[index]} alt={alt(index)} fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-contain" />
          </div>
          <div className="flex items-center justify-between gap-3 p-3 text-white">
            <button
              type="button"
              onClick={() => go(-1)}
              className="grid size-11 place-items-center rounded-full bg-white/10 outline-none hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-brand-amber"
            >
              <Icon icon={ArrowLeft01Icon} size={22} />
              <span className="sr-only">Previous photo</span>
            </button>
            <p className="text-sm font-semibold" aria-live="polite">
              {index + 1} / {total}
            </p>
            <button
              type="button"
              onClick={() => go(1)}
              className="grid size-11 place-items-center rounded-full bg-white/10 outline-none hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-brand-amber"
            >
              <Icon icon={ArrowRight01Icon} size={22} />
              <span className="sr-only">Next photo</span>
            </button>
          </div>
          <DialogClose className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-black/60 text-white outline-none hover:bg-black/80 focus-visible:ring-3 focus-visible:ring-brand-amber">
            <Icon icon={Cancel01Icon} size={20} />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}

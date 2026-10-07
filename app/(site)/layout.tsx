import { Footer, Newsletter } from "@/components/site/footer"
import { Header } from "@/components/site/header"
import { Partners } from "@/components/site/partners"

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Partners />
      <Newsletter />
      <Footer />
    </>
  )
}

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* We will add a sticky Cart Bar here later */}
      <main className="pb-24"> {/* Padding bottom for sticky bar */}
        {children}
      </main>
    </div>
  )
}
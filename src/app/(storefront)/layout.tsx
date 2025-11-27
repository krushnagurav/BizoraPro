export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pb-24">
        {children}
      </main>
    </div>
  )
}
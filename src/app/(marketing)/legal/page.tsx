import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-primary mb-10 text-center">Legal & Policies</h1>
        
        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/20">
            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
            <TabsTrigger value="terms">Terms of Service</TabsTrigger>
            <TabsTrigger value="refund">Refund Policy</TabsTrigger>
          </TabsList>
          
          <div className="mt-8 p-8 bg-card border border-border rounded-xl text-muted-foreground space-y-4">
            <TabsContent value="privacy">
              <h2 className="text-2xl font-bold text-foreground mb-4">Privacy Policy</h2>
              <p>At BizoraPro, we respect your data...</p>
              {/* Paste full Privacy text here later */}
            </TabsContent>
            
            <TabsContent value="terms">
              <h2 className="text-2xl font-bold text-foreground mb-4">Terms of Service</h2>
              <p>By using our platform, you agree to...</p>
            </TabsContent>
            
            <TabsContent value="refund">
              <h2 className="text-2xl font-bold text-foreground mb-4">Refund Policy</h2>
              <p>Subscriptions are non-refundable...</p>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
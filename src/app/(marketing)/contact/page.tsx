import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-primary">How can we help?</h1>
        <p className="text-muted-foreground text-lg">
          We are here to support your business growth. Choose a channel below.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:border-primary/50 transition cursor-pointer">
            <CardContent className="pt-6 space-y-4">
              <MessageCircle className="w-12 h-12 mx-auto text-green-500" />
              <h3 className="font-bold text-xl">WhatsApp Support</h3>
              <p className="text-sm text-muted-foreground">Fastest response time (10am - 6pm)</p>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Chat Now</Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition cursor-pointer">
            <CardContent className="pt-6 space-y-4">
              <Mail className="w-12 h-12 mx-auto text-blue-500" />
              <h3 className="font-bold text-xl">Email Support</h3>
              <p className="text-sm text-muted-foreground">For billing and account issues</p>
              <Button variant="outline" className="w-full">Send Email</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
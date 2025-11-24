"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Store } from "lucide-react";

export function MobileHeader() {
  return (
    <header className="md:hidden h-16 border-b border-border bg-card flex items-center px-4 fixed top-0 left-0 right-0 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-card border-r border-border">
           {/* Reuse Sidebar Logic here logic manually if needed, or just a simple list */}
           <div className="p-6">
             <h2 className="font-bold text-xl mb-6">Menu</h2>
             {/* For MVP simplicity, we can rely on the user clicking specific links. 
                 Ideally, we refactor Sidebar to be reusable, but let's keep it simple for now. */}
             <p className="text-muted-foreground">Navigation (Use Desktop for full experience)</p>
           </div>
        </SheetContent>
      </Sheet>
      
      <div className="ml-4 flex items-center font-bold text-lg">
        <Store className="h-5 w-5 text-primary mr-2" />
        Seller Panel
      </div>
    </header>
  );
}
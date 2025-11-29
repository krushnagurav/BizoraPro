"use client";

import { useState } from "react";
import { TemplateEditor } from "./template-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "./copy-button";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { deleteTemplateAction } from "@/src/actions/marketing-actions";

export function TemplatesManager({ templates }: { templates: any[] }) {
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* LEFT: EDITOR */}
      <div className="lg:col-span-1">
        <Card className="bg-card border-border/50 sticky top-8">
          <div className="p-6 border-b border-border/50 flex justify-between items-center">
            <h3 className="font-bold">
              {editingTemplate ? "Edit Template" : "New Template"}
            </h3>
            {editingTemplate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingTemplate(null)}
              >
                Cancel
              </Button>
            )}
          </div>
          <CardContent className="p-6">
            <TemplateEditor
              key={editingTemplate?.id || "new"}
              initialData={editingTemplate}
              onClose={() => setEditingTemplate(null)}
            />
          </CardContent>
        </Card>
      </div>

      {/* RIGHT: LIST */}
      <div className="lg:col-span-2 space-y-4">
        {templates.map((t) => (
          <Card
            key={t.id}
            className={`bg-card border-border/50 group hover:border-primary/30 transition ${
              editingTemplate?.id === t.id ? "border-primary" : ""
            }`}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className="font-bold text-lg cursor-pointer hover:text-primary"
                      onClick={() => setEditingTemplate(t)}
                    >
                      {t.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {t.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Used {t.used_count} times
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingTemplate(t)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <form action={deleteTemplateAction}>
                    <input type="hidden" name="id" value={t.id} />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
              <p className="text-sm bg-secondary/10 p-3 rounded border border-border/50">
                {t.message}
              </p>
              <CopyButton text={t.message} id={t.id} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
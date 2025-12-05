"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { importProductsAction } from "@/src/actions/product-actions";
import { toast } from "sonner";
import { Loader2, FileSpreadsheet, Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function BulkImportForm() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => setData(results.data),
      error: (err) => toast.error("Error: " + err.message),
    });
  };

  const handleImport = async () => {
    if (data.length === 0) return;
    setLoading(true);
    const result = await importProductsAction(data);
    setLoading(false);

    if (result?.error) toast.error(result.error);
    else {
      toast.success(result.success);
      router.push("/products");
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "Name,Price,Category,Description\nRed Cotton Saree,999,Fashion,Premium quality";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary">Bulk Import</h1>
          <p className="text-muted-foreground">
            Upload a CSV file to add multiple products.
          </p>
        </div>
      </div>

      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>1. Upload File</CardTitle>
          <CardDescription>
            Headers: Name, Price, Category, Description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-6 border-2 border-dashed border-border rounded-lg bg-secondary/10">
            <FileSpreadsheet className="h-10 w-10 text-green-600" />
            <Input
              type="file"
              accept=".csv"
              onChange={handleFile}
              className="cursor-pointer bg-background"
            />
            <Button variant="outline" onClick={handleDownloadTemplate}>
              Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {data.length > 0 && (
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>2. Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.Name}</TableCell>
                      <TableCell>₹{row.Price}</TableCell>
                      <TableCell>{row.Category}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                size="lg"
                className="font-bold gap-2"
                onClick={handleImport}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Import Products
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

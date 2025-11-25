"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { importProductsAction } from "@/src/actions/product-actions";
import { toast } from "sonner";
import { Loader2, FileSpreadsheet, Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BulkImportPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle File Selection
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
      },
      error: (err) => {
        toast.error("Error parsing CSV: " + err.message);
      }
    });
  };

  // Handle Upload
  const handleImport = async () => {
    if (data.length === 0) return;
    setLoading(true);

    const result = await importProductsAction(data);

    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success);
      router.push("/products");
    }
  };

  // PROFESSIONAL DOWNLOAD HANDLER
  const handleDownloadTemplate = () => {
    // 1. Define Headers & Sample Data
    const headers = ["Name", "Price", "Category", "Description"];
    const rows = [
      ["Red Cotton Saree", "999", "Fashion", "Premium quality cotton saree"],
      ["Bluetooth Headset", "1499", "Electronics", "Noise cancelling wireless"],
      ["Chocolate Cake", "500", "Food", "Freshly baked 1kg cake"]
    ];

    // 2. Convert to CSV String
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // 3. Create Blob & Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "bizorapro_product_template.csv"); // Proper filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary">Bulk Import</h1>
          <p className="text-muted-foreground">
            Upload a CSV file to add multiple products at once.
          </p>
        </div>
      </div>

      {/* INSTRUCTIONS & UPLOAD */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>1. Upload File</CardTitle>
          <CardDescription>
            Your CSV must have these headers:{" "}
            <strong>Name, Price, Category, Description</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-6 border-2 border-dashed border-border rounded-lg bg-secondary/10">
            <FileSpreadsheet className="h-10 w-10 text-green-600" />
            <div className="flex-1">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFile}
                className="cursor-pointer bg-background"
              />
            </div>
            <Button variant="outline" onClick={handleDownloadTemplate}>
              Download Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PREVIEW TABLE */}
      {data.length > 0 && (
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>2. Preview Data ({data.length} items)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.Name}</TableCell>
                      <TableCell>₹{row.Price}</TableCell>
                      <TableCell>{row.Category}</TableCell>
                      <TableCell className="truncate max-w-[200px]">
                        {row.Description}
                      </TableCell>
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
                Import {data.length} Products
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
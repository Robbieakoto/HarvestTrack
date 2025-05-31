'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Filter } from "lucide-react";

const mockReports = [
  { id: "REP001", title: "Q3 Transit Time Analysis", date: "2023-10-05", type: "Transit Analysis" },
  { id: "REP002", title: "September Delay Incidents", date: "2023-10-02", type: "Delay Report" },
  { id: "REP003", title: "Produce Spoilage Overview YTD", date: "2023-09-28", type: "Quality Report" },
  { id: "REP004", title: "Carrier Performance Q3", date: "2023-10-06", type: "Performance Metrics" },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" />
            Automated Reports
          </CardTitle>
          <CardDescription>Access generated reports detailing transit times, delays, and other supply chain insights.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <Button>
                    <Download className="mr-2 h-4 w-4" /> Generate New Report
                </Button>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> Filter Reports
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Report ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date Generated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockReports.map((report) => (
                        <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.id}</TableCell>
                            <TableCell>{report.title}</TableCell>
                            <TableCell>{report.type}</TableCell>
                            <TableCell>{report.date}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                    <span className="sr-only">Download</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <p className="text-center text-muted-foreground mt-6 text-sm">
                Automated report generation is a backend feature. This UI demonstrates how reports could be listed and accessed.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}

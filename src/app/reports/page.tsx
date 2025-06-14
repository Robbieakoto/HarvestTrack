
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Filter, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
}

const initialMockReportsData: Report[] = [
  { id: "REP001", title: "Q3 Transit Time Analysis", date: "2023-10-05", type: "Transit Analysis" },
  { id: "REP002", title: "September Delay Incidents", date: "2023-10-02", type: "Delay Report" },
  { id: "REP003", title: "Produce Spoilage Overview YTD", date: "2023-09-28", type: "Quality Report" },
  { id: "REP004", title: "Carrier Performance Q3", date: "2023-10-06", type: "Performance Metrics" },
  { id: "REP005", title: "Q3 Fuel Cost Report", date: "2023-10-07", type: "Financial Report" },
  { id: "REP006", title: "October Projected Delays", date: "2023-10-08", type: "Delay Report" },
];

const allReportTypes = ["All Types", ...new Set(initialMockReportsData.map(report => report.type))];

export default function ReportsPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>(initialMockReportsData);
  const [selectedReportType, setSelectedReportType] = useState<string>("All Types");
  const [filteredReports, setFilteredReports] = useState<Report[]>(reports);

  useEffect(() => {
    if (selectedReportType === "All Types") {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter(report => report.type === selectedReportType));
    }
  }, [selectedReportType, reports]);

  const handleDownloadReport = (reportId: string, reportTitle: string) => {
    toast({
      title: "Report Download Started",
      description: `Downloading "${reportTitle}" (ID: ${reportId})...`,
    });
    // In a real app, this would trigger an API call to download the report
  };

  const handleGenerateNewReport = () => {
    const newReportId = `REP${String(reports.length + 1).padStart(3, '0')}`;
    const newReport: Report = {
      id: newReportId,
      title: `Newly Generated Report ${newReportId}`,
      date: format(new Date(), "yyyy-MM-dd"),
      type: "General Analysis", // You can make this selectable or more dynamic
    };
    setReports(prevReports => [newReport, ...prevReports]); // Add to the beginning of the list

    toast({
      title: "Generating Report",
      description: `New report "${newReport.title}" has been initiated.`,
      // Removed action: <Button variant="outline" size="sm">View Status</Button>,
    });
    // In a real app, this would trigger a backend process
  };

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
                <Button onClick={handleGenerateNewReport}>
                    <Activity className="mr-2 h-4 w-4" /> Generate New Report
                </Button>
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                    <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Filter by type..." />
                        </SelectTrigger>
                        <SelectContent>
                            {allReportTypes.map(type => ( // Use allReportTypes which is static
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
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
                    {filteredReports.length > 0 ? filteredReports.map((report) => (
                        <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.id}</TableCell>
                            <TableCell>{report.title}</TableCell>
                            <TableCell><span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{report.type}</span></TableCell>
                            <TableCell>{report.date}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleDownloadReport(report.id, report.title)} title={`Download ${report.title}`}>
                                    <Download className="h-4 w-4" />
                                    <span className="sr-only">Download</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                No reports match the selected filter or no reports available.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {reports.length === 0 && initialMockReportsData.length === 0 && ( // Check if initial data was also empty
                 <p className="text-center text-muted-foreground mt-6 text-sm">
                    No reports available yet. Click "Generate New Report" to create one.
                </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

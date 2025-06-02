
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanLine, Package, AlertTriangle, CheckCircle, Truck, Clock } from "lucide-react";
import Image from 'next/image';
import QrScannerModal from "@/components/QrScannerModal";

// Mock data
const summaryMetrics = [
  { title: "Total Shipments", value: "125", icon: Package, color: "text-primary" },
  { title: "In Transit", value: "42", icon: Truck, color: "text-blue-500" },
  { title: "Delayed", value: "8", icon: AlertTriangle, color: "text-destructive" },
  { title: "Delivered", value: "75", icon: CheckCircle, color: "text-green-500" },
];

const recentActivity = [
  { id: "S123", produce: "Apples", status: "Departed from WA", time: "2 hours ago", icon: Truck },
  { id: "S456", produce: "Oranges", status: "Delay expected: Traffic", time: "1 hour ago", icon: AlertTriangle },
  { id: "S789", produce: "Berries", status: "Arrived at MA Hub", time: "30 mins ago", icon: CheckCircle },
  { id: "S101", produce: "Bananas", status: "Out for delivery", time: "5 mins ago", icon: Truck },
];

export default function DashboardPage() {
  const [isQrModalOpen, setIsQrModalOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-headline">Welcome to HarvestTrack!</CardTitle>
          <Button onClick={() => setIsQrModalOpen(true)} size="lg">
            <ScanLine className="mr-2 h-5 w-5" />
            Scan Produce QR
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Monitor your produce supply chain in real-time. Track shipments, predict delays, and ensure freshness from farm to table.</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recent Activity</CardTitle>
            <CardDescription>Latest updates on your shipments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="bg-secondary p-2 rounded-full">
                  <activity.icon className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-medium">{activity.produce} <span className="text-sm text-muted-foreground">({activity.id})</span></p>
                  <p className="text-sm text-muted-foreground">{activity.status}</p>
                </div>
                <p className="ml-auto text-xs text-muted-foreground whitespace-nowrap flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </p>
              </div>
            ))}
             <Button variant="default" className="w-full mt-4">View All Activity</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Live Tracking Snapshot</CardTitle>
            <CardDescription>Overview of current shipment locations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <Image
                src="https://placehold.co/600x338.png"
                alt="Map placeholder"
                width={600}
                height={338}
                data-ai-hint="world map"
                className="rounded-lg object-cover"
              />
            </div>
            <Button variant="default" className="w-full mt-4">Go to Full Map</Button>
          </CardContent>
        </Card>
      </div>
      <QrScannerModal isOpen={isQrModalOpen} onOpenChange={setIsQrModalOpen} />
    </div>
  );
}

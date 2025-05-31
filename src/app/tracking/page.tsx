'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, Package, AlertTriangle } from "lucide-react";
import Image from 'next/image';

const mockShipments = [
  { id: "S123", produce: "Fuji Apples", origin: "Yakima, WA", destination: "New York, NY", status: "In Transit", currentLocationName: "Omaha, NE", dataAiHint: "fruit apples" },
  { id: "S456", produce: "Valencia Oranges", origin: "Orlando, FL", destination: "Los Angeles, CA", status: "Delayed", currentLocationName: "Dallas, TX", dataAiHint: "fruit oranges" },
  { id: "S789", produce: "Organic Strawberries", origin: "Watsonville, CA", destination: "Boston, MA", status: "On Schedule", currentLocationName: "Pittsburgh, PA", dataAiHint: "fruit berries" },
];

export default function TrackingPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <MapPin className="h-7 w-7 text-primary" />
            Geolocation Tracking
          </CardTitle>
          <CardDescription>View the current location and status of your produce shipments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-[16/9] w-full bg-muted rounded-lg overflow-hidden shadow-lg">
            <Image 
              src="https://placehold.co/1200x675.png" // Larger placeholder for map
              alt="Geolocation Map Placeholder"
              width={1200}
              height={675}
              className="object-cover w-full h-full"
              data-ai-hint="world map"
            />
            {/* In a real app, map markers would be rendered here using a library like Vis.GL */}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Shipment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockShipments.map((shipment) => (
            <Card key={shipment.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary rounded-full">
                    <Package className="h-6 w-6 text-secondary-foreground" data-ai-hint={shipment.dataAiHint}/>
                  </div>
                  <div>
                    <h3 className="font-semibold">{shipment.produce} <span className="text-sm font-normal text-muted-foreground">({shipment.id})</span></h3>
                    <p className="text-xs text-muted-foreground">
                      {shipment.origin} &rarr; {shipment.destination}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-1">
                   <Badge variant={shipment.status === "Delayed" ? "destructive" : shipment.status === "In Transit" ? "secondary" : "default"}>
                    {shipment.status === "Delayed" && <AlertTriangle className="h-3 w-3 mr-1 inline-block" />}
                    {shipment.status !== "Delayed" && <Truck className="h-3 w-3 mr-1 inline-block" />}
                    {shipment.status}
                  </Badge>
                  <p className="text-sm flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {shipment.currentLocationName}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

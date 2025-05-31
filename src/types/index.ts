import type { LucideIcon } from "lucide-react";

export interface Shipment {
  id: string;
  produceName: string;
  status: 'In Transit' | 'Delayed' | 'Delivered' | 'Pending';
  origin: string;
  destination: string;
  expectedDelivery: string; // Could be Date object
  lastUpdate: string; // Could be Date object
  currentLocation?: {
    lat: number;
    lng: number;
    name: string;
  };
  icon?: LucideIcon; // For display purposes
}

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  external?: boolean;
}

import {
  Building2,
  Cctv,
  Dog,
  Eye,
  Landmark,
  Package,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Shield,
  Eye,
  Package,
  Users,
  Landmark,
  Cctv,
  Building2,
  Dog,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Shield;
  return <Icon className={className} aria-hidden />;
}

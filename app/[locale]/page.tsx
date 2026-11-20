import { HomePage } from "@/components/site/home-page";
import { getSiteData } from "@/lib/site-data";

export default async function Page() {
  const site = await getSiteData();
  return <HomePage site={site} />;
}

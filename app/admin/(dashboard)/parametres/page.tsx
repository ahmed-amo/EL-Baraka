import { PasswordForms, SettingsForm } from "@/components/admin/editors";
import { getPrisma } from "@/lib/db";

export default async function SettingsPage() {
  const db = getPrisma();
  if (!db) return <p>Base de données indisponible.</p>;
  const settings = await db.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!settings) return <p>Paramètres absents. Lancez le seed.</p>;
  const fields = [
    ["phone", "Téléphone affiché", settings.phone],
    ["phoneHref", "Lien téléphone", settings.phoneHref],
    ["fax", "Fax", settings.fax],
    ["address", "Adresse", settings.address],
    ["email", "E-mail affiché", settings.email],
    ["whatsappNumber", "WhatsApp (international, sans +)", settings.whatsappNumber],
    ["whatsappMessage", "Message WhatsApp", settings.whatsappMessage],
    ["years", "Années", settings.years],
    ["employees", "Employés", settings.employees],
    ["partners", "Partenaires", settings.partners],
    ["servicesCount", "Nombre de services affiché", settings.servicesCount],
    ["lat", "Latitude", settings.lat],
    ["lng", "Longitude", settings.lng],
    ["hours", "Horaires", settings.hours],
    ["capital", "Capital", settings.capital],
    ["facebookUrl", "Facebook", settings.facebookUrl],
    ["linkedinUrl", "LinkedIn", settings.linkedinUrl],
    ["instagramUrl", "Instagram", settings.instagramUrl],
    ["metaTitle", "Titre SEO", settings.metaTitle],
    ["metaDescription", "Description SEO", settings.metaDescription],
    ["heroVideoUrl", "URL vidéo hero", settings.heroVideoUrl],
    ["heroVideoWebmUrl", "URL vidéo webm", settings.heroVideoWebmUrl],
    ["heroPosterUrl", "Affiche hero", settings.heroPosterUrl],
    ["aboutImageUrl", "Image à propos", settings.aboutImageUrl],
  ] as const;
  return (
    <div className="grid gap-10">
      <h1 className="font-display text-3xl">Paramètres</h1>
      <SettingsForm
        liveDot={settings.showLiveDot}
        fields={fields.map(([name, label, value]) => ({
          name,
          label,
          value,
          area: name === "address" || name === "whatsappMessage" || name === "metaDescription",
        }))}
      />
      <PasswordForms />
    </div>
  );
}

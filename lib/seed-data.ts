import { GATE_PHOTO } from "./brand";
import type { CompanyData, GalleryData, Milestone, PublicSite, ServiceData, SiteSettingsData } from "./types";

export const MAPS_URL = "https://maps.app.goo.gl/9k3HuhUXRnFBsd4v8";

export const INTRO =
  "Créée en 1996, S.A.R.L. EL BARAKA CONSEIL est une société spécialisée dans le gardiennage, le transport de fonds et de produits sensibles. Avec un capital social de 10.500.000 DA, grâce à nos moyens déployés et à notre expertise de plus de 30 ans, nous garantissons une prestation de qualité, adaptée à vos besoins spécifiques, tout en assurant la confidentialité de nos relations et en respectant la réglementation en vigueur.";

export const defaultSettings = (): SiteSettingsData => ({
  phone: "021 59 59 59",
  phoneHref: "tel:+21321595959",
  fax: "021 58 58 58",
  address: "Siège social : Le Cirque, Jijel 18000, Algérie",
  email: process.env.MAIL_TO || "contact@el-baraka-conseil.dz",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  whatsappMessage: "Bonjour EL BARAKA CONSEIL, je souhaite des informations sur vos services.",
  years: 30,
  employees: 500,
  partners: 100,
  servicesCount: 9,
  heroVideoUrl: "/videos/hero.mp4",
  heroVideoWebmUrl: "",
  heroPosterUrl: GATE_PHOTO,
  aboutImageUrl: "/images/gallery/hq-facade.jpg",
  lat: 36.823443,
  lng: 5.76469,
  hours: "Dimanche – Jeudi · 08h00 – 17h00",
  capital: "10.500.000 DA",
  foundedYear: 1996,
  legalName: "S.A.R.L. EL BARAKA CONSEIL",
  facebookUrl: "",
  linkedinUrl: "",
  instagramUrl: "",
  metaTitle: "EL BARAKA CONSEIL | Gardiennage, sécurité privée et transport de fonds en Algérie",
  metaDescription:
    "Société de gardiennage et de sécurité privée à Jijel. Transport de fonds et de produits sensibles en Algérie depuis 1996. Plus de 500 agents. Demandez un devis.",
  showLiveDot: false,
  milestones: milestoneSeed,
});

export const milestoneSeed: Milestone[] = [
  {
    year: "1996",
    title: "Création",
    text: "Naissance de la S.A.R.L. EL BARAKA CONSEIL à Jijel.",
    image: "/images/gallery/hq-facade.jpg",
  },
  {
    year: "2005",
    title: "Gardiennage",
    text: "{{À CONFIRMER}} Déploiement des équipes de gardiennage et de protection des sites.",
    image: "/images/gallery/field-site.jpg",
  },
  {
    year: "2012",
    title: "Flux sensibles",
    text: "{{À CONFIRMER}} Extension du transport de fonds et de la sécurisation de produits sensibles.",
    image: "/images/gallery/field-safe.jpg",
  },
  {
    year: "2018",
    title: "Moyens renforcés",
    text: "{{À CONFIRMER}} Télésurveillance et activités cynophiles viennent compléter les dispositifs.",
    image: "/images/gallery/field-cyno.jpg",
  },
  {
    year: "2024",
    title: "500 professionnels",
    text: "Plus de 500 professionnels à votre service, en Algérie.",
    image: "/images/gallery/field-team.jpg",
  },
  {
    year: "Aujourd'hui",
    title: "30+ ans",
    text: "Plus de 30 ans d'expérience auprès des entreprises et des institutions.",
    image: "/images/gallery/field-watch.jpg",
  },
];

const long = (lead: string, body: string) => `${lead}\n\n${body}`;

export const serviceSeed: ServiceData[] = [
  {
    id: "seed-protection",
    slug: "protection-des-biens-et-des-personnes",
    title: "Protection des biens et des personnes",
    shortDescription:
      "Nous assurons la sécurité de vos biens et de vos personnes grâce à des solutions adaptées et un personnel qualifié, garantissant ainsi une protection efficace contre les risques potentiels.",
    content: long(
      "Nous assurons la sécurité de vos biens et de vos personnes grâce à des solutions adaptées et un personnel qualifié, garantissant ainsi une protection efficace contre les risques potentiels.",
      "Chaque dispositif est construit autour de votre site, de vos horaires et de vos flux. Les agents sont formés, identifiables et encadrés, avec des consignes claires et une remontée d'information régulière.",
    ),
    imageUrl: "/images/gallery/field-watch.jpg",
    icon: "Shield",
    order: 1,
  },
  {
    id: "seed-gardiennage",
    slug: "gardiennage",
    title: "Gardiennage",
    shortDescription:
      "Nos services de gardiennage incluent la surveillance des sites, le contrôle des accès et l'accueil des visiteurs, assurant un environnement sécurisé et bien régulé.",
    content: long(
      "Nos services de gardiennage incluent la surveillance des sites, le contrôle des accès et l'accueil des visiteurs, assurant un environnement sécurisé et bien régulé.",
      "Rondes, filtrage, main courante et présence visible : le gardiennage EL BARAKA CONSEIL s'adapte aux sites industriels, tertiaires et institutionnels.",
    ),
    imageUrl: "/images/gallery/field-site.jpg",
    icon: "Eye",
    order: 2,
  },
  {
    id: "seed-securisation",
    slug: "securisation-de-produits-sensibles",
    title: "Sécurisation de produits sensibles",
    shortDescription:
      "La sécurisation de produits sensibles couvre le chargement, le parcours et la remise, avec des véhicules aménagés et des protocoles stricts.",
    content: long(
      "La sécurisation de produits sensibles couvre le chargement, le parcours et la remise, avec des véhicules aménagés et des protocoles stricts.",
      "Le dispositif est préparé avec le donneur d'ordre. La confidentialité de l'opération et le respect de la réglementation en vigueur font partie du service.",
    ),
    imageUrl: "/images/gallery/field-team.jpg",
    icon: "Package",
    order: 3,
  },
  {
    id: "seed-produits",
    slug: "transport-de-produits-sensibles",
    title: "Transport de produits sensibles",
    shortDescription:
      "Notre équipe qualifiée garantit la protection de vos biens tout au long du trajet grâce à des véhicules aménagés et des protocoles stricts.",
    content: long(
      "Sécurisation de produits sensibles. Notre équipe qualifiée garantit la protection de vos biens tout au long du trajet grâce à des véhicules aménagés et des protocoles stricts pour assurer le transport de vos produits sensibles.",
      "Le parcours, les horaires et les points de remise sont préparés à l'avance. La confidentialité de l'opération et le respect de la réglementation en vigueur font partie du dispositif.",
    ),
    imageUrl: "/images/gallery/field-convoy.jpg",
    icon: "Package",
    order: 4,
  },
  {
    id: "seed-fonds",
    slug: "transport-des-fonds",
    title: "Transport des fonds",
    shortDescription:
      "Le transport sécurisé de vos fonds, avec nos véhicules aménagés et des protocoles stricts, garantissant une sécurité maximale.",
    content: long(
      "Le transport sécurisé de vos fonds, avec nos véhicules aménagés et des protocoles stricts, garantissant une sécurité maximale.",
      "Collecte, acheminement et remise suivent une chaîne de contrôle définie avec vous. Les équipes sont formées à la discrétion et à la régularité du service.",
    ),
    imageUrl: "/images/gallery/field-safe.jpg",
    icon: "Landmark",
    order: 6,
  },
  {
    id: "seed-tele",
    slug: "telesurveillance",
    title: "Télésurveillance",
    shortDescription:
      "Nous proposons des solutions de télésurveillance avancées pour surveiller vos sites en temps réel, permettant une intervention rapide en cas d'incident.",
    content: long(
      "Nous proposons des solutions de télésurveillance avancées pour surveiller vos sites en temps réel, permettant une intervention rapide en cas d'incident.",
      "La levée de doute et l'alerte s'articulent avec les équipes sur le terrain lorsque le contrat le prévoit.",
    ),
    imageUrl: "/images/services/IMG_1514.jpg",
    icon: "Cctv",
    order: 7,
  },
  {
    id: "seed-sites",
    slug: "surveillance-des-sites-et-des-infrastructures",
    title: "Surveillance des sites et des infrastructures",
    shortDescription:
      "Nos équipes effectuent une surveillance continue des sites et des infrastructures pour détecter toute activité suspecte et assurer une sécurité constante.",
    content: long(
      "Nos équipes effectuent une surveillance continue des sites et des infrastructures pour détecter toute activité suspecte et assurer une sécurité constante.",
      "Le dispositif couvre les accès, les périmètres et les points sensibles, avec des comptes rendus exploitables par vos responsables.",
    ),
    imageUrl: "/images/gallery/field-site.jpg",
    icon: "Building2",
    order: 8,
  },
  {
    id: "seed-cyno",
    slug: "activites-cynophiles",
    title: "Activités cynophiles",
    shortDescription:
      "Nous utilisons des chiens de sécurité spécialement formés pour renforcer la protection des sites et effectuer des interventions en cas de besoin.",
    content: long(
      "Nous utilisons des chiens de sécurité spécialement formés pour renforcer la protection des sites et effectuer des interventions en cas de besoin.",
      "Les équipes cynophiles interviennent en complément du gardiennage, selon le niveau de sensibilité du site.",
    ),
    imageUrl: "/images/gallery/field-cyno.jpg",
    icon: "Dog",
    order: 9,
  },
];

export const companySeed: CompanyData[] = [
  { id: "seed-at", name: "Algérie Télécom", logoUrl: "/images/logos/ALG-TLC.png", websiteUrl: "", order: 1 },
  { id: "seed-ap", name: "Algérie Poste", logoUrl: "/images/logos/ALGERIE-POST.png", websiteUrl: "", order: 2 },
  { id: "seed-anbt", name: "ANBT", logoUrl: "/images/logos/anbt-logo.png", websiteUrl: "", order: 3 },
  { id: "seed-badr", name: "BADR", logoUrl: "/images/logos/BADR-logo.png", websiteUrl: "", order: 4 },
  { id: "seed-riz", name: "Rizzani de Ecci", logoUrl: "/images/logos/RIZZANI.png", websiteUrl: "", order: 5 },
  { id: "seed-af", name: "Africaver", logoUrl: "/images/logos/AFRICAVER.png", websiteUrl: "", order: 6 },
  { id: "seed-ona", name: "ONA", logoUrl: "/images/logos/ONA.jpeg", websiteUrl: "", order: 7 },
  { id: "seed-spa", name: "SPA", logoUrl: "/images/logos/SPA.jpeg", websiteUrl: "", order: 8 },
  { id: "seed-ctc", name: "CTC", logoUrl: "/images/logos/CTC.jpeg", websiteUrl: "", order: 9 },
];

const field = [
  "field-convoy.jpg",
  "field-safe.jpg",
  "field-team.jpg",
  "field-cyno.jpg",
  "field-watch.jpg",
  "field-site.jpg",
  "IMG_1440.jpg",
  "IMG_1550.jpg",
  "IMG_1422.jpg",
  "IMG_1433.jpg",
  "IMG_2645.jpg",
  "IMG_3019.jpg",
];
const inside = ["hq-facade.jpg", "IMG_1456.jpg", "IMG_1514.jpg", "IMG_1519.jpg", "IMG_2843.jpg"];

export const gallerySeed: GalleryData[] = [
  ...field.map((file, index) => ({
    id: `seed-field-${index + 1}`,
    url: `/images/gallery/${file}`,
    alt: `Équipe EL BARAKA CONSEIL sur le terrain, photo ${index + 1}`,
    category: "FIELD" as const,
    order: index + 1,
  })),
  ...inside.map((file, index) => ({
    id: `seed-inside-${index + 1}`,
    url: `/images/gallery/${file}`,
    alt: `À l'intérieur de la sécurité, photo ${index + 1}`,
    category: "INSIDE" as const,
    order: field.length + index + 1,
  })),
];

export function fallbackSite(): PublicSite {
  const settings = defaultSettings();
  settings.servicesCount = serviceSeed.length;
  return {
    settings,
    services: serviceSeed,
    companies: companySeed,
    gallery: gallerySeed,
    jobs: [],
  };
}

export type Milestone = {
  year: string;
  title: string;
  text: string;
  image: string;
};

export type SiteSettingsData = {
  phone: string;
  phoneHref: string;
  fax: string;
  address: string;
  email: string;
  whatsappNumber: string;
  whatsappMessage: string;
  years: number;
  employees: number;
  partners: number;
  servicesCount: number;
  heroVideoUrl: string;
  heroVideoWebmUrl: string;
  heroPosterUrl: string;
  aboutImageUrl: string;
  lat: number;
  lng: number;
  hours: string;
  capital: string;
  foundedYear: number;
  legalName: string;
  facebookUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  metaTitle: string;
  metaDescription: string;
  milestones: Milestone[];
  showLiveDot: boolean;
};

export type ServiceData = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  content: string;
  imageUrl: string;
  icon: string;
  order: number;
};

export type CompanyData = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  order: number;
};

export type GalleryData = {
  id: string;
  url: string;
  alt: string;
  category: "FIELD" | "INSIDE";
  order: number;
};

export type JobData = {
  id: string;
  title: string;
  location: string;
  description: string;
  order: number;
};

export type PublicSite = {
  settings: SiteSettingsData;
  services: ServiceData[];
  companies: CompanyData[];
  gallery: GalleryData[];
  jobs: JobData[];
};

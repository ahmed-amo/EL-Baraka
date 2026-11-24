import { readFileSync } from "fs";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { GATE_PHOTO } from "../lib/brand";
import { defaultSettings, gallerySeed, milestoneSeed, serviceSeed } from "../lib/seed-data";

function loadEnv() {
  try {
    const text = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index < 0) continue;
      const key = trimmed.slice(0, index).trim();
      let value = trimmed.slice(index + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    /* prisma CLI already injects env */
  }
}

async function main() {
  loadEnv();
  const prisma = new PrismaClient();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL et ADMIN_PASSWORD sont requis pour le seed.");

  const normalized = email.toLowerCase();
  const existing = await prisma.adminUser.findUnique({ where: { email: normalized } });
  if (!existing) {
    await prisma.adminUser.create({
      data: {
        email: normalized,
        name: "Administrateur",
        passwordHash: await bcrypt.hash(password, 12),
      },
    });
  }

  const settings = defaultSettings();
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      aboutImageUrl: settings.aboutImageUrl,
    },
    create: {
      id: "singleton",
      ...settings,
      milestones: settings.milestones,
    },
  });

  await prisma.siteSettings.updateMany({
    where: { heroPosterUrl: { endsWith: ".svg" } },
    data: { heroPosterUrl: GATE_PHOTO },
  });

  const removedEscorte = await prisma.service.deleteMany({ where: { slug: "escorte" } });
  if (removedEscorte.count > 0) {
    await prisma.siteSettings.update({
      where: { id: "singleton" },
      data: { servicesCount: await prisma.service.count({ where: { isActive: true } }) },
    });
  }

  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({
      data: serviceSeed.map((service) => ({
        slug: service.slug,
        title: service.title,
        shortDescription: service.shortDescription,
        content: service.content,
        imageUrl: service.imageUrl,
        icon: service.icon,
        order: service.order,
        isActive: true,
      })),
    });
  } else {
    for (const service of serviceSeed) {
      await prisma.service.updateMany({
        where: { slug: service.slug },
        data: { imageUrl: service.imageUrl },
      });
    }
    const securisation = serviceSeed.find((service) => service.slug === "securisation-de-produits-sensibles");
    if (securisation && !(await prisma.service.findUnique({ where: { slug: securisation.slug } }))) {
      await prisma.service.updateMany({ where: { order: { gte: 3 } }, data: { order: { increment: 1 } } });
      await prisma.service.create({
        data: {
          slug: securisation.slug,
          title: securisation.title,
          shortDescription: securisation.shortDescription,
          content: securisation.content,
          imageUrl: securisation.imageUrl,
          icon: securisation.icon,
          order: securisation.order,
          isActive: true,
        },
      });
      await prisma.siteSettings.update({ where: { id: "singleton" }, data: { servicesCount: serviceSeed.length } });
    }
  }
  if ((await prisma.galleryImage.count()) === 0) {
    await prisma.galleryImage.createMany({
      data: gallerySeed.map((image) => ({
        url: image.url,
        alt: image.alt,
        category: image.category,
        order: image.order,
        isActive: true,
      })),
    });
  } else {
    for (const image of gallerySeed) {
      const existing = await prisma.galleryImage.findFirst({ where: { url: image.url } });
      if (!existing) {
        await prisma.galleryImage.create({
          data: {
            url: image.url,
            alt: image.alt,
            category: image.category,
            order: image.order,
            isActive: true,
          },
        });
      }
    }
  }
  if ((await prisma.milestone.count()) === 0) {
    await prisma.milestone.createMany({
      data: milestoneSeed.map((item, index) => ({
        year: item.year,
        title: item.title,
        text: item.text,
        imageUrl: item.image,
        order: index + 1,
        isActive: true,
      })),
    });
  } else {
    for (const [index, item] of milestoneSeed.entries()) {
      await prisma.milestone.updateMany({
        where: { year: item.year, title: item.title },
        data: { imageUrl: item.image, order: index + 1 },
      });
    }
  }

  const assets = [
    { key: "hero_video", url: settings.heroVideoUrl || "/videos/hero.mp4", type: "VIDEO" as const, label: "Vidéo du hero" },
    { key: "hero_poster", url: settings.heroPosterUrl, type: "IMAGE" as const, label: "Affiche du hero" },
    { key: "escort_photo", url: "/placeholders/escort.svg", type: "IMAGE" as const, label: "Photo escorte" },
    { key: "about_image", url: settings.aboutImageUrl, type: "IMAGE" as const, label: "Image à propos" },
  ];
  for (const asset of assets) {
    await prisma.mediaAsset.upsert({
      where: { key: asset.key },
      update: asset.key === "about_image" ? { url: asset.url } : {},
      create: asset,
    });
  }

  await prisma.$disconnect();
  console.log("Seed terminé.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

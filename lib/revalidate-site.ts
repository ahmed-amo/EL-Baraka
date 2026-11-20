import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateSite() {
  revalidateTag("site");
  for (const path of ["/", "/ar", "/contact", "/ar/contact", "/galerie", "/ar/galerie", "/recrutement", "/ar/recrutement"]) {
    revalidatePath(path);
  }
  revalidatePath("/services", "layout");
}

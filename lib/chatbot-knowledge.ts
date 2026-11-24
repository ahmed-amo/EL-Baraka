export type ChatbotFacts = {
  legalName: string;
  phone: string;
  phoneHref: string;
  fax: string;
  email: string;
  address: string;
  hours: string;
  capital: string;
  foundedYear: number;
  years: number;
  employees: number;
  partners: number;
  servicesCount: number;
  whatsappNumber: string;
  services: { title: string; shortDescription: string }[];
};

export type ChatReply = {
  text: string;
  links?: { label: string; href: string }[];
};

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAny(haystack: string, needles: string[]) {
  return needles.some((needle) => haystack.includes(normalize(needle)));
}

export function answerChat(question: string, facts: ChatbotFacts, locale: string): ChatReply {
  const q = normalize(question);
  const ar = locale === "ar";
  const contactPath = ar ? "/ar/contact" : "/contact";
  const recruitPath = ar ? "/ar/recrutement" : "/recrutement";
  const wa = facts.whatsappNumber ? `https://wa.me/${facts.whatsappNumber}` : null;

  if (!q) {
    return {
      text: ar
        ? "اكتبوا سؤالاً عن الشركة، الهاتف، العنوان، الخدمات أو كيفية الاتصال."
        : "Posez une question sur la société, le téléphone, l’adresse, les services ou comment nous contacter.",
    };
  }

  if (hasAny(q, ["bonjour", "salut", "hello", "salam", "سلام", "مرحبا", "اهلا", "أهلا"])) {
    return {
      text: ar
        ? `مرحباً، أنا مساعد ${facts.legalName}. يمكنني إفادتكم عن الهاتف، العنوان، الخدمات وكيفية الاتصال.`
        : `Bonjour, je suis l’assistant ${facts.legalName}. Je peux vous renseigner sur le téléphone, l’adresse, les services et comment nous contacter.`,
    };
  }

  if (hasAny(q, ["telephone", "téléphone", "tel", "appeler", "numero", "numéro", "phone", "هاتف", "رقم", "اتصل"])) {
    return {
      text: ar
        ? `الهاتف الثابت: ${facts.phone}${facts.fax ? `\nالفاكس: ${facts.fax}` : ""}`
        : `Téléphone fixe : ${facts.phone}${facts.fax ? `\nFax : ${facts.fax}` : ""}`,
      links: [{ label: ar ? "اتصال" : "Appeler", href: facts.phoneHref }],
    };
  }

  if (hasAny(q, ["email", "mail", "courriel", "e-mail", "بريد", "ايميل"])) {
    return {
      text: ar ? `البريد الإلكتروني: ${facts.email}` : `E-mail : ${facts.email}`,
      links: [{ label: ar ? "إرسال بريد" : "Écrire un e-mail", href: `mailto:${facts.email}` }],
    };
  }

  if (hasAny(q, ["whatsapp", "واتساب", "واتس"])) {
    if (!wa) {
      return {
        text: ar
          ? `يمكنكم الاتصال عبر الهاتف ${facts.phone} أو عبر صفحة الاتصال.`
          : `Vous pouvez appeler le ${facts.phone} ou utiliser la page Contact.`,
        links: [
          { label: ar ? "اتصال" : "Appeler", href: facts.phoneHref },
          { label: ar ? "صفحة الاتصال" : "Page contact", href: contactPath },
        ],
      };
    }
    return {
      text: ar ? "يمكنكم مراسلتنا مباشرة على واتساب." : "Vous pouvez nous écrire directement sur WhatsApp.",
      links: [{ label: "WhatsApp", href: wa }],
    };
  }

  if (hasAny(q, ["adresse", "siege", "siège", "ou etes", "où êtes", "localisation", "jijel", "جيجل", "عنوان", "موقع", "مقر"])) {
    return {
      text: ar ? `العنوان: ${facts.address}` : `Adresse : ${facts.address}`,
      links: [{ label: ar ? "صفحة الاتصال" : "Voir le contact", href: contactPath }],
    };
  }

  if (hasAny(q, ["horaire", "heures", "ouvert", "fermeture", "horaires", "ساعات", "توقيت", "مفتوح"])) {
    return {
      text: ar ? `أوقات العمل: ${facts.hours}` : `Horaires : ${facts.hours}`,
    };
  }

  if (hasAny(q, ["contact", "contacter", "joindre", "devis", "rdv", "rendez", "اتصال", "تواصل", "عرض سعر"])) {
    return {
      text: ar
        ? `للتواصل معنا:\n• الهاتف: ${facts.phone}\n• البريد: ${facts.email}\n• أو عبر نموذج الاتصال على الموقع.`
        : `Pour nous contacter :\n• Téléphone : ${facts.phone}\n• E-mail : ${facts.email}\n• Ou via le formulaire sur la page Contact.`,
      links: [
        { label: ar ? "صفحة الاتصال" : "Page contact", href: contactPath },
        { label: ar ? "اتصال" : "Appeler", href: facts.phoneHref },
        ...(wa ? [{ label: "WhatsApp", href: wa }] : []),
      ],
    };
  }

  if (hasAny(q, ["service", "services", "gardiennage", "transport", "fonds", "telesurveillance", "sécurité", "securite", "حراسة", "خدمات", "نقل", "أموال", "مراقبة"])) {
    const list = facts.services
      .slice(0, 6)
      .map((service) => `• ${service.title}`)
      .join("\n");
    return {
      text: ar
        ? `نقدّم خاصة:\n${list}\n\nللتفصيل أو عرض سعر، استخدموا صفحة الاتصال.`
        : `Nous proposons notamment :\n${list}\n\nPour un devis précis, utilisez la page Contact.`,
      links: [{ label: ar ? "طلب اتصال" : "Demander un devis", href: contactPath }],
    };
  }

  if (hasAny(q, ["qui etes", "qui êtes", "societe", "société", "entreprise", "presentation", "présentation", "apropos", "à propos", "histoire", "creation", "création", "1996", "شركة", "من انتم", "من أنتم", "تعريف", "تاريخ"])) {
    return {
      text: ar
        ? `${facts.legalName} تأسست سنة ${facts.foundedYear} بجيجل. رأسمالها ${facts.capital}. خبرة حوالي ${facts.years} سنة، أكثر من ${facts.employees} عون، وحوالي ${facts.partners} شريك.`
        : `${facts.legalName} a été créée en ${facts.foundedYear} à Jijel. Capital social : ${facts.capital}. Environ ${facts.years} ans d’expérience, plus de ${facts.employees} agents et environ ${facts.partners} partenaires.`,
    };
  }

  if (hasAny(q, ["recrut", "emploi", "job", "candidat", "cv", "carriere", "carrière", "توظيف", "عمل", "سيرة", "ترشح"])) {
    return {
      text: ar
        ? "يمكنكم الاطلاع على فرص التوظيف وإرسال ترشحكم عبر صفحة التوظيف."
        : "Consultez les postes ouverts et envoyez votre candidature depuis la page Recrutement.",
      links: [{ label: ar ? "التوظيف" : "Recrutement", href: recruitPath }],
    };
  }

  if (hasAny(q, ["merci", "thanks", "شكرا", "شكراً"])) {
    return {
      text: ar ? "عفواً. هل تحتاجون معلومة أخرى؟" : "Avec plaisir. Besoin d’autre chose ?",
    };
  }

  return {
    text: ar
      ? `لم أجد جواباً دقيقاً. يمكنكم سؤالي عن الهاتف، العنوان، الساعات، الخدمات، أو كيفية الاتصال.\nهاتف: ${facts.phone}`
      : `Je n’ai pas trouvé de réponse précise. Demandez-moi le téléphone, l’adresse, les horaires, les services, ou comment nous contacter.\nTéléphone : ${facts.phone}`,
    links: [
      { label: ar ? "صفحة الاتصال" : "Contact", href: contactPath },
      { label: ar ? "اتصال" : "Appeler", href: facts.phoneHref },
    ],
  };
}

export const quickPrompts = {
  fr: ["Téléphone ?", "Adresse ?", "Horaires ?", "Vos services ?", "Comment vous contacter ?", "Qui êtes-vous ?"],
  ar: ["الهاتف؟", "العنوان؟", "ساعات العمل؟", "الخدمات؟", "كيف أتواصل؟", "من أنتم؟"],
} as const;

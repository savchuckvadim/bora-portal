import type { Metadata } from "next";

export const SITE_NAME = "Bora Portal";

/** Абсолютный URL сайта для canonical / Open Graph (задайте в .env на проде). */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

export function getMetadataBase(): URL {
  return new URL(getSiteUrl());
}

const ROOT_TITLE = "Вместе создаём больше, чем просто работу";

const ROOT_DESCRIPTION_SHORT =
  "Пространство для общения, обмена идеями и роста. Для сотрудников: знания, вопросы, опыт и развитие команды — в одном месте.";

const ROOT_DESCRIPTION_LONG = [
  "Это пространство для общения, обмена идеями, обучения и роста. Здесь можно делиться опытом, находить ответы, обсуждать задачи и становиться сильнее как команда.",
  "Общайтесь, находите знания, делитесь опытом и развивайтесь вместе с коллегами. Всё важное для работы и роста собрано в одном месте.",
  "Работать вместе. Учиться вместе. Расти вместе.",
  "Этот портал создан для сотрудников компании: чтобы обмениваться знаниями, задавать вопросы, делиться опытом и поддерживать развитие внутри команды.",
].join(" ");

/** Корневые meta (layout). */
export const rootSiteMetadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: ROOT_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: ROOT_DESCRIPTION_SHORT,
  applicationName: SITE_NAME,
  keywords: [
    "портал",
    "команда",
    "Bora",
    "общение",
    "знания",
    "сотрудники",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: SITE_NAME,
    url: "/",
    title: ROOT_TITLE,
    description: ROOT_DESCRIPTION_LONG,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${ROOT_TITLE}`,
    description: ROOT_DESCRIPTION_SHORT,
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/favicon/site.webmanifest",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "48x48" },
      {
        url: "/favicon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: "/favicon/apple-touch-icon.png",
    shortcut: "/favicon/favicon.ico",
  },
};

/** Главная страница портала — без суффикса в title (только главный слоган). */
export const homePageMetadata: Metadata = {
  title: { absolute: ROOT_TITLE },
  description: ROOT_DESCRIPTION_SHORT,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${ROOT_TITLE}`,
    description: ROOT_DESCRIPTION_LONG,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${ROOT_TITLE}`,
    description: ROOT_DESCRIPTION_SHORT,
  },
};

export const loginPageMetadata: Metadata = {
  title: "Вход",
  description:
    "Вход сотрудников в Bora Portal через корпоративную учётную запись (SSO).",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    type: "website",
    url: "/login",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Вход`,
    description:
      "Вход сотрудников в Bora Portal через корпоративную учётную запись (SSO).",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Вход`,
    description:
      "Вход сотрудников в Bora Portal через корпоративную учётную запись (SSO).",
  },
};

/** Тексты разделов (готовы к страницам /knowledge, /learning, когда появятся). */
export const portalSectionsCopy = {
  knowledge: {
    section: "База знаний",
    title: "Знания, которые всегда под рукой",
    description:
      "Инструкции, регламенты, полезные материалы и накопленный опыт компании в одном месте.",
  },
  learning: {
    section: "Обучение",
    title: "Учитесь и развивайтесь внутри компании",
    description:
      "Материалы, курсы и полезный опыт для профессионального роста и развития навыков.",
  },
} as const;

export const postsPageMetadata: Metadata = {
  title: "Делитесь мыслями и опытом",
  description:
    "Публикуйте идеи, новости, полезные материалы и обсуждения, которые помогают команде двигаться вперёд.",
  alternates: {
    canonical: "/posts",
  },
  openGraph: {
    type: "website",
    url: "/posts",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Делитесь мыслями и опытом`,
    description:
      "Публикуйте идеи, новости, полезные материалы и обсуждения, которые помогают команде двигаться вперёд.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Делитесь мыслями и опытом`,
    description:
      "Публикуйте идеи, новости, полезные материалы и обсуждения, которые помогают команде двигаться вперёд.",
  },
};

export const usersPageMetadata: Metadata = {
  title: "Мы сильнее, когда понимаем друг друга",
  description:
    "Портал помогает объединять сотрудников, делая коммуникацию проще, а взаимодействие прозрачнее.",
  alternates: {
    canonical: "/users",
  },
  openGraph: {
    type: "website",
    url: "/users",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Мы сильнее, когда понимаем друг друга`,
    description:
      "Портал помогает объединять сотрудников, делая коммуникацию проще, а взаимодействие прозрачнее.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Мы сильнее, когда понимаем друг друга`,
    description:
      "Портал помогает объединять сотрудников, делая коммуникацию проще, а взаимодействие прозрачнее.",
  },
};

export const messengerPageMetadata: Metadata = {
  title: "Общение без лишних барьеров",
  description:
    "Быстро обсуждайте задачи, задавайте вопросы и оставайтесь на связи с коллегами.",
  alternates: {
    canonical: "/messenger",
  },
  openGraph: {
    type: "website",
    url: "/messenger",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Общение без лишних барьеров`,
    description:
      "Быстро обсуждайте задачи, задавайте вопросы и оставайтесь на связи с коллегами.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Общение без лишних барьеров`,
    description:
      "Быстро обсуждайте задачи, задавайте вопросы и оставайтесь на связи с коллегами.",
  },
};

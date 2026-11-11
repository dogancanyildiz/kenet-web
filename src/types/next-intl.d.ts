import type { routing } from "@/i18n/routing";
import type common from "../../messages/en/common.json";
import type home from "../../messages/en/home.json";
import type privacy from "../../messages/en/privacy.json";
import type seo from "../../messages/en/seo.json";
import type support from "../../messages/en/support.json";

/**
 * Message key type safety: every useTranslations, getTranslations and t()
 * call is checked against the English catalog, so a renamed or deleted key
 * fails tsc instead of rendering as a raw key. English is the reference;
 * tests/i18n/messages.test.ts keeps Turkish in key parity with it. The file
 * list mirrors MESSAGE_FILES in src/i18n/messages.ts.
 */
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof common &
      typeof home &
      typeof privacy &
      typeof support &
      typeof seo;
  }
}

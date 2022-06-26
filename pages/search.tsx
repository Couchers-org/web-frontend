import { appGetLayout } from "components/AppRoute";
import SearchPageComponent from "features/search/SearchPage";
import { GLOBAL, PROFILE, SEARCH } from "i18n/namespaces";
import { GetStaticProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(
      locale ?? "en",
      [GLOBAL, SEARCH, PROFILE],
      nextI18nextConfig
    )),
  },
});

export default function SearchPage() {
  return <SearchPageComponent />;
}

SearchPage.getLayout = appGetLayout({ noFooter: true });

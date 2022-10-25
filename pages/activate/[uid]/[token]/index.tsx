import { appGetLayout } from "components/AppRoute";
import Activation from "features/auth/signup/Activation";
import { AUTH, GLOBAL } from "i18n/namespaces";
import { translationStaticProps } from "i18n/server-side-translations";
import { GetStaticPaths } from "next";

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = translationStaticProps([GLOBAL, AUTH]);

export default function SignupPage() {
  return <Activation />;
}

SignupPage.getLayout = appGetLayout({
  isPrivate: false,
  noFooter: true,
  variant: "standard",
});

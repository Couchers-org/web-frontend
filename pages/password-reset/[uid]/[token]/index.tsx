import { appGetLayout } from "components/AppRoute";
import { CompleteResetPassword } from "features/auth/password";
import { AUTH, GLOBAL } from "i18n/namespaces";
import { translationStaticProps } from "i18n/server-side-translations";
import { GetStaticPaths } from "next";

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = translationStaticProps([GLOBAL, AUTH]);

export default function CompleteResetPasswordPage() {
  return <CompleteResetPassword />;
}

CompleteResetPasswordPage.getLayout = appGetLayout({
  isPrivate: false,
  variant: "standard",
});

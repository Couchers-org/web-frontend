import { languagesKey } from "features/queryKeys";
import { useQuery } from "react-query";
import client from "service/rest/client";

export const useLanguages = () => {
  const { data: { languages, languagesLookup } = {}, ...rest } = useQuery(
    languagesKey,
    () =>
      client.languages.languagesList().then((result) => {
        const list = result.results;
        const { languages, languagesLookup } = (list || []).reduce(
          (languagesResult, { code, name }) => {
            languagesResult.languages[code] = name;
            languagesResult.languagesLookup[name] = code;
            return languagesResult;
          },
          {
            languages: {} as { [code: string]: string },
            languagesLookup: {} as { [name: string]: string },
          }
        );
        return { languages, languagesLookup };
      })
  );

  return {
    languages,
    languagesLookup,
    ...rest,
  };
};

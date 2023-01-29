import { languagesKey } from "features/queryKeys";
import { useQuery } from "react-query";
import { service } from "service";
import { Language } from "service/resources";

export const useLanguages = () => {
    const { data, ...rest } = useQuery(languagesKey, async () => {
      const languages = await service.resources.getLanguages();
      return formatLanguagesData(languages)
    });

    return {
      languages: data?.languagesIdLookup,
      languagesIdLookup: data?.languagesNameLookup,
      ...rest
    };
}

export function formatLanguagesData(languages: Language[]) {
    return languages.reduce((languagesResult, language) => {
      languagesResult.languagesIdLookup[language.id] = language.name;
      languagesResult.languagesNameLookup[language.name] = language.id;
      return languagesResult;
    }, {
      languagesIdLookup: {} as { [id: number]: string },
      languagesNameLookup: {} as { [name: string]: number }
    });
}
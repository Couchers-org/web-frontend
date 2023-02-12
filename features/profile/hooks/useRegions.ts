import { regionsKey } from "features/queryKeys";
import { useQuery } from "react-query";
import { service } from "service";
import { Region } from "service/resources";

export const useRegions = () => {
    const { data, ...rest } = useQuery(regionsKey, async () => {
      const regions = await service.resources.getRegions();
      return formatRegionsData(regions)
    });

    return {
      regions: data?.regions,
      regionsLookup: data?.regionsLookup,
      ...rest
    };
}

export function formatRegionsData(regions: Region[]) {
    return regions.reduce((regionsResult, country) => {
      regionsResult.regions[country.code] = country.name;
      regionsResult.regionsLookup[country.name] = country.code;
      return regionsResult;
    }, {
      regions: {} as { [code: string]: string },
      regionsLookup: {} as { [name: string]: string }
    });
}
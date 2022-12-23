import * as Sentry from "@sentry/nextjs";
import { useAuthContext } from "features/auth/AuthProvider";
import { LngLat } from "maplibre-gl";
import Router, { useRouter } from "next/router";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { dashboardRoute } from "routes";
import {
  filterDuplicatePlaces,
  NominatimPlace,
  simplifyPlaceDisplayName,
} from "utils/nominatim";
import stringOrFirstString from "utils/stringOrFirstString";

// Locations having one of these keys are considered non-regions.
// https://nominatim.org/release-docs/latest/api/Output/#addressdetails
const nonRegionKeys = [
  "municipality",
  "city",
  "town",
  "village",
  "city_district",
  "district",
  "borough",
  "suburb",
  "subdivision",
];

function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}

function useSafeState<State>(
  isMounted: MutableRefObject<boolean>,
  initialState: State | (() => State)
): [State, Dispatch<SetStateAction<State>>] {
  const [state, setState] = useState(initialState);

  const safeSetState = useCallback(
    (newState: SetStateAction<State>) => {
      if (isMounted.current) {
        setState(newState);
      }
    },
    [isMounted]
  );

  return [state, safeSetState];
}

export interface GeocodeResult {
  name: string;
  simplifiedName: string;
  location: LngLat;
  isRegion?: boolean;
}

const NOMINATIM_URL = process.env.NEXT_PUBLIC_NOMINATIM_URL;

const useGeocodeQuery = () => {
  const isMounted = useIsMounted();
  const [isLoading, setIsLoading] = useSafeState(isMounted, false);
  const [error, setError] = useSafeState<string | undefined>(
    isMounted,
    undefined
  );
  const [results, setResults] = useSafeState<GeocodeResult[] | undefined>(
    isMounted,
    undefined
  );

  const query = useCallback(
    async (value: string) => {
      if (!value) {
        return;
      }
      setIsLoading(true);
      setError(undefined);
      setResults(undefined);
      const url = `${NOMINATIM_URL!}search?format=jsonv2&q=${encodeURIComponent(
        value
      )}&addressdetails=1`;
      const fetchOptions = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        method: "GET",
      };
      try {
        const response = await fetch(url, fetchOptions);
        if (!response.ok) throw Error(await response.text());

        const nominatimResults: NominatimPlace[] = await response.json();

        if (nominatimResults.length === 0) {
          setResults([]);
        } else {
          const filteredResults = filterDuplicatePlaces(nominatimResults);
          const formattedResults = filteredResults.map((result) => ({
            location: new LngLat(Number(result["lon"]), Number(result["lat"])),
            name: result["display_name"],
            simplifiedName: simplifyPlaceDisplayName(result),
            isRegion: !nonRegionKeys.some((k) => k in result.address),
          }));

          setResults(formattedResults);
        }
      } catch (e) {
        Sentry.captureException(e, {
          tags: {
            hook: "useGeocodeQuery",
          },
        });
        setError(e instanceof Error ? e.message : "");
      }
      setIsLoading(false);
    },
    [setError, setIsLoading, setResults]
  );

  return { isLoading, error, results, query };
};

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function useUnsavedChangesWarning({
  isDirty,
  isSubmitted,
  warningMessage,
}: {
  isDirty: boolean;
  isSubmitted: boolean;
  warningMessage: string;
}) {
  const router = useRouter();
  // https://github.com/vercel/next.js/issues/2694#issuecomment-732990201
  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = warningMessage;
      return;
    };
    const handleBrowseAway = () => {
      if (!isDirty || isSubmitted) return;
      if (window.confirm(warningMessage)) return;
      router.events.emit("routeChangeError");
      throw Error("Cancelled due to unsaved changes");
    };
    window.addEventListener("beforeunload", handleWindowClose);
    router.events.on("routeChangeStart", handleBrowseAway);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [isDirty, router.events, isSubmitted, warningMessage]);
}

function useRedirectAuthenticatedUsers({authenticated}: {authenticated?:boolean}) {
  const router = useRouter();

  const redirectFrom = stringOrFirstString(router.query.from) ?? dashboardRoute;
  const redirectTo =
    redirectFrom === "/" || redirectFrom === "%2F"
      ? dashboardRoute
      : redirectFrom;

  useEffect(() => {
    if (authenticated) {
      Router.push(redirectTo);
    }
  }, [authenticated, redirectTo]);
}

export {
  useGeocodeQuery,
  useIsMounted,
  usePrevious,
  useRedirectAuthenticatedUsers,
  useSafeState,
  useUnsavedChangesWarning,
};

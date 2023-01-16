import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { http } from "service";
import client from "service/client";

export async function getTermsOfService() {
  const res = await client.resources.getTermsOfService(new Empty());
  return res.toObject();
}


export async function getRegions(): Promise<Region[]> {
    let req =  await http.get<RegionsResponse>("regions");
    let res = req.results;
    // Get all regions, not paginated results
    while (req.next) {
        const nextReq = await http.get<RegionsResponse>(req.next);
        res = res.concat(nextReq.results);
        req = nextReq;
    }
    return res;
}
interface RegionsResponse {
    count: number,
    next: string,
    results: Region[]
}
export interface Region {
    id: number,
    code: string,
    name: string,
}

export async function getLanguages() {
  const languages = await client.resources.getLanguages(new Empty());
  return languages.toObject();
}

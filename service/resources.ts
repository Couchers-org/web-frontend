import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { http } from "service";
import client from "service/client";
import { Paginated } from "types/paginatedResponse";

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

export async function getLanguages(): Promise<Language[]> {

    let req =  await http.get<Paginated<Language>>("languages/");
    let res = req.results;
    // Get all Languages, not paginated results
    while (req.next) {
        const nextReq = await http.get<Paginated<Language>>(req.next);
        res = res.concat(nextReq.results);
        req = nextReq;
    }
    return res;


}

export interface Language {
  id: number;
  code: string;
  name: string;
}
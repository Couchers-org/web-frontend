import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import client from "service/client";

export interface CommunityGuideline {
  title: string;
  guideline: string;
  icon: string;
}

export async function getTermsOfService() {
  const res = await client.resources.getTermsOfService(new Empty());
  return res.toObject();
}

export async function getCommunityGuidelines(): Promise<CommunityGuideline[]> {
  return [
    {
      title: "Be kind to one another",
      guideline:
        "Couchers.org is an inclusive community where people of all cultures and backgrounds come together. Treat everyone with mutual respect and dignity.",
      icon: "hand_with_heart.svg",
    },
    {
      title: "This is not a dating app",
      guideline:
        "Couchers.org is NOT for dating or hooking up. Harassment or or using the platform for the purpose of dating or hooking up will result in a ban.",
      icon: "ghost.svg",
    },
    {
      title: "Be safe and sensible",
      guideline:
        "Read profiles, references, and resources. Report any inappropriate content or behavior.",
      icon: "shield.svg",
    },
    {
      title: "Keep money out of it",
      guideline:
        "Keep things non-transactional. Don't exchange money while staying or hosting. Couchers.org is about learning, experiences, and getting to know people.",
      icon: "handshake.svg",
    },
  ];
}

export async function getRegions() {
  const regions = await client.resources.getRegions(new Empty());
  return regions.toObject();
}

export async function getLanguages() {
  const languages = await client.resources.getLanguages(new Empty());
  return languages.toObject();
}

export const HOME = "https://maplestory.nexon.com";
export const RANKING_SEARCH = (nickname: string): string => `${HOME}/Ranking/World/Total?c=${encodeURI(nickname)}&w=0`;
//https://maplestory.nexon.com/Ranking/World/Total?c=%EC%A2%85%EB%A1%9C%EA%B5%AC%EC%8B%AC%EC%85%94%ED%8B%80&w=0\
//https://maplestory.nexon.com/Ranking/World/Tota?c=%EC%A2%85%EB%A1%9C%EA%B5%AC%EC%8B%AC%EC%85%94%ED%8B%80&w=0
export const DETAIL_SEARCH = (detailURL: string): string => `${HOME}${detailURL}`;
export const MAPLE_GG_SEARCH = (nickname: string): string => `https://maple.gg/u/${encodeURI(nickname)}`;
export const MULUNG_SEARCH = (nickname: string): string => `${HOME}/Ranking/World/Dojang/ThisWeek?c=${encodeURI(nickname)}&t=2&w=0`;
// https://maplestory.nexon.com/Ranking/Union?c=%EC%A2%85%EB%A1%9C%EA%B5%AC%EC%8B%AC%EC%85%94%ED%8B%80&w=0
export const UNION_SEARCH = (nickname: string): string => `${HOME}/Ranking/Union?c=${encodeURI(nickname)}&w=0`;

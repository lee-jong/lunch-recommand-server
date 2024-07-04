declare interface RestaurantInfo {
  구: string;
  업종명: string;
  사업장명: string;
  영업상태: string;
  인허가일자: string;
  폐업일자: string;
  "영업장면적(건물내부_건물외부)": string;
  "소재지(도로명)": string;
  "소재지(지번)": string;
  데이터기준일자: string;
}

type RestaurantKey =
  | "구"
  | "업종명"
  | "사업장명"
  | "영업상태"
  | "인허가일자"
  | "폐업일자"
  | "영업장면적(건물내부_건물외부)"
  | "소재지(도로명)"
  | "소재지(지번)"
  | "데이터기준일자";

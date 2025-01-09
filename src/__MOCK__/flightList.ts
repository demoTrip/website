interface Adult {
  totalPrice: number;
  tax: number;
  fare: number;
  discount: string | null;
  extraFee: string | null;
  bookingFee: number;
  atolFee: string | null;
}

interface AirlineInfo {
  code: string | null;
  name: string | null;
  alliance: string | null;
}

interface ChannelInfoList {
  engineType: string | null;
  channelType: string | null;
}

export interface CityStopInfoGroup {
  type: number;
  code: string | null;
  name: string | null;
  durationInfo: DurationInfo;
  diffType: number;
  dPortInfo: DPortInfo;
  aPortInfo: DPortInfo;
}

interface CraftInfo {
  name: string | null;
  minSeats: number | null;
  maxSeats: number | null;
  widthLevel: string | null;
  craftType: string | null;
}

interface DCityInfo {
  code: string | null;
  name: string | null;
}

export interface DPortInfo {
  code: string | null;
  name: string | null;
  terminal: string | null;
}

interface DurationInfo {
  hour: number;
  min: number;
}

interface FlightInfoList {
  segmentNo: number;
  aDateTime: string | null;
  dCityInfo: DCityInfo;
  aCityInfo: DCityInfo;
  dPortInfo: DPortInfo;
  aPortInfo: DPortInfo;
  arrivalDays: number;
  airlineInfo: AirlineInfo;
  craftInfo: CraftInfo;
  cabinClass: string | null;
  crossingSignInfo: {
      title: string;
      description: string
  } | null;
  dDateTime: string | null;
  shareAirline: string | null;
  shareFlightNo: string | null;
  durationInfo: DurationInfo;
  flightNo: string | null;
}

interface LimitInfo {
  minAge: number;
  maxAge: number;
  minPassengerCount: number;
  maxPassengerCount: number;
}

interface PolicyInfoList {
  productFlag: number;
  channelInfoList: ChannelInfoList[];
  productClass: string[];
  mainClass: string | null;
  availableTickets: number;
  priceDetailInfo: PriceDetailInfo;
  limitInfo: LimitInfo;
}

interface PriceDetailInfo {
  originalViewAvgPrice: string | null;
  viewAvgPrice: number;
  viewTotalPrice: number;
  adult: Adult;
  child: string | null;
  infant: string | null;
}

export interface FlightData {
  shoppingId: string;
  durationInfo: DurationInfo;
  dTimeStr: string | null;
  aTimeStr: string | null;
  avbTickets: number;
  durationMin: number;
  currency: string | null;
  score: number;
  flightId: string | null;
  canFlexibleChange: boolean;
  flightInfoList: FlightInfoList[];
  cityStopInfoGroup: CityStopInfoGroup[];
  policyInfoList: PolicyInfoList[];
}


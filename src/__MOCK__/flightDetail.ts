export interface AdultPrice {
    salePrice: number;
    tax: number;
    discount: any;
    extraFee: any;
    bookingFee: number;
    atolFee: number;
}

export interface ChildPrice {
    salePrice: number;
    tax: number;
    discount: any;
    extraFee: any;
    bookingFee: number;
    atolFee: number;
}

export interface AdultLimitInfo {
    minAge: number;
    maxAge: number;
    minPassengerCount: number;
    maxPassengerCount: number;
}

export interface PassengerLimitInfoPayload {
    /** 最小年龄 */
    minAge: number;
    maxAge: number;
    /** 最小预订人数 */
    minPassengerCount: number;
    maxPassengerCount: number;
}

export interface LimitInfo {
    adultLimitInfo: null | PassengerLimitInfoPayload;
    childLimitInfo: null | PassengerLimitInfoPayload;
    /** 剩余票量 */
    availableSeatCount: number;
    /** 限制的国籍 */
    nationalityLimit: string[];
    /** 国籍限制类型，0-不限，1-允许，2-不允许 */
    nationalityLimitType: number;
}

export interface ProductNoticeInfo {
    /** 折扣价描述 */
    discountPrice: null |  string;
    /** 仅成人 */
    onlyAdult: null |  string;
    /** 多票 */
    multiTicketNoticeList: string[];
    /** 过境 */
    transit: null |  string;
    /** 值机 */
    lcc: null |  string;
    /** 国际限制 */
    mationalityLimit: null |  string;
    /** 旅客限制 */
    passengerLimit: null |  string;
    /** 年龄限制 */
    ageLimit: null |  string;
    /** 24小时免费退 */
    free24HourRefund: null |  string;
    /** 出票时长 */
    ticketDeadline: string;
    /** 限时免费退票 */
    limitTimeFreeRefund: null |  string;
    /** 特殊表述集合 */
    noteList: null |  string[];
}

export interface NoticeInfoList {
    type: string;
    title: string;
    content: string;
    contentList: null |  string[];
    /** 0.default 1.Popup window */
    showType: number;
}

export interface TicketDeadlineInfo {
    deadlineType: number;
    promiseMinutes: number;
}

export type PriceInfoPayload = {
    /** 当前币种售价 （售卖价 或 公布运价） */
    salePrice: string;
    /** 当前币种税费 */
    tax: string;
    /** 当前币种折扣 （售卖价 - 公布运价） */
    discount?: null |  string;
    /** 加价 （售卖价 - 公布运价） */
    extraFee?: null |  string;
    /** Booking Fee */
    bookingFee?: null |  string;
};

export interface PolicyDetailInfo {
    priceId: string;
    /** 平均价 */
    avgPrice: number;
    /** 总价 */
    totalPrice: number;
    /** 1:快速出票,2:出票慢, */
    ticketDeadlineType: number;
    /** 成人运价 */
    adultPrice: null |  PriceInfoPayload;
    childPrice: null |  PriceInfoPayload;
    infantPrice: null |  PriceInfoPayload;
    /** 限制信息 */
    limitInfo: LimitInfo;
    /** 产品提示信息 */
    productNoticeInfo: null |  ProductNoticeInfo;
    /** 公共提示信息 */
    noticeInfoList: NoticeInfoList[];
    /** 最晚出票时间 */
    ticketDeadlineInfo: null |  TicketDeadlineInfo;
}

export interface CardTypeInfo {
    /** 可用证件列表 */
    cardInfoList: any;
    /** 是否支持无证件预定 */
    whetherNonCard: boolean;
}

export interface CityInfo {
    code: string;
    name: string;
}

export interface AirlineInfo {
    code: string;
    name: string;
    isLCC: boolean;
    alliance?: string;
    lowPrice?: any;
}

export interface CraftInfo {
    name: string;
    minSeats: any;
    maxSeats: any;
    widthLevel: string;
    craftType: string;
}

export interface DurationInfo {
    hour: string | number;
    min: string | number;
}

export interface FlightSegment {
    /** 航线 */
    segmentNo: number;
    aDateTime: string;
    dDateTime: string;
    dCityInfo: CityInfo;
    aCityInfo: CityInfo;
    dMainCityInfo?: any;
    aMainCityInfo?: any;
    /** 出发离主城距离 */
    dMainCityDistance?: any;
    /** 到达离主城距离 */
    aMainCityDistance?: any;
    dPortInfo: PortInfo;
    aPortInfo: PortInfo;
    acrossDays?: number;
    /** 航司信息 */
    airlineInfo: AirlineInfo;
    /** 机型信息 */
    craftInfo: CraftInfo;
    /** 主仓 */
    cabinClass: string;
    /** 子舱位 */
    subClass: string;
    /** 过境提示 */
    crossingSignInfo?: null | string;
    /** 共享航司信息 */
    shareAirline?: null | string;
    /** 共享航班号 */
    shareFlightNo?: string;
    durationInfo: DurationInfo;
    /** 中转时长 */
    transferDurationInfo?: null | DurationInfo;
    /** 中转提示 */
    flagInfoList?: null | string;
    /** 经停信息 */
    stopInfoList: StopInfoPayload[];
    /** 行李直挂信息 */
    luggageDirectInfo?: any;
  /** 航班号 */
    flightNo: string;
  /** 航班标签 */
    flightFlag?: number;
  /** 航段号 */
    sequenceNo?: number;
    /** 是否为国际航段，false：中国大陆境内，true：中国大陆境外 */
    beInternationalSegment?: boolean;
}

/** 经停信息 */
export type StopInfoPayload = {
    /** 经停城市 */
    stopCity: CityInfo;
    /** 经停机场 */
    stopAirport: PortInfo;
    /** 中转时长分钟数 */
    stopDurationInfo: DurationInfo;
};


export interface PortInfo {
    code: string;
    name: string;
    terminal: null | string;
}

export interface FlightGroupInfoList {
    /** id **/
    flightId: string;
    /** 到达城市 */
    arriveMultCityName: string;
    /** 到达Date */
    arriveDateTimeFormat: string;
    /** 出发Date */
    departDateTimeFormat: string;
    /** 出发城市 */
    departMultCityName: string;
    /** 航程标题 */
    flightTripTitle: string;
    /** 航程飞行时长 */
    duration: {
        h: string,
        m: string
    }
    /** 航程飞行日期-格式化 */
    dDateFormat: string;
    /** 航段 */
    flightSegments: FlightSegment[];
}

export interface SegmentList {
    dCityCode: string;
    dCityName: string;
    aCityCode: string;
    aCityName: string;
    puIndex: number;
    segmentNo: number;
    sequenceNo: number;
}

export interface BaggageDetail {
    description: string;
    weightAndPieceDesc: string;
    weight: number;
    piece: number;
}

export interface BaggageFormatted {
    sequenceNote: null |  string;
    adultDetail: BaggageDetail;
    childDetail: null |  BaggageDetail;
    infantDetail: null |  BaggageDetail;
}


export interface BaggageInfoList {
    /** 航段信息 */
    // segmentList: SegmentList[];
    checkedNote: string;
/** 行李额格式化信息 */
    checkedFormatted: BaggageFormatted;
    handNote: string;
    handFormatted: BaggageFormatted;
}

export interface FlagInfoList {
    flag: string;
    note: any;
    description: string;
    preferential: any;
}

export interface Formatted {
    adultList: AdultList[];
    childList: any;
    infantList: any;
    concurrentDescription: string;
}

export interface OriginText {
    adult: boolean;
    child: boolean;
    infant: boolean;
}

export interface AdultList {
    specialText: number | string;
    timeText: string;
    specialType: number;
}

export interface PenaltyPolicyInfo {
    note: string;
    formatted: Formatted;
    originText: OriginText;
    notAllowed: boolean;
    firstTimeChangeFreeNote: any;
}

export interface PenaltyInfoList {
    cancelInfo: PenaltyPolicyInfo;
    changeInfo: PenaltyPolicyInfo;
    endorsementNote: string;
    specialNote: string;
    noShowCondition: string;
    flagInfoList: FlagInfoList[];
    partialUseChangeInfo: any;
}

export interface PolicyInfo {
  /** 行李额信息 */
    baggageInfoList: BaggageInfoList[];
  /** 退改签政策 */
    penaltyInfoList: PenaltyInfoList[];
}

export interface TFlightDetailType {
    /** 定位产品的关键参数*/
    shoppingId: string;
    shoppingType: string;
    redisSchema: string;
    /** ShoppingId 是否改变 */
    shoppingIdChanged?: any;
    /** 是否需要postcode */
    requirePostCode?: boolean;
    /** 可用证件 */
    cardTypeInfo?: CardTypeInfo;
    /** 价格描述信息列表 */
    policyDetailInfo: PolicyDetailInfo;
    /** 航班基础信息 */
    flightGroupInfoList: FlightGroupInfoList[];
    /** 运价信息 */
    policyInfo: PolicyInfo;
    deeplink: string;
}

export interface TFlightDetailListType {
    /**orderid */
    orderId: string;
    /** 定位产品的关键参数*/
    shoppingInfo: TFlightDetailType;
    status: number;
    /**预定日期 */
    clientTime: string;
    flightPassengerList:
    [
        {
          /**
           * 乘机人ID
           */
          passengerId?: string | null;
          /**
           * 乘机人名
           */
          givenName: string | null;
          /**
           * 乘机人姓
           */
          surName: string | null;
          /**
           * 生日
           */
          birthDay: string | null;
          /**
           * 证件号
           */
          cardNo?: string | null;
          /**
           * 乘客类型 ADT/CHD/INF
           */
          travelerType: string | null;
          /**
           * 证件类型ID
           */
          cardType?: number | null;
          /**
           * 性别
           */
          gender: string | null;
          /**
           * 国家编号
           */
          nationality: string | null;
          /**
           * 证件有效期
           */
          passportLimit?: string | null;
        }
      ]
    currency: string | null;
}
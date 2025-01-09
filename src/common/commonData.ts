import { getHeader } from "@features/header/headerSlice";
import { useAppSelector } from "src/app/hooks";

export const useCommonHeaderData = () => {
    return useAppSelector(getHeader);
}

export const DEFAULT_IMAGE = 'http://demoTrip.com/static/image/city/AAC_960_210.jpg'
export const DEFAULT_IMAGE_2 = 'http://demoTrip.com/static/image/city/AAC_750_500.jpg'
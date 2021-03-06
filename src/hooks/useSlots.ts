import { useQuery } from 'react-query';
import { IDistrict } from './useDistricts';
import { API_BASE_URL, API_ENDPOINTS, API_HEADERS } from './../constants/api';
import dayjs from 'dayjs';

export interface ISession {
    session_id: string;
    date: string;
    available_capacity: number;
    min_age_limit: number;
    vaccine: string;
    slots: string[];
}

export interface ICenter {
    center_id: number;
    name: string;
    state_name: string;
    district_name: string;
    block_name: string;
    pincode: number;
    lat: number;
    long: number;
    from: string;
    to: string;
    fee_type: string;
    sessions: ISession[];
}

export interface IFetchSlots {
    centers: ICenter[];
}

interface ISlotParams {
    districtId?: IDistrict['district_id'];
    pinCode?: string;
    hideAbove45?: boolean;
}

const fetchSlotsQueryKey = 'FETCH_SLOTS';

export const fetchSlots = async ({
    districtId,
    pinCode,
    hideAbove45,
}: ISlotParams): Promise<IFetchSlots> => {
    const date = dayjs().format('DD-MM-YYYY');

    let slotEndpoint: string = '';
    let queryParams = new URLSearchParams({
        date,
    });

    if (districtId) {
        slotEndpoint = API_ENDPOINTS.APPOINTMENT_CALENDAR_DISTRICT;
        queryParams.append('district_id', districtId.toString());
    }

    if (pinCode) {
        slotEndpoint = API_ENDPOINTS.APPOINTMENT_CALENDAR_PIN;
        queryParams.append('pincode', pinCode);
    }

    const fetchedSlots: IFetchSlots = await (
        await fetch(`${API_BASE_URL}${slotEndpoint}?${queryParams}`, {
            headers: API_HEADERS,
        })
    ).json();

    let centers = fetchedSlots.centers.filter(
        (center) =>
            center.sessions.filter((session) => session.available_capacity > 0)
                .length > 0,
    );

    if (hideAbove45) {
        centers = centers.filter(
            (center) =>
                center.sessions.filter((session) => session.min_age_limit < 45)
                    .length > 0,
        );
    }

    return {
        centers,
    };
};

export const useSlots = (slotParams: ISlotParams) => {
    const slotsQuery = useQuery(
        [fetchSlotsQueryKey, slotParams],
        () => fetchSlots(slotParams),
        {
            enabled: false,
        },
    );
    return slotsQuery;
};

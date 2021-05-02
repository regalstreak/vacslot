import { useQuery } from 'react-query';
import { IDistrict } from './useDistricts';
import { API_BASE_URL, API_ENDPOINTS, API_HEADERS } from './../constants/api';

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
}

const fetchSlotsQueryKey = 'FETCH_SLOTS';

const fetchSlots = async ({
    districtId,
    pinCode,
}: ISlotParams): Promise<IFetchSlots> => {
    const date = new Date()
        .toLocaleDateString('en-in', {
            day: '2-digit',
            year: 'numeric',
            month: '2-digit',
        })
        .split('/')
        .join('-');

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

    const slots = await fetch(`${API_BASE_URL}${slotEndpoint}?${queryParams}`, {
        headers: API_HEADERS,
    });

    return slots.json();
};

export const useSlots = ({ districtId, pinCode }: ISlotParams) => {
    const slotsQuery = useQuery(
        fetchSlotsQueryKey,
        () => fetchSlots({ districtId, pinCode }),
        {
            enabled: false,
        },
    );
    return slotsQuery;
};

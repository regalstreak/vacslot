import { IState } from './useStates';
import { API_BASE_URL, API_ENDPOINTS, API_HEADERS } from '../constants/api';
import { useQuery } from 'react-query';
import { IDropdownItem } from '../components/Dropdown';

export interface IDistrict {
    district_id: number;
    district_name: string;
}

export interface IFetchDistricts {
    districts: IDistrict[];
    ttl: number;
}

const fetchDistrictsQueryKey = 'FETCH_DISTRICTS';

const getDistrictsDropdownItems = (
    districts?: IDistrict[],
): IDropdownItem[] => {
    if (!districts) {
        return [];
    }
    return districts?.map(state => ({
        value: state.district_name,
        id: state.district_id,
    }));
};

const fetchDistricts = async (
    stateId?: IState['state_id'],
): Promise<IFetchDistricts> => {
    const districts = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.LOCATION_DISTRICTS}${stateId}`,
        {
            headers: API_HEADERS,
        },
    );
    return districts.json();
};

export const useDistricts = (stateId?: IState['state_id']) => {
    const districtsQuery = useQuery(fetchDistrictsQueryKey, () =>
        fetchDistricts(stateId),
    );
    return {
        districtsQuery,
        districtsDropdownItems: getDistrictsDropdownItems(
            districtsQuery?.data?.districts,
        ),
    };
};

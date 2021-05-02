import { API_BASE_URL, API_ENDPOINTS, API_HEADERS } from './../constants/api';
import { useQuery } from 'react-query';

export interface IState {
    state_id: number;
    state_name: string;
}

export interface IFetchStates {
    states: IState[];
    ttl: number;
}

const fetchStatesQueryKey = 'FETCH_STATES';

const fetchStates = async (): Promise<IFetchStates> => {
    const states = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.LOCATION_STATES}`,
        {
            headers: API_HEADERS,
        },
    );
    return states.json();
};

export const useStates = () => {
    const statesQuery = useQuery(fetchStatesQueryKey, fetchStates);
    return statesQuery;
};

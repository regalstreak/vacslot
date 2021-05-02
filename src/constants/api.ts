export const API_BASE_URL = 'https://cdn-api.co-vin.in/api/v2';

export const API_ENDPOINTS = {
    LOCATION_STATES: '/admin/location/states/',
    LOCATION_DISTRICTS: '/admin/location/districts/',

    APPOINTMENT_CALENDAR_PIN: '/appointment/sessions/public/calendarByPin/',
    APPOINTMENT_CALENDAR_DISTRICT:
        '/appointment/sessions/public/calendarByDistrict/',
};

export const API_HEADERS = {
    Accept: 'application/json',
    'Accept-Language': 'en_IN',
};

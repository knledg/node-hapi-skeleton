/*
  Google Geocoding based on address.
  Delete is unused.
*/

import Promise from 'bluebird';
import GoogleMapsApi from 'googlemaps';

Promise.promisifyAll(GoogleMapsApi.prototype);

export async function geolocate(address) {
  const gmAPI = new GoogleMapsApi({
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_private_key: process.env.GOOGLE_PRIVATE_KEY,
    stagger_time: 1000,
    encode_polylines: false,
    secure: process.env.GOOGLE_USE_SECURE_CONNECTION,
  });

  return gmAPI.geocodeAsync({
    address,
    components: 'components=country:US',
    // bounds: '55,-1|54,1',
    language: 'en',
    region: 'us',
  });
}

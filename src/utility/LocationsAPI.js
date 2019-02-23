import axios from 'axios';

const api = "https://api.foursquare.com/v2/venues/"
const version = "20180323"
const clientId = "CKZMGSSVJRHZCYK1PXDWDGZVIYNJCHMVRFX4MYMSTTX41UCD"
const clientSecret = "3DZPGUPKPPTW3GM4QMAIGQBWZODLQN1DOWWIZH2GFRQ1EHGI"

// Builds the query for retrieving the locations
let buildLocationsQuery = () => {
    const parameters = {
        query: "sights",
        ll: "47.608013, -122.335167",
        limit: "15",
        client_id: clientId,
        client_secret: clientSecret,
        v: version
    }
    return api + "explore?" + new URLSearchParams(parameters)
}

// Builds the query for retrieving the photos
let buildLocationPhotoQuery = (locationId) => {
    const parameters = {
        client_id: clientId,
        client_secret: clientSecret,
        v: version
    }
    return api + locationId + "/photos?" + new URLSearchParams(parameters)
}

// Retrieves the locations from the Foursquare api
export const getAllLocations = () =>
    axios.get(buildLocationsQuery())
        .then(response => {
            return response.data.response.groups[0].items
        })
        .catch(error => {
            alert("Error getting data from foursquare" )
        })

// Retrieves the photos for the specific location
export const getPhoto = (locationId) =>
    axios.get(buildLocationPhotoQuery(locationId))
        .then(response => {
            return response.data.response.photos.items[0]
        })
        .catch(error => {
            alert("Error getting data from foursquare" )
        })

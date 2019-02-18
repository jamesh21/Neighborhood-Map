import axios from 'axios';

const api = "https://api.foursquare.com/v2/venues/explore?"

let buildLocationsQuery = () => {
    const parameters = {
        query: "sights",
        ll: "47.608013, -122.335167",
        limit: "30",
        client_id: "CKZMGSSVJRHZCYK1PXDWDGZVIYNJCHMVRFX4MYMSTTX41UCD",
        client_secret: "3DZPGUPKPPTW3GM4QMAIGQBWZODLQN1DOWWIZH2GFRQ1EHGI",
        v: "20180323"
    }
    return api + new URLSearchParams(parameters);
}

export const getAllLocations = () =>
axios.get(buildLocationsQuery())
    .then(response => {
        return response.data.response.groups[0].items;
    })
    .catch(error => {
        console.log("Error " + error);
    })

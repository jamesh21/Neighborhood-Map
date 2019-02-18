import React, { Component } from 'react';
import './App.css';
import * as LocationsAPI from './LocationsAPI';
class App extends Component {

    state = {
        locations: []
    }

    componentDidMount() {
        this.getLocations();
    }

    renderMap = () => {
        window.initMap = this.initMap;
        loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBWuIECp6K-PB2nZwnsob8oUU767EiZ4_w&v=3&callback=initMap");
    }

    getLocations = () => {
        LocationsAPI.getAllLocations()
            .then((locations) => {
                this.setState( {locations}, this.renderMap() );
        })
        .catch(error => {
            console.log("Error " + error);
        })
    }

    populateInfoWindow = (marker, infoWindow, map) => {
        if (infoWindow.marker != marker ) {
            infoWindow.marker = marker;
            infoWindow.setContent('<div>' + marker.title + '</div>');
            infoWindow.open(map, marker);
            // infoWindow.addListener('closeclick', () => {
            //     infoWindow.setMarker(null);
            // })
        }
    }

    initMap = () => {
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: {lat: 47.608013, lng: -122.335167},
            zoom: 14
        });
        const infoWindow = new window.google.maps.InfoWindow();
        this.state.locations.map(location => {
            const marker = new window.google.maps.Marker({
                position: {lat: location.venue.location.lat, lng: location.venue.location.lng},
                map: map,
                title: location.venue.name
            });
            marker.addListener('click', () => {
                this.populateInfoWindow(marker, infoWindow, map);
            });
        });

    }

    render() {
        return (
            <main>
                <div className="location-list-box">

                </div>
                <div id="map"></div>
            </main>
        );
    }
}

function loadScript (url) {
    const index = window.document.getElementsByTagName("script")[0];
    const script = window.document.createElement("script");
    script.src = url;
    script.async = true;
    script.defer = true;
    index.parentNode.insertBefore(script, index);
}

// buildQuery = () => {
//     const endPoint = "https://api.foursquare.com/v2/venues/explore?";
//     const parameters = {
//         query: "sights",
//         ll: "47.608013, -122.335167",
//         limit: "30",
//         client_id: "CKZMGSSVJRHZCYK1PXDWDGZVIYNJCHMVRFX4MYMSTTX41UCD",
//         client_secret: "3DZPGUPKPPTW3GM4QMAIGQBWZODLQN1DOWWIZH2GFRQ1EHGI",
//         v: "20180323"
//     }
//     return endPoint + new URLSearchParams(parameters);
// }

// getLocations = () => {
//     axios.get(this.buildQuery())
//         .then(response => {
//             this.setState({
//                 locations: response.data.response.groups[0].items
//             }, this.renderMap());
//         })
//         .catch(error => {
//             console.log("Error " + error);
//         })
// }
export default App;

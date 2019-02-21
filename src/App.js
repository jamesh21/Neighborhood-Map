import React, { Component } from 'react'
import './App.css'
import * as LocationsAPI from './utility/LocationsAPI'
import Sidebar from './components/Sidebar'
import { slide as Menu } from 'react-burger-menu'

var map;
var infoWindow;
class App extends Component {

    state = {
        locations: [],
        markers: []
    }

    componentDidMount() {
        this.getLocations()
    }

    updateMarkers = (markers) => {
        this.setState( {markers} )
        this.updateMap();
    }

    updateLocations = (locations) => {
        this.setState( {locations} )
    }

    updateMap = () => {
        for (let i = 0; i < this.state.markers.length; i++) {
            if (this.state.markers[i].visible) {
                this.state.markers[i].setMap(this.map)
            } else {
                this.state.markers[i].setMap(null)
            }
        }
    }

    disableMarkerAnimation = () => {
        const markers = this.state.markers
        for (let i = 0; i < markers.length; i++) {
            markers[i].setAnimation(null)
        }
    }

    listItemClicked = (location) => {
        this.disableMarkerAnimation()
        this.populateInfoWindow(this.state.markers.find(marker => marker.id === location.venue.id))
    }

    // Renders all resources needed to show the map on the screen.
    renderMap = () => {
        window.initMap = this.initMap;
        loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBWuIECp6K-PB2nZwnsob8oUU767EiZ4_w&v=3&callback=initMap")
    }


    // Gets all the locations from the LocationsAPI and calls rendermap after finished.
    getLocations = () => {
        LocationsAPI.getAllLocations()
            .then((locations) => {
                this.setState( {locations}, this.renderMap() )
                console.log(locations)
        })
        .catch(error => {
            console.log("Error " + error)
        })
    }

    getPhoto = (marker) => {
        LocationsAPI.getPhoto(marker.id)
            .then((photo) => {
                // console.log(photo.prefix + "200x200" + photo.suffix)
                // console.log(photo.prefix)
                return photo.prefix + "200x200" + photo.suffix
            })
            .catch(error => {
                console.log("Error " + error)
            })
    }
    // Adds info windows for each marker.
    populateInfoWindow = (marker) => {
        if (this.infoWindow.marker != marker) {
            this.infoWindow.marker = marker
            const contentString = '<div>' +
            '<h2>' + marker.title + '</h2>' +
            '<h3>' + marker.address + '</h3></div>'
            this.infoWindow.setContent(contentString)
            this.infoWindow.open(this.map, marker)
            marker.setAnimation(window.google.maps.Animation.BOUNCE)
            // this.getPhoto(marker)

            this.infoWindow.addListener('closeclick', () => {
                marker.setAnimation(null)
            })
        }
    }

    // Initializes google map and adds markers for all the locations.
    initMap = () => {
        this.map = new window.google.maps.Map(document.getElementById('map'), {
            center: {lat: 47.608013, lng: -122.335167},
            zoom: 14
        });
        this.infoWindow = new window.google.maps.InfoWindow()
        let markers = []
        this.state.locations.map(location => {
            const marker = new window.google.maps.Marker({
                position: {lat: location.venue.location.lat, lng: location.venue.location.lng},
                map: this.map,
                title: location.venue.name,
                address: location.venue.location.address,
                id: location.venue.id
            });
            marker.addListener('click', () => {
                this.disableMarkerAnimation()
                this.populateInfoWindow(marker)
            });
            markers.push(marker)
        });
        this.setState( {markers} )

    }


    render() {
        return (
            <main>
                <div className="navbar">
                    <h1>Neighborhood Map</h1>
                </div>
                <div className="container">
                    <div className="location-list-box">
                        <Sidebar
                            locations = {this.state.locations}
                            markers = {this.state.markers}
                            updateMarkers = {this.updateMarkers}
                            listItemClicked = {this.listItemClicked}
                        />
                    </div>
                    <div className="map-container">
                        <div id="map"></div>
                    </div>
                </div>

            </main>
        );
    }
}

// Used to load the script for google maps api
function loadScript (url) {
    const index = window.document.getElementsByTagName("script")[0]
    const script = window.document.createElement("script")
    script.src = url
    script.async = true
    script.defer = true
    index.parentNode.insertBefore(script, index)
}

export default App;

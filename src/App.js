import React, { Component } from 'react'
import './App.css'
import * as LocationsAPI from './utility/LocationsAPI'
import Sidebar from './components/Sidebar'

let map;
let infoWindow;
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

    // Used to disable the marker bounce animation
    disableMarkerAnimation = () => {
        const markers = this.state.markers
        for (let i = 0; i < markers.length; i++) {
            markers[i].setAnimation(null)
        }
    }

    // Listen to list item clicks to open corresponding marker.
    listItemClicked = (location) => {
        this.disableMarkerAnimation()
        this.populateInfoWindow(this.state.markers.find(marker => marker.id === location.venue.id))
    }

    // Used when tabbing through the list item and by pressing enter it will open the marker.
    listItemPressed = (keyPressed, location) => {
        if (keyPressed.key === 'Enter') {
            this.disableMarkerAnimation()
            this.populateInfoWindow(this.state.markers.find(marker => marker.id === location.venue.id))
        }
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
        })
        .catch(error => {
            console.log("Error " + error)
        })
    }

    // Promise which gets photos from the foursquare api
    getPhoto = (marker) => {
        return new Promise((resolve, reject) => {
            LocationsAPI.getPhoto(marker.id)
                .then((photo) => {
                    resolve(photo.prefix + "200x200" + photo.suffix)
                })
                .catch(error => {
                    reject(new Error(error))
                })
        })

    }

    // Adds info windows for each marker.
    populateInfoWindow = (marker) => {
        if (this.infoWindow.marker != marker) {
            this.infoWindow.marker = marker
            let markerPhoto
            this.getPhoto(marker)
                .then((result) => {
                    markerPhoto = result
                    const contentString = `<div><h2>${marker.title}</h2><h3>${marker.address}</h3><img src="${markerPhoto}" alt="picture of ${marker.title}"></div>`
                    this.infoWindow.setContent(contentString)
                })
                .catch(error => {
                    console.log("Error " + error)
                })
            this.infoWindow.open(this.map, marker)
            marker.setAnimation(window.google.maps.Animation.BOUNCE)
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
            <div className="app-container">
                <header>
                    <nav className="navbar">
                        <h1>Neighborhood Map</h1>
                    </nav>
                </header>
                <main className="main-container">
                    <section className="location-list-box">
                        <Sidebar
                            locations = {this.state.locations}
                            markers = {this.state.markers}
                            updateMarkers = {this.updateMarkers}
                            listItemClicked = {this.listItemClicked}
                            listItemPressed = {this.listItemPressed}
                        />
                    </section>
                    <section className="map-container">
                        <div id="map"></div>
                    </section>
                </main>
            </div>
        )
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

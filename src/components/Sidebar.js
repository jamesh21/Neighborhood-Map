import React, { Component } from 'react'
import LocationListView from './LocationListView'
import LocationSearch from './LocationSearch'

class Sidebar extends Component {

    state = {
        query: ''
    }

    // Used to set which markers are visible
    updateMap = (query) => {
        this.setState({ query: query })
        const {locations, markers, updateMarkers} = this.props
        const currentShownLocations = locations.map(location => {
            const isContained = location.venue.name.toLowerCase().includes(query.trim().toLowerCase())
            const currentMarker = markers.find(marker => marker.id === location.venue.id)
            if (isContained) {
                currentMarker.visible = true;
            } else {
                currentMarker.visible = false;
            }
        })
        updateMarkers(markers)
    }

    // For filtering the entered location in the search box
    filterLocations = () => {
        const { locations } = this.props
        if (this.state.query.trim() !== "") {
            const filteredLocations = locations.filter(location =>
                location.venue.name.toLowerCase().includes(this.state.query.toLowerCase())
            )
            return filteredLocations
        } else {
            return locations
        }
    }

    render () {
        return (
            <div>
                <LocationSearch
                    updateQuery = {this.updateMap}
                    query = {this.state.query}
                />
                <LocationListView
                    locations = {this.filterLocations()}
                    listItemClicked = {this.props.listItemClicked}
                    listItemPressed = {this.props.listItemPressed}
                />
            </div>
        )
    }
}

export default Sidebar

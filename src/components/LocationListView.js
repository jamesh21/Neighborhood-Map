import React, { Component } from 'react'
import LocationItem from './LocationItem'
class LocationListView extends Component {
    render() {
        const { locations } = this.props
        return (
            <ol>
                {locations.map((location, index) => (

                    <LocationItem
                        key={index}
                        location = {location}
                        listItemClicked = {this.props.listItemClicked}
                    />

                ))}
            </ol>
        )
    }
}

export default LocationListView

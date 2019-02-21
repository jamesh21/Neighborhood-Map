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
                        listItemPressed = {this.props.listItemPressed}
                    />

                ))}
            </ol>
        )
    }
}

export default LocationListView

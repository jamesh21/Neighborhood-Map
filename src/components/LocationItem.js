import React, { Component } from 'react'
class LocationItem extends Component {
    render () {
        return (
            <li className="listItem" onClick={() => this.props.listItemClicked(this.props.location)}>
                {this.props.location.venue.name}
            </li>
        )
    }
}

export default LocationItem

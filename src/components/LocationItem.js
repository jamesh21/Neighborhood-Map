import React, { Component } from 'react'
class LocationItem extends Component {
    render () {
        return (
            <li tabIndex="0" className="listItem" onClick={() => this.props.listItemClicked(this.props.location)} onKeyPress={(event) => this.props.listItemPressed(event, this.props.location)}>
                {this.props.location.venue.name}
            </li>
        )
    }
}
export default LocationItem

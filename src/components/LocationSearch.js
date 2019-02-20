import React, { Component } from 'react'
class LocationSearch extends Component {
    render () {
        return (
            <input
                className='search-bar'
                type='search'
                placeholder='Search locations'
                value={this.props.query}
                onChange={(event) => this.props.updateQuery(event.target.value)}
            />
        )
    }
}

export default LocationSearch

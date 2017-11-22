import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import './styles/Map.css'

const Location = () => <div className='vehicle-icon' />;

class SimpleMap extends Component {
  unique_locations = {}

  constructor(props) {
    super(props);
    this.state = {
      currentPosition:{}
    }

    this.renderLocations = this.renderLocations.bind(this)
    this.onMapChange = this.onMapChange.bind(this)
  }

  static defaultProps = {
    center: [52.53, 13.403],
    zoom: 11
  };

  renderLocations(location, index){
    if (this.state.currentPosition.zoom < 15){
      if (!(location.vehicle_id in this.unique_locations)){
        this.unique_locations[location.vehicle_id] = location
        return(
          <Location
            key={index}
            lat={location.lat}
            lng={location.lng}
          />
        )
      }
    }else{
      const { currentPosition } = this.state
      if((location.lat > currentPosition.bounds.sw.lat && location.lat < currentPosition.bounds.nw.lat) &&
        (location.lng > currentPosition.bounds.sw.lng && location.lng < currentPosition.bounds.ne.lng)){
          return(
            <Location
              key={index}
              lat={location.lat}
              lng={location.lng}
            />
          )
      }
    }
  }

  renderLocationsComplete(location, index){
    return(
      <Location
        key={index}
        lat={location.lat}
        lng={location.lng}
      />
    )
  }

  onMapChange(currentPosition){
    this.setState({currentPosition: currentPosition})
    this.unique_locations = {}
  }

  render() {
    const API_KEY = 'AIzaSyCiar1kjMg0w3zDy4ZLGRll-wfjHIc_7qA'

    const { locations } = this.props

    return (
      <GoogleMapReact
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        style={{height: '100%', 'width': '100%'}}
        onChange={this.onMapChange}
        bootstrapURLKeys={{
          key: API_KEY
        }}
      >
        {
          locations.map(this.renderLocations)
        }
      </GoogleMapReact>
    );
  }
}

export default SimpleMap

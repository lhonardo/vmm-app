import React, { Component } from 'react'
import './styles/App.css'
import ActionCable from 'actioncable'
import SimpleMap from './Map'

class App extends Component {
  vehicles = []
  locations = []

  constructor(props) {
    super(props)

    this.state = {
      vehicles: {},
      locations: []
    }

    this.handleReceiveUpdates = this.handleReceiveUpdates.bind(this)
    this.handleLocationsUpdates = this.handleLocationsUpdates.bind(this)
    this.updateState = this.updateState.bind(this)
  }

  componentDidMount() {
    const cable = ActionCable.createConsumer('ws://localhost:3001/cable')

    this.sub = cable.subscriptions.create('VehiclesChannel', {
      received: this.handleReceiveUpdates
    })

    this.sub2 = cable.subscriptions.create('LocationsChannel', {
      received: this.handleLocationsUpdates
    })

    window.fetch('http://localhost:3001/start')

    setInterval(() => this.updateState(this.vehicles, this.locations), 6000)
  }

  updateState(vehicles, locations) {
    if(Object.keys(this.state.vehicles).length !== vehicles.length){
      let associative_vehicles = {}

      vehicles.forEach((item) => {
        associative_vehicles[item['_id']] = item
      })

      this.setState({vehicles: associative_vehicles})
    }

    if(this.state.locations.length !== locations.length){
      this.setState({locations: locations})
    }
  }

  handleReceiveUpdates(vehicles){
    this.vehicles = vehicles
  }

  handleLocationsUpdates(locations){
    this.locations = locations
  }

  render() {
    return (
      <SimpleMap
        vehicles={this.state.vehicles}
        locations={this.state.locations}
        defaultZoom={11}
        defaultCenter={{'lat': 52.53, 'lng': 13.403}}
      />
    )
  }
}

export default App

// Name and SID (alphabetically):
// Alvin CHAN 1155108897
// Chun Yeung CHOW 1155131406
// Ngou Shan WONG 1155141835
// Siu Fung CHEUNG 1155110966
// Wing Lam CHENG 1155125313
// Yee Han CHENG 1155143426

import React from 'react';

import { 
Map, 
Marker,
GoogleApiWrapper, 
InfoWindow 
} from 'google-maps-react';

const mapStyle = {
    width: '40%',
    height: '400',
};

export class MapContainer extends React.Component {
    constructor(props) {
      super(props);
      /*https://stackoverflow.com/questions/67849094/i-want-to
      -show-info-window-when-i-click-on-google-map-marker-in-
      reactjs-app*/
      this.state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        newlink:""
      };
    }

    onMarkerClick = (props, marker, e) =>{
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
    };

  onInfoWindowClose = () => {
    this.setState({
      activeMarker: null,
      showingInfoWindow: false
    });
  };
  
    displayMarkers = () => {
      return this.props.loc.map((store, index) => {
        return <Marker 
        key={index} 
        id={index} 
        title={store.locName} 
        position={{
         lat: store.locLat,
         lng: store.locLong
       }}
       onClick={this.onMarkerClick} />
      });
    }
  
    render() {
      return (
          <Map
            google={this.props.google}
            zoom={2}
            style={mapStyle}
            initialCenter={{ lat: 0, lng: 0}}
          >
            {this.displayMarkers()}
            <InfoWindow
              marker={this.state.activeMarker}
              onClose={this.onInfoWindowClose}
              visible={this.state.showingInfoWindow}
            >
              <div>
                {/* <h5 component={Link} to={"/location/" + this.state.selectedPlace.title}>{this.state.selectedPlace.title}</h5> */}
                {/* <Link to={"/location/" + this.state.selectedPlace.title}><h5>{this.state.selectedPlace.title}</h5></Link> */}
                <h5>{this.state.selectedPlace.title}</h5>
              </div>
            </InfoWindow>
          </Map>
      );
    }
  }

export default GoogleApiWrapper({
apiKey: 'AIzaSyCpO84gMZqJsvzb0861se_Vn8_obfsplOY'
})(MapContainer);
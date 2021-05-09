import * as React from 'react';
import {
    withGoogleMap,
    GoogleMap,
    Marker,
} from "react-google-maps";

const Map: React.FC<{lat: number, lng: number}> = ({lng, lat}) => {
    const MapWithAMarker = withGoogleMap(props =>
        <GoogleMap
            defaultZoom={8}
            defaultCenter={{lat: lat, lng: lng}}
        >
            <Marker
                position={{lat: lat, lng: lng}}
            />
        </GoogleMap>
    );
    return (
        <MapWithAMarker
            containerElement={<div style={{height: `400px`}}/>}
            mapElement={<div style={{height: `100%`}}/>}
        />
    )
}


export default Map;
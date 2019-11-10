import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline
} from "react-google-maps";

const Map = props => {
  return (
    <GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: -33.1402229, lng: -64.3512425 }}
    >
      {props.content.map((line, key) => (
        <Polyline
          key={key}
          path={line.points}
          geodesic={true}
          options={{
            strokeColor: line.color,
            strokeOpacity: 0.75,
            strokeWeight: 2,
            icons: [
              {
                icon: "no",
                offset: "0",
                repeat: "20px"
              }
            ]
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default withScriptjs(withGoogleMap(Map));

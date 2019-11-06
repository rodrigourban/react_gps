import React from "react";
import firebase from "firebase";
import { Avatar, Button } from "antd";
import Map from "./Map/Map";
import SideMenu from "./Sidemenu/Sidemenu";
import axios from "axios";
class Layout extends React.Component {
  state = {
    puntos: [],
    showing: null
  };

  toggleShowedElement = n => {
    this.setState({ showing: n });
    this.fetchPoints(n);
  };

  componentDidMount() {
    const db = firebase.firestore();
    db.collection("points")
      .where("userId", "==", firebase.auth().currentUser.uid)
      .get()
      .then(querySnapshot => {
        let contenido = [];
        querySnapshot.forEach(doc => {
          contenido.push({
            lat: doc.data().point.latitude,
            lng: doc.data().point.longitude
          });
        });
        console.log(contenido);

        this.setState({ puntos: contenido });
      });
  }

  fetchPoints = n => {
    if (n === 0) {
      axios
        .get(
          `https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/${this.props.spotID}/message.json`
        )
        .then(res => {
          const messages =
            res.data.response.feedMessageResponse.messages.message;
          const points = messages.map(element => ({
            lat: element.latitude,
            lng: element.longitude
          }));
          this.setState({ puntos: points });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.setState({ puntos: [] });
      console.log("Buscar en firebase");
    }
  };
  render() {
    return (
      <div style={{ display: "flex", height: "100%" }}>
        <div
          style={{
            flex: "20%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div style={{ padding: "8px" }}>
            <Avatar
              size={64}
              src={firebase.auth().currentUser.photoURL}
              alt={`Foto de ${firebase.auth().currentUser.displayName}`}
            />
            <h1>Bienvenido</h1>
            <div style={{ marginBottom: "1rem" }}>
              {firebase.auth().currentUser.displayName}
            </div>
          </div>
          <div style={{ padding: "15px", background: "#ccc", flex: "1" }}>
            <SideMenu
              userList={[{ username: "Ismael" }]}
              onToggle={this.toggleShowedElement}
            />
          </div>
          <div>
            <Button onClick={() => console.log("Creando")} block type="primary">
              Cargar Nuevo
            </Button>
            <Button onClick={() => firebase.auth().signOut()} block>
              Salir
            </Button>
          </div>
        </div>
        <div style={{ background: "#ddd", flex: "80%" }}>
          <Map
            isMarkerShown
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB7sg2QE8LR3UadUzVvHEHM7_60VvHICSI&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            snake={this.state.puntos}
          />
        </div>
      </div>
    );
  }
}

export default Layout;

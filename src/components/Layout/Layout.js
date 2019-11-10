import React from "react";
import firebase from "firebase";
import { Avatar, Button } from "antd";
import Map from "./Map/Map";
import SideMenu from "./Sidemenu/Sidemenu";
import axios from "axios";
import { Modal } from "antd";
import AddPerson from "../Modal/Forms/AddPerson";
import EditPerson from "../Modal/Forms/EditPerson";
import "./scrollbar.css";

class Layout extends React.Component {
  state = {
    puntos: [],
    showing: null,
    modal: false,
    modalId: null,
    userList: [],
    db: firebase.firestore()
  };

  toggleShowedElement = n => {
    this.setState({ showing: n });
    this.fetchPoints(n);
  };

  toggleModal = n => {
    if (n) {
      this.setState({ modal: !this.state.modal, modalId: n });
    }
    this.setState({ modal: !this.state.modal });
  };

  editElement = el => {
    this.setState({ spot: el.spot });
    this.toggleModal();
  };

  componentDidMount() {
    this.state.db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(res => {
        this.setState({
          userList: res.data().userList,
          spotId: res.data().spotId
        });
      });
  }

  fetchPoints = n => {
    if (n === 0) {
      axios
        .get(
          `https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/${this.state.spotId}/message.json`
        )
        .then(res => {
          const messages =
            res.data.response.feedMessageResponse.messages.message;
          const points = messages.map(element => ({
            lat: element.latitude,
            lng: element.longitude
          }));
          this.setState({ puntos: points });
          this.forceUpdate();
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.state.db
        .collection("points")
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

          this.setState({ puntos: contenido });
        });
    }
  };

  render() {
    return (
      <div style={{ display: "flex", height: "100%" }}>
        <Modal
          title={
            this.state.modalId === 1 ? "Editar información" : "Agregar persona"
          }
          visible={this.state.modal}
          onCancel={() => this.toggleModal(0)}
          footer={null}
        >
          {this.state.modalId === 1 ? (
            <EditPerson
              toggleModal={this.toggleModal}
              userId={firebase.auth().currentUser.uid}
            />
          ) : (
            <AddPerson onSubmit={this.addElement} />
          )}
        </Modal>
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
              {firebase.auth().currentUser.displayName}{" "}
              <Button
                onClick={() => this.toggleModal(1)}
                shape="circle"
                icon="edit"
              />
            </div>
          </div>
          <div
            style={{
              padding: "15px",
              background: "#ccc",
              flex: "1",
              overflowY: "auto"
            }}
          >
            <SideMenu
              userList={this.state.userList}
              onToggle={this.toggleShowedElement}
            />
          </div>
          <div>
            <Button onClick={() => this.toggleModal(2)} type="primary" block>
              Agregar persona
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

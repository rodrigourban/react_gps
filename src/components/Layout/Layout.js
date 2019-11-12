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

const generateColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

class Layout extends React.Component {
  state = {
    content: [],
    showing: null,
    modal: false,
    modalId: null,
    userList: [],
    db: firebase.firestore()
  };

  toggleModal = n => {
    if (n) {
      this.setState({ modal: !this.state.modal, modalId: n });
    }
    this.getUser();
    this.setState({ modal: !this.state.modal });
  };

  editElement = el => {
    this.setState({ spot: el.spot });
    this.toggleModal();
  };

  getUser = () => {
    this.state.db
      .collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then(res => {
        if (!res.empty) {
          this.setState({
            userList: res.docs[0].data().userList,
            spotId: res.docs[0].data().spotId,
            color: res.docs[0].data().color
          });
        } else {
          //If user has no profile, create one
          const color = generateColor();
          this.state.db
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .set({
              username: firebase.auth().currentUser.displayName,
              email: firebase.auth().currentUser.email,
              spotId: "",
              color: color
            });
          this.setState({ spotId: "", color: color });
        }
      });
  };

  componentDidMount() {
    this.getUser();
  }

  fetchPoints = payload => {
    const oldContent = [...this.state.content];
    const oldContentIndex = oldContent.findIndex(
      element => element.username === payload.username
    );
    if (oldContentIndex > -1) {
      if (oldContent[oldContentIndex].type === payload.type) {
        oldContent.splice(oldContentIndex, 1);
        this.setState({ content: oldContent });
        return;
      }
    }
    if (payload.type) {
      axios
        .get(
          `https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/${payload.spotId}/message.json`
        )
        .then(res => {
          const messages =
            res.data.response.feedMessageResponse.messages.message;
          const points = messages.map(element => ({
            lat: element.latitude,
            lng: element.longitude
          }));
          const newContent = {
            username: payload.username,
            points: points,
            color: payload.color,
            type: payload.type
          };
          this.setState({
            content: [...oldContent, newContent]
          });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      if (payload.userId) {
        this.state.db
          .collection("points")
          .where("userId", "==", payload.userId)
          .orderBy("timestamp", "asc")
          .get()
          .then(querySnapshot => {
            let contenido = [];
            querySnapshot.forEach(doc => {
              contenido.push({
                lat: doc.data().point.latitude,
                lng: doc.data().point.longitude
              });
            });
            const newContent = {
              username: payload.username,
              points: contenido,
              color: payload.color,
              type: payload.type
            };
            this.setState({
              content: [...oldContent, newContent]
            });
          });
      }
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
            <AddPerson
              toggleModal={this.toggleModal}
              userId={firebase.auth().currentUser.uid}
            />
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
              userList={this.state.userList ? this.state.userList : []}
              username={firebase.auth().currentUser.displayName}
              userId={firebase.auth().currentUser.uid}
              spotId={this.state.spotId}
              userColor={this.state.color}
              onToggle={this.fetchPoints}
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
            content={this.state.content}
          />
        </div>
      </div>
    );
  }
}

export default Layout;

import React from "react";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Typography } from "antd";
import logo from "./assets/logazo.png";
import Layout from "./components/Layout/Layout";

firebase.initializeApp({
  apiKey: "AIzaSyCsHPGB0Zmv3468gMFuk4dbKmuXoacid0U",
  authDomain: "my-gps-94a6c.web.app",
  databaseURL: "https://my-gps-94a6c.firebaseio.com",
  projectId: "my-gps-94a6c",
  storageBucket: "my-gps-94a6c.appspot.com",
  messagingSenderId: "720146341436",
  appId: "1:720146341436:web:0ad186d8ee073c47baad39"
});

class App extends React.Component {
  state = {
    isAuthenticated: false,
    db: firebase.firestore()
  };
  uiConfig = {
    signInFlow: "popup",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccess: () => console.log("gay")
    }
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isAuthenticated: !!user });
    });
  };

  render() {
    return (
      <div className="App" style={{ height: "100vh" }}>
        {!this.state.isAuthenticated ? (
          <div
            style={{
              textAlign: "center",
              backgroundColor: "black",
              height: "100%"
            }}
          >
            <img
              src={logo}
              height="80px"
              width="70px"
              alt="Logazo super genial de gps"
            />
            <Typography.Title level={1} style={{ color: "white" }}>
              Bienvenido!
            </Typography.Title>
            <Typography.Title level={2} style={{ color: "white" }}>
              Por favor inicia sesion para poder comenzar a trackear!
            </Typography.Title>
            <StyledFirebaseAuth
              uiConfig={this.uiConfig}
              firebaseAuth={firebase.auth()}
            />
          </div>
        ) : (
          <Layout />
        )}
      </div>
    );
  }
}

export default App;

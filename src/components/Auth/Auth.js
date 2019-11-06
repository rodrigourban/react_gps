import React from "react";
import firebase from "firebase";
import PropTypes from "prop-types";

const Auth = props => {
  return (
    <div class="overlay">
      {!props.isAuthenticated ? (
        <StyledFirebaseAuth
          uiConfig={props.uiConfig}
          firebaseAuth={firebase.auth()}
        />
      ) : (
        <>
          <Avatar
            size={64}
            src={firebase.auth().currentUser.photoURL}
            alt={`Foto de ${firebase.auth().currentUser.displayName}`}
          />
          <h1>{firebase.auth().currentUser.displayName}</h1>
          <div style={{ marginBottom: "1rem" }}>Logged in!</div>
          <Button onClick={() => firebase.auth().signOut()}>Salir</Button>
        </>
      )}
    </header>
  );
};

Auth.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  uiConfig: PropTypes.object.isRequired
};

export default Auth;

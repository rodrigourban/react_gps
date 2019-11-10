import React from "react";
import { Form, Input, Button, Spin } from "antd";
import firebase from "firebase";

const AddPerson = props => {
  const db = firebase.firestore();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const { getFieldDecorator } = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    props.form.validateFields((err, values) => {
      if (!err) {
        db.collection("users")
          .where("email", "==", values.email)
          .limit(1)
          .get()
          .then(res => {
            setLoading(false);
            if (res.empty) {
              setError(true);
            } else {
              console.log(res.docs[0].data());
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  };

  const errorMessage = error
    ? {
        validateStatus: "error",
        help: "El email ingresado no existe. Por favor intente de nuevo."
      }
    : null;

  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  } else {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Item
          label={<span>Ingresa el email que deseas buscar</span>}
          {...errorMessage}
        >
          {getFieldDecorator("email", {
            rules: [
              {
                message: "Ingresa el mail que deseas buscar",
                whitespace: true
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Agregar
          </Button>
        </Form.Item>
      </Form>
    );
  }
};

const WrappedAddPerson = Form.create({ name: "add_person" })(AddPerson);

export default WrappedAddPerson;

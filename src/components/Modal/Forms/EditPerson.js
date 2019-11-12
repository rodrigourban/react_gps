import React from "react";
import { Form, Icon, Input, Button, Tooltip } from "antd";
import firebase from "firebase";

const EditPerson = props => {
  const [docId, setDocId] = React.useState(null);
  const { getFieldDecorator } = props.form;
  const db = firebase.firestore();
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        db.collection("users")
          .doc(props.userId)
          .update({
            spotId: values.spot
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
        props.toggleModal();
      }
    });
  };

  React.useEffect(() => {
    db.collection("users")
      .doc(props.userId)
      .get()
      .then(res => setDocId(res.data().spotId));
  });

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label={<span>Spot</span>}>
        {getFieldDecorator("spot", {
          initialValue: docId,
          rules: [
            {
              message: "Agrega el ID de tu spot",
              whitespace: true
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Editar
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedEditPerson = Form.create({ name: "edit_person" })(EditPerson);

export default WrappedEditPerson;

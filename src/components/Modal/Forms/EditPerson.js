import React from "react";
import { Form, Icon, Input, Button, Tooltip } from "antd";

const EditPerson = props => {
  const { getFieldDecorator } = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        props.onSubmit(values);
      }
    });
  };
  return (
    <Form onSubmit={handleSubmit} layout="inline">
      <Form.Item label={<span>Spot</span>}>
        {getFieldDecorator("spot", {
          rules: [
            {
              required: true,
              message: "Please input your nickname!",
              whitespace: true,
              setFieldsValue: props.spot
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          block
        >
          Editar
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedEditPerson = Form.create({ name: "edit_person" })(EditPerson);

export default WrappedEditPerson;

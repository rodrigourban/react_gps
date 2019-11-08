import React from "react";
import { Form, Input, Button } from "antd";

const AddPerson = props => {
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
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item label={<span>Ingresa el email que deseas buscar</span>}>
        {getFieldDecorator("spot", {
          rules: [
            {
              message: "Please input your nickname!",
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
};

const WrappedAddPerson = Form.create({ name: "add_person" })(AddPerson);

export default WrappedAddPerson;

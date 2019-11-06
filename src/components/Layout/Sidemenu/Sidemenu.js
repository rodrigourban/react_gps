import React from "react";
import PropTypes from "prop-types";
import { Menu, Icon } from "antd";

const SideMenu = props => {
  const [value, setValue] = React.useState(null);

  const handleClick = e => {
    console.log("click ", e);
  };

  return (
    <Menu mode="inline" style={{ textAlign: "left" }}>
      <Menu.SubMenu
        key="sub1"
        title={
          <span>
            <Icon type="mail" />
            <span>Yo</span>
          </span>
        }
      >
        <Menu.Item key="1" onClick={() => props.onToggle(0)}>
          Spot
        </Menu.Item>
        <Menu.Item key="2" onClick={() => props.onToggle(1)}>
          Telefono
        </Menu.Item>
      </Menu.SubMenu>
      {props.userList.map((user, key) => (
        <Menu.SubMenu
          key={`sub${key}`}
          title={
            <span>
              <Icon type="mail" />
              <span>{user.username}</span>
            </span>
          }
        >
          <Menu.Item key="1" disabled={user.mySpot ? false : true}>
            Spot
          </Menu.Item>
          <Menu.Item key="2">Telefono</Menu.Item>
        </Menu.SubMenu>
      ))}
    </Menu>
  );
};

SideMenu.propTypes = {
  mySpot: PropTypes.string,
  userList: PropTypes.array.isRequired
};

export default SideMenu;

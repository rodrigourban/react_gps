import React from "react";
import PropTypes from "prop-types";
import { Menu, Icon } from "antd";

const SideMenu = props => {
  return (
    <Menu mode="inline" style={{ textAlign: "left" }}>
      <Menu.SubMenu
        key="0"
        title={
          <span>
            <Icon
              type="rocket"
              theme="twoTone"
              twoToneColor={props.userColor}
            />
            <span>Yo</span>
          </span>
        }
      >
        <Menu.Item
          key="1"
          onClick={() =>
            props.onToggle({
              type: true,
              username: props.username,
              spotId: props.spotId,
              color: props.userColor
            })
          }
        >
          Spot
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() =>
            props.onToggle({
              type: false,
              username: props.username,
              userId: props.userId,
              color: props.userColor
            })
          }
        >
          Telefono
        </Menu.Item>
      </Menu.SubMenu>
      {props.userList.map((user, key) => {
        return (
          <Menu.SubMenu
            key={`sub${key}`}
            title={
              <span>
                <Icon type="rocket" theme="twoTone" twoToneColor={user.color} />
                <span>{user.username}</span>
              </span>
            }
          >
            <Menu.Item
              key={`item1${key}`}
              onClick={() =>
                props.onToggle({
                  type: true,
                  username: user.username,
                  spotId: user.spotId,
                  color: user.color
                })
              }
            >
              Spot
            </Menu.Item>
            <Menu.Item
              key={`item2${key}`}
              onClick={() =>
                props.onToggle({
                  type: false,
                  username: user.username,
                  userId: user.userId,
                  color: user.color
                })
              }
            >
              Telefono
            </Menu.Item>
          </Menu.SubMenu>
        );
      })}
    </Menu>
  );
};

SideMenu.propTypes = {
  mySpot: PropTypes.string,
  userList: PropTypes.array.isRequired
};

export default SideMenu;

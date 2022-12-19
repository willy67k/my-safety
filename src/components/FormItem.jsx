import React, { useState } from "react";
import styled from "styled-components";

const Item = styled.div`
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);

  &:last-child {
    border-bottom: none;
  }
`;

const ItemGroupName = styled(Item)`
  padding: 0;
  border: none;
`;

const Input = styled.input`
  margin-right: 16px;
  padding: 2px 8px 4px;
  background-color: transparent;
  border: 1px solid;
  border-color: ${(props) => (props.active ? "rgba(255, 255, 255, 0.1)" : "transparent")};
  border-radius: 4px;
  transition: 0.3s;
`;

const InputGroupName = styled(Input)`
  color: rgba(255, 255, 255, 0.2);
`;

const InputAddress = styled(Input)`
  width: 72px;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
`;

const InputPass = styled(Input)`
  flex-grow: 0;
  flex-shrink: 1;
  width: 100%;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
`;

const Tools = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  border-left: 1px solid #ffffff;
  transition: 0.3s;

  ${(props) => {
    switch (props.status) {
      case "normal":
        return `
          width: 0px;
          opacity: 0;
          pointer-events: none;
          flex-grow: 0;
        `;
      case "focus":
        return "width: 83px;";
      case "edit":
        return "width: 79px;";
      case "add":
        return "width: 35px;";
      default:
        break;
    }
  }}
`;

const ToolBtn = styled.button`
  color: ${(props) => (props.color === "danger" ? "rgba(229, 127, 127, 1)" : props.color === "confirm" ? "#6AF190" : "#ffffff")};
  font-size: 12px;
  margin-left: 0;
  width: 0;
  opacity: 0;
  pointer-events: none;

  ${(props) => {
    if (props.active)
      return `
        margin-left: 12px;
        width: 100%;
        opacity: 1;
        pointer-events: all;
        transition: 0.3s;
      `;
  }}
`;

const FormItem = React.memo((props) => {
  const { id_group, id, name = "", password = "", statusForce, setItem, addItem, readyToRemoveItem, setItemSetStatus } = props;
  const [status, setStatus] = useState(statusForce || "normal");

  const [itemName, setItemName] = useState(name);
  const [itemPassword, setItemPassword] = useState(password);

  function cancelEdit() {
    setItemName(name);
    setItemPassword(password);
  }

  return (
    <Item
      data-target="form-item"
      onClick={() => {
        if (status === "normal") {
          setStatus("focus");
          setItemSetStatus({ setStatus, cancelEdit });
        }
      }}
    >
      <InputAddress
        active={status === "edit" || status === "add"}
        value={itemName}
        readOnly={status !== "edit" && status !== "add"}
        onInput={(e) => {
          setItemName(e.target.value);
        }}
      />
      <InputPass
        active={status === "edit" || status === "add"}
        value={itemPassword}
        readOnly={status !== "edit" && status !== "add"}
        onInput={(e) => {
          setItemPassword(e.target.value);
        }}
      />
      <Tools status={status}>
        <ToolBtn active={status === "focus"} onClick={() => setStatus("edit")}>
          Edit
        </ToolBtn>
        <ToolBtn active={status === "focus"} color="danger" onClick={() => readyToRemoveItem({ id_group, id })}>
          Delete
        </ToolBtn>
        <ToolBtn
          active={status === "edit"}
          color="confirm"
          onClick={() => {
            setStatus("normal");
            setItem({ id, name: itemName, password: itemPassword });
          }}
        >
          OK
        </ToolBtn>
        <ToolBtn
          active={status === "edit"}
          color="danger"
          onClick={() => {
            setStatus("normal");
            cancelEdit();
          }}
        >
          Cancel
        </ToolBtn>
        <ToolBtn
          active={status === "add"}
          color="confirm"
          onClick={() => {
            if (itemName.length < 1 || itemPassword.length < 1) return;
            addItem({ id_group, name: itemName, password: itemPassword });
            setItemName("");
            setItemPassword("");
          }}
        >
          Add
        </ToolBtn>
      </Tools>
    </Item>
  );
});

const FormItemGroupName = React.memo((props) => {
  const { id, name, setGroup, setItemSetStatus, readyToRemoveGroup } = props;
  const [status, setStatus] = useState("normal");

  const [groupName, setGroupName] = useState(name);

  function cancelEdit() {
    setGroupName(name);
  }

  return (
    <ItemGroupName
      data-target="form-item"
      onClick={() => {
        if (status === "normal") {
          setStatus("focus");
          setItemSetStatus({ setStatus, cancelEdit });
        }
      }}
    >
      <InputGroupName
        active={status === "edit"}
        value={groupName}
        readOnly={status !== "edit"}
        onInput={(e) => {
          setGroupName(e.target.value);
        }}
      />
      <Tools status={status}>
        <ToolBtn active={status === "focus"} onClick={() => setStatus("edit")}>
          Edit
        </ToolBtn>
        <ToolBtn
          active={status === "focus"}
          color="danger"
          onClick={() => {
            readyToRemoveGroup({ id });
          }}
        >
          Delete
        </ToolBtn>
        <ToolBtn
          active={status === "edit"}
          color="confirm"
          onClick={() => {
            setStatus("normal");
            setGroup({ id, name: groupName });
          }}
        >
          OK
        </ToolBtn>
        <ToolBtn
          active={status === "edit"}
          color="danger"
          onClick={() => {
            setStatus("normal");
            cancelEdit();
          }}
        >
          Cancel
        </ToolBtn>
      </Tools>
    </ItemGroupName>
  );
});
export { FormItemGroupName, FormItem };

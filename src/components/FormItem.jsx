import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import DragStatusEnum from "../enum/dragStatus";
import DragTypeEnum from "../enum/dragType";
import { setTargetItem, setStatus as setDragStatus, setType } from "../store/slice/dragSlice";
import DragDots from "./icons/DragDots";

const Order = styled.div`
  position: absolute;
  top: 50%;
  left: -11px;
  width: 13px;
  transition: 0.3s;
  transform: translateY(-50%);
  opacity: 0;
  cursor: ${(props) => props.status !== "add" && "grab"};
`;

const Item = styled.div`
  position: relative;
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  transition: ${(props) => (props.isFlash ? 0 : "0.3s")};

  &:last-child {
    border-bottom: none;
  }

  &:hover ${Order} {
    opacity: ${(props) => (props.status === "add" ? 0 : 1)};
  }
`;

const ItemGroupName = styled(Item)`
  padding: 0;
  border: none;
`;

const Input = styled.input`
  margin-right: 16px;
  padding: 4px 8px 2px;
  background-color: transparent;
  border: 1px solid;
  border-color: ${(props) => (props.active ? "rgba(255, 255, 255, 0.1)" : "transparent")};
  border-radius: 4px;
  transition: 0.3s;
`;

const InputGroupName = styled(Input)`
  padding: 2px 8px 4px;
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

  const dispatch = useDispatch();
  const dragStatus = useSelector((state) => state.drag.status);

  function cancelEdit() {
    setItemName(name);
    setItemPassword(password);
  }

  function setDragData(e) {
    if (e.target.closest("button")?.getAttribute("color") === "confirm") return;
    dispatch(setType(DragTypeEnum.item));

    e.target.closest("[data-target=form-item]")?.id.includes("add")
      ? dispatch(setDragStatus(DragStatusEnum.normal))
      : dispatch(setDragStatus(DragStatusEnum.dragging));

    dispatch(setTargetItem({ id_group, id }));
  }

  return (
    <Item
      id={`item-${id}`}
      status={status}
      isFlash={dragStatus === DragStatusEnum.normal}
      data-target="form-item"
      onClick={() => {
        if (status === "normal") {
          setStatus("focus");
          setItemSetStatus({ setStatus, cancelEdit });
        }
      }}
    >
      <Order status={status} onMouseDown={setDragData}>
        <DragDots />
      </Order>
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
            setItemSetStatus({ cancelEdit: () => {} });
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

  const dispatch = useDispatch();

  const [groupName, setGroupName] = useState(name);

  function setDragData() {
    dispatch(setType(DragTypeEnum.group));
    dispatch(setDragStatus(DragStatusEnum.dragging));
    dispatch(setTargetItem({ id_group: id }));
  }

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
      <Order status={status} onMouseDown={setDragData}>
        <DragDots />
      </Order>
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
            setItemSetStatus({ cancelEdit: () => {} });
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

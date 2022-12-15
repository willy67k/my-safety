import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FormItem, FormItemGroupName } from "../components/FormItem";
import Modal from "../components/Modal";
import Api from "../resource/api";

const Layout = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  max-width: 1600px;
  padding: 40px 24px;
`;

const Card = styled.div`
  padding: 16px;
  padding-top: 12px;
  margin-left: 12px;
  margin-right: 12px;
  margin-bottom: 24px;
  width: 360px;
  border-radius: 8px;
  background-color: #3b4148;
  box-shadow: ${(props) => (props.selected ? " 0px 0px 8px 2px rgba(255, 255, 255, 0.25);" : "none")};
`;

function Account() {
  const [safety, setSafety] = useState([]);

  const activeItem = useRef(null);
  const itemSetStatus = useRef({ isUpdate: null, old: null, new: null });

  const [modalActive, setModalActive] = useState(false);
  const modalDetail = useRef({ message: "", confirmType: "confirm", cancelType: "danger", confirm: () => {}, cancel: () => {} });

  // demo func

  function setGroup({ id, name }) {
    setSafety((prev) => {
      let newState = [...prev];
      const i = newState.findIndex((el) => el.id === id);
      newState[i].group_name = name;
      return newState;
    });
  }

  function readyToRemoveGroup({ id }) {
    setModalActive(true);

    modalDetail.current = {
      message: 'Are you sure to Delete "Group" ?',
      confirmType: "danger",
      confirm: () => {
        removeGroup({ id });
      },
    };
  }

  function removeGroup({ id }) {
    setSafety((prev) => {
      let newState = [...prev];
      newState = newState.filter((el) => el.id !== id);
      return newState;
    });
  }

  async function addItem({ id_group, name, password }) {
    const CCtoken = axios.CancelToken.source();
    try {
      const { data } = await Api.addItem({ id_group, name, password }, CCtoken.token);
      setSafety((prev) => {
        let newState = [...prev];
        const i = newState.findIndex((el) => el.id === data.safety_group_id);
        newState[i].items.push({ id: data.id, name: data.name, password: data.password });
        return newState;
      });
    } catch (err) {
      console.log(err);
    }
    return;
  }

  async function setItem({ id, name, password }) {
    const CCtoken = axios.CancelToken.source();
    try {
      const { data } = await Api.setItem(id, { name, password }, CCtoken.token);
      setSafety((prev) => {
        let newState = [...prev];
        const i = newState.findIndex((el) => el.id === data.safety_group_id);
        const j = newState[i].items.findIndex((el) => el.id === data.id);
        newState[i].items[j].name = data.name;
        newState[i].items[j].password = data.password;
        return newState;
      });
    } catch (err) {
      console.log(err);
    }
  }

  function readyToRemoveItem({ id_group, id }) {
    setModalActive(true);

    modalDetail.current = {
      message: 'Are you sure to Delete "item" ?',
      confirmType: "danger",
      confirm: () => {
        removeItem({ id_group, id });
      },
    };
  }

  async function removeItem({ id }) {
    const CCtoken = axios.CancelToken.source();
    try {
      const { data } = await Api.removeItem({ id }, CCtoken.token);
      setSafety((prev) => {
        let newState = [...prev];
        const i = newState.findIndex((el) => el.id === data.safety_group_id);
        newState[i].items = newState[i].items.filter((item) => item.id !== data.id);
        return newState;
      });
    } catch (err) {
      console.log(err);
    }
  }

  function setItemSetStatus(method = itemSetStatus.current.old) {
    itemSetStatus.current = { ...itemSetStatus.current, isUpdate: true, new: method };
  }

  useEffect(() => {
    const CCtoken = axios.CancelToken.source();
    Api.getSafeties(CCtoken.token)
      .then((res) => {
        const { data } = res;
        setSafety(data);
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== "development" && err.name === "CanceledError") return;
        console.log(err);
      });

    window.addEventListener("click", (e) => {
      const target = e.target.closest("[data-target=form-item]");

      if (activeItem.current !== null && target !== activeItem.current) {
        itemSetStatus.current.old && itemSetStatus.current.old("normal");
      }

      if (itemSetStatus.current.isUpdate) {
        itemSetStatus.current.old = itemSetStatus.current.new;
        itemSetStatus.current.isUpdate = false;
        activeItem.current = target;
      }
    });

    return () => {
      CCtoken.cancel();
    };
  }, []);

  return (
    <div className="account">
      <Layout>
        {safety.map((el) => {
          return (
            <Card selected={el.id === 1} key={el.id}>
              <FormItemGroupName
                id={el.id}
                name={el.group_name}
                setGroup={setGroup}
                setItemSetStatus={setItemSetStatus}
                readyToRemoveGroup={readyToRemoveGroup}
              ></FormItemGroupName>
              {el.items.map((f) => {
                return (
                  <FormItem
                    id_group={el.id}
                    id={f.id}
                    name={f.name}
                    password={f.password}
                    key={f.id}
                    setItem={setItem}
                    readyToRemoveItem={readyToRemoveItem}
                    setItemSetStatus={setItemSetStatus}
                  />
                );
              })}
              <FormItem id_group={el.id} statusForce="add" addItem={addItem} />
            </Card>
          );
        })}
      </Layout>
      {modalActive && <Modal setModalActive={setModalActive} detail={modalDetail.current} />}
    </div>
  );
}

export default Account;

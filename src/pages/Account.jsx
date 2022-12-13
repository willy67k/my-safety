import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FormItem, FormItemGroupName } from "../components/FormItem";

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

  // demo func

  function setGroup({ id, name }) {
    setSafety((prev) => {
      let newState = [...prev];
      const i = newState.findIndex((el) => el.id === id);
      newState[i].group_name = name;
      return newState;
    });
  }

  function setItem({ id_group, id, name, password }) {
    setSafety((prev) => {
      let newState = [...prev];
      const i = newState.findIndex((el) => el.id === id_group);
      const j = newState[i].items.findIndex((el) => el.id === id);
      newState[i].items[j].name = name;
      newState[i].items[j].password = password;
      return newState;
    });
  }

  function addItem({ id_group, id, name, password }) {
    setSafety((prev) => {
      let newState = [...prev];
      const i = newState.findIndex((el) => el.id === id_group);
      newState[i].items.push({ id, name, password });
      return newState;
    });
  }

  function removeItem({ id_group, id }) {
    setSafety((prev) => {
      let newState = [...prev];
      const i = newState.findIndex((el) => el.id === id_group);
      newState[i].items = newState[i].items.filter((item) => item.id !== id);
      return newState;
    });
  }

  function setItemSetStatus(method = itemSetStatus.current.old) {
    itemSetStatus.current = { ...itemSetStatus.current, isUpdate: true, new: method };
  }

  useEffect(() => {
    async function fetchApi() {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/safety-grouping-items`);
        const data = await res.json();
        setTimeout(() => {
          console.log(data);
          setSafety(data);
        }, 1500);
      } catch (err) {
        console.log(err);
      }
    }
    fetchApi();

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
  }, []);

  return (
    <div className="account">
      <Layout>
        {safety.map((el) => {
          return (
            <Card selected={el.id === 1} key={el.id}>
              <FormItemGroupName id={el.id} name={el.group_name} setGroup={setGroup} setItemSetStatus={setItemSetStatus}></FormItemGroupName>
              {el.items.map((f) => {
                return (
                  <FormItem
                    id_group={el.id}
                    id={f.id}
                    name={f.name}
                    password={f.password}
                    key={f.id}
                    setItem={setItem}
                    removeItem={removeItem}
                    setItemSetStatus={setItemSetStatus}
                  />
                );
              })}
              <FormItem statusForce="add" addItem={addItem} />
            </Card>
          );
        })}
      </Layout>
    </div>
  );
}

export default Account;

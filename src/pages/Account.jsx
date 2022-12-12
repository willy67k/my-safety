import { useState } from "react";
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

const data = [
  {
    id: 1,
    group_name: "A_group",
    fields: [
      { id: 1, name: "A_item_1", password: "A_pass_1" },
      { id: 2, name: "A_item_2", password: "A_pass_2" },
      { id: 3, name: "A_item_3", password: "A_pass_3" },
    ],
  },
  {
    id: 2,
    group_name: "B_group",
    fields: [
      { id: 4, name: "B_item_1", password: "B_pass_1" },
      { id: 5, name: "B_item_2", password: "B_pass_2" },
      { id: 6, name: "B_item_3", password: "B_pass_3" },
    ],
  },
  {
    id: 3,
    group_name: "C_group",
    fields: [
      { id: 7, name: "C_item_1", password: "C_pass_1" },
      { id: 8, name: "C_item_2", password: "C_pass_2" },
      { id: 9, name: "C_item_3", password: "C_pass_3" },
    ],
  },
];

function Account() {
  const [safety, setSafety] = useState(data);

  function setGroup({ id, name }) {
    setSafety((prev) => {
      const i = prev.findIndex((el) => el.id === id);
      prev[i].group_name = name;
      return prev;
    });
  }

  function setField({ id_group, id, name, password }) {
    setSafety((prev) => {
      const i = prev.findIndex((el) => el.id === id_group);
      const j = prev[i].fields.findIndex((el) => el.id === id);
      prev[i].fields[j].name = name;
      prev[i].fields[j].password = password;
      return prev;
    });
  }

  return (
    <div className="account">
      <Layout>
        {safety.map((el) => {
          return (
            <Card selected={el.id === 1} key={el.id}>
              <FormItemGroupName id={el.id} name={el.group_name} setGroup={setGroup}></FormItemGroupName>
              {el.fields.map((f) => {
                return <FormItem id_group={el.id} id={f.id} name={f.name} password={f.password} key={f.id} setField={setField} />;
              })}
              <FormItem statusForce="add" />
            </Card>
          );
        })}
      </Layout>
    </div>
  );
}

export default Account;

import styled from "styled-components";

const Layout = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  max-width: 1600px;
  padding: 40px 24px;
`;

const Card = styled.div`
  padding: 16px;
  margin-right: 24px;
  margin-bottom: 24px;
  width: 360px;
  border-radius: 8px;
  background-color: #3b4148;
  box-shadow: ${(props) => (props.selected ? " 0px 0px 8px 2px rgba(255, 255, 255, 0.25);" : "none")};
`;

const H2 = styled.h2`
  color: rgba(255, 255, 255, 0.2);
  margin-bottom: 4px;
`;

const FormItem = styled.div`
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);

  &:last-child {
    border-bottom: none;
  }
`;

const Input = styled.input`
  margin-right: 16px;
  border: ${(props) => (props.mode === "edit" ? "1px solid rgba(255, 255, 255, 0.1)" : "none")};
  border-radius: 4px;
  padding: 2px 8px 4px;
`;

const InputAddress = styled(Input)`
  width: 72px;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  background-color: transparent;
`;

const InputPass = styled(Input)`
  flex-grow: 1;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  background-color: transparent;
`;
const Tools = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  border-left: 1px solid #ffffff;
`;

const ToolBtn = styled.button`
  color: ${(props) => (props.color === "danger" ? "rgba(229, 127, 127, 1)" : props.color === "confirm" ? "#6AF190" : "#ffffff")};
  font-size: 12px;
  margin-left: 12px;
`;

function Account() {
  return (
    <div className="account">
      <Layout>
        {[0, 1, 0].map((el, i) => {
          return (
            <Card selected={el} key={i}>
              <H2>Group Name</H2>
              <FormItem>
                <InputAddress defaultValue="address" />
                <InputPass defaultValue="password" />
              </FormItem>
              <FormItem>
                <InputAddress defaultValue="address" />
                <InputPass defaultValue="password" />
                <Tools>
                  <ToolBtn>Edit</ToolBtn>
                  <ToolBtn color="danger">Delete</ToolBtn>
                </Tools>
              </FormItem>
              <FormItem>
                <InputAddress mode="edit" canEdit defaultValue="address" />
                <InputPass mode="edit" canEdit defaultValue="password" />
                <Tools>
                  <ToolBtn color="confirm">Add</ToolBtn>
                </Tools>
              </FormItem>
            </Card>
          );
        })}
      </Layout>
    </div>
  );
}

export default Account;

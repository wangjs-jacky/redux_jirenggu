import React, { useState, useContext, useEffect } from "react"
import styled from "styled-components"
// 导入 redux.js 
import { store, connect, appContext } from "./redux.js"

const Section = styled.section`
  border: 1px solid #000;
  width: 70vw;
  height: 20vh;
  margin: 2vh auto;
  input{
    padding: 5px;
    background-color: #BBB;
    border: 1px dashed #333;
  }
`

const App = () => {
  return (
    <appContext.Provider value={store}>
      <Child1></Child1>
      <Child2></Child2>
      <Child3></Child3>
    </appContext.Provider>
  );
}
const Child1 = () => {
  console.log('渲染Child1');
  return (
    <Section>
      兄弟组件1
      <User />
    </Section>
  )
}
const Child2 = () => {
  console.log('渲染Child2');
  return (
    <Section>
      兄弟组件2
      <Wrapper2>
        <span style={{ color: "red" }}>透传数据</span>
      </Wrapper2>
    </Section>
  )
}
const Child3 = () => {
  console.log('渲染Child3');
  return (
    <Section>
      兄弟组件3
    </Section>
  )
}


const User = connect(({ state }) => {
  console.log('渲染User');
  return (
    <div>
      用户名：{state.user.name}
    </div>
  )
})



const UserModifier = ({ dispatch, state, children }) => {
  const onChange = (e) => {
    dispatch("updateUser", { name: e.target.value })
  }
  return (
    <div>
      修改用户名：
      <input
        value={state.user.name}
        onChange={onChange}></input>
      <div>
        父组件数据：{children}
      </div>
    </div>
  )

}

const Wrapper2 = connect(UserModifier)

export default App

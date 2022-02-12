import React, { useState, useContext } from "react"
import styled from "styled-components"

// 创建一个全局的环境
const appContext = React.createContext(null)

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
  const [appState, setAppState] = useState({
    user: { name: "王家盛", age: 18 }
  })
  const contextValue = { appState, setAppState }
  return (
    <appContext.Provider value={contextValue}>
      <Child1></Child1>
      <Child2></Child2>
      <Child3></Child3>
    </appContext.Provider>
  );
}
const Child1 = ()=> {
  return (
    <Section>
      兄弟组件1
      <User/>
    </Section>
  )
}
const Child2 = ()=> {
  return (
    <Section>
      兄弟组件2
      <UserModifier />
    </Section>
  )
}
const Child3 = ()=> {
  return (
    <Section>
      兄弟组件3
    </Section>
  )
}

const User = ()=>{
  const contextValue = useContext(appContext)
  return (
    <div>
      用户名：{contextValue.appState.user.name}
    </div>
  )
}

const UserModifier = ()=>{
  const contextValue = useContext(appContext)
  const onChange = (e)=>{
    contextValue.appState.user.name = e.target.value
    contextValue.setAppState({...contextValue.appState})
  }
  return (
    <div>
      修改用户名：
      <input 
      value={contextValue.appState.user.name}
      onChange={onChange}></input>
    </div>
  )

}

export default App

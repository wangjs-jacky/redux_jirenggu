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
const Child1 = () => {
  return (
    <Section>
      兄弟组件1
      <User />
    </Section>
  )
}
const Child2 = () => {
  return (
    <Section>
      兄弟组件2
      <UserModifier />
    </Section>
  )
}
const Child3 = () => {
  return (
    <Section>
      兄弟组件3
    </Section>
  )
}

const User = () => {
  const contextValue = useContext(appContext)
  return (
    <div>
      用户名：{contextValue.appState.user.name}
    </div>
  )
}

// 创建一个新的状态需要几个要素：
// 1. 修改的是哪儿个 数据源(状态仓库)
// 2. 对这个仓库中的什么变量做什么操作？
// 3. 传递的数据，即payload（payload这个词很形象，载荷）
const createNewState = (state, actionType, payload) => {
  if (actionType === "updateUser") {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  } else {
    return state
  }
}

const UserModifier = () => {
  const { appState, setAppState } = useContext(appContext)
  const onChange = (e) => {
    // 编写的时候已经发现存在问题了，即没有拷贝一份后再修改。
    // contextValue.appState.user.name = e.target.value
    // contextValue.setAppState({...contextValue.appState})

    // 通过newState创建出来的变量，符合 React 对状态Immutable的要求
    const newState = createNewState(appState, "updateUser", { name: e.target.value })
    console.log('newState', newState);
    setAppState(newState)
  }
  return (
    <div>
      修改用户名：
      <input
        value={appState.user.name}
        onChange={onChange}></input>
    </div>
  )

}

export default App

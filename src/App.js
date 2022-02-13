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

const User = () => {
  console.log('渲染User');
  const contextValue = useContext(appContext)
  return (
    <div>
      用户名：{contextValue.appState.user.name}
    </div>
  )
}

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

const UserModifier = ({ dispatch, state, children }) => {
  console.log('UserModifier被调用了');
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

// 使用 createWrapper 批量化生成 HOC 组件 ,即connect
const createWrapper = (Component) => {
  return (props) => {
    const { appState, setAppState } = useContext(appContext)
    const dispatch = (actionType, payload) => {
      const newState = createNewState(appState, actionType, payload)
      setAppState(newState)
    }
    return <Component {...props} dispatch={dispatch} state={appState} />
  }
}

const Wrapper2 = createWrapper(UserModifier)

export default App

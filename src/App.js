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

// 使用初衷：在Hooks的渲染原则是：一旦调用了setAppState，App会进行重复渲染，于是底下所有组件全部被重复渲染了。
// 解决：直接废弃掉 Hooks 提供的 setAppState 方法。
// 做法：自己创建 store 对象，自己维护 state 和 修改这个 state 的方法
// 依次来替换掉 原始 的 react-Hooks 自己提供的钩子函数。
const store = {
  appState: {
    user: { name: "王家盛", age: 18 }
  },
  setAppState(newState) {
    console.log('newState', newState);
    store.appState = newState
  }
}

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

const User = () => {
  console.log('渲染User');
  const { appState } = useContext(appContext)
  return (
    <div>
      用户名：{appState.user.name}
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
    // 显式地调用 setXXXX 方法，达到精准的控制 视图刷新 的功能
    const [, update] = useState({})
    const dispatch = (actionType, payload) => {
      setAppState(createNewState(appState, actionType, payload))
      // 在 dispatch 后刷新
      update({})
    }
    return <Component {...props} dispatch={dispatch} state={appState} />
  }
}

const Wrapper2 = createWrapper(UserModifier)

export default App

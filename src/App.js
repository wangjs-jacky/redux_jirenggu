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
      <Wrapper />
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

const Wrapper = () => {
  // 通过 HOC ：只做一件事，就是将这个组件与全局状态库链接起来。
  const { appState, setAppState } = useContext(appContext)
  // 由于之前reducer需要接受三个值：状态仓库| actionType |payload
  // 实际上，对于用户而言，不用每次使用的时候频繁输入: 状态仓库。
  // 于是，封装了 dispatch 将输入参数进一步缩小为只需要输入： actionType | payload
  const dispatch = (actionType, payload) => {
    const newState = createNewState(appState, actionType, payload)
    setAppState(newState)
  }
  return <UserModifier dispatch={dispatch} state={appState} />
}

const UserModifier = ({ dispatch, state }) => {
  /*
   通过封装的方式，UserModifer 不再通过 useContext 取全局状态
   链接全局变量的活由 父组件(HOC) 代为解决
   通过 { dispatch } 获取直接修改 状态仓库 的工作 
   而 { state } 获取 状态仓库。
   对比： 
   const { appState, setAppState } = useContext(appContext)
   与：
   通过 props 接受 ({ appState , dispatch }) 
   可以发现，核心 reducer 和 dispatch 相当于禁用原始的dispatch，想要修改
   仓库必须使用我提供的dispatch的方法，这个想法非常牛逼。
  */

  const onChange = (e) => {
    dispatch("updateUser", { name: e.target.value })
  }

  return (
    <div>
      修改用户名：
      <input
        value={state.user.name}
        onChange={onChange}></input>
    </div>
  )

}

export default App

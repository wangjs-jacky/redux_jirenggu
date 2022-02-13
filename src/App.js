import React, { useState, useContext, useEffect } from "react"
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
const store = {
  appState: {
    user: { name: "王家盛", age: 18 }
  },
  setAppState(newState) {
    console.log('newState', newState);
    store.appState = newState
    store.listeners.map(fn => fn(store.appState))
  },
  /*
    通过 [,update] = useState()刷新视图的方法存在一个问题：
    createWrapper(connect) 会单独生成一个dispatch函数, 于是每一个connect的组件，只会刷新自己的状态，
    而无法把这个 state 的变化 映射到 所有依赖这个state的组件中。
    解决方法： 使用 eventhub，订阅 state 的变化。
    一旦某个state，就将 全局订阅state变化的组件 给渲染一下。
  */
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1)
    }
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

// 使用 createWrapper 批量化生成 HOC 组件 ,即connect
const createWrapper = (Component) => {
  return (props) => {
    const { appState, setAppState } = useContext(appContext)
    // 显式地调用 setXXXX 方法，达到精准的控制 视图刷新 的功能
    const [, update] = useState({})
    useEffect(() => {
      store.subscribe(() => {
        update({})
      })
    }, [])

    const dispatch = (actionType, payload) => {
      setAppState(createNewState(appState, actionType, payload))
    }
    return <Component {...props} dispatch={dispatch} state={appState} />
  }
}

const User = createWrapper(({ state }) => {
  console.log('渲染User');
  return (
    <div>
      用户名：{state.user.name}
    </div>
  )
})

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

const Wrapper2 = createWrapper(UserModifier)

export default App

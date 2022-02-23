import React from "react"
import styled from "styled-components"

// 导入 redux.js 
// 不再导出 store， 而是导出 createStore
import { createStore, appContext } from "./redux.js"

// 导入 connecters
import { connectToUser } from "./connecters/connectToUser"
import { connectToChild3 } from "./connecters/connectToChild3"

// 用户编写：应是从外部传入 redux 中的 appState 对象中。
const initState = {
  user: { name: "王家盛", age: 18 },
  group: "前端小组"
}

// 用户编写：应是从外部传入 store 中的 reducer 对象中。
const reducer = (state, actionType, payload) => {
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

const store = createStore(reducer, initState)

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
      <UserModifier>
        <span style={{ color: "red" }}>透传数据</span>
      </UserModifier>
    </Section>
  )
}

const Child3 = connectToChild3(({ group }) => {
  console.log('渲染Child3');
  return (
    <Section>
      兄弟组件3
      <div>
        打印<strong>store.group属性</strong>:{group}
      </div>
    </Section>
  )
})



// connect 新增一个(selector,dispatchSelector)，对属性和方法进行过滤或者拦截。
// 修改前： <Component state={state} dispatch={dispatch}>
// 修改后： 将 state 和 dispatch 进行一层封装，不直接给你这两个东西，而是封装一些功能后弹出。
// HOC存在两个空 connect=(xxx,yyy)=>( return <Component {...xxx} {...yyy}>)
// 本版本： 实现的是 attribute的selector，可以对快速的选中： state.xxxx.yyyy.zzz属性
// 映射规则： attr = state.xxxx.yyyy.attr ，使用时：{attr}=>{...}
const User = connectToUser(({ user }) => {
  console.log('渲染User');
  return (
    <div>
      用户名：{user.name}
    </div>
  )
})

// 使用 第2个 connect 来演示，connect的第二个参数

const UserModifier = connectToUser(({ updateUser, user, children }) => {
  const onChange = (e) => {
    updateUser({ name: e.target.value })
  }
  return (
    <div>
      修改用户名：
      <input
        value={user.name}
        onChange={onChange}></input>
      <div>
        父组件数据：{children}
      </div>
    </div>
  )

})

export default App

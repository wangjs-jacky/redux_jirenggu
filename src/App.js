import React from "react"
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
      <UserModifier>
        <span style={{ color: "red" }}>透传数据</span>
      </UserModifier>
    </Section>
  )
}

const Child3 = connect(state => {
  return { group: state.group }
})(({ group }) => {
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
const User = connect((appState) => {
  return { user: appState.user }
})(({ user }) => {
  console.log('渲染User');
  return (
    <div>
      用户名：{user.name}
    </div>
  )
})

const UserModifier = connect()(({ dispatch, appState, children }) => {
  const onChange = (e) => {
    dispatch("updateUser", { name: e.target.value })
  }
  return (
    <div>
      修改用户名：
      <input
        value={appState.user.name}
        onChange={onChange}></input>
      <div>
        父组件数据：{children}
      </div>
    </div>
  )

})

export default App

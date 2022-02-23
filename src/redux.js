import { useContext, useEffect, useState } from "react";
import React from "react";

// 创建一个全局的环境
export const appContext = React.createContext(null)

export const store = {
    appState: {
        user: { name: "王家盛", age: 18 },
        group: "前端小组"
    },
    setAppState(newState) {
        console.log('newState', newState);
        store.appState = newState
        store.listeners.map(fn => fn(store.appState))
    },
    /*
      通过 [,update] = useState()刷新视图的方法存在一个问题：
      connect(connect) 会单独生成一个dispatch函数, 于是每一个connect的组件，只会刷新自己的状态，
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

const changed = (oldState, newState) => {
    let changed = false;
    // 进行 深比较 
    for (let key in oldState) {
        if (oldState[key] !== newState[key]) {
            changed = true
        }
    }
    return changed;
}
// 使用 connect 批量化生成 HOC 组件 ,即connect
export const connect = (selector) => (Component) => {
    return (props) => {
        console.log('connect组件渲染');
        const { appState, setAppState } = useContext(appContext)
        // 显式地调用 setXXXX 方法，达到精准的控制 视图刷新 的功能
        const [, update] = useState({})
        const data = selector ? selector(appState) : { appState: appState }
        useEffect(() => {
            const unsubscribe = store.subscribe(() => {
                console.log("启动订阅");
                const newData = selector ? selector(store.appState) : { appState: store.appState }
                if (changed(data, newData)) {
                    console.log('视图真实update');
                    // 这里可以对state进行精准控制
                    update({})
                }
            })
            return unsubscribe
            // 此时依赖改为 [selector,appState] 也不会重复订阅。每次值变化的时，先执行return的unsubscribe函数。
        }, [selector])

        const dispatch = (actionType, payload) => {
            setAppState(reducer(appState, actionType, payload))
        }
        return <Component {...props} dispatch={dispatch} {...data} />
    }
}

export const reducer = (state, actionType, payload) => {
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
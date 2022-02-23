import { connect } from "../redux.js"

// 创建一个专门修改 User 对象的环境(即，只暴露全局与User有关的属性和修改属性的方法)
const mapStatetoProps = state => {
    return { user: state.user }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (attrs) => dispatch("updateUser", attrs)
    }
}

export const connectToUser = connect(mapStatetoProps, mapDispatchToProps)
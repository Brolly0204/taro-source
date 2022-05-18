class Component {
  _init(scope) {
    console.log('scope', scope)
    this.$scope = scope
  }

  setState(state) {
    console.log('state', state)
    update(this.$scope.$component, state)
  }

  createData(state) {
    this.__state = state
    const text = this.state.count % 2 === 0 ? '偶数' : '奇数'
    Object.assign(this.__state, {
      text: text
    })
    return this.__state
  }
}

const update = (compInstance, state = {}) => {
  compInstance.state = Object.assign(compInstance.state, state)
  const data = compInstance.createData(state)
  data.$taroCompReady = true
  compInstance.$state = data
  compInstance.$scope.setData(data)
}

const bindHandleEvents = (option, events, compInstance) => {
  if (events) {
    events.forEach(eventName => {
      if (option[eventName]) return
      option[eventName] = function() {
        compInstance[eventName].call(compInstance)
      }
    })
  }
}

const createPage = (ComponentContructor) => {
  const compInstance = new ComponentContructor()
  const initData = compInstance.state
  const option = {
    data: initData,
    onLoad() {
      this.$component = compInstance
      this.$component._init(this)
    },
    onReady() {
      if (typeof this.$component.componentDidMount === 'function') {
        this.$component.componentDidMount()
      }
    }
  }
  bindHandleEvents(option, ComponentContructor.$$events, compInstance)
  return option
}

module.exports = {
  Component,
  createPage
}

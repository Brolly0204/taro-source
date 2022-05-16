// index.js
const _app = require('../../npm/app.js')

class Index extends _app.Component {
  constructor() {
    super()
    this.state = {
      count: 0
    }
  }
  componentDidMount() {
    console.log('componentDidMount')
    this.setState({
      count: 1
    })
  }
  onAddClick() {
    this.setState({
      count: this.state.count + 1
    })
  }
  onReduceClick() {
    this.setState({
      count: this.state.count - 1
    })
  }
}
// 获取应用实例
const app = getApp()
Index.$$events = ['onAddClick','onReduceClick']
Page(_app.createPage(Index))

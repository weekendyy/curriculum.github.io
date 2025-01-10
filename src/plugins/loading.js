
const Loading = {
  install(Vue) {
    const LoadingConstructor = Vue.extend(require('../components/Loader.vue').default)
    let loadingInstance = null

    Vue.prototype.$loading = {
      show() {
        if (!loadingInstance) {
          loadingInstance = new LoadingConstructor({
            el: document.createElement('div')
          })
          document.body.appendChild(loadingInstance.$el)
        }
        loadingInstance.visible = true
      },
      hide() {
        if (loadingInstance) {
          loadingInstance.visible = false
        }
      }
    }
  }
}

export default Loading

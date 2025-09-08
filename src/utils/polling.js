const polling = {
  promiseProviders: []
}
// 开启轮询, promise provider是返回promise的function, interval 是轮询间隔时间
polling.start = (promiseProvider, interval = 1000, note) => {
  if (polling.promiseProviders.find((item) => (item === promiseProvider))) {
    if (note) {
      console.log('已存在=====', note, polling.promiseProviders.find((item) => (item === promiseProvider)))
    }
  } else {
    if (note) {
      console.log('polling 新增', note)
    }
    polling.promiseProviders.push(promiseProvider)
    let starter = async () => {
      let promise = null
      if (polling.promiseProviders.find((item) => (item === promiseProvider))){
        promise = promiseProvider()
      }
      if (promise) {
        promise = promise.catch((e) => {
          console.log(e)
          Promise.resolve()
        })
      } else {
        // console.log(promiseProvider.name)
      }
      await promise

      if (polling.promiseProviders.find((item) => (item === promiseProvider))) {
        setTimeout(starter, interval)
      } else {
        console.log('REMOVED')
      }
    }
    starter()
  }
}
// 取消轮询
polling.stop = (promiseProvider, note) => {
  if (note) {
    console.log(note, '已移除')
  }
  polling.promiseProviders = polling.promiseProviders.filter(item => (item !== promiseProvider))
}

export default polling

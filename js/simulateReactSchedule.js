var taskQueue = window.TaskQueue.taskQueue
var pop = window.TaskQueue.pop
// const { NIUBI_TIME } = require("./task-priority")/

let deadline = 0
let yieldInterval = 6

// 实例化MessageChannel
const channel = new MessageChannel()
const port = channel.port2
channel.port1.onmessage = performWorkUntilDeadline

let getCurrentTime
const hasPerformanceNow =
  typeof performance === 'object' && typeof performance.now === 'function'

// 这行目的就是
if (hasPerformanceNow) {
  const localPerformance = performance
  getCurrentTime = () => localPerformance.now()
} else {
  const localDate = Date
  const initialTime = localDate.now()
  getCurrentTime = () => localDate.now() - initialTime
}

// 定义浏览器帧
function forceFrameRate(fps) {
  if (fps < 0 || fps > 125) {
    return console.error("支持 0- 125帧，超过就扯淡了，太牛的不支持，react没工夫干活了")
  }
  if (fps > 0) {
    yieldInterval = Math.floor(1000 / fps);
  } else {
    // reset the framerate
    yieldInterval = 6
  }
}

// 假设浏览器是70帧/秒
forceFrameRate(70)

// 是否要停止干活
function shouldYieldToHost() {
  const currentTime = getCurrentTime();
  if (currentTime >= deadline) {
    return true
  } else {
    // There's still time left in the frame.
    return false;
  }
}

// 干活中
function workLoop (hasTimeRemaining, initialTime) {
  // 由于是链表，停了之后可以找到父节点 兄弟节点 子节点  我们不这么实现 用数组
  // while (currentTask !==null) {
  while (taskQueue.length > 0) {
    // 如果真的该停了就不要继续了 哈哈哈
    if (!hasTimeRemaining || shouldYieldToHost()) {
      break
    }
    // 这次可以踏踏实实的干活了
    const task = pop(taskQueue)
    // 模拟干活
    simulateWork(task)
  }
  if (taskQueue.length > 0) {// 由于是链表，停了之后可以找到父节点 兄弟节点 子节点 
    return true
  } else {
    return false
  }
}

function simulateWork (task) {
  const el = document.createElement(task.tagName)
  el.innerHTML = task.innerHTML
  el.style.textAlign = "right"
  document.body.appendChild(el)
}

function performWorkUntilDeadline () {
  if (workLoop !== null) {
    const currentTime = getCurrentTime();
    // 计算这次时间间隔还能干多久的活
    deadline = currentTime + yieldInterval
    // 假设还有时间 先干活试试的
    const hasTimeRemaining = true
    // 默认都有活做， 还有一个目的就是
    // 当try中的workLoop中存在耗时操作
    // 会默认当作这次操作超出了这次deadline
    // 也会直接让出主进程，开启下一个宏任务再去做。
    let hasMoreWork = true
    try {
      // 源码是这个 其实scheduledHostCallback就是workLoop (有兴趣可以去看 看看我说的对不对)
      // hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime)
      hasMoreWork = workLoop(hasTimeRemaining, currentTime)
    } finally {
      if (hasMoreWork) {
        port.postMessage(null)
      }
    }
  }
}

window.performWorkUntilDeadline = performWorkUntilDeadline

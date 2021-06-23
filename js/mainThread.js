const mainEl = document.querySelector("#box")   
let temp

function mainWork () {
  const style = mainEl.getBoundingClientRect()
  if (style.left <= 0)  {
    temp = 2
  } else if (style.left >= 500) {
    temp = -2
  }
  mainEl.style.left = style.left + temp + 'px'
  // requestAnimationFrame(mainWork)
}
// //顺滑版本
// function simulateMainThread () {
//   mainWork()
// }
//非丝滑版本 跳跳块
function simulateMainThread () {
  setInterval(() => {
    mainWork()
  }, 100)
}

window.simulateMainThread = simulateMainThread
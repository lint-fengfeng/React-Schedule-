const obj = {
  tagName: 'div',
  innerHTML: 'hello worldhello worldhello worldhello worldhello worldhello world'
}
const module = {
  taskQueue: [],
  pop
}

let num = 1
while(num < 50000) {
  module.taskQueue.push({...obj})
  num++
  if (num === 4999) {
    console.log(num)
  }
}

function pop (queue) {
  return queue.pop()
}

// taskQueue.forEach(item => {
//   const el = document.createElement(item.tagName)
//   el.innerHTML = item.innerHTML
//   el.style.textAlign = "right"
//   document.body.appendChild(el)
// })

window.TaskQueue = module
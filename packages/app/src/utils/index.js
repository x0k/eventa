export function buildWorker (Worker) {
  const worker = new Worker()
  return (data) => new Promise((resolve, reject) => {
    worker.postMessage(data)
    worker.onmessage = ({ data }) => resolve(data)
    worker.onerror = reject
  })
}

export function compose (f, g) {
  return (arg) => g(f(arg))
}

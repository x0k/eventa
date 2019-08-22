export function download (fileName, data) {
  const file = new Blob([ JSON.stringify(data) ], {
    type: 'application/json',
    name: fileName
  })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
}

export function upload () {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.onchange = resolve
    input.onabort = reject
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'json|application/json')
    input.click()
  })
}

export function readFile (file) {
  return new Promise((resolve, reject) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = resolve
      reader.onerror = reject
      reader.readAsText(file)
    } else {
      reject(new Error('File not selected'))
    }
  })
}

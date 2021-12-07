const todoServices = {
  getTodos: () => {
    return fetch('/todos')
      .then(res => {
        if (res.status !== 401)
          return res.json().then(data => data)
        else
          return ({ message: { msgBody: 'Unauthorized' }, msgError: true })

      })
  },
  postTodo: todo => {
    return fetch('/todos', {
      method: "post",
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 401)
          return res.json().then(data => data)
        else
          return ({ message: { msgBody: 'Unauthorized' }, msgError: true })
      })
  }
}

export default todoServices
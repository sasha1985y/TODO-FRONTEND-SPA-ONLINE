import { useState, useEffect } from "react";
import axios from "axios";

import { Todo } from "../types";

function App() {

  const [todos, setTodos] = useState<Todo[]>([])
  const [name, setName] = useState("")
  const [editStatus, setEditStatus] = useState(false)
  const [editName, setEditName] = useState('')
  const [editTodo, setEditTodo] = useState<Todo | null>(null); 
  const [openEditUI, setOpenEditUI] = useState(false)

  const addTodoHandler = (): void => {
    const postTodo = async() => {
      const postTodoData = {
        name: name
      }
      const {data} = await axios.post('https://cd80175.tw1.ru/todos/', postTodoData)
      setTodos([...todos, data])
      setName("")
    }
    postTodo()
  }

  const editTodoHandler = (todo: Todo) => {
    const updatePatchTodo = async () => {
      const { id, ...updateData } = todo;
      await axios.patch(`https://cd80175.tw1.ru/todos/${id}/`, updateData);
      // Ваши обновления...
      const updatedTodos = todos.map((todo) => {
        if(todo.id === id) {
          todo.name = editName;
          todo.status = editStatus;
        }
        return todo
      })
      setTodos(updatedTodos)
      setEditTodo(todo)
      setEditName('')
      setEditStatus(false)
      setOpenEditUI(false)
    };
    updatePatchTodo();
  };
  


  const deleteTodoHandler = (id: number): void => {
    const deleteTodo = async() => {
      await axios.delete(`https://cd80175.tw1.ru/todos/${id}/`)
      const newTodos = todos.filter((todo) => todo.id !== id)
      setTodos(newTodos)
    }
    deleteTodo()
  }

  useEffect(() => {
    const fetchTodos = async () => {
      const {data} = await axios.get<Todo[]>('https://cd80175.tw1.ru/todos/')
      setTodos(data)
    }
    fetchTodos();
  }, [])

  return (
    <div className="min-vh-100 bg-secondary position-relative">
      <div className="h-5 d-inline-block"></div>
      <h1 className="text-center">Todo App</h1>
      <div className="d-flex justify-content-center hstack gap-2">
        <input 
          type="text"
          id="myInput" 
          maxLength={200}
          className="w-75 bg-body-secondary rounded-start-pill"
          placeholder="Add todo here..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div onClick={addTodoHandler} className="w-20 bg-body-secondary rounded-end-pill border border-dark-subtle border-3">
          <i className="text-success fa-solid fa-square-plus"></i>
        </div>
      </div>
      <div className="h-5 d-inline-block"></div>
      <div className="row">
        <div className="col-md-1"></div>
        <ol className="col d-inline-block">
          {todos?.map((todo: Todo) => {
            const chunkedName = todo.name.match(/.{1,50}/g); // Разбиваем строку на части по 20 символов
            return (
              <li key={todo.id} className="col bg-secondary-subtle mb-1 rounded-4">
                <p className="text-center" onClick={() => {
                  setEditStatus(todo.status)
                  setEditName(todo.name)
                  setEditTodo(todo)
                  setOpenEditUI(true)
                }}>
                  <div key={todo.id} className="todo-item">
                    {chunkedName && chunkedName.map((chunk, chunkIndex) => (
                      <span key={chunkIndex}>
                        {chunk}
                        {chunkIndex < chunkedName.length - 1 && <br />} {/* Добавляем <br> между частями */}
                      </span>
                    ))}
                  </div>
                </p>
                {" "}
                {todo.status && (
                  <div className="text-center position-relative">
                    <span className="text-light-emphasis">(Completed)</span>
                    <i onClick={() => deleteTodoHandler(todo.id)} className="text-danger fs-3 position-absolute bottom-0 end-0 fa-regular fa-trash-can"></i>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        <div className="col-md-4">
          <div className={`position-fixed row h-15 w-20 bg-secondary ${openEditUI ? "" : "invisible"}`}>
            <div className="col-md-2"></div>
            <ul className="col bg-body-secondary rounded-4">
              <li className="d-flex justify-content-around hstack gap-2">
                <span className="fs-6">Editor</span>
                < input type="checkbox" checked={editStatus} onChange={() => setEditStatus(!editStatus)}/>
                <i>status</i>
                <i onClick={() => setOpenEditUI(false)} className="text-danger fs-5 fa-solid fa-xmark"></i>
              </li>
              <li className="input-group">
                <textarea className="form-control" maxLength={200} value={editName} onChange={(e) => setEditName(e.target.value)}></textarea>
              </li>
              <li>
              <button onClick={() => editTodo && editTodoHandler(editTodo)} className="btn btn-success">Update</button>
              </li>
            </ul>
            <div className="col-md-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

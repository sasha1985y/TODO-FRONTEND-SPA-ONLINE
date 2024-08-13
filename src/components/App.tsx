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

  const editTodoHandler = async () => {
    if(editTodo) {
      const updatedTodo = {
        ...editTodo,
        name: editName, // Используем измененное имя
        status: editStatus, // Используем измененный статус
      };
  
      try {
        // Отправляем обновленные данные на сервер
        const { data } = await axios.patch(`https://cd80175.tw1.ru/todos/${editTodo.id}/`, updatedTodo);
  
        // Обновляем состояние todos с обновленным todo
        const updatedTodos = todos.map((todo) => (
          todo.id === editTodo.id ? data : todo // Предполагается, что сервер возвращает обновленный объект todo
        ));
  
        setTodos(updatedTodos);
        
        // Сброс состояний после успешного обновления
        setEditTodo(null);
        setEditName('');
        setEditStatus(false);
        setOpenEditUI(false);
      } catch (error) {
        console.error("Ошибка обновления todo:", error);
        // Здесь может быть обработка ошибки, например, показ уведомления пользователю
      }
    }
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
    <>
      <div className={`row min-vh-100 h-15 w-20 bg-secondary ${openEditUI ? "" : "d-none"}`}>
        <div className="h-5 d-inline-block"></div>
        <div className="col-md-2"></div>
        <ul className="col bg-body-secondary rounded-4">
          <li className="d-flex justify-content-around hstack gap-2">
            <span className="fs-6">Редактор задачи</span>
            < input type="checkbox" checked={!editStatus} onChange={() => setEditStatus(!editStatus)}/>
            <i>статус</i>
            <i onClick={() => setOpenEditUI(false)} className="text-danger fs-5 fa-solid fa-xmark"></i>
          </li>
          <li className="input-group">
            <textarea className="form-control" maxLength={200} value={editName} onChange={(e) => setEditName(e.target.value)}></textarea>
          </li>
          <li>
            <button onClick={() => editTodo && editTodoHandler()} className="btn btn-success">обновить</button>
          </li>
        </ul>
        <div className="col-md-2"></div>
        <div className="h-5 d-inline-block"></div>
      </div>
      <div className={`min-vh-100 bg-secondary position-relative ${!openEditUI ? "" : "d-none"}`}>
        <div className="h-5 d-inline-block"></div>
        <h1 className="text-center">Todo App</h1>
        <div className="row input-group input-group-sm mb-3">
          <div className="col-md-3"></div>
          <input 
            type="text"
            id="myInput" 
            maxLength={200}
            className={`form-control col bg-body-secondary ${name.trim() === "" ? "rounded-pill" : "rounded-start-pill"}`}
            placeholder="Add todo here..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div onClick={addTodoHandler} className={`col-md-1 w-20 bg-body-secondary rounded-end-pill border border-dark-subtle border-3 ${name.trim() === "" ? "invisible" : ""}`}>
            <i className="text-success fa-solid fa-square-plus"></i>
          </div>
          <div className={name.trim() === "" ? "col-md-2" : "col-md-3"}></div>
        </div>
        <div className="h-5 d-inline-block"></div>
        <div className="row">
          <div className="col-md-3"></div>
          <ul className="col d-inline-block list-group">
            {todos?.map((todo: Todo) => {
              const chunkedName = todo.name.match(/.{1,49}/g);
              return (
                <li key={todo.id} className="col bg-secondary-subtle mb-1 rounded-4 list-group-item">
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
                          {chunkIndex < chunkedName.length - 1 && <i>&#8211;<br></br></i>}
                        </span>
                      ))}
                    </div>
                  </p>
                  {" "}
                  <div className="row">
                    <span className="col-md-7 text-end text-light-emphasis">{!todo.status ? "выполнена" : "не выполнена"}</span>
                    <i onClick={() => deleteTodoHandler(todo.id)} className="col-md-5 text-end text-danger fs-3 bottom-0 end-0 fa-regular fa-trash-can"></i>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="col-md-3"></div>
        </div>
      </div>
    </>
  );
}

export default App;

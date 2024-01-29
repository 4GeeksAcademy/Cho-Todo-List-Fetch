import React, { useState, useEffect } from "react";

const API_BASE_URL = "https://playground.4geeks.com/apis/fake/todos/user/";

const fetchApiData = (url, method = "GET", body = null) => {
  const requestOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  };

  return fetch(`${API_BASE_URL}${url}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${url}`);
      }
      return response.json();
    })
    .catch((error) => console.error("Error:", error));
};

const handleRequestError = (error, errorMessage) => {
  setIsLoading(false);
  setError(errorMessage);
  console.error("Error:", error);
};

const Home = () => {
  const [value, setValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [username, setUsername] = useState("");
  const [createdUsername, setCreatedUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = () => {
    if (username.trim() !== "") {
      fetchApiData(username, "POST", []).then(() =>
        setCreatedUsername(username)
      );
    }
  };

  useEffect(() => {
    if (createdUsername.trim() !== "") {
      fetchApiData(createdUsername).then((data) =>
        setTodos(Array.isArray(data) ? data : [])
      );
    }
  }, [createdUsername]);

  const handleAddTodo = () => {
    if (value.trim() !== "" && createdUsername.trim() !== "") {
      const newTodos = [...todos, { label: value, done: false }];

      setIsLoading(true);
      fetchApiData(createdUsername, "PUT", newTodos)
        .then(() => {
          setTodos(newTodos);
          setValue("");
        })
        .catch((error) => handleRequestError(error, "Failed to add todo"))
        .finally(() => setIsLoading(false));
    }
  };

  const handleDeleteTodo = (indexToDelete) => {
    if (createdUsername.trim() !== "") {
      const newTodos = todos.filter((_, index) => index !== indexToDelete);

      fetchApiData(createdUsername, "PUT", newTodos)
        .then(() => setTodos(newTodos))
        .catch((error) => handleRequestError(error, "Failed to delete todo"));
    }
  };

  const handleUpdateTodo = () => {
    if (username.trim() === "") {
      alert("No user created. Please create a user first.");
      return;
    }

    fetchApiData(username)
      .then((data) => setTodos(data))
      .catch((error) => handleRequestError(error, "Failed to fetch todos"));
  };

  return (
    <div className="container mx-auto p-2 mt-3">
      <h1 className="text-center">My To-Do list</h1>
      <div className="d-flex align-items-center justify-content-center username">
        <input
          type="text"
          placeholder="Username"
          className="myInputs flex-grow-1"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        ></input>
        <button
          type="button"
          className="btn d-flex align-items-center justify-content-center"
          onClick={handleCreateUser}
        >
          Create
        </button>
        <button
          type="button"
          className="btn d-flex align-items-center justify-content-center"
          onClick={handleUpdateTodo}
        >
          Update
        </button>
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <input
          type="text"
          className="myInputs flex-grow-1"
          placeholder="Add your to-do task here.."
          onChange={(e) => setValue(e.target.value)}
          value={value}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTodo();
            }
          }}
        ></input>
        <button
          className="btn d-flex align-items-center justify-content-center"
          type="button"
          onClick={handleAddTodo}
        >
          Add new
        </button>
      </div>
      <ul className="myList">
        {Array.isArray(todos) &&
          todos.map((todo, index) => (
            <li key={index}>
              <div className="d-flex justify-content-between align-items-center mx-2">
                {todo.label}
                <i
                  className="fa-solid fa-delete-left"
                  style={{ color: "#B197FC" }}
                  onClick={() => handleDeleteTodo(index)}
                ></i>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Home;

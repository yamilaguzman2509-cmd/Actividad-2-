class Tarea {
  constructor(nombre, completa = false) {
    this.nombre = nombre;
    this.completa = completa;
  }

  toggleEstado() {
    this.completa = !this.completa;
  }

  editar(nuevoNombre) {
    this.nombre = nuevoNombre;
  }
}

class GestorDeTareas {
  constructor() {
    this.tareas = this.cargar();
  }

  agregar(nombre) {
    const tarea = new Tarea(nombre);
    this.tareas.push(tarea);
    this.guardar();
  }

  eliminar(index) {
    this.tareas.splice(index, 1);
    this.guardar();
  }

  editar(index, nuevoNombre) {
    this.tareas[index].editar(nuevoNombre);
    this.guardar();
  }

  toggle(index) {
    this.tareas[index].toggleEstado();
    this.guardar();
  }

  guardar() {
    localStorage.setItem("tareas", JSON.stringify(this.tareas));
  }

  cargar() {
    const data = localStorage.getItem("tareas");
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.map(t => new Tarea(t.nombre, t.completa));
    }
    return [];
  }
}

const gestor = new GestorDeTareas();

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const errorMsg = document.getElementById("errorMsg");

const render = () => {
  taskList.innerHTML = "";

  gestor.tareas.forEach((tarea, index) => {
    const li = document.createElement("li");

    if (tarea.completa) {
      li.classList.add("completa");
    }

    const span = document.createElement("span");
    span.textContent = tarea.nombre;

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Listo";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";

    completeBtn.addEventListener("click", () => {
      gestor.toggle(index);
      render();
    });

    editBtn.addEventListener("click", () => {
      const nuevoTexto = prompt("Edita la tarea:", tarea.nombre);
      if (nuevoTexto && nuevoTexto.trim() !== "") {
        gestor.editar(index, nuevoTexto.trim());
        render();
      }
    });

    deleteBtn.addEventListener("click", () => {
      gestor.eliminar(index);
      render();
    });

    li.appendChild(span);
    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
};

addTaskBtn.addEventListener("click", () => {
  const texto = taskInput.value.trim();

  if (texto === "") {
    errorMsg.textContent = "No puedes agregar una tarea vacía.";
    return;
  }

  errorMsg.textContent = "";
  gestor.agregar(texto);
  taskInput.value = "";
  render();
});

render();

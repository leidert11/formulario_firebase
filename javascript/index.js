const abrirModal = document.getElementById('abrir-modal');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('cerrarModal');
const guardado = document.getElementById('guardarCliente');
const editar = document.querySelector('.btn-edit');

const registerModal = () => {
  modal.classList.toggle('is-active');
};

abrirModal.addEventListener('click', registerModal);
closeModal.addEventListener('click', registerModal);
guardado.addEventListener('click', registerModal);

// Implementación de datos

import { saveTask, getTasks, onGetTasks, deleteTask, updateTask, updateTaskFinal } from "./firebase.js";

const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('client-list');

let editStatus = false;
let id = '';

window.addEventListener('DOMContentLoaded', async () => {
  onGetTasks((querySnapshot) => {
    let html = '';
    querySnapshot.forEach(doc => {
      const task = doc.data();

      html += `
        <table class='table-list'>
          <tr class='tr-table-list'>
            <th scope="col">${task.nombre}</th>
            <th scope="col">${task.apellido}</th>
            <th scope="col">${task.nit}</th>
            <th scope="col">${task.direccion}</th>
            <th scope="col">${task.ciudad}</th>
            <th scope="col">${task.telefono}</th>
            <th scope="col">${task.cupoDisponible}</th>
            <th scope="col">${task.estado}</th>
            <th>
              <div class="botones">
                <button class="btn-delete button is-danger is-outlined" data-id=${doc.id} id="borrar">D</button>
                <button class="btn-edit button is-link is-outlined" data-id=${doc.id} id="editar">E</button>
              </div>
            </th>
          </tr>
        </table>
      `;
    });

    taskContainer.innerHTML = html;
    // Insertar el código de búsqueda aquí
    function searchRecords() {
        // Obtén el valor de búsqueda
        const searchInput = document.getElementById('search-input');
        const searchValue = searchInput.value.trim().toLowerCase();
      
        // Filtra los registros por NIT en la tabla
        const rows = taskContainer.getElementsByClassName('tr-table-list');
        Array.from(rows).forEach((row) => {
          const nit = row.getElementsByTagName('th')[2].textContent.toLowerCase();
          if (searchValue === '') {
            // Mostrar todas las filas si el campo de búsqueda está vacío
            row.style.display = '';
          } else if (nit === searchValue) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      }
      
      // Evento para buscar registros al hacer clic en el botón "Search"
      const searchButton = document.getElementById('search-button');
      searchButton.addEventListener('click', searchRecords);
      
      // Evento para buscar registros al ingresar un valor en el campo de búsqueda
      const searchInput = document.getElementById('search-input');
      searchInput.addEventListener('input', searchRecords);
    //--------------------------------------------------
    const btnDelete = taskContainer.querySelectorAll('.btn-delete');

    btnDelete.forEach(btn => {
      btn.addEventListener('click', ({ target: { dataset } }) => {
        deleteTask(dataset.id);
      });
    });

    const btnEdit = taskContainer.querySelectorAll('.btn-edit');
    btnEdit.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const doc = await updateTask(e.target.dataset.id);
        const tasks = doc.data();

        taskForm['inputnombre'].value = tasks.nombre;
        taskForm['inputapellido'].value = tasks.apellido;
        taskForm['inputnit'].value = tasks.nit;
        taskForm['inputdireccion'].value = tasks.direccion;
        taskForm['ciudad'].value = tasks.ciudad;
        taskForm['inputtelefono'].value = tasks.telefono;
        taskForm['inputdispo'].value = tasks.cupoDisponible;
        taskForm['estado'].value = tasks.estado;
        taskForm['inputcupoTot'].value = tasks.cupoTotal;
        taskForm['inputdiasgar'].value = tasks.diasGracia;

        editStatus = true;
        id = doc.id;
        taskForm['guardarCliente'].disabled = false;
        taskForm['guardarCliente'].innerText = 'Actualizar';
        abrirModal.textContent = 'Editar';
      });
      taskForm['guardarCliente'].innerText = 'Guardar';
      abrirModal.textContent = 'Crear cliente';
    });
  });
});

const btn = document.getElementById('guardarCliente');
let clearForm = true;

function validar() {
  let deshabilitar = false;

  if (
    taskForm.inputnombre.value === '' ||
    taskForm.inputapellido.value === '' ||
    taskForm.inputnit.value === '' ||
    taskForm.inputdireccion.value === '' ||
    taskForm.ciudad.value === '' ||
    taskForm.inputtelefono.value === '' ||
    taskForm.inputdispo.value === '' ||
    taskForm.estado.value === '' ||
    taskForm.inputcupoTot.value === '' ||
    taskForm.inputdiasgar.value === ''
  ) {
    deshabilitar = true;
  }

  if (deshabilitar) {
    btn.disabled = true;
  } else {
    btn.disabled = false;
  }
}

taskForm.addEventListener('keyup', validar);
taskForm.addEventListener('click', validar);

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = taskForm['inputnombre'];
  const apellido = taskForm['inputapellido'];
  const nit = taskForm['inputnit'];
  const direccion = taskForm['inputdireccion'];
  const ciudad = taskForm['ciudad'];
  const telefono = taskForm['inputtelefono'];
  const cupoDisponible = taskForm['inputdispo'];
  const estado = taskForm['estado'];
  const cupoTotal = taskForm['inputcupoTot'];
  const diasGracia = taskForm['inputdiasgar'];

  if (!editStatus) {
    saveTask(
      nombre.value,
      apellido.value,
      nit.value,
      direccion.value,
      ciudad.value,
      telefono.value,
      cupoDisponible.value,
      estado.value,
      cupoTotal.value,
      diasGracia.value
    );
  } else {
    updateTaskFinal(id, {
      nombre: nombre.value,
      apellido: apellido.value,
      nit: nit.value,
      direccion: direccion.value,
      ciudad: ciudad.value,
      telefono: telefono.value,
      cupoDisponible: cupoDisponible.value,
      estado: estado.value,
      cupoTotal: cupoTotal.value,
      diasGracia: diasGracia.value,
    });

    taskForm.reset();
    editStatus = false;
    taskForm['guardarCliente'].disabled = true;
    taskForm['guardarCliente'].innerText = 'Guardar';
  }

  validar();
});

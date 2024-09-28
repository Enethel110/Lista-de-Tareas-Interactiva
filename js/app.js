    const form = document.getElementById('tasks-form'); // Selecciona el formulario
    const taskInput = document.getElementById('task-input'); // Selecciona el campo de entrada de tarea
    const taskList = document.getElementById('tasks-list'); // Selecciona la lista de tareas
    const modal = document.getElementById('modal'); // Selecciona el modal
    const modalMessage = document.getElementById('modal-message'); // Selecciona el mensaje dentro del modal
    const closeModal = document.getElementById('close-modal'); // Selecciona el botón de cerrar modal
    const empty= document.getElementById('empty'); // Selccionamos mensaje de lista vacia

    // Función para mostrar mensajes en el modal
    function showModal(message) {
        modalMessage.textContent = message; // Establece el mensaje del modal
        modal.style.display = 'block'; // Muestra el modal
    }

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none'; // Cierra el modal al hacer clic en el botón
    });

    // Cerrar el modal si se hace clic fuera de él
    window.onclick = function(event) {
        if (event.target === modal) { // Verifica si el clic fue en el modal
            modal.style.display = 'none'; // Cierra el modal
        }
    };

    // Función para guardar las tareas en localStorage
    function saveTasks() {
        const tasks = Array.from(taskList.children).map(item => {
            return {
                text: item.firstChild.textContent, // Obtiene el texto de la tarea
                completed: item.classList.contains('completed') // Verifica si está completada
            };
        });
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Guarda las tareas en localStorage
    }

    // Función para cargar las tareas desde localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Carga tareas o asigna un arreglo vacío
        tasks.forEach(task => addTask(task.text, task.completed)); // Agrega cada tarea
    }

    // Función para añadir una tarea
    function addTask(taskText, isCompleted = false) {
        const listItem = document.createElement('li'); // Crea un nuevo elemento de lista
        listItem.textContent = taskText; // Establece el texto de la tarea

        const deleteButton = document.createElement('button'); // Crea un botón de eliminar
        deleteButton.textContent = 'Eliminar'; // Establece el texto del botón
        deleteButton.classList.add('delete-button'); // Agrega una clase al botón

        // Configurar el estado inicial de la tarea
        if (isCompleted) {
            listItem.classList.add('completed'); // Marca la tarea como completada
            deleteButton.disabled = true; // Desactiva el botón de eliminar
        }

        deleteButton.addEventListener('click', function() {
            taskList.removeChild(listItem); // Elimina la tarea de la lista
            saveTasks(); // Guarda cambios después de eliminar
            if (taskList.children.length === 0) {
                empty.style.display = "block"; // Muestra el mensaje si no hay tareas
            }
        });

        // Evento para marcar la tarea como completada
        listItem.addEventListener('click', function() {
            listItem.classList.toggle('completed'); // Alterna la clase "completed"
            deleteButton.disabled = listItem.classList.contains('completed'); // Desactiva/activa el botón
            saveTasks(); // Guarda cambios al marcar como completada
        });

        listItem.appendChild(deleteButton); // Agrega el botón al elemento de lista
        taskList.appendChild(listItem); // Agrega el elemento de lista a la lista
        empty.style.display = "none"; // No mostrar texto de no hay tareas
        saveTasks(); // Guarda cambios al agregar la tarea
    }

    // Evento para el formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario
        const taskText = taskInput.value.trim(); // Obtiene el texto de la tarea y elimina espacios

        if (taskText) {
            const existingTasks = Array.from(taskList.children).map(item => item.firstChild.textContent); // Obtiene tareas existentes
            if (existingTasks.includes(taskText)) {
                showModal('Esta tarea ya existe.'); // Muestra un mensaje si la tarea ya existe
                return;
            }
            addTask(taskText); // Agrega la nueva tarea
            taskInput.value = ''; // Limpia el campo de entrada
        } else {
            showModal('Por favor, el campo no debe estar vacío.'); // Muestra un mensaje si la entrada es inválida
        }
    });

    // Cargar tareas al iniciar
    loadTasks(); // Carga las tareas guardadas al iniciar la aplicación

// Get the todo list container
const todoList = document.getElementById('todoList');

// Add event listeners for drag and drop functionality
todoList.addEventListener('dragstart', handleDragStart);
todoList.addEventListener('dragover', handleDragOver);
todoList.addEventListener('drop', handleDrop);

// Function to handle dragstart event
function handleDragStart(event) {
  const target = event.target;
  if (target.classList.contains('task') || target.classList.contains('subtask')) {
    event.dataTransfer.setData('text/plain', target.id);
  }
}

// Function to handle dragover event
function handleDragOver(event) {
  event.preventDefault();
}

// Function to handle drop event
function handleDrop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text/plain');
  const target = event.target;

  if (target.classList.contains('task') || target.classList.contains('subtask')) {
    const draggedElement = document.getElementById(data);

    // Check if dragged element and target are in the same list (tasks or subtasks)
    if (draggedElement.parentElement === target.parentElement) {
      // If they are in the same list, rearrange them by inserting the dragged element before or after the target
      const parentList = target.parentElement;
      const targetIndex = Array.from(parentList.children).indexOf(target);
      const draggedIndex = Array.from(parentList.children).indexOf(draggedElement);

      if (draggedIndex < targetIndex) {
        parentList.insertBefore(draggedElement, target.nextSibling);
      } else {
        parentList.insertBefore(draggedElement, target);
      }
    } else {
      // If they are in different lists, move the dragged element to the target's list
      target.parentElement.appendChild(draggedElement);
    }
  }
}

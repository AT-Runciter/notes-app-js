const notesEl = document.querySelector('.notes');
const addBtn = document.querySelector('.note-add');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const pageNumbersEl = document.querySelector('.page-numbers');

const pageSize = 4;
let currentPage = 1;

function createNoteElement(title, text) {
  const noteEl = document.createElement('div');
  noteEl.classList.add('note');
  noteEl.innerHTML = `
    <div class="note-header">
      <p id="note-title">${title}</p>
      <textarea id="note-title-input" class="hidden">${title}</textarea>
      <div>
        <button class="note-edit"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="note-delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
    <p id="note-text">${text}</p>
    <textarea id="note-textarea" class="hidden">${text}</textarea>
  `;

  const editBtn = noteEl.querySelector('.note-edit');
  const deleteBtn = noteEl.querySelector('.note-delete');
  const titleEl = noteEl.querySelector('#note-title');
  const textEl = noteEl.querySelector('#note-text');
  const titleInputEl = noteEl.querySelector('#note-title-input');
  const textInputEl = noteEl.querySelector('#note-textarea');

  editBtn.addEventListener('click', function (e) {
    titleEl.classList.toggle('hidden');
    textEl.classList.toggle('hidden');
    titleInputEl.classList.toggle('hidden');
    textInputEl.classList.toggle('hidden');
  });

  deleteBtn.addEventListener('click', function (e) {
    noteEl.remove();
    saveNotesToLocalStorage();
    checkPagination();
  });

  titleInputEl.addEventListener('input', function (e) {
    titleEl.innerText = e.target.value;
    saveNotesToLocalStorage();
  });

  textInputEl.addEventListener('input', function (e) {
    textEl.innerText = e.target.value;
    saveNotesToLocalStorage();
  });

  return noteEl;
}

function saveNotesToLocalStorage() {
  const notes = Array.from(notesEl.querySelectorAll('.note'));
  const serializedNotes = notes.map(note => {
    const title = note.querySelector('#note-title').innerText;
    const text = note.querySelector('#note-text').innerText;
    return { title, text };
  });
  localStorage.setItem('notes', JSON.stringify(serializedNotes));
}

function loadNotesFromLocalStorage() {
  const serializedNotes = localStorage.getItem('notes');
  if (serializedNotes) {
    const parsedNotes = JSON.parse(serializedNotes);
    parsedNotes.forEach(({ title, text }) => {
      const noteEl = createNoteElement(title, text);
      notesEl.appendChild(noteEl);
    });
  }
}

function updatePagination() {
  const notes = Array.from(notesEl.querySelectorAll('.note'));
  const totalPages = Math.ceil(notes.length / pageSize);

  pageNumbersEl.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageNumber = document.createElement('button');
    pageNumber.classList.add('page-number');
    pageNumber.innerText = i;
    pageNumber.addEventListener('click', function () {
      currentPage = i;
      checkPagination();
    });
    pageNumbersEl.appendChild(pageNumber);
  }

  if (totalPages > 1) {
    prevBtn.style.display = 'block';
    nextBtn.style.display = 'block';
  } else {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }

  if (currentPage === 1) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }

  if (currentPage === totalPages) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
}

function renderNotes() {
  const notes = Array.from(notesEl.querySelectorAll('.note'));
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  notes.forEach((note, index) => {
    if (index >= start && index < end) {
      note.style.display = 'block';
    } else {
      note.style.display = 'none';
    }
  });
}

function checkPagination() {
  updatePagination();
  renderNotes();
}

loadNotesFromLocalStorage();
checkPagination();

addBtn.addEventListener('click', function (e) {
  const el = createNoteElement("Title", "Text");
  notesEl.appendChild(el);
  saveNotesToLocalStorage();
  checkPagination();
});

prevBtn.addEventListener('click', function () {
  if (currentPage > 1) {
    currentPage--;
    checkPagination();
  }
});

nextBtn.addEventListener('click', function () {
  const notes = Array.from(notesEl.querySelectorAll('.note'));
  const totalPages = Math.ceil(notes.length / pageSize);

  if (currentPage < totalPages) {
    currentPage++;
    checkPagination();
  }
});

checkPagination();

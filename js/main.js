document.addEventListener("DOMContentLoaded", function () {
  const submitForm /* HTMLFormElement */ = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  loadBookfromStorage();
});

const READ_BOOK = "read";
const UNREAD_BOOK = "unread";
const STORAGE = "booksApps";
const BOOK_ID = "bookId";
let books = [];

function makeBook(title, author, year, isComplete) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = title;
  const textAuthor = document.createElement("p");
  textAuthor.innerText = author;
  const textYear = document.createElement("small");
  textYear.innerText = year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.append(textContainer);

  if (isComplete) {
    container.append(createUndoButton(), createTrashButton());
  } else {
    container.append(createCheckButton(), createTrashButton());
  }
  return container;
}

function createUndoButton() {
  return createButton("undoButton", function (event) {
    undoBookFromRead(event.target.parentElement);
  });
}

function createTrashButton() {
  return createButton("trashButton", function (event) {
    removeBookFromRead(event.target.parentElement);
  });
}

function createCheckButton() {
  return createButton("checkButton", function (event) {
    addBookToRead(event.target.parentElement);
  });
}

function createButton(textContent, eventListener) {
  const button = document.createElement("button");
  button.classList.add(textContent);
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
}

function addBook() {
  const unreadBookList = document.getElementById(UNREAD_BOOK);
  const textTitle = document.getElementById("title").value;
  const textAuthor = document.getElementById("author").value;
  const textYear = document.getElementById("year").value;

  const book = makeBook(textTitle, textAuthor, textYear, false);
  const bookObject = arrageBookObject(textTitle, textAuthor, textYear, false);

  book[BOOK_ID] = bookObject.id;
  books.push(bookObject);

  unreadBookList.append(book);
  updateBookToStorage();
}

function addBookToRead(bookElement) {
  const listRead = document.getElementById(READ_BOOK);
  bookTitle = bookElement.querySelector(".inner > h2").innerText;
  bookAuthor = bookElement.querySelector(".inner > p").innerText;
  bookYear = bookElement.querySelector(".inner > small").innerText;

  newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
  const book = searchBook(bookElement[BOOK_ID]);
  book.isComplete = true;
  newBook[BOOK_ID] = book.id;

  listRead.append(newBook);
  bookElement.remove();

  updateBookToStorage();
}

function removeBookFromRead(bookElement) {
  const bookLocation = searchBookIndex(bookElement[BOOK_ID]);
  books.splice(bookLocation, 1);
  bookElement.remove();
  updateBookToStorage();
}

function undoBookFromRead(bookElement) {
  const listUnread = document.getElementById(UNREAD_BOOK);
  const bookTitle = bookElement.querySelector(".inner > h2").innerText;
  const bookAuthor = bookElement.querySelector(".inner > p").innerText;
  const bookYear = bookElement.querySelector(".inner > small").innerText;

  const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);
  const book = searchBook(bookElement[BOOK_ID]);
  book.isComplete = false;
  newBook[BOOK_ID] = book.id;

  listUnread.append(newBook);
  bookElement.remove();
  updateBookToStorage();
}

function saveBook() {
  const parseBook = JSON.stringify(books);
  localStorage.setItem(STORAGE, parseBook);
  document.dispatchEvent(new Event("onbooksaved"));
}

function loadBookfromStorage() {
  const dataData = localStorage.getItem(STORAGE);
  const data = JSON.parse(dataData);
  if (data !== null) books = data;
  document.dispatchEvent(new Event("onbookloaded"));
}

function updateBookToStorage() {
  saveBook();
}

function arrageBookObject(bookTitle, bookAuthor, bookYear, isComplete) {
  return {
    id: +new Date(),
    bookTitle,
    bookAuthor,
    bookYear,
    isComplete,
  };
}

function searchBook(BOOK_ID) {
  for (book of books) {
    if (book.id === BOOK_ID) return book;
  }
  return null;
}

function searchBookIndex(BOOK_ID) {
  let index = 0;
  for (book of books) {
    if (book.id === BOOK_ID) return index;
    index++;
  }
}

function getDataFromBooks() {
  const unreadBookList = document.getElementById(UNREAD_BOOK);
  const listRead = document.getElementById(READ_BOOK);

  for (book of books) {
    const newBook = makeBook(
      book.bookTitle,
      book.bookAuthor,
      book.bookYear,
      book.isComplete
    );
    newBook[BOOK_ID] = book.id;

    if (book.isComplete) {
      listRead.append(newBook);
    } else {
      unreadBookList.append(newBook);
    }
  }
}

document.addEventListener("onbookloaded", () => {
  getDataFromBooks();
});

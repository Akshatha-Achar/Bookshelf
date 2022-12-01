"use strict";
const landingPage = document.querySelector(".landing-page");
const openButton = document.querySelector("#open-button");
const allBooksSection = document.querySelector(".all-books-section");
const insideBookSection = document.querySelector(".inside-book-section");
// openButton.addEventListener("click", function () {
//   landingPage.classList.add("hidden");
//   allBooksSection.classList.remove("hidden");
// });

landingPage.classList.add("hidden");
// allBooksSection.classList.remove("hidden");

// ALL BOOKS PAGE

const alllBooksContainer = document.querySelector(".all-books-container");
const addBookButton = document.querySelector("#add-book");

addBookButton.addEventListener("click", addBooks);

getAllBooks().forEach((book) => {
  const bookElement = createBook(book.id, book.bookName);
  alllBooksContainer.insertBefore(bookElement, addBookButton);
});

function addBooks() {
  const books = getAllBooks();
  const bookNameValue = prompt("What is the book name:");
  if (bookNameValue) {
    const bookObject = {
      id: Math.floor(Math.random() * 10000),
      bookName: bookNameValue,
    };

    const bookElement = createBook(bookObject.id, bookObject.bookName);
    alllBooksContainer.insertBefore(bookElement, addBookButton);
    books.push(bookObject);
    saveBooks(books);
  }
}

function getAllBooks() {
  const books = localStorage.getItem("bookshelf-books") || "[]";
  return JSON.parse(books);
}

function createBook(id, bookName) {
  const element = document.createElement("div");
  element.classList.add("books");
  element.classList.add(`book-${id}`);
  element.innerText = bookName;

  // element.addEventListener("click", function () {
  //   const newBookName = prompt("Enter the new book name:");
  //   updateBook(id, newBookName);
  // });

  element.addEventListener("dblclick", function () {
    const doDelete = confirm("Are you sure about deleting this book");
    if (doDelete) {
      deleteBook(id, element);
    }
  });

  return element;
}

function saveBooks(books) {
  localStorage.setItem("bookshelf-books", JSON.stringify(books));
}

function deleteBook(id, book) {
  const books = getAllBooks().filter((book) => book.id !== id);
  saveBooks(books);
  alllBooksContainer.removeChild(book);
}

// INSIDE BOOK PAGE

const openBookButton = document.querySelector("#open-book");
const insideBookContainer = document.querySelector(".inside-book-container");
const bookTitle = document.querySelector(".book-title");
const topicsContainer = document.querySelector(".topics-container");
const addTopicButton = document.querySelector(".add-topic");

// openBookButton.addEventListener("click", function () {
//   const bookDetail = prompt("Enter the book name to open:");
//   const bookName = bookDetail[0]
//     .toUpperCase()
//     .concat(bookDetail.slice(1).toLowerCase());

//   const requiredBook = getAllBooks().filter(
//     (book) => book.bookName == bookName
//   );

//   console.log("From localStorage:", requiredBook);

//   if (!requiredBook[0]) {
//     alert("book name does not exist. Click again..");
//   } else {
//     allBooksSection.classList.add("hidden");
//     insideBookSection.classList.remove("hidden");
//     bookTitle.innerText = requiredBook[0].bookName;
//   }
// });

// for Testing
console.log("All books:", getAllBooks());
allBooksSection.classList.add("hidden");
insideBookSection.classList.remove("hidden");

const bookName = "Maths";
const requiredBook = getAllBooks().filter((book) => book.bookName == bookName);
console.log(requiredBook[0]);
bookTitle.innerText = requiredBook[0].bookName;

addTopicButton.addEventListener("click", function () {
  requiredBook[0].topics = {};
  console.log(requiredBook[0]);
});

function getAllTopics() {
  const requiredBook = getAllBooks().filter(
    (book) => book.bookName == bookTitle.innerText
  );
  //   const topicsObj = requiredBook[0].topics || {};
  //   return topicsObj;
  // }
  return requiredBook[0].topics || {};
}

function addTopic() {
  let topicObject = getAllTopics();

  topicObject = {
    topicId: Math.floor(Math.random() * 100),
    topicName: "",
    content: "",
  };
  // return topicObject;

  const topicElement = createTopic(topicObject.topicId, topicObject.topicName);
  topicsContainer.insertAdjacentElement("beforeend", topicElement);
}

function createTopic(topicId, topicName) {
  let topic = document.createElement("input");
  topic.classList.add("topics");
  topic.placeholder = "Topic Name...";

  topic.value = topicName;

  topic.addEventListener("change", function () {
    updateTopic(topicId, topic.value);
  });

  return topic;
}

function updateTopic(topicId, newTopicName) {
  const topics = getAllTopics();
  const targetTopic = topics.filter((topic) => topic.id === topicId);
  targetTopic.topicName = newTopicName;
  alllBooksContainer.querySelector(`.book-${id}`).innerText = newBookName;
  saveBooks(books);
}

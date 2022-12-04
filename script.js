"use strict";
const landingPage = document.querySelector(".landing-page");
const openButton = document.querySelector("#open-button");
const allBooksSection = document.querySelector(".all-books-section");
const alllBooksContainer = document.querySelector(".all-books-container");
const addBookButton = document.querySelector("#add-book");
const insideBookSection = document.querySelector(".inside-book-section");
const openBookButton = document.querySelector("#open-book");
const insideBookContainer = document.querySelector(".inside-book-container");
const bookTitle = document.querySelector(".book-title");
const topicsContainer = document.querySelector(".topics-container");
const addTopicButton = document.querySelector(".add-topic");
const whiteSheet = document.querySelector(".white-sheet");

openButton.addEventListener("click", function () {
  landingPage.classList.add("hidden");
  allBooksSection.classList.remove("hidden");
});

//***************************************************
// ALL BOOKS PAGE

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
      topics: [],
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

//***************************************************
// INSIDE BOOK PAGE

openBookButton.addEventListener("click", openBook);

function openBook() {
  const bookNameInput = prompt("Write the book Name to open:");
  const book = getTheBook(bookNameInput);

  if (book) {
    allBooksSection.classList.add("hidden");
    insideBookSection.classList.remove("hidden");
    bookTitle.innerText = book.bookName;

    book["topics"].forEach((topic) => {
      const topicElement = createTopic(
        book.bookName,
        topic.topicId,
        topic.topicName
      );
      topicsContainer.insertBefore(topicElement, addTopicButton);
    });
  } else {
    alert(`' ${bookNameInput} ' book doesn't exist. Try Again...☹`);
  }
}

function getTheBook(bookName) {
  const book = getAllBooks().filter((book) => book.bookName === bookName)[0];
  return book;
}

//WHEN THE ADD TOPIC BUTTON IS CLICKED

addTopicButton.addEventListener("click", function () {
  const bookName = bookTitle.innerText;
  addTopic(bookName);
});

function addTopic(bookName) {
  const book = getTheBook(bookName);
  const topics = book.topics;
  const topicObj = {
    topicId: Math.floor(Math.random() * 1000),
    topicName: "",
    content: "",
  };

  const topicElement = createTopic(
    book.bookName,
    topicObj.topicId,
    topicObj.topicName
  );
  topicsContainer.insertBefore(topicElement, addTopicButton);

  topics.push(topicObj);
  saveTopics(book.bookName, topics);
}

function saveTopics(bookName, topics) {
  const allBooks = getAllBooks();
  const book = allBooks.filter((book) => book.bookName == bookName);
  book[0].topics = topics;
  localStorage.setItem("bookshelf-books", JSON.stringify(allBooks));
}

function createTopic(bookName, topicId, topicName) {
  const element = document.createElement("input");
  element.classList.add("topics");
  element.classList.add(`topic-${topicId}`);
  element.placeholder = "Topic Name...";
  element.value = topicName;

  element.addEventListener("change", function (e) {
    const newTopicName = e.target.value;
    updateTopic(bookName, topicId, newTopicName);
  });

  element.addEventListener("dblclick", function (e) {
    if (e.ctrlKey) {
      const doDelete = confirm("Do you want to delete this topic");
      if (doDelete) {
        deleteTopic(bookName, topicId, element);
      }
    }
  });
  element.addEventListener("click", function (e) {
    e.target.classList.toggle("topic-selected");
  });
  return element;
}

function updateTopic(bookName, topicId, newTopicName) {
  const topics = getTheBook(bookName).topics;
  const targetTopic = topics.filter((topic) => topic.topicId === topicId);
  targetTopic[0]["topicName"] = newTopicName;
  topicsContainer.querySelector(`.topic-${topicId}`).innerText = newTopicName;
  saveTopics(bookName, topics);
  console.log(bookName, topics);
}

function deleteTopic(bookName, topicId, topicElement) {
  const topics = getTheBook(bookName).topics;
  const remainTopics = topics.filter((topic) => topic.topicId !== topicId);
  saveTopics(bookName, remainTopics);
  topicsContainer.removeChild(topicElement);
  console.log(bookName, remainTopics);
}

//WHEN THE TOPIC NAME IS SELECTED TO WRITE ITS CONTENT
whiteSheet.addEventListener("change", function (e) {
  console.log(e);
  const bookName = bookTitle.innerText;
  const newContent = whiteSheet.innerText;
  updateContent(bookName, topicId, newContent);
});

function updateContent(bookName, topicId, newContent) {
  const topics = getTheBook(bookName).topics;
  const targetTopic = topics.filter((topic) => topic.topicId === topicId);
  targetTopic[0]["content"] = newContent;
  topicsContainer.querySelector(`.topic-${topicId}`).style.backgroundColor =
    "blue";
  console.log(bookName, targetTopic);
  // saveTopics(bookName, topics);
}

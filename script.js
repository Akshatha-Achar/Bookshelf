"use strict";
const landingPage = document.querySelector(".landing-page");
const openButton = document.querySelector("#open-button");
const allBooksSection = document.querySelector(".all-books-section");
const allBooksContainer = document.querySelector(".all-books-container");
const addBookButton = document.querySelector("#add-book");
const insideBookSection = document.querySelector(".inside-book-section");
const openBookButton = document.querySelector("#open-book");
const insideBookContainer = document.querySelector(".inside-book-container");
const bookTitle = document.querySelector(".book-title");
const topicTitle = document.querySelector(".topic-title");

const topicsContainer = document.querySelector(".topics-container");
const addTopicButton = document.querySelector(".add-topic");
const whiteSheet = document.querySelector(".white-sheet");
const deleteTopicButton = document.querySelector(".delete-topic");

//***************************************************
// LANDING PAGE

openButton.addEventListener("click", function () {
  landingPage.classList.add("hidden");
  allBooksSection.classList.remove("hidden");
});

//***************************************************
// ALL BOOKS PAGE

addBookButton.addEventListener("click", addBooks);

getAllBooks().forEach((book) => {
  const bookElement = createBook(book.id, book.bookName);
  allBooksContainer.insertBefore(bookElement, addBookButton);
});

function addBooks() {
  const books = getAllBooks();
  const bookNameValue = prompt("What is the book name:");
  if (bookNameValue) {
    const bookNameTrim = bookNameValue.trim();
    const bookObject = {
      id: Math.floor(Math.random() * 10000),
      bookName: bookNameTrim,
      topics: [],
    };

    const bookElement = createBook(bookObject.id, bookObject.bookName);
    allBooksContainer.insertBefore(bookElement, addBookButton);
    books.push(bookObject);
    saveBooks(books);
  } else if (bookNameValue === "") {
    alert("Book Name should not be empty..Try again.");
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
  allBooksContainer.removeChild(book);
}

//***************************************************
// INSIDE BOOK PAGE

openBookButton.addEventListener("click", openBook);

function openBook() {
  const bookNameInput = prompt("Write the book Name to open:").trim();
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
    alert(`"${bookNameInput}" book doesn't exist. Try Again..😓`);
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
    console.log(e.target.value);
    const newTopicName = e.target.value.trim();
    updateTopic(bookName, topicId, newTopicName);
  });

  element.addEventListener("click", function (e) {
    topicTitle.innerText = e.target.value;
    const clickedElements = document.querySelectorAll(".topic-selected");
    if (clickedElements !== []) {
      clickedElements.forEach((element) =>
        element.classList.remove("topic-selected")
      );
    }
    e.target.classList.toggle("topic-selected");
    whiteSheet.value = getTheBook(bookName).topics.filter(
      (topic) => topic.topicId === topicId
    )[0].content;
    console.log(`Topic-Name: ${element.value}\n Content: ${whiteSheet.value}`);
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

//WHEN THE TOPIC NAME IS SELECTED TO WRITE ITS CONTENT
whiteSheet.addEventListener("change", function (e) {
  const selectedElement = topicsContainer.querySelector(".topic-selected");
  console.log(selectedElement);
  if (!selectedElement) {
    alert("Please select the topic Name form the topic list...");
  } else {
    const bookName = bookTitle.innerText;
    const topicName = selectedElement.value;
    const newContent = e.target.value.trimEnd();
    console.log(getTheBook(bookName).topics);
    updateContent(bookName, topicName, newContent);
    console.log(`Topic-Name: ${topicName}\n NewContent: ${newContent}`);
  }
});

function updateContent(bookName, topicName, newContent) {
  const topics = getTheBook(bookName).topics;
  const targetTopic = topics.filter((topic) => topic.topicName === topicName);
  targetTopic[0]["content"] = newContent;
  saveTopics(bookName, topics);
}

//WHEN YOU CLICK DELETE TOPIC BUTTON

deleteTopicButton.addEventListener("click", deleteTopic);

function deleteTopic() {
  const bookName = bookTitle.innerText;
  const topicNameUI = prompt("Write the Topic Name to DELETE:").trim();
  const topics = getTheBook(bookName).topics;
  const topicRequired = topics.filter(
    (topic) => topic["topicName"] === topicNameUI
  );
  if (!topicRequired[0]) {
    alert("Incorrect Topic Name...Try again...");
  } else {
    const id = topicRequired[0].topicId;
    const topicElement = topicsContainer.querySelector(`.topic-${id}`);
    const remainTopics = topics.filter((topic) => topic.topicId !== id);

    saveTopics(bookName, remainTopics);
    topicsContainer.removeChild(topicElement);
    whiteSheet.value = "";
    topicTitle.innerText = "";
  }
}

//  const colors= [background: #ff757d,background: #5bceac,background: #ffac75,background: #bfb553, background: #4fdb72,background: #bc99ec,background: #5cc2c8]

//******************* */
// for Testing
// const bookNameInput = "Maths";
// const book = getTheBook(bookNameInput);
// allBooksSection.classList.add("hidden");
// insideBookSection.classList.remove("hidden");
// bookTitle.innerText = book.bookName;

// book["topics"].forEach((topic) => {
//   const topicElement = createTopic(
//     book.bookName,
//     topic.topicId,
//     topic.topicName
//   );
//   topicsContainer.insertBefore(topicElement, addTopicButton);
// });
//****************** */

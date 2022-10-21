"use strict";
let search = document.getElementById("searchFilm");
let inputForm = document.forms.form;
let input = inputForm.inputSearch;
let radioForm = document.forms.radioPart;
let answer;
let resultWrap = document.querySelector(".resultSearch");
let message = document.createElement("div");
let radio = null;
let list;
let liWrap;
let details;
let buttonWrap;
let previousPage;
let page;
let amount;
let nextPage;
let currentPage = 1;
let info;

search.addEventListener("click", clickSearch);
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    clickSearch();
  }
});

for (let i = 0; i < radioForm.length; i++) {
  radioForm[i].addEventListener("change", function () {
    radio = this.value;
    console.log(radio);
  });
}

let status = function (response) {
  if (response.status !== 200) {
    return Promise.reject(new Error(response.statusText));
  }
  return Promise.resolve(response);
};
let json = function (response) {
  return response.json();
};

function clickSearch(currentPage) {
  let searchQuery = input.value;
  if (searchQuery != "") {
    fetch(
      `https://www.omdbapi.com/?s=${searchQuery}&type=${radio}&page=${currentPage}&apikey=465e935e&`
    )
      .then(status)
      .then(json)
      .then(function (response) {
        if (response.Search == null) {
          showMessage();
        } else {
          answer = response.Search;
          showMoviesList(answer);
          if (response.totalResults > 10) {
            createButtonResults(response.totalResults);
          }
        }
      });
    search.after(resultWrap);
  }
}

function showMessage() {
  removeResult();
  message.style.marginLeft = "15px";
  message.style.color = "red";
  message.innerHTML = "Movie not found!";
  resultWrap.prepend(message);
}

function showMoviesList(arr) {
  removeResult();
  list = document.createElement("ul");
  arr.forEach((item, index) => {
    resultWrap.prepend(list);
    liWrap = document.createElement("div");
    list.append(liWrap);
    let li = document.createElement("li");
    li.style.marginLeft = "15px";
    li.style.marginTop = "30px";
    li.innerText = `${(currentPage - 1) * 10 + (1 + index)}. ${item.Title}`;
    liWrap.prepend(li);
    details = document.createElement("button");
    details.id = `id = ${index}`;
    li.after(details);
    applyStyle(details);
    details.innerHTML = "DETAILS";
    list.addEventListener("click", clickDetailsMovie);
  });
}

function createButtonResults(number) {
  buttonWrap = document.createElement("div");
  buttonWrap.style.cssText = `
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 15px;
  `;
  list.after(buttonWrap);
  previousPage = document.createElement("div");
  applyStyle(previousPage);
  previousPage.style.background = "orange";
  buttonWrap.prepend(previousPage);
  previousPage.innerHTML = "pre page";
  previousPage.id = "-1";
  nextPage = document.createElement("div");
  applyStyle(nextPage);
  nextPage.style.background = "orange";
  buttonWrap.append(nextPage);
  nextPage.innerHTML = "next page";
  nextPage.id = "-2";
  amount = Math.ceil(number * 0.1);

  for (let i = 1; i <= amount; i++) {
    page = document.createElement("div");
    applyStyle(page);
    nextPage.before(page);
    page.innerHTML = i;
    page.id = i;
  }
  buttonWrap.addEventListener("click", changePage);
}

function applyStyle(element) {
  element.style.cssText = `
  min-width: 100px;
min-height: 30px;
border: 2px solid orange;
border-radius: 10px;
margin:15px;
text-align: center; `;
}

function changePage(event) {
  let idButton = Number(event.target.id);
  if (idButton === -1 && currentPage === 1) {
  } else if (idButton === -2 && currentPage === amount) {
  } else if (idButton === -1 && currentPage > 1) {
    console.log("click", currentPage);
    currentPage = currentPage - 1;
    clickSearch(currentPage);
  } else if (idButton === -2 && currentPage < amount) {
    console.log("click", currentPage);
    currentPage = currentPage + 1;
    clickSearch(currentPage);
  } else {
    removeResult();
    currentPage = idButton;
    clickSearch(currentPage);
  }
}

function clickDetailsMovie(event) {
  if (event.target.tagName === "BUTTON") {
    let idMovie = event.target.id;
    let numberMovie = Number(idMovie.slice(4));
    let obj = answer[numberMovie];
    let titleMovie = obj.Title;
    let typeMovie = obj.Type;
    let yearMovie = obj.Year;
    let posterMovie = obj.Poster;
    showDetailsMovie(titleMovie, typeMovie, yearMovie, posterMovie);
  }
}

function showDetailsMovie(title, type, year, poster) {
  if (info != null) {
    info.remove();
  }

  info = document.createElement("div");
  info.style.background = "#2323";
  resultWrap.after(info);

  let titleDiv = document.createElement("div");
  titleDiv.innerHTML = `Title: ${title}`;
  titleDiv.style.margin = "15px";
  info.append(titleDiv);
  let typeDiv = document.createElement("div");
  typeDiv.innerHTML = `Type: ${type}`;
  typeDiv.style.margin = "15px";
  info.append(typeDiv);
  let yearDiv = document.createElement("div");
  yearDiv.innerHTML = `Year: ${year}`;
  yearDiv.style.margin = "15px";
  info.append(yearDiv);
  if (poster != "N/A") {
    let posterImg = document.createElement("img");
    posterImg.src = poster;
    info.append(posterImg);
    posterImg.style.margin = "15px";
  }

  let elem = document.createElement("div");
  info.append(elem);
  setTimeout(() => elem.scrollIntoView(), 500);
 }


function removeResult() {
  if (list != null) {
    list.remove();
  }
  if (buttonWrap != null) {
    buttonWrap.remove();
  }
  if (info != null) {
    info.remove();
  }
  if (message != null) {
    message.remove();
  }
}

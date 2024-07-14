/// <reference types="../@types/jquery"/>

const search = document.getElementById("search");
const categories = document.getElementById("categories");
const area = document.getElementById("area");
const ingredients = document.getElementById("ingredients");
const contact = document.getElementById("contactUs");
const searchContainer = document.getElementById("searchContainer");
const rowData = document.getElementById("rowData");

$(window).on("load", function () {
  closeNav();
});


/*  Navbar  */
const navTapWidth = $(".nav-tap").innerWidth();

function closeNav() {
  $(".navigation").animate({ left: -navTapWidth }, 800);
  $(".navLinks li").animate({ top: 300 }, 1000);
  $(".open-close-icon").removeClass("fa-x").addClass("fa-bars");
  isOpen = false;
}
let isOpen = false;

$(".open-close-nav").on("click", function () {
  let status;

  if (!isOpen) {
    status = 0;
    $(".open-close-nav").removeClass("fa-bars").addClass("fa-x");
    for (let i = 0; i < 5; i++) {
      $(".navLinks li").eq(i).animate({ top: 0 }, (i + 5) * 100);
    }
  } else {
    status = -navTapWidth;
    $(".open-close-nav").removeClass("fa-x").addClass("fa-bars");
    $(".navLinks li").animate({ top: 300 }, 500);
  }

  isOpen = !isOpen;
  $(".navigation").animate({ left: status }, 500);
});

$("#search, #categories, #area, #ingredients, #contactUs").on(
  "click",
  function (e) {
    e.preventDefault();
    closeNav();
    $(".open-close-nav").removeClass("fa-x").addClass("fa-bars");
  }
);


/*  Meals  */
async function getMeals() {
  rowData.innerHTML = "";
  searchContainer.classList.add("d-none");
   $(".loading").removeClass("d-none").fadeIn();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s`
  );
  let data = await response.json();
  $(".loading").addClass("d-none").fadeOut();
  showMeals(data.meals);
}

(function () {
  getMeals();
})();

function showMeals(data) {
  let container = "";
  for (let i = 0; i < data.length; i++) {
    container += `
  <div class="col-md-3">
    <div onclick="getMealDetails('${data[i].idMeal}')" class="meal position-relative overflow-hidden curser-pointer">
      <img  src="${data[i].strMealThumb}" alt="${data[i].strMeal}" class=" w-100 rounded-2">
      <div  class="layer d-flex align-items-center position-absolute rounded-2 ">
        <h3 >${data[i].strMeal}</h3>
      </div>
    </div>
     
  </div>

  `;
  }
  rowData.innerHTML = container;
}

async function getMealDetails(mealDetail) {
  rowData.innerHTML = "";
   $(".loading").removeClass("d-none").fadeIn();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealDetail}`
  );
  let data = await response.json();
  $(".loading").addClass("d-none").fadeOut();
  showMealDetails(data.meals[0]);
}

function showMealDetails(meal) {
  let container = `
  <div class="col-md-4">
                    <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                        alt="${meal.strMeal}">
                        <h2>${meal.strMeal}</h2>
                </div>
                <div class="col-md-8">
                    <h2>Instructions</h2>
                    <p>${meal.strInstructions}</p>
                    <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                    <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                    <h3>Recipes :</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap" id="receipes">
                        
                    </ul>
    
                    <h3>Tags :</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap" id="tags">
                       
                    </ul>
    
                    <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                    <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
                </div>
  `;

  rowData.innerHTML = container;
  searchContainer.classList.add("d-none");

  var ul = "";
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`] !== "") {
      ul += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${
        meal[`strIngredient${i}`]
      }</li>`;
    }
  }
  $("#receipes").html(ul);

  let tags = meal.strTags?.split(",");
  if (!tags) {
    tags = [];
  }

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  $("#tags").html(tagsStr);
}

 /* Category */ 
async function getCategories() {
  rowData.innerHTML = "";
   $(".loading").removeClass("d-none").fadeIn();
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let data = await response.json();
  $(".loading").addClass("d-none").fadeOut();
  showCategories(data.categories);
}

async function getCategoryMeals(category) {
  rowData.innerHTML = "";
   $(".loading").removeClass("d-none").fadeIn();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let data = await response.json();
  $(".loading").addClass("d-none").fadeOut();

  showMeals(data.meals.slice(0, 20));
}

function showCategories(Category) {
  let container = "";

  for (let i = 0; i < Category.length; i++) {
    container += `
  <div class="col-lg-3 overflow-hidden ">
    <div onclick="getCategoryMeals('${
      Category[i].strCategory
    }')" class="meal position-relative overflow-hidden  curser-pointer">
      <img  src="${Category[i].strCategoryThumb}" alt="${
      Category[i].strCategory
    }" class=" w-100 rounded-2">
      <div  class="layer position-absolute rounded-2 text-center">
        <h3 >${Category[i].strCategory}</h3>
        <p >${Category[i].strCategoryDescription
          .split(" ")
          .slice(0, 20)
          .join(" ")}</p>
      </div>
    </div>
     
  </div>
  `;
  }
  rowData.innerHTML = container;
  searchContainer.classList.add("d-none");
}

$("#categories").on("click", function (e) {
  e.preventDefault();
  getCategories();
});

/*  Area */
async function getArea() {
  rowData.innerHTML = "";
   $(".loading").removeClass("d-none").fadeIn();
  searchContainer.classList.add("d-none");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await response.json();
  $(".loading").addClass("d-none").fadeOut();
  showArea(data.meals);
}

async function showAreaMeals(area) {
   $(".loading").removeClass("d-none").fadeIn();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let data = await response.json();
  $(".loading").addClass("d-none").fadeOut();
  showMeals(data.meals.slice(0, 20));
}

function showArea(arr) {
  let container = "";

  for (let i = 0; i < arr.length; i++) {
    container += `
    <div class="col-md-3">
    <div onclick="showAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center curser-pointer">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3>${arr[i].strArea}</h3>
    </div>
    </div>
    `;
  }

  rowData.innerHTML = container;
}

$("#area").on("click", function (e) {
  e.preventDefault();
  getArea();
});


/*  Ingredients */
async function getIngredients() {
  rowData.innerHTML = "";
   $(".loading").removeClass("d-none").fadeIn();
  searchContainer.classList.add("d-none");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await response.json();
  $(".loading").addClass("d-none").fadeOut();
  showIngredients(data.meals.slice(0, 20));
}

async function getIngredientsMeals(ingredients) {
   $(".loading").removeClass("d-none").fadeIn();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  let data = await response.json();
  $(".loading").addClass("d-none").fadeOut();
  showMeals(data.meals.slice(0, 20));
}

function showIngredients(ingData) {
  let container = "";

  for (let i = 0; i < ingData.length; i++) {
    container += `
    <div class="col-md-3">
                <div onclick="getIngredientsMeals('${
                  ingData[i].strIngredient
                }')" class="rounded-2 text-center curser-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ingData[i].strIngredient}</h3>
                        <p>${ingData[i].strDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                </div>
        </div>
    `;
  }

  rowData.innerHTML = container;
}

$("#ingredients").on("click", function (e) {
  e.preventDefault();
  getIngredients();
});


/*  Search  */
async function getMealByName(searchMeal) {
  rowData.innerHTML = "";
   $(".loading").removeClass("d-none").fadeIn();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchMeal}`
  );
  let data = await response.json();
  data.meals ? showMeals(data.meals) : showMeals([]);
  $(".loading").addClass("d-none").fadeOut();
}

async function getMealByLett(searcMeal) {
  rowData.innerHTML = "";
   $(".loading").removeClass("d-none").fadeIn();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${searcMeal}`
  );
  let data = await response.json();
  $(".loading").addClass("d-none").fadeOut();
  data.meals ? showMeals(data.meals) : showMeals([]);
}

function showSearchInp() {
  rowData.innerHTML = "";
  let searchEle = `
  <div class="col-md-6 ">
      <input id="searchByName" class="form-control text-white bg-transparent" type="text" placeholder="Search By Name">
  </div>
  <div class="col-md-6">
      <input id="searchByLett" class="form-control text-white bg-transparent" type="text" placeholder="Search By First Letter"  maxlength="1">
  </div>
  `;
  searchContainer.classList.remove("d-none");
  searchContainer.innerHTML = searchEle;

  $("#searchByName").on("input", function () {
    let search = $("#searchByName").val();
    getMealByName(search);
  });

  $("#searchByLett").on("input", function () {
    let search = $("#searchByLett").val();
    if(search !==''){getMealByLett(search)};
  });
}

$("#search").on("click", function (e) {
  e.preventDefault();
  showSearchInp();
});


/*  Contact  */
function showContact() {
  searchContainer.classList.add("d-none");
  const container = `
    <div class="contact-us min-vh-100 d-flex justify-content-center align-items-center">
      <div class="container-fluid w-75 text-center">
          <div class="row g-4">
              <div class="col-md-6">
                  <input id="nameInput" oninput="validateInputs()" type="text" class="form-control" placeholder="Enter Your Name">
                  <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Special characters and numbers not allowed
                  </div>
              </div>
              <div class="col-md-6">
                  <input id="emailInput" oninput="validateInputs()" type="email" class="form-control" placeholder="Enter Your Email">
                  <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Email not valid *example@yyy.zzz
                  </div>
              </div>
              <div class="col-md-6">
                  <input id="phoneInput" oninput="validateInputs()" type="text" class="form-control" placeholder="Enter Your Phone">
                  <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Enter valid Phone Number
                  </div>
              </div>
              <div class="col-md-6">
                  <input id="ageInput" oninput="validateInputs()" type="number" class="form-control" placeholder="Enter Your Age">
                  <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Enter valid age
                  </div>
              </div>
              <div class="col-md-6">
                  <input id="passwordInput" oninput="validateInputs()" type="password" class="form-control" placeholder="Enter Your Password">
                  <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Enter valid password *Minimum eight characters, at least one letter and one number:*
                  </div>
              </div>
              <div class="col-md-6">
                  <input id="repasswordInput" oninput="validateInputs()" type="password" class="form-control" placeholder="Repassword">
                  <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Enter valid repassword 
                  </div>
              </div>
          </div>
          <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
      </div>
    </div> 
  `;

  rowData.innerHTML = container;

  $("#nameInput").on("input", function () {
    nameInputFocused = true;
  });

  $("#emailInput").on("input", function () {
    emailInputFocused = true;
  });

  $("#phoneInput").on("input", function () {
    phoneInputFocused = true;
  });

  $("#ageInput").on("input", function () {
    ageInputFocused = true;
  });

  $("#passwordInput").on("input", function () {
    passwordInputFocused = true;
  });

  $("#repasswordInput").on("input", function () {
    repasswordInputFocused = true;
  });
}

let nameInputFocused = false;
let emailInputFocused = false;
let phoneInputFocused = false;
let ageInputFocused = false;
let passwordInputFocused = false;
let repasswordInputFocused = false;

function validateInputs() {
  if (nameInputFocused) {
    if (nameValidation() == false) {
      $("#nameAlert").removeClass("d-none");
    } else {
      $("#nameAlert").addClass("d-none");
    }
  }

  if (emailInputFocused) {
    if (emailValidation() == false) {
      $("#emailAlert").removeClass("d-none");
    } else {
      $("#emailAlert").addClass("d-none");
    }
  }

  if (phoneInputFocused) {
    if (phoneValidation() == false) {
      $("#phoneAlert").removeClass("d-none");
    } else {
      $("#phoneAlert").addClass("d-none");
    }
  }

  if (ageInputFocused) {
    if (ageValidation() == false) {
      $("#ageAlert").removeClass("d-none");
    } else {
      $("#ageAlert").addClass("d-none");
    }
  }

  if (passwordInputFocused) {
    if (passwordValidation() == false) {
      $("#passwordAlert").removeClass("d-none");
    } else {
      $("#passwordAlert").addClass("d-none");
    }
  }

  if (repasswordInputFocused) {
    if (repasswordValidation() == false) {
      $("#repasswordAlert").removeClass("d-none");
    } else {
      $("#repasswordAlert").addClass("d-none");
    }
  }

  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    $("#submitBtn").removeAttr("disabled");
  } else {
    $("#submitBtn").attr("disabled", true);
  }
}

function nameValidation() {
  return (/^[a-zA-Z\s]+$/.test($("#nameInput").val()));
}

function emailValidation() {
  return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($("#emailInput").val()));
}

function phoneValidation() {
  return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test($("#phoneInput").val()));
}

function ageValidation() {
  return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test($("#ageInput").val()));
}

function passwordValidation() {
  return (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test($("#passwordInput").val()));
}

function repasswordValidation() {
  return $("#repasswordInput").val() === $("#passwordInput").val();
}

$("#contactUs").on("click", function(e){
  e.preventDefault();
  showContact();
});

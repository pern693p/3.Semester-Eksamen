const chosen = [];

document.querySelectorAll(".duck").forEach(duck => {
  duck.addEventListener("click", clickedDuck);
});

function clickedDuck() {
  if (chosen.length < 3) {
    this.classList.add("chosen");
  }

  const number = Math.floor(Math.random() * 4) + 1;

  if (number < 1) {
    chosen.push(25);
  } else if (number < 2) {
    chosen.push(50);
  } else if (number < 3) {
    chosen.push(75);
  } else if (number < 4) {
    chosen.push(100);
  }

  showChosenDuck();
}

function showChosenDuck() {
  if (chosen.length == 1) {
    document.querySelector(".first p").textContent = `${chosen[0]}`;
    document.querySelector(".first .chosenduck").style.backgroundColor = "black";
  } else if (chosen.length == 2) {
    document.querySelector(".second p").textContent = `${chosen[1]}`;
    document.querySelector(".second .chosenduck").style.backgroundColor = "black";
  } else if (chosen.length == 3) {
    document.querySelector(".third p").textContent = `${chosen[2]}`;
    document.querySelector(".third .chosenduck").style.backgroundColor = "black";
  } else if (chosen.length > 3) {
    console.log("alle ænder valgt");
  }
}

hello 
const chosen = [];

window.addEventListener("DOMContentLoaded", loadSVGS);

document.addEventListener("DOMContentLoaded", start);

function start() {
  setTimeout(hideLoading, 4000);

  document.querySelector(".right").addEventListener("transitionend", () => {
    document.querySelector(".tent_top").classList.add("gone");
  });
}

function hideLoading() {
  document.querySelector(".left").classList.add("slide_out_left");
  document.querySelector(".right").classList.add("slide_out_right");
  document.querySelector(".loading_ducks").classList.add("fade_out");
  document.querySelector(".loading_ducks").addEventListener("transitionend", () => {
    document.querySelector(".loading_ducks").classList.add("gone");

    document.querySelector(".play_button").addEventListener("click", startGame);
  });
  document.querySelector(".right").addEventListener("transitionend", () => {
    document.querySelector(".curtain").classList.add("gone");
  });
}

function startGame() {
  document.querySelector(".startscreen").classList.add("gone");

  document.querySelector(".ripple").classList.remove("gone");
  document.querySelector(".ducks").classList.remove("gone");
  document.querySelectorAll(".duck").forEach(duck => {
    duck.addEventListener("click", clickedDuck);
  });
}

function clickedDuck() {
  this.classList.add("gone");

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
  if (chosen.length === 1) {
    document.querySelector(".first p").textContent = `${chosen[0]} kr`;
    document.querySelector(".first .chosenduck").style.backgroundPosition = "100% 0";
  } else if (chosen.length === 2) {
    document.querySelector(".second p").textContent = `${chosen[1]} kr`;
    document.querySelector(".second .chosenduck").style.backgroundPosition = "100% 0";
  } else if (chosen.length === 3) {
    document.querySelector(".third p").textContent = `${chosen[2]} kr`;
    document.querySelector(".third .chosenduck").style.backgroundPosition = "100% 0";
  } else if (chosen.length > 3) {
    console.log("alle ænder valgt");
  }

  if (chosen.length) {
    setTimeout(function() {
      formOverlay();
    }, 2000);
  }
}

function formOverlay() {
  document.querySelector(".inputFields").classList.remove("hide");

  if (chosen.length == 1) {
    document.querySelector(".email").classList.remove("hide");
  } else if (chosen.length == 2) {
    document.querySelector(".username").classList.remove("hide");
  } else if (chosen.length == 3) {
    document.querySelector(".regi").classList.remove("hide");
  }

  document.querySelectorAll("form").forEach(el => {
    el.addEventListener("submit", function(event) {
      document.querySelector(".inputFields").classList.add("hide");
      event.preventDefault();
      if (chosen.length == 1) {
        document.querySelector(".email").classList.add("hide");
      } else if (chosen.length == 2) {
        document.querySelector(".username").classList.add("hide");
      } else if (chosen.length == 3) {
        document.querySelector(".regi").classList.add("hide");
      }
    });
  });
}

async function loadSVGS() {
  const edgeSvg = await fetch("/assets/edge.svg");
  const edge = await edgeSvg.text();

  document.querySelector(".edge").innerHTML = edge;
}

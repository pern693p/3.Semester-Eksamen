/* Babel laver moderne javascript om til gammel javascript så alle browsere kan køre det. */
/* import "babel-polyfill"; */

const chosen = [];
const emailAndUsernameRegistrationForm = document.querySelector("form#email_and_username_registration");
const fullUserRegistrationForm = document.querySelector("form#full_user_registration");
let currentID = 0;

window.addEventListener("DOMContentLoaded", loadSVGS);
window.addEventListener("DOMContentLoaded", start);

function start() {
  setTimeout(hideLoading, 4000);

  document.querySelector(".curtain__panel--right").addEventListener("transitionend", () => {
    document.querySelector(".curtain__top").classList.add("hide");
    document.querySelector(".curtain").classList.add("hide");
  });
}

function hideLoading() {
  document.querySelector(".curtain__panel--left").classList.add("slide_out_left");
  document.querySelector(".curtain__panel--right").classList.add("slide_out_right");
  document.querySelector(".curtain__loading_ducks").classList.add("fade_out");
  document.querySelector(".curtain__loading_ducks").addEventListener("transitionend", () => {
    document.querySelector(".curtain__loading_ducks").classList.add("hide");
    document.querySelector(".play_button").addEventListener("click", startGame);
  });
}

function startGame() {
  document.querySelector("#bgmusic").play();
  document.querySelector(".duckpond__welcome_screen").classList.add("hide");
  document.querySelector(".ducks").classList.remove("hide");
  document.querySelectorAll(".duck").forEach(duck => {
    duck.addEventListener("click", clickedDuck);
  });
}

function clickedDuck() {
  document.querySelector("#ducksound").play();
  document.querySelector("#coinsound").play();
  this.classList.add("hide");
  let number = Math.floor(Math.random() * 4);

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
    }, 500);
  }
}

function formOverlay() {
  document.querySelector(".form_overlay").classList.remove("hide");

  if (chosen.length === 1) {
    emailAndUsernameRegistrationForm.querySelector(".email").classList.remove("hide");
    emailAndUsernameRegistrationForm.elements.email.required = true;

    document.querySelector("input.email_submit").addEventListener("click", async function(event) {
      event.preventDefault();

      if (await checkEmail(emailAndUsernameRegistrationForm.elements.email.value)) {
        alert("Denne email er allerede i brug. Har du glemt din adgangskode kan du få hjælp på support@karnevalspil.dk");
      } else {
        document.querySelector(".form_overlay").classList.add("hide");
        emailAndUsernameRegistrationForm.querySelector(".input.email").classList.add("hide");
        emailAndUsernameRegistrationForm.elements.email.required = false;
      }
    });
  } else if (chosen.length === 2) {
    emailAndUsernameRegistrationForm.querySelector(".username").classList.remove("hide");
    emailAndUsernameRegistrationForm.elements.name.required = true;

    document.querySelector("input.username_submit").addEventListener("click", async function(event) {
      event.preventDefault();
      await postHalf().then(b => (currentID = b._id));

      document.querySelector(".form_overlay").classList.add("hide");
      emailAndUsernameRegistrationForm.querySelector(".username").classList.add("hide");
      emailAndUsernameRegistrationForm.elements.name.required = false;
    });
  } else if (chosen.length === 3) {
    fullUserRegistrationForm.classList.remove("hide");
    emailAndUsernameRegistrationForm.classList.add("hide");
    fullUserRegistrationForm.querySelector("#username").setAttribute("value", emailAndUsernameRegistrationForm.elements.name.value);
    fullUserRegistrationForm.querySelector("#email").setAttribute("value", emailAndUsernameRegistrationForm.elements.email.value);

    let sum = calculateSum();
    fullUserRegistrationForm.querySelector("input#credit").setAttribute("value", sum);

    fullUserRegistrationForm.querySelector(".register_user_submit").addEventListener("click", async function(event) {
      await postFull(sum);
      event.preventDefault();
      await deleteBruger(currentID);
      window.location.href = "karnevalspil.html";
    });
  }

  async function deleteBruger(id) {
    await fetch(`https://eksamenhalvt-0223.restdb.io/rest/brugere/${id}`, {
      method: "delete",
      headers: {
        "content-type": "application/json; charset=utf-8",
        "x-apikey": "5de81a1d4658275ac9dc22e2",
        "cache-control": "no-cache"
      }
    })
      .then(res => res.json())
      .then(d => {});
  }

  function calculateSum() {
    const sum = chosen.reduce(add, 0);
    function add(accumulator, a) {
      return accumulator + a;
    }
    return sum;
  }
}

async function checkEmail(nyBruger) {
  return (
    (await fetch("https://eksamenhalvt-0223.restdb.io/rest/brugere", {
      //halve brugere
      method: "get",
      headers: {
        "Content-Type": "application/json; charset=uft-8",
        "x-apikey": "5de81a1d4658275ac9dc22e2",
        "cache-control": "no-cache"
      }
    })
      .then(e => e.json())
      .then(brugere => {
        return brugere.filter(bruger => bruger.email === nyBruger).length > 0;
      })) ||
    (await fetch("https://eksamen-f310.restdb.io/rest/brugere", {
      //fulde brugere
      method: "get",
      headers: {
        "Content-Type": "application/json; charset=uft-8",
        "x-apikey": "5de4cc954658275ac9dc2176",
        "cache-control": "no-cache"
      }
    })
      .then(e => e.json())
      .then(brugere => {
        return brugere.filter(bruger => bruger.email === nyBruger).length > 0;
      }))
  );
}

async function postHalf() {
  const postData = {
    name: emailAndUsernameRegistrationForm.elements.name.value,
    email: emailAndUsernameRegistrationForm.elements.email.value
  };
  return await fetch("https://eksamenhalvt-0223.restdb.io/rest/brugere", {
    method: "post",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-apikey": "5de81a1d4658275ac9dc22e2",
      "cache-control": "no-cache"
    },
    body: JSON.stringify(postData)
  })
    .then(res => res.json())
    .then(data => {
      return data;
    });
}

async function postFull(sum) {
  const data = {
    cpr: fullUserRegistrationForm.elements.cpr.value,
    name: fullUserRegistrationForm.elements.firstname.value,
    lastname: fullUserRegistrationForm.elements.lastname.value,
    username: fullUserRegistrationForm.elements.username.value,
    mobile: fullUserRegistrationForm.elements.mobile.value,
    address: fullUserRegistrationForm.elements.address.value,
    email: fullUserRegistrationForm.elements.email.value,
    estimated: sum
  };

  await fetch("https://eksamen-f310.restdb.io/rest/brugere", {
    method: "post",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-apikey": "5de4cc954658275ac9dc2176",
      "cache-control": "no-cache"
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => {
      return data;
    });
}

async function loadSVGS() {
  const edgeSvg = await fetch("assets/edge.svg");
  const edge = await edgeSvg.text();
  document.querySelector(".duckpond__edge").innerHTML = edge;
}

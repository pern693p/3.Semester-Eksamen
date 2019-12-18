const chosen = [];
const halfform = document.querySelector("form#addHalf");
const fullform = document.querySelector("form.regi");
let currentID = 0;

window.addEventListener("DOMContentLoaded", loadSVGS);

window.addEventListener("DOMContentLoaded", start);

function start() {
  document.querySelector("#bgmusic").play();
  setTimeout(hideLoading, 4000);

  document.querySelector(".right").addEventListener("transitionend", () => {
    document.querySelector(".tent_top").classList.add("gone");
    document.querySelector(".curtain").classList.add("gone");
  });
}

function hideLoading() {
  document.querySelector(".left").classList.add("slide_out_left");
  document.querySelector(".right").classList.add("slide_out_right");
  document.querySelector(".loading_ducks").classList.add("fade_out");
  document
    .querySelector(".loading_ducks")
    .addEventListener("transitionend", () => {
      document.querySelector(".loading_ducks").classList.add("gone");

      document
        .querySelector(".play_button")
        .addEventListener("click", startGame);
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
  document.querySelector("#ducksound").play();
  document.querySelector("#coinsound").play();
  this.classList.add("gone");

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
    document.querySelector(".first .chosenduck").style.backgroundPosition =
      "100% 0";
  } else if (chosen.length === 2) {
    document.querySelector(".second p").textContent = `${chosen[1]} kr`;
    document.querySelector(".second .chosenduck").style.backgroundPosition =
      "100% 0";
  } else if (chosen.length === 3) {
    document.querySelector(".third p").textContent = `${chosen[2]} kr`;
    document.querySelector(".third .chosenduck").style.backgroundPosition =
      "100% 0";
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

  if (chosen.length === 1) {
    document.querySelector(".email").classList.remove("hide");
    halfform.elements.email.required = true;

    document
      .querySelector(".submitHalfEmail")
      .addEventListener("click", async function(event) {
        event.preventDefault();

        if (await checkEmail(halfform.elements.email.value)) {
          alert(
            "Denne email er allerede i brug. Har du glemt din adgangskode kan du få hjælp på support@karnevalspil.dk"
          );
        } else {
          document.querySelector(".inputFields").classList.add("hide");
          document.querySelector(".email").classList.add("hide");
          halfform.elements.email.required = false;
        }
      });
  } else if (chosen.length === 2) {
    document.querySelector(".username").classList.remove("hide");
    halfform.elements.name.required = true;

    document
      .querySelector(".submitHalfName")
      .addEventListener("click", async function(event) {
        event.preventDefault();
        await postHalf().then(b => (currentID = b._id));

        document.querySelector(".inputFields").classList.add("hide");
        document.querySelector(".username").classList.add("hide");
        halfform.elements.name.required = false;
      });
  } else if (chosen.length === 3) {
    document.querySelector(".regi").classList.remove("hide");

    document
      .querySelector("#username")
      .setAttribute("value", halfform.elements.name.value);
    document
      .querySelector("#emailfull")
      .setAttribute("value", halfform.elements.email.value);

    let sum = calculateSum();

    document.querySelector(".money div").textContent = `${sum} kr.`;

    document
      .querySelector(".mainSiteLink")
      .addEventListener("click", async function(event) {
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
    name: halfform.elements.name.value,
    email: halfform.elements.email.value
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
    cpr: fullform.elements.cpr.value,
    name: fullform.elements.firstname.value,
    lastname: fullform.elements.lastname.value,
    username: fullform.elements.username.value,
    mobile: fullform.elements.mobile.value,
    address: fullform.elements.address.value,
    gender: fullform.elements.sex.value,
    email: fullform.elements.email.value,
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
  const edgeSvg = await fetch("/assets/edge.svg");
  const edge = await edgeSvg.text();

  document.querySelector(".edge").innerHTML = edge;
}

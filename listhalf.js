document.addEventListener("DOMContentLoaded", get);
let users = [];

function closeform(id) {
  document.querySelectorAll(".liste").forEach(e => {
    if (e.dataset.listeid === id) {
      e.querySelector("#form").classList.add("gone");
      e.querySelector(".user").classList.remove("gone");
    }
  });
}

function get() {
  fetch("https://eksamenhalvt-0223.restdb.io/rest/brugere", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=uft-8",
      "x-apikey": "5de81a1d4658275ac9dc22e2",
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(brugere => {
      users = brugere;
      addUserToTheDOM();
    });
}

function addUserToTheDOM() {
  users.forEach(user => {
    const template = document.querySelector("template").content;
    const copy = template.cloneNode(true);

    copy.querySelector("article.liste").dataset.listeid = user._id;

    copy.querySelector("h1").textContent = `Navn: ${user.name}`;
    copy.querySelector("h2").textContent = `Email: ${user.email}`;

    copy.querySelector("button.btnDelete").addEventListener("click", e => {
      const target = e.target.closest("article");
      target.classList.add("gone");
      deleteUser(user._id);
    });

    copy.querySelector("button.btnEdit").addEventListener("click", e => {
      fetchAndPopulate(user._id);
    });

    document.querySelector("#app").prepend(copy);
  });
}

function fetchAndPopulate(id) {
  document.querySelectorAll(".liste").forEach(e => {
    if (e.dataset.listeid === id) {
      e.querySelector("#form").classList.remove("gone");
      e.querySelector(".user").classList.add("gone");

      fetch(`https://eksamenhalvt-0223.restdb.io/rest/brugere/${id}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json; charset=uft-8",
          "x-apikey": "5de81a1d4658275ac9dc22e2",
          "cache-control": "no-cache"
        }
      })
        .then(a => a.json())
        .then(bruger => {
          e.querySelector("#editForm").elements.name.value = bruger.name;
          e.querySelector("#editForm").elements.email.value = bruger.email;
        });

      e.addEventListener("submit", evt => {
        evt.preventDefault();

        put(e, id);
      });
    }
  });
}

function put(e, id) {
  const data = {
    name: e.querySelector("#editForm").elements.name.value,
    email: e.querySelector("#editForm").elements.email.value
  };

  closeform(id);

  fetch(
    `https://eksamenhalvt-0223.restdb.io/rest/brugere/${e.dataset.listeid}`,
    {
      method: "put",
      headers: {
        "content-type": "application/json; charset=utf-8",
        "x-apikey": "5de81a1d4658275ac9dc22e2",
        "cache-control": "no-cache"
      },
      body: JSON.stringify(data)
    }
  )
    .then(res => res.json())
    .then(updatedListe => {
      const parentElement = document.querySelector(
        `.liste[data-listeid="${updatedListe._id}"]`
      );

      parentElement.querySelector(
        "h1"
      ).textContent = `Navn: ${updatedListe.name}`;
      parentElement.querySelector(
        "h2"
      ).textContent = `Email: ${updatedListe.email}`;
    });
}

function deleteUser(id) {
  fetch("https://eksamenhalvt-0223.restdb.io/rest/brugere/" + id, {
    method: "delete",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-apikey": "5de81a1d4658275ac9dc22e2",
      "cache-control": "no-cache"
    }
  })
    .then(res => res.json())
    .then(data => {});
}

let cart = document.querySelector(".cart-card__recap");
let copyOfLS = JSON.parse(localStorage.getItem("products"));

main();

function main() {
  displayCart();
  countTotalInCart();
  toEmptyCart();
  checkFormAndPostRequest();
}

function displayCart() {
  let test = document.querySelector(".width-to-empty-cart");
  let cartCard = document.querySelector(".cart-card");
  let emptyCart = document.querySelector(".if-empty-cart");

  /*s'il y a un produit dans le panier on supprime le message d'erreur*/
  if (localStorage.getItem("products")) {
    cartCard.style.display = "flex";
    cartCard.style.flexDirection = "column";
    cartCard.style.justifyContent = "space-around";
    emptyCart.style.display = "none";
  }

  /*remplir les div avec les données du tableau*/
  for (let produit in copyOfLS) {
    let productRow = document.createElement("div");
    cart.insertBefore(productRow, test);
    productRow.classList.add("cart-card__recap__row", "product-row");

    let productName = document.createElement("div");
    productRow.appendChild(productName);
    productName.classList.add("cart-card__recap__title");
    productName.innerHTML = copyOfLS[produit].name;

    let productQuantity = document.createElement("div");
    productRow.appendChild(productQuantity);
    productQuantity.classList.add("cart-card__recap__title", "title-quantity");
    productQuantity.innerHTML = copyOfLS[produit].quantity;

    let productPrice = document.createElement("div");
    productRow.appendChild(productPrice);
    productPrice.classList.add(
      "cart-card__recap__title",
      "data-price",
      "price"
    );

    /*modification du prix en €*/
    productPrice.innerHTML = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(copyOfLS[produit].price * copyOfLS[produit].quantity);
  }
}

function countTotalInCart() {
  let arrayOfPrice = [];
  let totalPrice = document.querySelector(".total");

  /*basculer les prix du DOM dans un tableau*/
  let productPriceAccordingToQuantity = document.querySelectorAll(".price");
  for (let price in productPriceAccordingToQuantity) {
    arrayOfPrice.push(productPriceAccordingToQuantity[price].innerHTML);
  }

  /*supprimer "undefined" du tableau*/
  arrayOfPrice = arrayOfPrice.filter((el) => {
    return el != undefined;
  });

  /*valeur "nombre" dans le tableau*/
  arrayOfPrice = arrayOfPrice.map((x) => parseFloat(x));

  /*addition du tableau pour le prix total*/
  const reducer = (acc, currentVal) => acc + currentVal;
  arrayOfPrice = arrayOfPrice.reduce(reducer);

  /*modification du prix en €*/
  totalPrice.innerText = `Total : ${(arrayOfPrice = new Intl.NumberFormat(
    "fr-FR",
    {
      style: "currency",
      currency: "EUR",
    }
  ).format(arrayOfPrice))}`;
}

  /*vider le panier ainsi que le LS*/
function toEmptyCart() {
  const buttonToEmptyCart = document.querySelector(".to-empty-cart");
  buttonToEmptyCart.addEventListener("click", () => {
    localStorage.clear();
  });
}

function checkFormAndPostRequest() {
  /*récupération des inputs via le DOM*/
  const submit = document.querySelector("#submit");
  let inputName = document.querySelector("#name");
  let inputLastName = document.querySelector("#lastname");
  let inputPostal = document.querySelector("#postal");
  let inputCity = document.querySelector("#city");
  let inputAdress = document.querySelector("#adress");
  let inputMail = document.querySelector("#mail");
  let inputPhone = document.querySelector("#phone");
  let erreur = document.querySelector(".erreur");

  /*au clic, si les champs ne sont remplis > erreur et on empêche l'envoi au formulaire > vérification que le numéro est un nombre > sinon même procédure*/
  submit.addEventListener("click", (e) => {
    if (
      !inputName.value ||
      !inputLastName.value ||
      !inputPostal.value ||
      !inputCity.value ||
      !inputAdress.value ||
      !inputMail.value ||
      !inputPhone.value
    ) {
      erreur.innerHTML = "Vous devez renseigner tous les champs !";
      e.preventDefault();
    }
    else if (isNaN(inputPhone.value)) {
      e.preventDefault();
      erreur.innerText = "Votre numéro de téléphone n'est pas valide";
    } 

    else {
      /*Si formulaire est valide alors > le tableau productsBought contiendra un tableau des produits acheté et order contiendra le tableau avec l'objet qui contient les coordonnées de l'acheteur*/
      let productsBought = [];
      productsBought.push(copyOfLS);

      const order = {
        contact: {
          firstName: inputName.value,
          lastName: inputLastName.value,
          city: inputCity.value,
          address: inputAdress.value,
          email: inputMail.value,
        },
        products: productsBought,
      };

      /*envoie de la requête au back-end*/
      /*entête de la requête*/
      const options = {
        method: "POST",
        body: JSON.stringify(order),
        headers: { "Content-Type": "application/json" },
      };

      /*prix formaté pour l'afficher sur la prochaine page*/
      let priceConfirmation = document.querySelector(".total").innerText;
      priceConfirmation = priceConfirmation.split(" :");

      /*envoie de la requête avec l'en-tête. Changement de page avec un LS qui ne contiendra plus que l'order id et le prix*/
      fetch("http://localhost:3000/api/teddies/order", options)
        .then((response) => response.json())
        .then((data) => {
          localStorage.clear();
          console.log(data)
          localStorage.setItem("orderId", data.orderId);
          localStorage.setItem("total", priceConfirmation[1]);

          /*commenter pour vérifier le statut 201 de la requête fetch*/
           document.location.href = "confirmation.html";
        })
        .catch((err) => {
          alert("Il y a eu une erreur : " + err);
        });
    }
  });
}
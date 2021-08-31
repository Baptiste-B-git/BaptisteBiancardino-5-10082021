
let params = new URL(document.location).searchParams;
let id = params.get("id");

const productCardImg = document.querySelector(".img");
const productCardName = document.querySelector(".product-card__infos__title");
const productCardDescription = document.querySelector(
  ".product-card__infos__description"
);
const productCardPrice = document.querySelector(".product-card__infos__price");
const bearNumber = document.querySelector("#bearNum");
const colorSelect = document.querySelector("#color-select");

main();

function main() {
  checkIf404();
  getArticle();
  addToCart();
}

function checkIf404() {
  window.addEventListener("error", (e) => {
      let container = document.querySelector(".container");
      container.innerHTML = `<p>Cette page n'existe pas. <a class="back-to-home" href="index.html">Retourner dans la boutique ?</a></p>`;
      container.style.padding = "40vh 0";
      container.style.fontSize = "26px";
      let backToHomeLink = document.querySelector(".back-to-home");
      backToHomeLink.style.textDecoration = "underline";
    },
    true
  );
}

/*récupération du produit souhaité par la requête*/
function getArticle() {
  fetch(`http://localhost:3000/api/teddies/${id}`)
    .then(function (response) {
      return response.json();
    })
    .catch((error) => {
      let container = document.querySelector(".container");
      container.innerHTML =
        "Nous n'avons pas réussi à afficher nos peluches. Avez-vous bien lancé le serveur local (Port 3000) ? <br>Si le problème persiste, contactez-nous.";
      container.style.textAlign = "center";
      container.style.padding = "45vh 0";
    })
    .then(function (resultatAPI) {
      /*repositionner les données de l'API dans la page*/
      myProduct = new product(resultatAPI.name, resultatAPI.description, resultatAPI.price, resultatAPI.imageUrl, resultatAPI.colors)
      productCardName.innerHTML = myProduct.name;
      productCardImg.src = myProduct.imageUrl;
      productCardDescription.innerText = myProduct.description;

      /*afficher le prix en €*/
      productCardPrice.innerText = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(myProduct.price / 100);

      let colorSelect = document.getElementById("color-select");
      for (let i = 0; i < myProduct.colors.length; i++) {
        let option = document.createElement("option")
        option.innerText = myProduct.colors[i]
        colorSelect.appendChild(option)
      }
    });
}

function addToCart() {
  const addToCartBtn = document.querySelector(".add-to-cart");
  const confirmation = document.querySelector(".added-to-cart-confirmation");
  const textConfirmation = document.querySelector(".confirmation-text");
  
  addToCartBtn.addEventListener("click", () => {
    if (bearNumber.value > 0 && bearNumber.value < 100) {
      /*basculer le produit vers le panier*/
      let productAdded = {
        name: productCardName.innerHTML,
        price: parseFloat(productCardPrice.innerHTML),
        quantity: parseFloat(document.querySelector("#bearNum").value),
        _id: id,
      };

      /*localStorage*/
      let arrayProductsInCart = [];
      /*récupération du LS > tableau arrayProductsInCart > LS*/
      if (localStorage.getItem("products") !== null) {
        arrayProductsInCart = JSON.parse(localStorage.getItem("products"));
      /*LS vide > création avec le produit ajouté*/
      }
        arrayProductsInCart.push(productAdded);
        localStorage.setItem("products", JSON.stringify(arrayProductsInCart));
        
      /*l'effet "article ajouté au panier"*/
      confirmation.style.visibility = "visible";
      textConfirmation.innerHTML = `Article ajouté !`;
      setTimeout("location.reload(true);", 4000);
    } else {
      confirmation.style.visibility = "visible";
      textConfirmation.style.background = "red";
      textConfirmation.style.border = "red";
      textConfirmation.style.color = "white";
      textConfirmation.style.whiteSpace = "normal";
      textConfirmation.innerText = `La quantité doit se trouver au dessus de 0`;
    }
  });
}

  
  
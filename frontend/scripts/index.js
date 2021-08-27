main();

function main() {
  getArticles();
}

// création de la class product
class product{
  constructor(name, price, imageUrl, id){
  this.name = name;
  this.price = price;
  this.imageUrl = imageUrl;
  this.id = id
  }
}

// créer un nouveau product
let objetProduct = new product(
  product.name,
  product.price,
  product.imageUrl,
  product.id,
);

/*récupération de l'API*/
function getArticles() {
  fetch("http://localhost:3000/api/teddies")
    .then(function (res) {
      return res.json();
    })
    .catch((error) => {
      var productsContainer = document.querySelector(".products-container");
      productsContainer.innerHTML =
        "Veuillez lancer le serveur local Port 3000";
      productsContainer.style.textAlign = "center";
      productsContainer.style.padding = "30vh 0";
    })

/*basculer les données dans le DOM*/
    .then(function (resultatAPI) {
      myProduct = new product(resultatAPI.name, resultatAPI.price, resultatAPI.imageUrl, resultatAPI.id)
      const articles = resultatAPI;
      for (let article in articles) {
        let productCard = document.createElement("div");
        document.querySelector(".products").appendChild(productCard);
        productCard.classList.add("product");

        let productLink = document.createElement("a");
        productCard.appendChild(productLink);
        productLink.href = `product.html?id=${resultatAPI[article]._id}`;
        productLink.classList.add("stretched-link");

        let productImgDiv = document.createElement("div");
        productLink.appendChild(productImgDiv);
        productImgDiv.classList.add("product__img");

        let productImg = document.createElement("img");
        productImgDiv.appendChild(productImg);
        productImg.src = resultatAPI[article].imageUrl;

        let productInfosDiv = document.createElement("div");
        productLink.appendChild(productInfosDiv);
        productInfosDiv.classList.add("product__infos");

        let productInfoTitle = document.createElement("div");
        productInfosDiv.appendChild(productInfoTitle);
        productInfoTitle.classList.add("product__infos__title");
        productInfoTitle.innerHTML = myProduct.name;

        let productInfoPrice = document.createElement("div");
        productInfosDiv.appendChild(productInfoPrice);
        productInfoPrice.classList.add("product__infos__price");
        /*transformer le prix en €*/
        resultatAPI[article].price = resultatAPI[article].price / 100;
        productInfoPrice.innerHTML = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(resultatAPI[article].price);
      }
    });
}

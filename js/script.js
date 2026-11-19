const formulaire = document.querySelector(".Fromulaire form");
const message = document.getElementById("message-succes");

if (formulaire && message) {

    formulaire.addEventListener("submit", function(event) {
        event.preventDefault();

        if (formulaire.checkValidity()) {
            message.style.display = "block";
        }
    });

}


const imagesGalerie = document.querySelectorAll(".galerie img");
const lightbox = document.getElementById("lightbox");
const imageAgrandie = document.getElementById("image-agrandie");
const boutonFermer = document.getElementById("fermer-lightbox");

if (imagesGalerie.length > 0 && lightbox && imageAgrandie && boutonFermer) {

    // Ouvrir une image
    imagesGalerie.forEach(function(image) {

        image.addEventListener("click", function() {
            imageAgrandie.src = image.src;
            imageAgrandie.alt = image.alt;
            lightbox.classList.add("active");
        });

    });

    // Fermer la lightbox
    function fermerLightbox() {
        lightbox.classList.remove("active");
    }

    // Fermer avec la croix
    boutonFermer.addEventListener("click", fermerLightbox);

    // Fermer en cliquant à l'extérieur de l'image
    lightbox.addEventListener("click", function(event) {

        if (event.target === lightbox) {
            fermerLightbox();
        }
    });

    // Fermer avec la touche Échap
    document.addEventListener("keydown", function(event) {

        if (event.key === "Escape") {
            fermerLightbox();
        }
    });

}


const menus = document.querySelectorAll("nav");

menus.forEach(function(nav) {

    const boutonBurger = nav.querySelector(".burger");

    if (boutonBurger) {

        boutonBurger.addEventListener("click", function() {

            nav.classList.toggle("ouvert");

            const menuOuvert = nav.classList.contains("ouvert");

            boutonBurger.setAttribute("aria-expanded", menuOuvert);
        });
    }
});



const boutonsAjouter = document.querySelectorAll(".btn-ajouter");
const listeCommande = document.getElementById("liste-commande");
const totalCommande = document.getElementById("total-commande");
const boutonVider = document.getElementById("vider-panier");

// Création du panier
const panier = new Map();

// Formatage des prix en euros
function formaterPrix(prix) {
    return prix.toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR"
    });
}

// Ajouter un produit au panier
boutonsAjouter.forEach(bouton => {

    bouton.addEventListener("click", () => {

        // Récupération de l'article concerné
        const article = bouton.closest(".card, .card-boissons");

        // Récupération du nom et du prix
        const nom = article.dataset.name;
        const prix = Number(article.dataset.price);

        // Vérification des informations
        if (!nom || !Number.isFinite(prix) || prix <= 0) {
            console.error("Informations du produit incorrectes.");
            return;
        }

        // Vérifier si le produit existe déjà
        if (panier.has(nom)) {

            // Augmenter la quantité
            panier.get(nom).quantite++;

        } else {

            // Ajouter un nouveau produit
            panier.set(nom, {
                prix: prix,
                quantite: 1
            });
        }

        // Actualiser l'affichage
        afficherPanier();
    });
});


// Afficher le contenu du panier
function afficherPanier() {

    // Vider l'affichage précédent
    listeCommande.innerHTML = "";

    // Calcul du total
    let total = 0;

    // Vérifier si le panier est vide
    if (panier.size === 0) {

        listeCommande.innerHTML = "<p>Votre panier est vide.</p>";

    } else {

        // Parcourir les produits du panier
        panier.forEach((produit, nom) => {

            // Calcul du prix selon la quantité
            const sousTotal = produit.prix * produit.quantite;

            total += sousTotal;

            // Créer une ligne de commande
            const ligne = document.createElement("div");
            ligne.classList.add("commande-item");

            // Afficher le nom, la quantité et le prix
            const nomProduit = document.createElement("span");
            nomProduit.textContent =
                nom + " x " + produit.quantite;

            const prixProduit = document.createElement("strong");
            prixProduit.textContent = formaterPrix(sousTotal);

            ligne.appendChild(nomProduit);
            ligne.appendChild(prixProduit);

            listeCommande.appendChild(ligne);
        });
    }

    // Actualiser le total général
    totalCommande.textContent = formaterPrix(total);
}

// Vider complètement le panier
boutonVider.addEventListener("click", () => {

    panier.clear();

    afficherPanier();
});

// Affichage initial
afficherPanier();

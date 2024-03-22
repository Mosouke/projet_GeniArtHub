const cartContainer = document.querySelector('.container');
const itemsContainer = document.querySelector('.ligne');
const totalElement = document.querySelector('.total');
const cart = JSON.parse(localStorage.getItem('cart')) || [];
async function get_datas() {
    await peuplee_data(cart);
}
async function fetch_product_details(product_id) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${product_id}`);
        if (!response.ok) {
            throw new Error('erreur lors de la récupération des détails du produit');
        }
        const product_data = await response.json();
        return product_data;
    } catch (error) {
        console.error('une erreur s\'est produite lors de la récupération des détails du produit :', error.message);
        return null;
    }
}
async function peuplee_data(cart) {
    let total_articles = 0;
    let total_montant = 0;

    itemsContainer.innerHTML = ''; // Supprimer le contenu précédent

    if (cart.length === 0) {
        totalElement.innerHTML = `<h3 class="fonte">total de la commande</h3><p id="total-content">0 article pour un montant de 0€</p>`;
        itemsContainer.innerHTML =  '<p>votre panier est vide veuillez ajouter au moins un article à votre panier</p>'
        
        return;
    }

    for (const product of cart) {
        const product_details = await fetch_product_details(product.id);
        if (!product_details) {
            console.error('détails du produit non trouvés');
            continue;
        }
        
        const selected_declinaison = product_details.declinaisons.find(declinaison => declinaison.taille === product.taille);
        if (!selected_declinaison || !selected_declinaison.prix) {
            console.error('prix non trouvé pour la taille spécifiée');
            continue;
        }

        const prix = parseFloat(selected_declinaison.prix);
        const quantite = parseInt(product.quantite);
        total_articles += quantite;
        total_montant += prix * quantite;

        const item_html = `
            <div class="item">
                <img class="img" src="${product_details.image}" alt="image_du_produit">
                <h3 class="fonte">${product_details.titre}</h3>
                <p>format_${product.taille}</p>
                <p>${prix.toFixed(2)}€</p>
                <p>quantité : <input type="number" name="quantity" class="quantity-input" value="${quantite}" maxlength="3" data-index="${cart.indexOf(product)}"></p>
                <p class="sup">supprimer</p>
            </div>
        `;
        itemsContainer.insertAdjacentHTML('afterend', item_html);
    }
    update_total();
    setup_event_listeners();
    
}
function update_quantity(event) {
    const index = parseInt(event.target.dataset.index);
    const new_quantity = parseInt(event.target.value);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index] && cart[index].hasOwnProperty('quantite')) {
        cart[index].quantite = new_quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        
        number_item();
    } else {
        console.error('la quantité de l\'élément du panier est_ indéfinie ou non définie');
    }
}

function enforce_quantity_limits(event) {
    let quantity = parseInt(event.target.value);
    if (isNaN(quantity) || quantity <= 0) {
        event.target.value = 1;
    } else if (quantity > 100) {
        event.target.value = 100;
    }
}

async function update_total() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total_articles = 0;
    let total_montant = 0;

    if(cart.length === 0){
        itemsContainer.innerHTML =  '<p>votre panier est vide veuillez ajouter au moins un article à votre panier</p>'
    }
    for (const product of cart) {
        const product_details = await fetch_product_details(product.id);
        if (!product_details) {
            console.error('détails du produit non trouvés');
            continue;
        }

        const selected_declinaison = product_details.declinaisons.find(declinaison => declinaison.taille === product.taille);
        if (!selected_declinaison || !selected_declinaison.prix) {
            console.error('prix non trouvé pour la taille spécifiée');
            continue;
        }

        const prix = parseFloat(selected_declinaison.prix);
        const quantite = parseInt(product.quantite);
        total_articles += quantite;
        total_montant += prix * quantite;
    }
    const totalContent = `${total_articles} ${total_articles === 1 ? 'article' : 'articles'} pour un montant de ${total_montant.toFixed(2)}€`;
    totalElement.innerHTML = `<h3 class="fonte">total de la commande</h3><p id="total-content">${totalContent}</p>`;
    number_item();
}

function setup_event_listeners() {
    const quantity_inputs = document.querySelectorAll('.quantity-input');
    quantity_inputs.forEach(input => {
        input.addEventListener('change', update_quantity);
        input.addEventListener('input', enforce_quantity_limits);
        
    });    
    cartContainer.addEventListener('click', async (event) => {
        if (event.target.classList.contains('sup')) {
            const index = parseInt(event.target.closest('.item').querySelector('.quantity-input').dataset.index);
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            event.target.closest('.item').remove();
            update_total();
            number_item();
            
        }
    });
}
function valider_formulaire() {
    let prenom = document.querySelector('#form input[type="text"][id="first_name"]').value;
    let nom = document.querySelector('#form input[type="text"][id="name"]').value;
    let adresse = document.querySelector('#form input[type="text"][id="Adresse"]').value;
    let ville = document.querySelector('#form input[type="text"][id="Ville"]').value;
    let email = document.querySelector('#form input[type="email"][id="mail"]').value;

    let regexLettres = /^[a-zA-Z]+$/;
    let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (prenom.length < 2 || !regexLettres.test(prenom)) {
        alert('Le prénom doit contenir au moins 2 lettres et ne doit pas contenir de caractères spéciaux.');
        return false;
    }
    if (nom.length < 2 || !regexLettres.test(nom)) {
        alert('Le nom doit contenir au moins 2 lettres et ne doit pas contenir de caractères spéciaux.');
        return false;
    }
    if (adresse.length < 10) {
        alert('L\'adresse doit contenir au moins 10 caractères.');
        return false;
    }
    if (ville.length < 3 || !regexLettres.test(ville)) {
        alert('La ville doit contenir au moins 3 lettres et ne doit pas contenir de chiffres.');
        return false;
    }
    if (!regexEmail.test(email)) {
        alert('Veuillez entrer une adresse email valide.');
        return false;
    }
    return true;
}


get_datas();
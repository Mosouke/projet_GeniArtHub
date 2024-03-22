const cart_container = document.querySelector('.container');

async function get_datas() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    await peuplee_data(cart);
    number_item()
}

async function fetch_product_details(product_id) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${product_id}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des détails du produit');
        }
        const product_data = await response.json();
        return product_data;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des détails du produit :', error.message);
        return null;
    }
}

async function peuplee_data(cart) {
    let total_articles = 0;
    let total_montant = 0;

    const itemsContainer = document.querySelector('.ligne ');
    itemsContainer.innerHTML = ''; // Supprimer le contenu précédent
    const total_element = document.querySelector('.total');

    if (cart.total_element === 0) {
        const item_html = `
            <div class="item">
                <p class="para_vide">Votre panier est vide. Veuillez ajouter au moins un article à votre panier.</p>
            </div>
        `;

        total_element.innerHTML = `<h3 class="fonte">Total de la commande</h3><p id="total-content">Pas de produit dans la Commande</p>`;
        
        itemsContainer.insertAdjacentHTML('afterend', item_html);
        return;
    }

    for (const product of cart) {
        const product_details = await fetch_product_details(product.id);
        if (product_details) {
            const selected_declinaison = product_details.declinaisons.find(declinaison => declinaison.taille === product.taille);
            if (selected_declinaison && selected_declinaison.prix) {
                const prix = parseFloat(selected_declinaison.prix);
                const quantite = parseInt(product.quantite);
                total_articles += quantite;
                total_montant += prix * quantite;

                const item_html = `
                    <div class="item">
                        <img class="img" src="${product_details.image}" alt="image du produit">
                        <h3 class="fonte">${product_details.titre}</h3>
                        <p>Format ${product.taille}</p>
                        <p>${prix.toFixed(2)}€</p>
                        <p>Quantité : <input type="number" name="quantity" class="quantity-input" value="${quantite}" maxlength="3" data-index="${cart.indexOf(product)}"></p>
                        <p class="Sup">Supprimer</p>
                    </div>
                `;

                itemsContainer.insertAdjacentHTML('afterend', item_html);
            } else {
                console.error('Prix non trouvé pour la taille spécifiée.');
            }
        }
    }
}
    
    if(total_articles === 0){
        total_element.innerHTML = `<h3 class="fonte">Total de la commande</h3><p id="total-content">Pas de produit dans la Commande</p>`;
        console.log(total_element);

    if( total_articles === 1){
        total_element.innerHTML = `<h3 class="fonte">Total de la commande</h3><p id="total-content">${total_articles} article pour un montant de ${total_montant.toFixed(2)}€</p>`;

    } else {
        total_element.innerHTML = `<h3 class="fonte">Total de la commande</h3><p id="total-content">${total_articles} articles pour un montant de ${total_montant.toFixed(2)}€</p>`;
    }

    const quantity_inputs = document.querySelectorAll('.quantity-input');
    quantity_inputs.forEach(input => {
        input.addEventListener('change', (event) => {
            const index = parseInt(event.target.dataset.index);
            const new_quantity = parseInt(event.target.value);
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart[index] && cart[index].hasOwnProperty('quantite')) {
                cart[index].quantite = new_quantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                if (typeof update_total === 'function') {
                    update_total();
                } else {
                    console.error('La fonction update_total n\'est pas définie.');
                }
            } else {
                console.error('La quantité de l\'élément du panier est indéfinie ou non définie.');
            }
            quantity_inputs.forEach(input => {
                input.addEventListener('input', (event) => {
                    let quantity = parseInt(event.target.value);
        
                    if (isNaN(quantity) || quantity <= 0) {
                        event.target.value = 1;
                    } else if (quantity > 100) {
                        event.target.value = 100;
                    } // Si la quantité est dans la plage autorisée, ne rien faire d'autre
                });
            });
        });
    });



    supprimer();
}

async function update_total() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    number_item()
    let total_articles = 0;
    let total_montant = 0;

    for (const product of cart) {
        const product_details = await fetch_product_details(product.id);
        if (product_details) {
            const selected_declinaison = product_details.declinaisons.find(declinaison => declinaison.taille === product.taille);
            if (selected_declinaison && selected_declinaison.prix) {
                const prix = parseFloat(selected_declinaison.prix);
                const quantite = parseInt(product.quantite);
                total_articles += quantite;
                total_montant += prix * quantite;
            } else {
                console.error('Prix non trouvé pour la taille spécifiée.');
            }
        } else {
            console.error('Détails du produit non trouvés.');
        }
    }

    const total_content = document.getElementById('total-content');
    total_content.innerText = `${total_articles} articles pour un montant de ${total_montant.toFixed(2)}€`;
    supprimer();
}

function supprimer() {
    const cart_container = document.querySelector('.container');
    cart_container.addEventListener('click', async (event) => {
        if (event.target.classList.contains('Sup')) {
            const index = event.target.closest('.item').dataset.index;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.splice(parseInt(index), 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            event.target.closest('.item').remove();

            update_total();
        }
    });
}

get_datas();
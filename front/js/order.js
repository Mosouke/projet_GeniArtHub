// const selected_size = format_select.value;
// const selected_declinaison = data.declinaisons.find              (declinaison => declinaison.taille === selected_size);
// if (selected_declinaison) {
//     const total_price = selected_declinaison.prix * quantity;
//     prix_container.innerText = total_price.toFixed(2) + '€';
// }

let cart_container = document.querySelector('.container');

async function get_datas() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    peuplee_data(cart);
}

async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des détails du produit');
        }
        const productData = await response.json();
        return productData;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des détails du produit :', error.message);
        return null;
    }
}

async function peuplee_data(cart) {
    for (const product of cart) {
        let prix = 'N/A'; 

        const productDetails = await fetchProductDetails(product.id);
        if (productDetails) {
            const selectedDeclinaison = productDetails.declinaisons.find(declinaison => declinaison.taille === product.taille);
            prix = selectedDeclinaison ? selectedDeclinaison.prix.toFixed(2) : 'N/A'; 
        }

        const itemHtml = `
            <div class="item">
                <img class="img" src="${product.image}" alt="image du produit">
                <h3 class="fonte">${product.titre}</h3>
                <p>Format ${product.taille}</p>
                <p>${prix}€</p>
                <p>Quantité : <input type="number" name="quantity" id="quantity" value="${product.quantite}" maxlength="3"></p>
                <p class="Sup">Supprimer</p>
            </div>
        `;

        const itemElement = document.querySelector('.ligne');
        itemElement.insertAdjacentHTML('afterend', itemHtml); 
    }
    supprimer();
}



function supprimer() {
    const supprimer = document.querySelectorAll('.Sup');
    for (let i = 0; i < supprimer.length; i++){
        supprimer[i].addEventListener("click", () => {
            let local_storage = localStorage.getItem('cart');
            let data_local = JSON.parse(local_storage);
            data_local.splice(i, 1);
            localStorage.setItem('cart', JSON.stringify(data_local));
            window.location.reload();
        });
    }
}   



get_datas();



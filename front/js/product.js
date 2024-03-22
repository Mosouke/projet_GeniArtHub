let format_select;
let quantity_input;
let data;

async function get_datas(){
    const url = window.location.href;
    const str = new URL(url);
    const id = str.searchParams.get('id');

    let response = await fetch(`http://localhost:3000/api/products/${id}`);
    data = await response.json();
    ajout_data();
}  

function ajout_data (){ 
    document.querySelector('h1').innerText = data.titre;
    const chemin_img = data.image;
    document.querySelector('figure img').src = chemin_img;

    const aside = document.querySelector("aside h2");
    aside.innerText = `Description de l'oeuvre : ${data.titre}`;
    const para = document.createElement("p");
    para.innerText = data.description;
    para.id = "short_desc";
    aside.insertAdjacentElement("afterend", para);

    const texte_complet = data.description;
    const paragraphes = texte_complet.split("\n\n");
    const premier_paragraphe = paragraphes[0];
    document.querySelector('#short_desc').innerText = premier_paragraphe;
    
    const button_buy = document.querySelector('.button-buy');
    button_buy.innerText = `Buy ${data.shorttitle}`;

    button_buy.addEventListener('click', function(event) {
        ajout_panier(event);
        event.preventDefault();
    });
    
    const prix_container = document.querySelector('.price .showprice');

    format_select = document.getElementById('format');

    data.declinaisons.forEach(declinaison => {
        const declinaison_element = document.createElement('option');
        declinaison_element.value = declinaison.taille;
        declinaison_element.innerText = declinaison.taille;
        format_select.appendChild(declinaison_element);

        if (declinaison.taille === '20 x 20') {
            prix_container.innerText = declinaison.prix + '€';
        }
    });

    format_select.addEventListener('change', (event) => {
        const selected_size = event.target.value;
        const selected_declinaison = data.declinaisons.find(declinaison => declinaison.taille === selected_size);
        if (selected_declinaison) {
            prix_container.innerText = selected_declinaison.prix + '€';
        }
    });

    quantity_input = document.getElementById('quantity');
    quantity_input.addEventListener('input', (event) => {
        let quantity = parseInt(event.target.value);

        if (quantity <= 0) {
            event.target.value = 1;
        } else if (quantity > 100) {
            event.target.value = 100;
        } else {
            event.target.value = quantity;
        }
    });
    document.querySelector('title').innerHTML = data.titre + ' - GeniArtHub';
}


function ajout_panier () {
    
    let product = {
        id: data._id,
        image: data.image,
        titre: data.titre,
        // prix: prix_container.value,
        taille: format_select.value,
        quantite: quantity_input.value
    };

    if (parseInt(product.quantite) >= 100) {
        alert("La quantité maximale autorisée est de 100.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    let existing_product_index = cart.findIndex(item => item.id === product.id && item.taille === product.taille);

    if (existing_product_index !== -1) {
        cart[existing_product_index].quantite = Math.min(parseInt(cart[existing_product_index].quantite) + parseInt(product.quantite), 100);
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    number_item()
}


get_datas();

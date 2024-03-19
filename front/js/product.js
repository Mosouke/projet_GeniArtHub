let data = {};

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
    
    document.querySelector('.button-buy').innerText = `Buy ${data.shorttitle}`;

    
    const prix_container = document.querySelector('.price .showprice');

    const format_select = document.getElementById('format');

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

    const quantity_input = document.getElementById('quantity');
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

get_datas();

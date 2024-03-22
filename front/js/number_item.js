/*
    Récupére le cart dans la localstorage
    S'il ya des élément enregistrés dans le panier, on recupère et on l'affiche dans le san qu'on devra inseérer danssur #cart_icon
*/

const span = "<span>0</span>";
const cart_icon = document.querySelector("#cart_icon");
cart_icon.insertAdjacentHTML("beforeend", span);

function number_item() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length > 0) {
        const quantity = cart.reduce ((acc, el) => acc + parseInt(el.quantite), 0);
        document.querySelector("#cart_icon span").textContent = quantity
        document.querySelector("#cart_icon span").style.display = "flex"
        return
    }
    document.querySelector("#cart_icon span").style.display = "none"
}

number_item()
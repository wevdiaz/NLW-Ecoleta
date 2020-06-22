function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]");

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
            .then((res) => { return res.json() })
            .then(function(states){

                for (state of states) {

                   ufSelect.innerHTML =  ufSelect.innerHTML + `<option value="${state.id}">${state.nome}</option>`;
                   
                }
            })
}

populateUFs();

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]");
    const stateInput = document.querySelector("input[name=state]");

    const ufValue = event.target.value;

    const indexOfSelectedState = event.target.selectedIndex;
    stateInput.value = event.target.options[indexOfSelectedState].text;

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;

    citySelect.innerHTML = "<option>Selecione a Cidade</option>";
    citySelect.disabled = true;

    fetch(url)
        .then(function(res){
                return res.json()
            })
        .then(function(cities){

            for (city of cities) {
                
                citySelect.innerHTML = citySelect.innerHTML + `<option value="${city.nome}">${city.nome}</option>`
            }

            citySelect.disabled = false;
        });
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities );



// Items de coleta

const itemsToCollect = document.querySelectorAll(".items-grid li");

for (item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem )
}

const collectedItems = document.querySelector("input[name=items]");

let selectedItems = []

function handleSelectedItem() {
    const itemLi = event.target;

    itemLi.classList.toggle("selected");

    const itemId = event.target.dataset.id;


    const alreadySelected = selectedItems.findIndex( function(item){
        const itemFound = item == itemId;
        return itemFound
    })

    if (alreadySelected >= 0) {
        // tirar seleção
        const filteredItems = selectedItems.filter(function(item){
            const itemIsDifferent = item != itemId;
            return itemIsDifferent;
        })

        selectedItems = filteredItems;
    } else {
        selectedItems.push(itemId);
    }
    
    collectedItems.value = selectedItems;
}
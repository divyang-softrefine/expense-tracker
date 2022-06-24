const table = document.querySelector('.table');
const balanceField = document.querySelector('#current-balance')

class data{
    constructor(type,desp,amount){
        this.id = String(new Date().getTime()).slice(6);
        this.type = type;
        this.desp = desp;
        this.amount = type === 'Income' ? +amount : -amount;
    }
}

class App{
    
    #balance;
    #movements;
    constructor(){
        if(localStorage.getItem('balance')){
            this.#balance = Number(localStorage.getItem('balance'));
        }else{
            this.#balance = 0;
            localStorage.setItem('balance',0)
        }

        if(localStorage.getItem('movements')){
            this.#movements = JSON.parse(localStorage.getItem('movements'));
        }else{
            this.#movements = [];
            localStorage.setItem('movements',[])
        }
        this.addHandler();
        this.renderBalance();
        this.onLoad();
    }

    updateBalance(amount){
        this.#balance += amount;

        localStorage.setItem('balance',this.#balance);
    }
    onLoad(){
        this.#movements.forEach(ele=>{
            this.renderData(ele)
        })
    }
    renderData(_data){
        const  markup = `<tr class="data-field" data-id=${_data.id}}>
        <td class="type-field">${_data.type}</td>
        <td class="description-field">${_data.desp}</td>
        <td class="amount-field">${_data.amount}</td>
        </tr> `;
        table.insertAdjacentHTML('beforeend',markup);
    }
    updateMovements(data){

        this.#movements.push(data);
        localStorage.setItem('movements',JSON.stringify(this.#movements))
        const movement = this.#movements.at(-1)
        this.updateBalance(movement.amount)
        

        this.renderData(movement);
        this.renderBalance();;
    }

    renderBalance(){
        balanceField.textContent = this.#balance;
        this.#balance >= 0 ? balanceField.style.color = `green` : balanceField.style.color = `red`;
    }
    addData(e){
        e.preventDefault();
        this.updateMovements(new data(
            e.target.children[0].value,
            e.target.children[1].value,
            e.target.children[2].value));

    }
    addHandler(){
        document.querySelector('#form').addEventListener('submit',this.addData.bind(this));
    }
}
const app = new App();

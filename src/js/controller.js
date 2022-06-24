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

        if(localStorage.getItem('movements')){
            this.#movements = JSON.parse(localStorage.getItem('movements'));
        }else{
            this.#movements = [];
            localStorage.setItem('movements',[])
        }

        this.loadBalance()
        this.renderBalance();
        this.onLoad();
        this.addHandler();
        this.addDeleteButtonHandler();
    }
    loadBalance(){
        this.#balance = 0;
        this.#movements.forEach(ele=>this.#balance+=ele.amount);

        localStorage.setItem(`balance`,JSON.stringify(this.#balance))
    }
    updateBalance(amount){
        this.#balance += amount;

        localStorage.setItem('balance',this.#balance);
    }
    onLoad(){
        let markup = `<thead>
        <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Edit</th>
        </tr>
    </thead>${this.#movements.map(_data=>{return `<tr class="data-field" data-id=${_data.id}>
    <td class="type-field">${_data.type}</td>
    <td class="description-field">${_data.desp}</td>
    <td class="amount-field">${_data.amount}</td>
    <td><button class='deleteBtn'>Delete</button></td>
    </tr> `}).join('')}`;
    
        table.innerHTML = markup;
    }
    renderData(_data){
        const  markup = `<tr class="data-field" data-id=${_data.id}>
        <td class="type-field">${_data.type}</td>
        <td class="description-field">${_data.desp}</td>
        <td class="amount-field">${_data.amount}</td>
        <td><button class='deleteBtn'>Delete</button></td>
        </tr> `;
        table.insertAdjacentHTML('beforeend',markup);
        this.addDeleteButtonHandler();
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
    deleteMovement(id){
        for(let i = 0;i < this.#movements.length; i++){
            if(this.#movements[i].id === id)
            {   this.#balance -= +this.#movements[i].amount;
                localStorage.setItem('balance',this.#balance);
                this.#movements.splice(i,1);
                localStorage.setItem('movements',JSON.stringify(this.#movements))
                break;
            }
        }
        this.onLoad();
        this.addDeleteButtonHandler();
        this.renderBalance();
    }
    addHandler(){
        document.querySelector('#form').addEventListener('submit',this.addData.bind(this))
    }

    addDeleteButtonHandler(){
        document.querySelectorAll('.deleteBtn').forEach(ele=>{
            console.log(ele)
            ele.addEventListener('click',function(e){
                this.deleteMovement(e.target.closest('.data-field').dataset.id)
            }.bind(this))
        })
    }
}
const app = new App();

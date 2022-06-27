const table = document.querySelector('.table');
const balanceField = document.querySelector('#current-balance');
const inputType = document.querySelector('#inputType');
const inputDesp = document.querySelector('#inputDesp');
const inputPrice = document.querySelector('#inputPrice');
const inputSubmit = document.querySelector('#submitBtn');
const despError = document.querySelector('#despError');
const priceError = document.querySelector('#priceError');
const typeError = document.querySelector('#typeError');
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

        // console.log(this.#balance,this.#movements)
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
    </thead>`;
        table.innerHTML = markup;
        this.#movements.forEach(ele=>this.renderData(ele));
    }
    renderData(_data){
        const  markup = `<tr class="data-field" data-id=${_data.id}>
        <td class="type-field">${_data.type}</td>
        <td class="description-field">${_data.desp}</td>
        <td class="amount-field">${_data.amount}</td>
        <td><button id='del-${_data.id}'>Delete</button></td>
        </tr> `;
        table.insertAdjacentHTML('beforeend',markup);
        this.addDeleteButtonHandler(_data.id);
    }
    updateMovements(data){
        // CHECK IF MOVMENT IS VALID
        console.log(typeof data.amount)

        this.#movements.push(data);
        localStorage.setItem('movements',JSON.stringify(this.#movements));

        this.updateBalance(data.amount);
        this.renderData(data);
        this.renderBalance();
    }

    renderBalance(){
        balanceField.textContent = this.#balance;
        this.#balance >= 0 ? balanceField.style.color = `green` : balanceField.style.color = `red`;
    }
    addData(e){
        e.preventDefault();
        let desp = null;
        let check = false;
        if(inputType.value === 'Select'){
            desp = despError.textContent;
            typeError.textContent = `Only Income and Expense are allowed!!!`
            typeError.closest('.popup').classList.add('show');
            check = true;
        }
        // console.log(inputDesp.value.length)
        if(!inputDesp.value || inputDesp.value.length > 128){
            despError.textContent = `Despcription should be between 1 and 128 characters, Thank you!`;
            despError.closest('.popup').classList.add('show');
            check = true;

        }

        if(!inputPrice.value || !Number(inputPrice.value)){
            priceError.closest('.popup').classList.add('show');
            check = true;
        }
        if(check){
            return;
        }
        check = false;
        despError.closest('.popup').classList.remove('show');   
        typeError.closest('.popup').classList.remove('show');
        priceError.closest('.popup').classList.remove('show');
        this.updateMovements(new data(inputType.value,inputDesp.value,inputPrice.value));
        this.clearInput();
    }
    clearInput(){
        document.querySelectorAll('input').forEach(ele=>{
            if(ele.type!=='submit') ele.value = '';
        })
        inputType.children[0].selected = true;
        inputType.children[1].selected = false;
        inputType.children[2].selected = false;
        window.requestAnimationFrame(this.color.bind(this));
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
        // console.log(document.getElementsByClassName('data-field'),`helllo`);
        this.renderBalance();
    }

    color(){
        if(inputType.value==='Income'){
            inputSubmit.style.background = inputDesp.style.borderColor = inputPrice.style.borderColor = 'green';
            inputSubmit.style.color = 'white';
        }else if(inputType.value == 'Expense'){
            inputSubmit.style.background = inputDesp.style.borderColor = inputPrice.style.borderColor = 'red';
            inputSubmit.style.color = 'white';
        }else{
            inputSubmit.style.background = inputDesp.style.borderColor = inputPrice.style.borderColor = '';
            inputSubmit.style.color = 'black';
        }
    }
    addHandler(){
        document.querySelector('#form').addEventListener('submit',this.addData.bind(this));
        window.addEventListener('load',this.color.bind(this));
        inputType.addEventListener('change',this.color.bind(this));
    }
    
    
    delButton(e){
        let text = `Do you really want to delete the element`;
        if (confirm(text)) {
            this.deleteMovement(e.target.id.slice(4))
            e.target.closest('.data-field').remove();
        }
    }

    addDeleteButtonHandler(id){
        document.querySelector(`#del-${id}`).addEventListener('click',this.delButton.bind(this));
    }
}
const app = new App();

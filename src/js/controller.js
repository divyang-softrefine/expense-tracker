const positive_table = document.querySelector('.table-positive');
const negative_table = document.querySelector('.table-negative');
const balanceField = document.querySelector('#current-balance');
const inputType = document.querySelector('#inputType');
const inputDesp = document.querySelector('#inputDesp');
const inputPrice = document.querySelector('#inputPrice');
const inputSubmit = document.querySelector('#submitBtn');
const despError = document.querySelector('#despError');
const priceError = document.querySelector('#priceError');
const typeError = document.querySelector('#typeError');
const totalPositive = document.querySelector('.total-positive');
const totalNegative = document.querySelector('.total-negative');

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    // minimumFractionDigits: 10, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    // maximumFractionDigits: 80, // (causes 2500.99 to be printed as $2,501)
});

class data{
    constructor(type,desp,amount){
        this.id = String(new Date().getTime()).slice(6);
        this.type = type;
        this.desp = desp;
        this.amount = +amount;
    }
}

class App{
    
    #balance;
    #movements;
    #positive_movements;
    #negative_movements;
    constructor(){

        if(localStorage.getItem('positive-movements')){
            this.#positive_movements = JSON.parse(localStorage.getItem('positive-movements'));

        }else{
            this.#positive_movements = [];
            localStorage.setItem('positive-movements',[])
        }
        if(localStorage.getItem('negative-movements')){

            this.#negative_movements = JSON.parse(localStorage.getItem('negative-movements'));
        }else{
            this.#negative_movements = [];
            localStorage.setItem('negative-movements',[]);
        }

        this.loadBalance()
        this.renderBalance();
        this.onLoad();
        this.addHandler();
        this.renderTotals();
        // console.log(this.#balance,this.#movements)
    }
    loadBalance(){
        this.#balance = 0;
        this.#positive_movements.forEach(ele=>this.#balance+=ele.amount);
        this.#negative_movements.forEach(ele=>this.#balance-=ele.amount);

        localStorage.setItem(`balance`,JSON.stringify(this.#balance))
    }
    updateBalance(amount,negative = false){
        if(negative)
            this.#balance -= amount;
        else
            this.#balance += amount;

        localStorage.setItem('balance',this.#balance);
    }
    onLoad(){
        let markup = `<thead>
        <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Edit</th>
        </tr>
    </thead>`;
        positive_table.innerHTML = markup;
        this.#positive_movements.forEach(ele=>this.renderData(ele,positive_table));

        negative_table.innerHTML = markup;
        this.#negative_movements.forEach(ele=>this.renderData(ele,negative_table));
    }
    renderData(_data,table){
        const  markup = `<tr class="data-field" data-id=${_data.id}>
        <td class="description-field">${_data.desp}</td>
        <td class="amount-field">${table===positive_table ? formatter.format(_data.amount):formatter.format(-_data.amount)}</td>
        <td><button id='del-${_data.id}'>Delete</button></td>
        </tr> `;
        table.insertAdjacentHTML('beforeend',markup);
        this.addDeleteButtonHandler(_data.id);
    }
    updateMovements(data){
        // CHECK IF MOVMENT IS VALID
        // console.log(typeof data.amount)
        if(data.type === 'Income'){
            this.#positive_movements.push(data);

            localStorage.setItem('positive-movements',JSON.stringify(this.#positive_movements));
            this.updateBalance(data.amount);
            this.renderData(data,positive_table);
        }
        else{
            this.#negative_movements.push(data);
            localStorage.setItem('negative-movements',JSON.stringify(this.#negative_movements));

            this.updateBalance(data.amount,true);
            this.renderData(data,negative_table);
        }
        this.renderBalance();
    }

    renderTotals(){
        let neg_sum = 0;
        for(let i = 0; i < this.#negative_movements.length; i++)
            neg_sum+=this.#negative_movements[i].amount;
        let pos_sum = 0;
        for(let i = 0; i < this.#positive_movements.length; i++)
            pos_sum+=this.#positive_movements[i].amount;
        
        totalNegative.textContent = `${pos_sum === 0 ? `` : `(${Math.round((neg_sum/pos_sum )* 100)}%)`} ${formatter.format(neg_sum)}`;
        totalPositive.textContent =  `${formatter.format(pos_sum)}`;
    }

    renderBalance(){
        balanceField.textContent = formatter.format(this.#balance);
        this.#balance >= 0 ? balanceField.style.color = `green` : balanceField.style.color = `red`;

        this.renderTotals();
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
        }else{
        typeError.closest('.popup').classList.remove('show');
        }
        // console.log(inputDesp.value.length)
        if(!inputDesp.value ||(inputDesp.value && inputDesp.value.length > 128) ){
            if(!inputDesp.value){
                despError.textContent = `Please add Description`;
                despError.closest('.popup').classList.add('show');
                setTimeout(()=>{despError.closest('.popup').classList.remove('show')},5000);
                check = true;
            }
            if(inputDesp.value && inputDesp.value.length > 128){
                despError.textContent = `Despcription should be between 1 and 128 characters, Thank you!`;
                despError.closest('.popup').classList.add('show');
                setTimeout(()=>{despError.closest('.popup').classList.remove('show')},5000);
                check = true;
            }
        }else{
            despError.closest('.popup').classList.remove('show');
        }

        if(!inputPrice.value || !Number(inputPrice.value) ||Number(inputPrice.value) < 0){
            priceError.closest('.popup').classList.add('show');
            setTimeout(()=>{priceError.closest('.popup').classList.remove('show')},5000);
            check = true;
        }else{
            priceError.closest('.popup').classList.remove('show');
        }
        if(check){
            return;
        }
        check = false;
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
        for(let i = 0;i < this.#positive_movements.length; i++){
            if(this.#positive_movements[i].id === id)
            {   this.#balance -= +this.#positive_movements[i].amount;
                localStorage.setItem('balance',this.#balance);
                this.#positive_movements.splice(i,1);
                localStorage.setItem('positive-movements',JSON.stringify(this.#positive_movements))
                break;
            }
        }
        for(let i = 0;i < this.#negative_movements.length; i++){
            if(this.#negative_movements[i].id === id)
            {   this.#balance += +this.#negative_movements[i].amount;
                localStorage.setItem('balance',this.#balance);
                this.#negative_movements.splice(i,1);
                localStorage.setItem('negative-movements',JSON.stringify(this.#negative_movements))
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

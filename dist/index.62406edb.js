const table = document.querySelector(".table");
const balanceField = document.querySelector("#current-balance");
const inputType = document.querySelector("#inputType");
const inputDesp = document.querySelector("#inputDesp");
const inputPrice = document.querySelector("#inputPrice");
const inputSubmit = document.querySelector("#submitBtn");
class data {
    constructor(type, desp, amount){
        this.id = String(new Date().getTime()).slice(6);
        this.type = type;
        this.desp = desp;
        this.amount = type === "Income" ? +amount : -amount;
    }
}
class App {
    #balance;
    #movements;
    constructor(){
        if (localStorage.getItem("movements")) this.#movements = JSON.parse(localStorage.getItem("movements"));
        else {
            this.#movements = [];
            localStorage.setItem("movements", []);
        }
        this.loadBalance();
        this.renderBalance();
        this.onLoad();
        this.addHandler();
    // console.log(this.#balance,this.#movements)
    }
    loadBalance() {
        this.#balance = 0;
        this.#movements.forEach((ele)=>this.#balance += ele.amount);
        localStorage.setItem(`balance`, JSON.stringify(this.#balance));
    }
    updateBalance(amount) {
        this.#balance += amount;
        localStorage.setItem("balance", this.#balance);
    }
    onLoad() {
        let markup = `<thead>
        <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Edit</th>
        </tr>
    </thead>`;
        table.innerHTML = markup;
        this.#movements.forEach((ele)=>this.renderData(ele));
    }
    renderData(_data) {
        const markup = `<tr class="data-field" data-id=${_data.id}>
        <td class="type-field">${_data.type}</td>
        <td class="description-field">${_data.desp}</td>
        <td class="amount-field">${_data.amount}</td>
        <td><button id='del-${_data.id}'>Delete</button></td>
        </tr> `;
        table.insertAdjacentHTML("beforeend", markup);
        this.addDeleteButtonHandler(_data.id);
    }
    updateMovements(data1) {
        this.#movements.push(data1);
        localStorage.setItem("movements", JSON.stringify(this.#movements));
        const movement = this.#movements.at(-1);
        this.updateBalance(movement.amount);
        this.renderData(movement);
        this.renderBalance();
    }
    renderBalance() {
        balanceField.textContent = this.#balance;
        this.#balance >= 0 ? balanceField.style.color = `green` : balanceField.style.color = `red`;
    }
    addData(e) {
        e.preventDefault();
        if ([
            ...e.target.children
        ].find((ele)=>ele.value === "")) alert("Please fill all details necessary");
        else this.updateMovements(new data(e.target.children[0].value, e.target.children[1].value, e.target.children[2].value));
        this.clearInput();
    }
    clearInput() {
        document.querySelectorAll("input").forEach((ele)=>{
            if (ele.type !== "submit") ele.value = "";
        });
    }
    deleteMovement(id) {
        for(let i = 0; i < this.#movements.length; i++)if (this.#movements[i].id === id) {
            this.#balance -= +this.#movements[i].amount;
            localStorage.setItem("balance", this.#balance);
            this.#movements.splice(i, 1);
            localStorage.setItem("movements", JSON.stringify(this.#movements));
            break;
        }
        // console.log(document.getElementsByClassName('data-field'),`helllo`);
        this.renderBalance();
    }
    color() {
        inputSubmit.style.background = inputType.style.background = inputDesp.style.borderColor = inputPrice.style.borderColor = inputType.value === "Income" ? "green" : "red";
    }
    addHandler() {
        document.querySelector("#form").addEventListener("submit", this.addData.bind(this));
        window.addEventListener("load", this.color.bind(this));
        inputType.addEventListener("change", this.color.bind(this));
    }
    delButton(e) {
        this.deleteMovement(e.target.id.slice(4));
        e.target.closest(".data-field").remove();
    }
    addDeleteButtonHandler(id) {
        document.querySelector(`#del-${id}`).addEventListener("click", this.delButton.bind(this));
    }
}
const app = new App();

//# sourceMappingURL=index.62406edb.js.map

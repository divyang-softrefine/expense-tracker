const table=document.querySelector(".table"),balanceField=document.querySelector("#current-balance"),inputType=document.querySelector("#inputType"),inputDesp=document.querySelector("#inputDesp"),inputPrice=document.querySelector("#inputPrice"),inputSubmit=document.querySelector("#submitBtn"),despError=document.querySelector("#despError"),priceError=document.querySelector("#priceError"),typeError=document.querySelector("#typeError");class data{constructor(e,t,n){this.id=String((new Date).getTime()).slice(6),this.type=e,this.desp=t,this.amount="Income"===e?+n:-n}}class App{#e;#t;constructor(){localStorage.getItem("movements")?this.#t=JSON.parse(localStorage.getItem("movements")):(this.#t=[],localStorage.setItem("movements",[])),this.loadBalance(),this.renderBalance(),this.onLoad(),this.addHandler()}loadBalance(){this.#e=0,this.#t.forEach((e=>this.#e+=e.amount)),localStorage.setItem("balance",JSON.stringify(this.#e))}updateBalance(e){this.#e+=e,localStorage.setItem("balance",this.#e)}onLoad(){table.innerHTML="<thead>\n        <tr>\n            <th>Type</th>\n            <th>Description</th>\n            <th>Amount</th>\n            <th>Edit</th>\n        </tr>\n    </thead>",this.#t.forEach((e=>this.renderData(e)))}renderData(e){const t=`<tr class="data-field" data-id=${e.id}>\n        <td class="type-field">${e.type}</td>\n        <td class="description-field">${e.desp}</td>\n        <td class="amount-field">${e.amount}</td>\n        <td><button id='del-${e.id}'>Delete</button></td>\n        </tr> `;table.insertAdjacentHTML("beforeend",t),this.addDeleteButtonHandler(e.id)}updateMovements(e){console.log(typeof e.amount),this.#t.push(e),localStorage.setItem("movements",JSON.stringify(this.#t)),this.updateBalance(e.amount),this.renderData(e),this.renderBalance()}renderBalance(){balanceField.textContent=this.#e,this.#e>=0?balanceField.style.color="green":balanceField.style.color="red"}addData(e){e.preventDefault();let t=null,n=!1;"Select"===inputType.value?(t=despError.textContent,typeError.textContent="Only Income and Expense are allowed!!!",typeError.closest(".popup").classList.add("show"),n=!0):typeError.closest(".popup").classList.remove("show"),!inputDesp.value||inputDesp.value&&inputDesp.value.length>128?(inputDesp.value||(despError.textContent="Please add Description",despError.closest(".popup").classList.add("show"),n=!0),inputDesp.value&&inputDesp.value.length>128&&(despError.textContent="Despcription should be between 1 and 128 characters, Thank you!",despError.closest(".popup").classList.add("show"),n=!0)):despError.closest(".popup").classList.remove("show"),!inputPrice.value||!Number(inputPrice.value)||Number(inputPrice.value)<0?(priceError.closest(".popup").classList.add("show"),n=!0):priceError.closest(".popup").classList.remove("show"),n||(n=!1,this.updateMovements(new data(inputType.value,inputDesp.value,inputPrice.value)),this.clearInput())}clearInput(){document.querySelectorAll("input").forEach((e=>{"submit"!==e.type&&(e.value="")})),inputType.children[0].selected=!0,inputType.children[1].selected=!1,inputType.children[2].selected=!1,window.requestAnimationFrame(this.color.bind(this))}deleteMovement(e){for(let t=0;t<this.#t.length;t++)if(this.#t[t].id===e){this.#e-=+this.#t[t].amount,localStorage.setItem("balance",this.#e),this.#t.splice(t,1),localStorage.setItem("movements",JSON.stringify(this.#t));break}this.renderBalance()}color(){"Income"===inputType.value?(inputSubmit.style.background=inputDesp.style.borderColor=inputPrice.style.borderColor="green",inputSubmit.style.color="white"):"Expense"==inputType.value?(inputSubmit.style.background=inputDesp.style.borderColor=inputPrice.style.borderColor="red",inputSubmit.style.color="white"):(inputSubmit.style.background=inputDesp.style.borderColor=inputPrice.style.borderColor="",inputSubmit.style.color="black")}addHandler(){document.querySelector("#form").addEventListener("submit",this.addData.bind(this)),window.addEventListener("load",this.color.bind(this)),inputType.addEventListener("change",this.color.bind(this))}delButton(e){confirm("Do you really want to delete the element")&&(this.deleteMovement(e.target.id.slice(4)),e.target.closest(".data-field").remove())}addDeleteButtonHandler(e){document.querySelector(`#del-${e}`).addEventListener("click",this.delButton.bind(this))}}const app=new App;
//# sourceMappingURL=index.d8e30473.js.map

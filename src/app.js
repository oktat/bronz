const nameElem = document.querySelector('#name');
const cityElem = document.querySelector('#city');
const salaryElem = document.querySelector('#salary');
const addButton = document.querySelector('#addButton');
const employeesTable = document.querySelector('#employeesTable');
const getEmpButton = document.querySelector('#getEmpButton');

const edited_idElem = document.querySelector('#edited_id');
const edited_nameElem = document.querySelector('#edited_name');
const edited_cityElem = document.querySelector('#edited_city');
const edited_salaryElem = document.querySelector('#edited_salary');
const saveButton = document.querySelector('#saveButton');


var tbody = document.createElement('tbody');
var actualTr = null;

const server = 'http://localhost:3000/';

( () => {
    employeesTable.innerHTML = '';
    console.log('működik')
    let endpoint = 'employees';
    let url = server + endpoint;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        
        renderTable(data)
    })
    .catch(err => {
        console.log(err);
    });
})();

var renderTable = (employees) => {
    console.log(employees)

    let thead = document.createElement('thead');
    let trh = document.createElement('tr');
    let thId = document.createElement('th');
    let thName = document.createElement('th');
    let thCity = document.createElement('th');
    let thSalary = document.createElement('th');
    thId.textContent = 'Id';
    thName.textContent = 'Név';
    thCity.textContent = 'Település';
    thSalary.textContent = 'Fizetés';    
    trh.appendChild(thId);
    trh.appendChild(thName);
    trh.appendChild(thCity);
    trh.appendChild(thSalary);
    thead.appendChild(trh);
    employeesTable.appendChild(thead);    
    tbody = document.createElement('tbody');
    employeesTable.appendChild(tbody);

    employees.forEach( employee => {
        let tr = document.createElement('tr');
        let tdId = document.createElement('td');
        let tdName = document.createElement('td');
        let tdCity = document.createElement('td');
        let tdSalary = document.createElement('td');
        let tdButton = document.createElement('td');
        let btnEdit = document.createElement('button');
        setBtnEdit(btnEdit, employee);
        let btnDel = document.createElement('button');
        setBtnDel(btnDel, employee.id)
        tdId.textContent = employee.id;
        tdName.textContent = employee.name;
        tdCity.textContent = employee.city;
        tdSalary.textContent = employee.salary;
        tdButton.appendChild(btnEdit);
        tdButton.appendChild(btnDel);
        tr.appendChild(tdId);
        tr.appendChild(tdName);
        tr.appendChild(tdCity);
        tr.appendChild(tdSalary);
        tr.append(tdButton);
        tbody.appendChild(tr);
        
    });
};

var setBtnEdit = (btnEdit, employee) => {
    btnEdit.classList.add('btn');
    btnEdit.classList.add('btn-info');
    btnEdit.setAttribute('data-empid', employee.id);
    btnEdit.setAttribute('data-empname', employee.name);
    btnEdit.setAttribute('data-empcity', employee.city);
    btnEdit.setAttribute('data-empsalary', employee.salary);
    btnEdit.textContent = 'Szerkesztés';
    btnEdit.setAttribute('data-bs-toggle', 'modal');
    btnEdit.setAttribute('data-bs-target', '#editModal');
    btnEdit.addEventListener('click', () => {
        edited_idElem.value = btnEdit.dataset.empid;
        edited_nameElem.value = btnEdit.dataset.empname;
        edited_cityElem.value = btnEdit.dataset.empcity;
        edited_salaryElem.value = btnEdit.dataset.empsalary;
        actualTr = btnEdit.parentElement.parentElement;
    });
};

var setBtnDel = (btnDel, id) => {
    btnDel.classList.add('btn');
    btnDel.classList.add('btn-info');
    btnDel.classList.add('ms-1');
    btnDel.textContent = 'Törlés'
    btnDel.addEventListener('click', () => {
        var ans = confirm('Biztosan törlöd');
        if (ans) {
            deleteEmployee(id);
            actualTr = btnDel.parentElement.parentElement;
            actualTr.parentNode.removeChild(actualTr);
        }        
    });    
};

var deleteEmployee = id => {
    let endpoint = 'employees/' + id;
    let url = server + endpoint;
    fetch(url, {
        method: 'delete'
    })
    .catch(err => {
        console.log(err);
    });
};

addButton.addEventListener('click', () => {
    addEmployee();
});


var addEmployee = () => {
    let endpoint = 'employees';
    let url = server + endpoint

    let employee = {
        name: nameElem.value,
        city: cityElem.value,
        salary: salaryElem.value
    }

    fetch(url, {
        method: "post",
        body: JSON.stringify(employee),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then( response => response.json())
    .then( result => {
        console.log(result);
        addEmpoyeToTable(result);
    })
    .catch(err => {
        console.log(err);
    })
    ;
};

var addEmpoyeToTable = employee => {
    let tr = document.createElement('tr');
    let tdId = document.createElement('td');
    let tdName = document.createElement('td');
    let tdCity = document.createElement('td');
    let tdSalary = document.createElement('td');
    let tdButton = document.createElement('td');

    tdId.textContent = employee.id;
    tdName.textContent = employee.name;
    tdCity.textContent = employee.city;
    tdSalary.textContent = employee.salary;
    
    let btnEdit = document.createElement('button');
    let btnDel = document.createElement('button');
    tdButton.appendChild(btnEdit);
    tdButton.appendChild(btnDel);
    setBtnEdit(btnEdit, employee);
    setBtnDel(btnDel, employee);
    
    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdCity);
    tr.appendChild(tdSalary);
    tr.appendChild(tdButton);
    tbody.appendChild(tr);
};

saveButton.addEventListener('click', () => {
    actualTr.childNodes[1].textContent = edited_nameElem.value;
    actualTr.childNodes[2].textContent = edited_cityElem.value;
    actualTr.childNodes[3].textContent = edited_salaryElem.value;
    
    updateEmployee(edited_idElem.value);

});

var updateEmployee = (id) => {
    let endpoint = 'employees/' + id;
    let url = server + endpoint;
    console.log(url);

    fetch(url, {
        method: 'put',
        body: JSON.stringify({
            id: id,
            name: edited_nameElem.value,
            city: edited_cityElem.value,
            salary: edited_salaryElem.value
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });
};
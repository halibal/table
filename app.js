const form = document.querySelector('#form');
const table = document.querySelector('#table');
const errorInput = document.querySelector('#errorInput');
const errorTable = document.querySelector('#errorTable');

form.addEventListener("submit", (e) => {
    e.preventDefault();

    errorInput.innerText = ""; //remove error text

    const name = document.querySelector("#name");
    const point = document.querySelector("#point");

    // avoid further bugs in new editing entries, value check needs to be done here
    if (!name.value || isAllSpace(name.value)) {
        errorInput.innerText = "*You can't leave the name field blank..";
        return;
    };

    if (!isNaN(name.value)) {
        errorInput.innerText = "*You can't use only numbers in the name field..";
        return;
    }

    if (!point.value || isAllSpace(point.value)) {
        errorInput.innerText = "*You can't leave the point field blank..";
        return;
    };

    if (isNaN(point.value)) {
        errorInput.innerText = "*You must enter a number in the point field..";
        return;
    }

    console.log(name.value + ": " + point.value);

    registerEntry(name.value, point.value);
    updateIndex();
    calculateAverage();

    name.value = "";
    point.value = "";
});


// register entry by sending two parameters taken from the input fields
const registerEntry = (name, point) => {
    const newRow = createNewRow(name, point);
    placeRowsInTable(newRow);
};

// edit entry by clicking on the pencil icon
document.addEventListener("click", (e) => {
    if (e.target && e.target.id == "editEntry") {
        e.target.classList.add("d-none");

        let nameBox = e.target.closest("tr").querySelector("td:nth-child(2)");
        let pointBox = e.target.closest("tr").querySelector("td:nth-child(3)");

        e.target.closest("td").querySelector("#confirmEdit").classList.remove("d-none");
        e.target.closest("td").querySelector("#cancelEdit").classList.remove("d-none");

        e.target.closest("td").querySelector("#deleteEntry").classList.add("d-none");

        nameBox.contentEditable = "true";
        nameBox.setAttribute("class", "bg-warning");
        pointBox.contentEditable = "true";
        pointBox.setAttribute("class", "bg-warning");
    }
});


// delete entry by clicking on trash can icon
document.addEventListener("click", (e) => {
    if (e.target && e.target.id == "deleteEntry") {
        if (confirm("Are you sure you want to delete this entry?")) {
            e.target.closest("tr").remove();
            calculateAverage();
            updateIndex();
        };
    }
});

// confirm edit by clicking on check icon
document.addEventListener("click", (e) => {
    if (e.target && e.target.id == "confirmEdit") {
        let nameBox = e.target.closest("tr").querySelector("td:nth-child(2)");
        let pointBox = e.target.closest("tr").querySelector("td:nth-child(3)");

        // check if innerHTML is NaN or empty and return
        if (isNaN(pointBox.innerHTML) || (!Number(pointBox.innerHTML) && Number(pointBox.innerHTML) != 0)) {
            errorTable.innerText = "Please enter a valid number..";
            return;
        }

        if (pointBox.innerHTML === "") {
            errorTable.innerText = "*Please do not leave point field empty..";
            return;
        }

        if (parseInt(nameBox.innerHTML)) {
            errorTable.innerText = "*You can't use only numbers in the name field..";
            return;
        }

        if (!isNaN(nameBox.innerText)) {
            errorTable.innerText = "*You can't leave name field empty..";
            return;
        };

        e.target.classList.add("d-none");
        e.target.closest("td").querySelector("#cancelEdit").classList.add("d-none");

        e.target.closest("td").querySelector("#editEntry").classList.remove("d-none");
        e.target.closest("td").querySelector("#deleteEntry").classList.remove("d-none");

        e.target.closest("tr").dataset.name = nameBox.innerHTML;
        e.target.closest("tr").dataset.point = pointBox.innerHTML;

        nameBox.contentEditable = "false";
        nameBox.removeAttribute("class", "bg-warning");
        pointBox.contentEditable = "false";
        pointBox.removeAttribute("class", "bg-warning");

        errorTable.innerText = "";
        calculateAverage();
    }
});



// cancel edit by clicking on the "X" mark
document.addEventListener('click', (e) => {
    if (e.target && e.target.id == 'cancelEdit') {
        e.target.classList.add("d-none");

        let nameBox = e.target.closest("tr").querySelector("td:nth-child(2)");
        let pointBox = e.target.closest("tr").querySelector("td:nth-child(3)");
        e.target.closest("td").querySelector("#confirmEdit").classList.add("d-none");

        e.target.closest("td").querySelector("#editEntry").classList.remove("d-none");
        e.target.closest("td").querySelector("#deleteEntry").classList.remove("d-none");

        nameBox.contentEditable = "false";
        nameBox.removeAttribute("class", "bg-warning");
        nameBox.innerHTML = e.target.closest("tr").dataset.name;
        pointBox.innerHTML = e.target.closest("tr").dataset.point;

        pointBox.contentEditable = "false";
        pointBox.removeAttribute("class", "bg-warning");

        errorTable.innerText = "";
        calculateAverage();
    };
});



// create new row by sending two parameters which represent two input fields
const createNewRow = (name, point) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = ` <th scope="row">1</th>
                            <td>${name}</td>
                            <td>${point}</td>
                            <td>
                                <i id="editEntry" class="fa-solid fa-pencil mx-2"></i>
                                <i id="deleteEntry" class="fa-solid fa-trash-can mx-2"></i>
                                <i id="confirmEdit" class="d-none fa-solid fa-check mx-2"></i>
                                <i id="cancelEdit" class="d-none fa-solid fa-x mx-2"></i>
                            </td>
                            `
    newRow.setAttribute("data-name", name);
    newRow.setAttribute("data-point", point);

    const averageRow = document.createElement("tr");
    averageRow.innerHTML = `
                            <td class="text-end" colspan="2">Average</td>
                            <td id="average" class="text-center">0</td>
                            <td></td>
                            `


    if (document.querySelector("#table tbody").childNodes.length === 0) {
        document.querySelector("#table tbody").appendChild(averageRow);
    }

    return newRow;
};

// place created rows inside the table body
const placeRowsInTable = (row) => {
    table.querySelector("#table tbody").prepend(row);
};


// check if input consists of only spaces
const isAllSpace = (str) => {
    return /^\s*$/.test(str);
};


// update index number on start of every row
const updateIndex = () => {
    const allRows = document.querySelectorAll('#table tbody tr');
    allRows.forEach((row, index) => {
        if (row.querySelector("th")) {
            row.querySelector("th").innerHTML = index + 1;
        }
    });
};


// calcualte average by reading every value in the point column
const calculateAverage = () => {
    const allRows = document.querySelectorAll("#table tbody tr");
    let allRowsArr = Array.from(allRows);

    const sum = allRowsArr
        ? allRowsArr.reduce((sum, row) => {
            row.querySelector("td:nth-child(3)") && (sum += Number(row.querySelector("td:nth-child(3)").innerHTML));
            return sum;
        }, 0)
        : 0;

    let average = allRows.length == 1
        ? 0
        : (sum / (allRowsArr.length - 1)).toFixed(2); // since average row is also in the tbody, we need to subtract one from the array length

    document.querySelector("#average").innerHTML = average;
};
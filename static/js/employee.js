clocks_scroll = document.querySelector("#clocks-scroll");
clock_in_button = document.querySelector("#clock-in");
clock_out_button = document.querySelector("#clock-out");
employee_id_input = document.querySelector("#employee-id-input");
orders_scroll = document.querySelector("#orders-scroll");
let back_button = document.querySelector("#back");

let bad_flash = (elem) => {
    elem.classList.add("bad-flash");
    setTimeout(() => {
        elem.classList.remove("bad-flash");
    }, 1000);
}

let populate_order_scroll = (scroll, arr) => {
    while (scroll.firstChild) {
        scroll.removeChild(scroll.firstChild);
    }
    for (let elem of arr) {
        let node = document.createElement("h1");
        node.classList.add("small");
        node.classList.add("outset");
        node.classList.add("card");
        let card = document.createTextNode(`[${elem.clockType.toUpperCase()}] ${elem.employeeName}, ${elem.clockTime}`);
        node.appendChild(card);
        scroll.appendChild(node);
    }
}

clock_in_button.addEventListener("click", async (e) => {
    if (employee_id_input.value != "") {
        let res = await fetch("/api/clock", {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clockType: "in",
                employeeID: employee_id_input.value
            })
        });
        employee_id_input.value = "";
        load_clocks();
    } else {
        bad_flash(employee_id_input);
    }
});

clock_out_button.addEventListener("click", async (e) => {
    if (employee_id_input.value != "") {
        let res = await fetch("/api/clock", {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clockType: "out",
                employeeID: employee_id_input.value
            })
        });
        employee_id_input.value = "";
        load_clocks();
    } else {
        bad_flash(employee_id_input);
    }
});

let load_clocks = async () => {
    let res = await fetch("/api/clocks");
    let clockTimes = await res.json();
    populate_order_scroll(clocks_scroll, clockTimes);
}

load_clocks();

let orders = [];

let load_orders = async () => {
    let orders_res = await fetch("/api/orders");
    orders = await orders_res.json();
    for (let order of orders) {
        let title = document.createElement("h1");
        title.classList.add("medium");
        title.classList.add("outset");
        title.classList.add("card");
        let title_text = document.createTextNode(`${order.customerName}, $${order.totalPrice}, ${order.orderTime}`);
        title.appendChild(title_text);
        let scroll_div = document.createElement("div");
        scroll_div.classList.add("vertical-scroll-div");
        scroll_div.classList.add("hidden-scrollbar");
        scroll_div.classList.add("wrapped");
        scroll_div.classList.add("inset");
        scroll_div.classList.add("card");
        title.appendChild(scroll_div);
        let items_res = await fetch(`/api/orders?order_id=${order.orderID}`);
        items = await items_res.json();
        for (let item of items) {
            console.log(item);
            let item_title = document.createElement("h1");
            item_title.classList.add("small");
            item_title.classList.add("outset");
            item_title.classList.add("card");
            let item_title_text = document.createTextNode(`${item.dishQuantity}x ${item.dishName}`);
            item_title.appendChild(item_title_text);
            scroll_div.appendChild(item_title);
        }
        let sub_text = document.createTextNode(`${order.orderType}, ${order.specialRequests}`);
        title.appendChild(sub_text);
        orders_scroll.appendChild(title);
    }
}

load_orders();

back_button.addEventListener("click", (e) => {
    window.location.href = "/";
})
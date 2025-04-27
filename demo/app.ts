console.log("Hello World");

let baseUrl = 'https://dae-mobile-assignment.hkit.cc/api'

let items = [1,2,3]

function loadItems() {
    let toekn = ''
    fetch('${baseUrl}/courses', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(json => {
        console.log('Items:' , json.item_ids)
    } => {
        console.log("items:", data)
    })
}

console.log("items:", items)


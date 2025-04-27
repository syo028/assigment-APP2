let baseUrl = 'https://dae-mobile-assignment.hkit.cc/api'

//let items = [1,2,3]

async function loadItems() {
    let token = ''
    let res = await fetch(`${baseUrl}/courses`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}` }
    })
    let json = await res.json()

        console.log('json:' , json)
}
loadItems()

//console.log("items:", items)


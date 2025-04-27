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
    if (json.error) {
        alert(json.error)
        return
    }

    type Item = {
        id: number,
        tags: string[],
        item_id: number,
        language: string,
        level: string,
        title: string,
        description: string,
        category: string,
        image_url: string,
        video_url: string
    }

    let items = json.items.map(item: Item =>{
        return {
            id: item.id,
            title: item.title,
            level: item.level,
            domain: item.category,
            description: item.description,
            tags: item.tags,
            imageUrl: item.image_url,
            videoUrl: item.video_url
    }
    console.log("items:", items)

        console.log('json:' , json)}
loadItems()




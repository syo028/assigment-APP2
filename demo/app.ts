import { IonButton } from '@ionic/core/components/ion-button'
import { IonToast } from '@ionic/core/components/ion-toast'

let baseUrl = 'https://dae-mobile-assignment.hkit.cc/api'

//let items = [1,2,3]

declare var refreshButton: IonButton
declare var toast: IonToast

refreshButton?.addEventListener('click', loadItems)

async function loadItems() {
    let token = ''
    let res = await fetch(`${baseUrl}/courses`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}` }
    })
    let json = await res.json()
    if (json.error) {
        toast.message = json.error
        toast.duration = 3000
        toast.color = 'danger'
        toast.present()
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

    let items = json.items.map((item: Item) => {
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
})
    console.log("items:", items)

}
loadItems()




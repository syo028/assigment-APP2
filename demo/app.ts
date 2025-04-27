import { IonButton } from '@ionic/core/components/ion-button'
import { IonToast } from '@ionic/core/components/ion-toast'
import { IonList } from '@ionic/core/components/ion-list'
let baseUrl = 'https://dae-mobile-assignment.hkit.cc/api'

//let items = [1,2,3]

declare var refreshButton: IonButton
refreshButton?.addEventListener('click', loadItems)


declare var errorToast: IonToast
declare var courseList: IonList

let skeletonItem = courseList.querySelector('.skeleton-item')!
skeletonItem.remove()

declare var loadMoreButton: IonButton
loadMoreButton.addEventListener('click', loadMoreItems)

let page = 1

async function loadItems() {
    courseList.textContent = ''
    courseList.appendChild(skeletonItem.cloneNode(true))
    courseList.appendChild(skeletonItem.cloneNode(true))
    courseList.appendChild(skeletonItem.cloneNode(true))
    let token = ''
    let params = new URLSearchParams()
    params.set('page', page.toString())
    let res = await fetch(`${baseUrl}/courses?${params}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}` }
    })
    let json = await res.json() as Result
    if (json.error) {
        errorToast.message = json.error
        errorToast.duration = 3000
        errorToast.color = 'danger'
        errorToast.present()
        courseList.textContent = ''
        return
    }
    errorToast.dismiss()

    let maxPage = Math.ceil(json.pagination.total / json.pagination.limit)

    loadMoreButton.hidden = json.pagination.page >= maxPage

    type Result = {
        error: string,
        items: ServerItem[],
        pagination: {
            page: number,
            limit: number,
            total: number
        }
    }

    type ServerItem = {
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

    let ServerItems = json.items as ServerItem[]
    let uiItems = ServerItems.map((item: ServerItem) => {
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
    console.log("items:", uiItems)

    courseList.textContent = ''
    for(let item of uiItems){
        let card = document.createElement('ion-card')
        card.innerHTML = `
        <ion-card-header>
            <ion-card-title>${item.title}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
        `
        courseList.appendChild(card)
    }
}

loadItems()

function loadMoreItems(){
    page++
    loadItems()
}




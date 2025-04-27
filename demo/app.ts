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

// declare var loadMoreButton: IonButton
// loadMoreButton.addEventListener('click', loadMoreItems)

let page = 1

declare var prevPageButton: IonButton
prevPageButton.addEventListener('click', () => {
  page--
  loadItems()
})

declare var nextPageButton: IonButton
nextPageButton.addEventListener('click', () => {
  page++
  loadItems()
})

let itemCardTemplate = courseList.querySelector('.item-card')!
itemCardTemplate.remove()

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

    prevPageButton.hidden = json.pagination.page <= 1
    nextPageButton.hidden = json.pagination.page >= maxPage

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

    let items = json.items as ServerItem[]
    
    console.log('items:', items)

    courseList.textContent = ''
    for(let item of items){
        let card = itemCardTemplate.cloneNode(true) as HTMLIonCardElement
        card.querySelector('.item-title')!.textContent = item.title

        let favoriteButton = card.querySelector('.favorite-button')!
        let favoriteIcon = favoriteButton.querySelector('ion-icon')!
        let hasBookmarked = false
        favoriteIcon.name = hasBookmarked ? 'heart' : 'heart-outline'
        favoriteButton.addEventListener('click', () => {
            hasBookmarked = !hasBookmarked
            favoriteIcon.name = hasBookmarked ? 'heart' : 'heart-outline'
            if (hasBookmarked) {
                favoriteButton.classList.add('active')
            } else {
                favoriteButton.classList.remove('active')
            }
            //todo call api to bookmark
        })

        let img = card.querySelector('.course-image') as HTMLImageElement
        img.src = item.image_url
        img.alt = item.title

        let courseMeta = card.querySelector('.course-meta')!
        courseMeta.innerHTML = `
            <span class="language">程式語言: Python 3.x</span>
            <span class="level">程度: ${item.level}</span>
        `

        card.querySelector('.course-description')!.textContent = item.description
        
        let tagContainer = card.querySelector<HTMLDivElement>('.tag-container')!
        let chipTemplate = tagContainer.querySelector<HTMLIonChipElement>('ion-chip')!
        chipTemplate.remove()

        for(let tag of item.tags){
            let chip = chipTemplate.cloneNode(true) as HTMLIonChipElement
            chip.textContent = tag
            chip.dataset.type = tag
            chip.addEventListener('click', () => {
                //filterByTag(tag)
            })
            tagContainer.appendChild(chip)
        }

        courseList.appendChild(card)
    }
}

loadItems()

function loadMoreItems(){
    page++
    loadItems()
}




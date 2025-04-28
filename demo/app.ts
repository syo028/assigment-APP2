import { IonButton } from '@ionic/core/components/ion-button'
import { IonToast } from '@ionic/core/components/ion-toast'
import { IonList } from '@ionic/core/components/ion-list'
import { IonModal } from '@ionic/core/components/ion-modal'


let baseUrl = 'https://dae-mobile-assignment.hkit.cc/api'

//let items = [1,2,3]

declare var refreshButton: IonButton
refreshButton?.addEventListener('click', loadItems)


declare var errorToast: IonToast

declare var loginModal: IonModal
declare var courseList: IonList

// 設置 errorToast 的默認屬性
//errorToast.duration = 3000
//errorToast.color = 'danger' 
//errorToast.position = 'bottom'

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

let token = localStorage.getItem('token')


async function loadItems() {
    courseList.textContent = ''
    courseList.appendChild(skeletonItem.cloneNode(true))
    courseList.appendChild(skeletonItem.cloneNode(true))
    courseList.appendChild(skeletonItem.cloneNode(true))
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
        items: Item[],
        pagination: {
            page: number,
            limit: number,
            total: number
        }
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

    let items = json.items as Item[]
    console.log('items:', items)

    let bookmarkedItemIds = await autoRetryGetBookmarks()
    courseList.textContent = ''
    for(let item of items){
        let card = itemCardTemplate.cloneNode(true) as HTMLIonCardElement
        card.querySelector('.item-title')!.textContent = item.title

        let favoriteButton = card.querySelector('.favorite-button')!
        let favoriteIcon = favoriteButton.querySelector('ion-icon')!
        favoriteIcon.name = bookmarkedItemIds.includes(item.id)
        ? 'heart' 
        : 'heart-outline'
        favoriteButton.addEventListener('click', async () => {
            
            if(!token){
                loginModal.present()
                return
            }
            
            try {
              await bookmarkItem(item.id)
              favoriteIcon.name = 'heart'
              errorToast.dismiss()
            } catch (error) {
              errorToast.message = String(error)
              errorToast.present()
            }
          })
            //hasBookmarked = !hasBookmarked
            //favoriteIcon.name = hasBookmarked ? 'heart' : 'heart-outline'

            //todo call api to bookmark
        

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
                //TODO: filterByTag(tag)
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

declare var usernameInput: HTMLIonInputElement
declare var passwordInput: HTMLIonInputElement
declare var loginButton: HTMLIonButtonElement
declare var registerButton: HTMLIonButtonElement

loginButton.addEventListener('click', async () => {
    await handleAuth('login')
  })
  
registerButton.addEventListener('click', async () => {
    await handleAuth('signup')
  })
  
  async function handleAuth(mode: 'signup' | 'login') {
    let username = usernameInput.value
    let password = passwordInput.value
  
    let res = await fetch(`${baseUrl}/auth/${mode}`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    let json = await res.json()
    if (json.error) {
      errorToast.message = json.error
      errorToast.present()
      return
    }
    errorToast.dismiss()
    token = json.token
    localStorage.setItem('token', json.token)
    loginModal.dismiss()
    // TODO load bookmarks
  }
  async function bookmarkItem(item_id: number) {
    let res = await fetch(`${baseUrl}/bookmarks/${item_id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    let json = await res.json()
    if (json.error) {
      throw json.error
    }
  }
  async function unBookmarkItem(item_id: number, icon: HTMLIonIconElement) {
    try {
      // TODO call server API
      throw 'TODO: call server API'
    } catch (error) {
      errorToast.message = String(error)
      errorToast.present()
    }
  }
  async function getBookmarks() {
    let res = await fetch(`${baseUrl}/bookmarks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    let json = await res.json()
    if (json.error) {
      throw json.error
    }
    return json.item_ids as number[]
  }
  
  async function autoRetryGetBookmarks() {
    let error = null
    for (let i = 0; i < 3; i++) {
      try {
        let itemIds = await getBookmarks()
        return itemIds
      } catch (err) {
        error = err
      }
    }
    throw error
  }
  
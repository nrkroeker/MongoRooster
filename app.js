class App {
  constructor(selectors) {
    this.chickens = []
    this.max = 0
    this.list = document
      .querySelector(selectors.listSelector)

    this.template = document
      .querySelector(selectors.templateSelector)

    document
      .querySelector(selectors.formSelector)
      .addEventListener('submit', this.createChicken.bind(this))

    this.loadList()
  }

  loadList() {
    // Get JSON list out of storage
    const chickensJSON = localStorage.getItem('chickens')

    // Turn the string into an array
    const chickensArray = JSON.parse(chickensJSON)

    // Fill this.chickens with that array
    if(chickensArray) {
      chickensArray
        .reverse()
        .map(this.addChicken.bind(this))
    }
  }

  saveList() {
    localStorage
      .setItem('chickens', JSON.stringify(this.chickens))
  }

  renderListItem(chicken) {
    const item = this.template.cloneNode(true)
    item.classList.remove('template')
    item.dataset.id = chicken.id
    item
      .querySelector('.chicken-name')
      .textContent = chicken.name

    if (chicken.fav) {
      item.classList.add('fav')
    }
  }

  addChicken(chicken) {
    const li = this.renderListItem(chicken)

    this.list
      .insertBefore(li, this.list.firstChild)

    if(chicken.id > this.max) {
      this.max = chicken.id
    }

    this.chickens.unshift(chicken)
    this.save()
  }

  createChicken(ev) {
    ev.preventDefault()

    const c = ev.target
    const chicken = {
      id: this.max + 1,
      name: c.chickenName.value,
      country: c.country.value,
      fav: false,
    }

    this.addChicken(chicken)

    f.reset()
  }
}

const app = new App({
  formSelector: '#chicken-form',
  listSelector: '#chicken-list',
  templateSelector: '.chicken.template',
})

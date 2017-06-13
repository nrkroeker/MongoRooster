class App {
  constructor(selectors) {
    this.chickens = []
    this.countries = []
    this.max = 0
    this.listTemplate = document
      .querySelector(selectors.listTemplateSelector)

    this.listBox = document
      .querySelector(selectors.listBoxSelector)

    this.template = document
      .querySelector(selectors.templateSelector)

    document
      .querySelector(selectors.formSelector)
      .addEventListener('submit', this.createChicken.bind(this))

    // this.loadList()
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
        .map(function() {
          // this.createCountry
          this.addChicken.bind(this)
        })
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

    item
      .querySelector('.chicken-name')
      .addEventListener('keypress', this.saveOnEnter.bind(this, chicken))

    item
      .querySelector('button.remove')
      .addEventListener('click', this.removeChicken.bind(this))
    item
      .querySelector('button.fav')
      .addEventListener('click', this.favChicken.bind(this, chicken))
    item
      .querySelector('button.move-up')
      .addEventListener('click', this.moveUp.bind(this, chicken))
    item
      .querySelector('button.move-down')
      .addEventListener('click', this.moveDown.bind(this, chicken))
    item
      .querySelector('button.edit')
      .addEventListener('click', this.edit.bind(this, chicken))
    return item
  }

  addChicken(chicken, countryList) {
    const li = this.renderListItem(chicken)

    countryList
      .appendChild(li)

    if(chicken.id > this.max) {
      this.max = chicken.id
    }

    this.chickens.unshift(chicken)
    this.saveList()
  }

  checkCountry(country) {
    console.log('checked country')
    for (var i = 0; i < this.countries.length; i++) {
      return this.countries[i] === country
    }
  }

  createCountry(ev, chicken) {
    ev.preventDefault()

    if(this.checkCountry(chicken.country)) {
      // Insert chicken into pre-existing country
      var countryList = document.querySelector('.chicken-list.' + chicken.country.toLowerCase())
      console.log('put it in the old country')
    } else {
      // Create new country list
      console.log('put it in the new country')
      var countryList = this.listTemplate.cloneNode(true)
      countryList = countryList.querySelector('ul')
      countryList.dataset.id = chicken.id

      countryList
        .classList.add(chicken.country.replace(/\s/g, '').toLowerCase())

      countryList
        .querySelector('.list-title')
        .textContent = chicken.country.toUpperCase()

      this.listBox
        .appendChild(countryList)

      this.countries.unshift(chicken.country.replace(/\s/g, '').toLowerCase())
    }

    return countryList
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

    this.addChicken(chicken, this.createCountry(ev, chicken))

    c.reset()
  }

  favChicken(chicken, ev) {
    const li = ev.target.closest('.chicken')
    chicken.fav = !chicken.fav

    if(chicken.fav) {
      li.classList.add('fav')
    } else {
      li.classList.remove('fav')
    }

    this.saveList()
  }

  removeChicken(ev, chicken) {
    const li = ev.target.closest('.chicken')

    for(let i = 0; i < this.chickens.length; i++) {
      const currentId = this.chickens[i].id.toString()

      if(li.dataset.id === currentId) {
        this.chickens.splice(i, 1)
        break
      }
    }

    li.remove()
    this.saveList()
  }

  moveUp(chicken, ev) {
    const li = ev.target.closest('.chicken')

    const index = this.chickens.findIndex((currentChicken, i) => {
      return currentChicken.id === chicken.id
    })

    if(index > 0) {
      this.list.insertBefore(li, li.previousElementSibling)

      const previousChicken = this.chickens[index - 1]
      this.chickens[index - 1] = chicken
      this.chickens[index] = previousChicken
      this.saveList()
    }
  }

  moveDown(chicken, ev) {
    const li = ev.target.closest('.chicken')

    const index = this.chickens.findIndex((currentChicken, i) => {
      return currentChicken.id === chicken.id
    })

    if(index < this.chickens.length - 1) {
      this.list.insertBefore(li.nextElementSibling, li)

      const nextChicken = this.chickens[index + 1]
      this.chickens[index + 1] = chicken
      this.chickens[index] = nextChicken
      this.saveList()
    }
  }

  edit(chicken, ev) {
    const li = ev.target.closest('.chicken')
    const nameField = li.querySelector('.chicken-name')

    const btn = li.querySelector('.edit.button')
    const icon = btn.querySelector('i.fa')

    if(nameField.isContentEditable) {
      nameField.contentEditable = false
      icon.classList.remove('fa-check')
      icon.classList.add('fa-pencil')
      btn.classList.remove('success')

      chicken.name = nameField.textContent
      this.saveList()
    } else {
      nameField.contentEditable = true
      nameField.focus()
      icon.classList.remove('fa-pencil')
      icon.classList.add('fa-check')
      btn.classList.add('success')
    }
  }

  saveOnEnter(chicken, ev) {
    if (ev.key === 'Enter') {
      this.edit(chicken, ev)
    }
  }
}

const app = new App({
  formSelector: '#chicken-form',
  listTemplateSelector: '.list-template',
  listBoxSelector: '.list-box',
  templateSelector: '.chicken.template',
})

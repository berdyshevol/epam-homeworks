const baseUrl = 'http://localhost:3000';
const appContainer = document.getElementById('app-container');

const AppService = {
  downloadAll() {

    this._persons = this._persons || [
      {"id":"5b9289","name":"Leanne Graham","username":"Bret","email":"Sincere@april.biz","address":{"street":"Kulas Light","suite":"Apt. 556","city":"Gwenborough","zipcode":"92998-3874","geo":{"lat":"-37.3159","lng":"81.1496"}},"phone":"1-770-736-8031 x56442","website":"hildegard.org","company":{"name":"Romaguera-Crona","catchPhrase":"Multi-layered client-server neural-net","bs":"harness real-time e-markets"}},
      {"id":"b477dc","name":"Ervin Howell","username":"Antonette","email":"Shanna@melissa.tv","address":{"street":"Victor Plains","suite":"Suite 879","city":"Wisokyburgh","zipcode":"90566-7771","geo":{"lat":"-43.9509","lng":"-34.4618"}},"phone":"010-692-6593 x09125","website":"anastasia.net","company":{"name":"Deckow-Crist","catchPhrase":"Proactive didactic contingency","bs":"synergize scalable supply-chains"}}
      ]
    return this._persons;
  },
  add(person) {
    this._persons.push(person);
  },
  getIndexById(id) {
    return this._persons.findIndex(man => man.id === id);
  },
  update(person) {
    const index = this.getIndexById(person.id);
    if (index === -1) {
      return;
    }
    this._persons[index] = person;
  },
  delete(person) {
    const index = this.getIndexById(person.id);
    if (index === -1) {
      return;
    }
    this._persons.splice(index, 1);
  }

};

const DOMService = {
  getClosestElement(event, selector) {
    return event.target.closest(selector)
  },
  getInfo(event, selector) {
    const row = this.getClosestElement(event, selector);
    return {
      id: row.querySelector('[data-component="id"]').dataset.id,
      name: row.querySelector('[data-component="name"]').value,
      username: row.querySelector('[data-component="username"]').value,
    };
  }
};

class Component {
  constructor({ element }) {
    this._element = element;
    this._callbackMap = {};
    this._render();
  }

  on(eventName, elementName, callback) {
    this._element.addEventListener(eventName, event => {
      const delegateTarget = event.target.closest(`[data-component="${ elementName }"]`);
      if (!delegateTarget || !this._element.contains(delegateTarget)) {
        return;
      }
      callback(event);
    });
  }

  subscribe(eventName, callback) {
    if (!this._callbackMap[eventName]) {
      this._callbackMap[eventName] = [];
    }
    this._callbackMap[eventName].push(callback);
  }

  emit(eventName, data) {
    const eventCallbacks = this._callbackMap[eventName];
    if (!eventCallbacks) {
      return;
    }
    eventCallbacks.forEach(callback => {
      callback(data);
    });
  }

  show() {
    this._element.hidden = false;
  }

  hide() {
    this._element.hidden = true;
  }

  _render() {
    throw new Error('_render() is not implemented in Component Class')
  }
}

class AppForm extends Component {
  constructor({ element }) {
    super({ element });
    this._onAllEvents();
  }

  _onAllEvents() {
    this.on('click', 'form-button-add-new-user', event =>
      this.emit('click-button-add-new-user', DOMService.getInfo(event, '.form'))
    );
  }

  clear() {
    this._element.querySelector('[data-component="name"]').value = '';
    this._element.querySelector('[data-component="username"]').value = '';
  }

  _render() {
    this._element.innerHTML = `
      <form data-component="form" class="form">
        <div data-id="" data-component="id"></div>
        <label>
          <input type="text" placeholder="Name" data-component="name">
        </label>
        <label>
          <input type="text" placeholder="Full Name" data-component="username">
        </label>
        <button type="button" data-component="form-button-add-new-user">
          Add New User
        </button>
      </form>
    `;
  }
}

class AppList extends Component {
  constructor({ element }) {
    super({ element });
    this._onAllEvents();
  }

  _onAllEvents() {
    this.on('click', 'list-row-button-update', event =>
      this.emit('click-button-update', DOMService.getInfo(event, '.row'))
    );
    this.on('click', 'list-row-button-delete', event =>
      this.emit('click-button-delete', DOMService.getInfo(event, '.row'))
    );
  }

  refresh() {
    this._render();
  }

  _render() {
    this._personList = AppService.downloadAll(); // TODO: отсюда надо будет убрать, чтобы какждый раз при рендоре не загружать !!!!!!!
    this._element.innerHTML = `
      <ul>
        ${ this._personList.map( person =>
          `<li class="row">
             <label  class="row__item row__label id">
               <div class="row__id" data-id="${ person.id }" data-component="id">${ person.id }</div>
             </label>
             <label  class="row__item row__label">
               <input type="text" class="row__input" data-component="name" value="${ person.name }">
             </label>
             <label class="row__item row__label">
               <input type="text" class="row__input" data-component="username" value="${ person.username }">
             </label>
             <div class="row__item row__button">
               <button type="button" data-component="list-row-button-update">Update</button>
             </div>
             <div class="row__item row__button">
               <button type="button" data-component="list-row-button-delete">Delete</button>
             </div>
           </li>`
        ).join(' ') }
      </ul>
    `;
  }
}

class UserAppPage {
  constructor({ element}) {
    this._element = element;
    this._render();
    this._initAppForm();
    this._initAppList();
  }

  _initAppForm() {
    this._appForm = new AppForm({
      element: this._element.querySelector('[data-component="app-form"]')
    });
    this._appForm.subscribe('click-button-add-new-user', person => {
      AppService.add(person);
      this._appList.refresh();
      this._appForm.clear();
      console.log('form-button-add-new-user is pressed', AppService.downloadAll())
    });
  }

  _initAppList() {
    this._appList = new AppList({
      element: this._element.querySelector('[data-component="app-list"]')
    });
    this._appList.subscribe('click-button-delete', person => {
      AppService.delete(person);
      this._appList.refresh();
      console.log('list-row-button-delete', AppService.downloadAll());
    });
    this._appList.subscribe('click-button-update', person => {
      AppService.update(person);
      this._appList.refresh();
      console.log('list-row-button-update', AppService.downloadAll())
    });
  }

  _render() {
    this._element.innerHTML = `
      <div class="app">
        <h1>Manager User App</h1>
        <div data-component="app-form" class="app__form"></div>
        <div data-component="app-list" class="app__list"></div>
      </div>
    `;
  }
}

const currentPage = new UserAppPage(
  {element: appContainer}
);


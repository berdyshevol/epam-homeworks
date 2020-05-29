const baseUrl = 'http://localhost:3000';
const appContainer = document.getElementById('app-container');

const AppService = {
  getAll(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", baseUrl + '/users');
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send();

    xhr.onload = () => {
      if (xhr.status != 200) { // HTTP ошибка?
        callback( [] );
        // console.log( 'Ошибка: ' + xhr.status);
      } else {
        // console.log( 'Good: ' + xhr.status);
        callback( JSON.parse(xhr.responseText) );
      }
    };
  },

  add(person, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST",
         baseUrl + '/users');
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify(this.getNameUsername(person)));

    xhr.onload = () => {
      if (xhr.status !== 201) {
        // console.log( 'Ошибка add: ' + xhr.status);
      } else {
        // console.log( 'сделал add: ' + xhr.status);
        callback();
      }
    };
  },

  update(person, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT",
      baseUrl + '/users/' + person.id);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify(this.getNameUsername(person)));

    xhr.onload = () => {
      if (xhr.status != 204) {
        // console.log( 'Ошибка update: ' + xhr.status);
      } else {
        // console.log( 'сделал update: ' + xhr.status);
        callback();
      }
    };
  },

  delete(person, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE",
      baseUrl + '/users/' + person.id);
    xhr.setRequestHeader('Authorization', 'admin');
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send();

    xhr.onload = () => {
      if (xhr.status != 204) {
        // console.log( 'Ошибка update: ' + xhr.status);
      } else {
        // console.log( 'сделал update: ' + xhr.status);
        callback();
      }
    };
  },

  getNameUsername(person) {
    return {
      name: person.name,
      username: person.username
    };
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
  },
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

  _buttonsDisable() {
    this._element
      .querySelector('[data-component="form-button-add-new-user"]')
      .disabled = true;
  }

  _buttonsEnable() {
    this._element
      .querySelector('[data-component="form-button-add-new-user"]')
      .disabled = false;
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
        <button type="button" data-component="form-button-add-new-user" class="form__button">
          Add New User
        </button>
      </form>
    `;
  }
}

class AppList extends Component {
  constructor({ element, loader }) {
    super({ element });
    this._onAllEvents();
    this._loadList(loader);
  }

  _onAllEvents() {
    this.on('click', 'list-row-button-update', event =>
      this.emit('click-button-update', DOMService.getInfo(event, '.row'))
    );
    this.on('click', 'list-row-button-delete', event =>
      this.emit('click-button-delete', DOMService.getInfo(event, '.row'))
    );
  }

  _buttonsDisable(person) {
    this._element
      .querySelector(`[data-button-update="${ person.id }"]`)
      .disabled = true;
    this._element
      .querySelector(`[data-button-delete="${ person.id }"]`)
      .disabled = true;
  }

  _buttonsEnable(person) {
    this._element
      .querySelector(`[data-button-update="${ person.id }"]`)
      .disabled = false;
    this._element
      .querySelector(`[data-button-delete="${ person.id }"]`)
      .disabled = false;
  }

  _loadList(loader) {
    loader.emit('loader-on');
    this.refresh( () => {
      loader.emit('loader-off');
    });
  }

  refresh(callback) {
    AppService.getAll( allPersons => {
      this._render(allPersons);
      callback();
    });

  }

  _render(personList = []) {
    this._element.innerHTML = `
    <ul>
      ${ personList.map( person =>
      `<li class="row">
           <label  class="row__item row__item--id">
             <div class="row__id" data-id="${ person.id }" data-component="id">${ person.id }</div>
           </label>
           <label  class="row__item">
             <input type="text" class="row__input" data-component="name" value="${ person.name }">
           </label>
           <label class="row__item">
             <input type="text" class="row__input" data-component="username" value="${ person.username }">
           </label>
           <div class="row__item row__item--button">
             <button type="button" 
                     data-component="list-row-button-update"
                     data-button-update="${ person.id }"
             >Update</button>
           </div>
           <div class="row__item row__item--button">
             <button type="button" 
                     data-component="list-row-button-delete"
                     data-button-delete="${ person.id }"
             >Delete</button>
           </div>
         </li>`
    ).join(' ') }
    </ul>
  `;
  }
}

class AppLoader extends Component {
  constructor({ element }) {
    super({ element });
    this.hide();
  }

  _render() {
    this._element.innerHTML = `
      <h2>Loading ...</h2>
      <div class="loader"></div>
    `;
  }
}

class UserAppPage {
  constructor({ element}) {
    this._element = element;
    this._render();
    this._initLoader();
    this._initAppForm();
    this._initAppList();
  }

  _initLoader() {
    this._appLoader = new AppLoader({
      element: this._element.querySelector('[data-component="app-loader"]')
    });

    this._appLoader.subscribe('loader-on', () => {
      this._appLoader.show()
    });

    this._appLoader.subscribe('loader-off', () => {
      this._appLoader.hide()
    });
  }

  _initAppForm() {
    this._appForm = new AppForm({
      element: this._element.querySelector('[data-component="app-form"]')
    });
    this._appForm.subscribe('click-button-add-new-user', person => {
      this._appForm._buttonsDisable();
      this._appLoader.show();
      AppService.add(person, () => {
        this._appList.refresh( () => {
          this._appForm.clear();
          this._appForm._buttonsEnable();
          this._appLoader.hide();
        });
      });
    });
  }

  _initAppList() {
    this._appList = new AppList({
      element: this._element.querySelector('[data-component="app-list"]'),
      loader: this._appLoader
    });

    this._appList.subscribe('click-button-delete', person => {
      this._appList._buttonsDisable(person);
      this._appLoader.show();

      AppService.delete(person, () => {
        this._appList.refresh(() => {
          this._appLoader.hide();
        });
      });
    });

    this._appList.subscribe('click-button-update', person => {
      this._appList._buttonsDisable(person);
      this._appLoader.show();

      AppService.update(person, () => {
        this._appList.refresh( () => {
          this._appList._buttonsEnable(person);
          this._appLoader.hide();
        });
      });
    });
  }

  _render() {
    this._element.innerHTML = `
      <div class="app">
        <h1>Manager User App</h1>
        <div data-component="app-form" class="app__form"></div>
        <div data-component="app-list" class="app__list"></div>
        <div data-component="app-loader" class="app__loader"></div>
      </div>
    `;
  }
}

const currentPage = new UserAppPage(
  {element: appContainer}
);


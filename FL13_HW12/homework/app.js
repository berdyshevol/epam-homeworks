const root = document.getElementById('root');

class Component {
  constructor({ element }) {
    this._element = element;
    this._callbackMap = {};
  }

  hide() {
    this._element.hidden = true;
  }

  show() {
    this._element.hidden = false;
  }

  on(eventName, elementName, callback) {
    this._element.addEventListener(eventName, (event) => {
      let delegateTarget = event.target.closest(`[data-component="${ elementName }"]`);

      if ( !delegateTarget || !this._element.contains(delegateTarget) ) {
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
}

class BookList extends Component{
  constructor({ element }) {
    super({ element });
    this._books = books; // TODO: вставить новый класс умный, который проверяет есть ли в локал сторидж или нет
    this._render();
  }

  _render() {
    // TODO: assign onAddClick through subscribe and emit
    this._element.innerHTML = `
      <h2>Book List</h2>
      <ul class="book-list">
        ${ this._books.map(book => `
              <li data-book-id="${ book.id }">
                <a href="?id=${ book.id }#preview">
                  ${book.title}
                </a> 
                <button onClick=location.href="${location.pathname}?id=${ book.id }#edit">Edit</button>
              </li>
           `).join('') 
        }
      </ul>
      <button type="button" data-component="add-button" onClick=location.href="${location.pathname}#add">
        Add
      </button>
    `;
  }
}

class BookPreview extends Component{
  constructor({ element }) {
    super({ element });
    this._render();
  }

  _render() {
    this._element.innerHTML =  `
        <h2>Book Preview</h2>
        <ul>
          <li>
            book name
          </li>
          <li>
            author
          </li>
          <li>
            image
          </li>
          <li>
            plot
          </li>
        </ul>
    `;
  }

}

class BooksPage {
  constructor({ element }) {
    this._element = element;
    this._render();
    this._initBookPage();
    this._initBookPreview();
    window.addEventListener('load', this._pageLoaded);
  }

  _initBookPage() {
    this._bookList = new BookList({
      element: document.querySelector('[data-component="book-list"]')
    });
  }

  _initBookPreview() {
    this._bookPreview = new BookPreview({
      element: document.querySelector('[data-component="book-preview"]')
    });

  }

  _pageLoaded () {
    const hash = location.hash;
    const search = location.search;
  }

  _render() {
    this._element.innerHTML = `
    <div class="book-app">
      <div data-component="book-list"></div>
      <hr>
      <div data-component="book-preview"></div>
      <div>
        Book Edit
      </div>
      <div>
        Book Add
      </div>
    </div>
    `;
  }
}

let currentPage = new BooksPage({
  element: root
});
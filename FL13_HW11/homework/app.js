const data = [
  {
    'folder': true,
    'title': 'Pictures',
    'children': [
      {
        'title': 'logo.png'
      },
      {
        'folder': true,
        'title': 'Vacations',
        'children': [
          {
            'title': 'spain.jpeg'
          }
        ]
      }
    ]
  },
  {
    'folder': true,
    'title': 'Desktop',
    'children': [
      {
        'folder': true,
        'title': 'screenshots',
        'children': null
      }
    ]
  },
  {
    'folder': true,
    'title': 'Downloads',
    'children': [
      {
        'folder': true,
        'title': 'JS',
        'children': null
      },
      {
        'title': 'nvm-setup.exe'
      },
      {
        'title': 'node.exe'
      }
    ]
  },
  {
    'title': 'credentials.txt'
  }
];

const rootNode = document.getElementById('root');

const FOLDERISEMPTY = '<ul class ="empty-folder" hidden>Folder is empty</ul>';
const FOLDERISEMPTY_TEXT = 'Folder is empty';
const type = item => item.folder ? 'folder' : 'file';

const getIcon = (item) => {
  if (type(item) === 'folder') {
    return `
      <i class="material-icons orange folder">folder</i>
      <i class="material-icons orange folder_open hide">folder_open</i>
    `;
  } else {
    return `<i class="material-icons grey">insert_drive_file</i>`;
  }
}

const creatUL = function(array) {
  if (array === null || array.length === 0) {
    return FOLDERISEMPTY;
  }

  let li = '';
  for (const item of array) {
    if (item.title) {
      li += `
        <li class="${type(item)}">
          <div class="row">
            ${getIcon(item)}
            <input type="text" class="input" value="${item.title}" disabled>
           </div>
      `;
      if (item.children === null || Array.isArray(item.children)) {
        li += creatUL(item.children);
      }
      li += `</li>`;
    }
  }
  return `<ul hidden>${li}</ul>`;
}

const creatList = function (element, array) {
  element.innerHTML = creatUL(array);
  const ul = element.querySelector('ul');
  if (ul) {
    ul.hidden = false;
  }
}

const makeMenu = () => {
  const str = `
  <div class="menu hide">
    <button type="button" class="button rename">Rename</button>
    <button type="button" class="button delete">Delete item</button>
  </div>
`;
  rootNode.insertAdjacentHTML('afterend', str);
}

creatList(rootNode, data);
makeMenu();

const hideLi = (event) => {
  const li = event.target.closest('li');
  if (!li || li.className === 'file') {
    return ;
  }
  const ul = li.querySelector('ul');
  if (ul) {
    ul.hidden = !ul.hidden;
    const itag = [...li.querySelectorAll('i')];
    if (itag) {
      itag[0].classList.toggle('hide');
      itag[1].classList.toggle('hide');
    }
  }
};
rootNode.addEventListener('click', hideLi);

const deleteItem = li => {
  const parent = li.parentNode;
  li.remove();
  if ([...parent.children].length === 0) {
    const folderIsEmpty = document.createElement('ul');
    folderIsEmpty.innerText = FOLDERISEMPTY_TEXT;
    folderIsEmpty.className = 'empty-folder';
    folderIsEmpty.hidden = false;
    parent.after(folderIsEmpty);
    parent.remove();
  }
};

const rename = li => {
  const input = li.querySelector('input');
  input.disabled = false;
  input.focus();
  input.setSelectionRange(0,
    input.getAttribute('value').lastIndexOf('.')
  );
  const inputDisable = () => {
    input.disabled = true;
  }
  input.onchange = inputDisable;
  input.onblur = inputDisable;
};

const menuDOM = document.querySelector('.menu');

const disable = buttons => buttons.forEach(button => {
    button.disabled = true;
  }
);

const enable = buttons => buttons.forEach(button => {
    button.disabled = false;
  }
);

const buttons = [...document.querySelectorAll('button')];
const openMenu = event => {
  event.preventDefault();
  const x = event.clientX;
  const y = event.clientY;
  const li = event.target.closest('li');
  if (!li) {
    disable(buttons);
  } else {
    enable(buttons);
  }
  menuDOM.classList.remove('hide');
  menuDOM.style.top = `${y}px`;
  menuDOM.style.left = `${x}px`;
  const closeMenu = event => {
    if (li) {
      const button = event.target.closest('button');
      if (button) {
        if (button.classList.contains('rename')) {
          rename(li);
        } else if (button.classList.contains('delete')) {
          deleteItem(li)
        }
      }
    }
    menuDOM.classList.add('hide');
  };
  document.onclick = closeMenu;
};

rootNode.addEventListener('contextmenu', openMenu);

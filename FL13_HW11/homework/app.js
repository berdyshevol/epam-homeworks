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
  },
  {
    title: 'test',
    folder: true,
    children: null
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
    return '<ul class ="empty-folder" hidden>Folder is empty</ul>';
  }

  let li = '';
  for (const item of array) {
    if (item.title) {
      li += `<li class="${type(item)}"><div class="row">${getIcon(item)}${item.title}</div>`;
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

// initialization
creatList(rootNode, data);
makeMenu();

// events to open/close files
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
    // console.dir(ul)
  }
};
rootNode.addEventListener('click', hideLi);

// delete function
const deleteItem = li => {
  const parent = li.parentNode;
  let unique = false;
  console.log(li.parentNode.children )
  if ([...parent.children].length === 1) {
    unique = true;
  }
  li.remove();
  // check if folder is empty
  if (unique) {
    const folderIsEmpty = document.createElement('ul');
    folderIsEmpty.innerText = FOLDERISEMPTY_TEXT;
    folderIsEmpty.className = 'empty-folder';
    folderIsEmpty.hidden = false;
    parent.after(folderIsEmpty);
    parent.remove();
  }

};

// events to open/close menu
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
  // enable/disable buttons
  const li = event.target.closest('li');
  if (!li) {
    disable(buttons);
  } else {
    enable(buttons);
  }
  // console.log(li)
  // open menu
  menuDOM.classList.remove('hide');
  menuDOM.style.top = `${y}px`;
  menuDOM.style.left = `${x}px`;
  // listen to close menu
  const closeMenu = event => {
    // console.log("in close menu", li)
    if (li) {
      const button = event.target.closest('button');
      console.log(button)
      if (button) {
        if (button.classList.contains('rename')) {
          console.log('rename');
        } else if (button.classList.contains('delete')) {
          console.log('delete');
          deleteItem(li)
        }
      }
    }
    menuDOM.classList.add('hide');
    // menuDOM.removeEventListener('click', closeMenu);
  };
  document.onclick = closeMenu;
};

rootNode.addEventListener('contextmenu', openMenu);

// buttons.forEach(button => {
//   button.addEventListener('click', (event) => {
//     // const button = event.target.closest('button');
//     if (button.className === 'rename') {
//       console.log("rename");
//     } else {
//       console.log('delete');
//     }
//     menuDOM.classList.add("hide");
//   })
// })

// buttons.forEach(button => {
//   button.addEventListener('click', (event) => {
//     const button = event.target.closest('button');
//     console.log(button);
//     if (button) {
//       if (button.className === 'rename') {
//         console.log("rename");
//       } else {
//         console.log('delete');
//       }
//     }
//     menuDOM.classList.add("hide");
//   })
// })

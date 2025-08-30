import { getUtf8Bytes, getEditorText, maskName } from './common.js';

/*
 * Dependency : common.js
 *              ckeditor (https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js)
 */

/* **************************************** *
 * GLOBAL
 * **************************************** */
let editor;

/* **************************************** *
 * READY
 * **************************************** */
window.addEventListener('DOMContentLoaded', () => {
  initEditor();

  const cancelBtn = document.getElementById('cancelBtn');
  const saveBtn = document.getElementById('saveBtn');

  cancelBtn.addEventListener('click', () => {
    history.back();
  })

  saveBtn.addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const content = editor.getData();

    if(!title || !content){
      alert('제목과 내용을 입력하세요');
      return;
    }

    let boardData = JSON.parse(sessionStorage.getItem('boardData')) || [];

    const newPost = {
      id: boardData.length ? Math.max(...boardData.map(p=>p.id)) + 1 : 1,
      title,
      writer: maskName('tester'),
      regDt: new Date().toISOString().split('T')[0],
      viewCount: 0,
      content
    };

    boardData.unshift(newPost);
    sessionStorage.setItem('boardData', JSON.stringify(boardData));

    alert('글이 저장되었습니다.');
    location.href = 'list.html';
  });
});

/* **************************************** *
 * FN
 * **************************************** */
export function initEditor() {
  window.ClassicEditor
    .create(document.querySelector('#editor'), {
      toolbar: [
        'heading',
        '|',
        'undo', 'redo'
      ],
      removePlugins: [ 'ImageUpload', 'MediaEmbed', 'Table', 'CKFinder', 'EasyImage' ]
    })
    .then(newEditor => {
      editor = newEditor;

      const counterEl = document.createElement('div');
      counterEl.style.textAlign = 'right';
      counterEl.style.marginTop = '8rem';
      document.querySelector('.ck-editor').appendChild(counterEl);

      const updateCounter = () => {
        const text = getEditorText(editor);
        const bytes = getUtf8Bytes(text);
        counterEl.textContent = `byte: ${bytes}`;
      };

      updateCounter();

      const domRoot = editor.editing.view.document.getRoot();
      const domEl = editor.editing.view.domConverter.mapViewToDom(domRoot);

      domEl.addEventListener('input', updateCounter);
      domEl.addEventListener('keyup', updateCounter);
    })
    .catch(error => { console.error(error); });
}


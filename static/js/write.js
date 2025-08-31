import {maskName, goBack, initEditor, checkRequired} from './common.js';

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
window.addEventListener('DOMContentLoaded', async () => {
  const titleEl = document.getElementById('title');
  const cancelBtn = document.getElementById('cancelBtn');
  const saveBtn = document.getElementById('saveBtn');

  const editor = await initEditor();

  cancelBtn.addEventListener('click', () => goBack());

  saveBtn.addEventListener('click', () => {
    const title = titleEl.value;
    const content = editor.getData();

    if (!checkRequired([
      { value: title, name: '제목' },
      { value: content, name: '내용' }
    ])) return;

    const boardData = JSON.parse(sessionStorage.getItem('boardData')) || [];
    const newPost = {
      id: boardData.length ? Math.max(...boardData.map(p => p.id)) + 1 : 1,
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
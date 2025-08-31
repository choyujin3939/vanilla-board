/*
 * Dependency : common.js
 *              ckeditor (https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js)
 */
import {checkRequired, goBack, initEditor} from './common.js';

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

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  const boardData = JSON.parse(sessionStorage.getItem('boardData')) || [];
  const post = boardData.find(item => item.id === parseInt(postId));

  if (!postId || !post) {
    alert('잘못된 접근입니다.');
    location.href = 'list.html';
    return;
  }

  const { title = '', content = '' } = post;

  titleEl.value = title;
  editor = await initEditor(content);

  cancelBtn.addEventListener('click', () => goBack());

  saveBtn.addEventListener('click', () => {
    const title = titleEl.value;
    const content = editor.getData();

    // if (!newTitle || !newContent) {
    //   alert('제목과 내용을 입력하세요');
    //   return;
    // }
    if (!checkRequired([
      { value: title, name: '제목' },
      { value: content, name: '내용' }
    ])) return;

    const idx = boardData.findIndex(item => item.id === parseInt(postId));
    if (idx !== -1) {
      boardData[idx] = {
        ...boardData[idx],
        title: title,
        content: content,
        modDt: new Date().toISOString().split('T')[0]
      };
      sessionStorage.setItem('boardData', JSON.stringify(boardData));
    }

    alert('글이 수정되었습니다');
    location.href = 'list.html';
  });
});

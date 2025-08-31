/*
 * Dependency : common.js
 *              ckeditor (https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js)
 */
import { checkRequired, goBack, initEditor } from './common.js';

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

  // 유효성 체크
  if (!postId || !post) {
    alert('잘못된 접근입니다.');
    location.href = 'list.html';
    return;
  }

  // 초기값 세팅
  const { title = '', content = '' } = post;
  titleEl.value = title;
  editor = await initEditor(content);

  // 이벤트 바인딩
  cancelBtn.addEventListener('click', () => goBack());
  saveBtn.addEventListener('click', () => handleSave(titleEl.value, postId, boardData));
});

/* **************************************** *
 * FN
 * **************************************** */
function handleSave(title, postId, boardData) {
  const content = editor.getData();

  // 필수 입력 체크
  if (!checkRequired([
    { value: title, name: '제목' },
    { value: content, name: '내용' }
  ])) return;

  const idx = boardData.findIndex(item => item.id === parseInt(postId));
  if (idx !== -1) {
    boardData[idx] = {
      ...boardData[idx],
      title,
      content,
      modDt: new Date().toISOString().split('T')[0]
    };
    sessionStorage.setItem('boardData', JSON.stringify(boardData));
  }

  alert('글이 수정되었습니다');
  location.href = 'list.html';
}
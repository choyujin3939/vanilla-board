import { maskName, goBack, initEditor, checkRequired } from './common.js';

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
  const cancelBtn = document.getElementById('cancelBtn');
  const saveBtn = document.getElementById('saveBtn');

  // 에디터 초기화
  editor = await initEditor();

  // 이벤트 바인딩
  cancelBtn.addEventListener('click', () => goBack());
  saveBtn.addEventListener('click', handleSave);
});

/* **************************************** *
 * FN
 * **************************************** */
function handleSave() {
  const titleEl = document.getElementById('title');
  const title = titleEl.value;
  const content = editor.getData();

  // 필수 입력 체크
  if (!checkRequired([
    { value: title, name: '제목' },
    { value: content, name: '내용' }
  ])) return;

  // 기존 데이터 가져오기
  const boardData = JSON.parse(sessionStorage.getItem('boardData')) || [];

  // 새 글 생성
  const newPost = {
    id: boardData.length ? Math.max(...boardData.map(p => p.id)) + 1 : 1,
    title,
    writer: maskName('tester'),
    regDt: new Date().toISOString().split('T')[0],
    viewCount: 0,
    content
  };

  // 저장
  boardData.unshift(newPost);
  sessionStorage.setItem('boardData', JSON.stringify(boardData));

  alert('글이 저장되었습니다.');
  location.href = 'list.html';
}
/*
 * Dependency : common.js
 *              ckeditor (https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js)
 */
import { getUtf8Bytes, getEditorText } from './common.js';


/* **************************************** *
 * READY
 * **************************************** */
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  const boardData = JSON.parse(sessionStorage.getItem('boardData')) || [];
  const post = boardData.find(item => item.id === parseInt(postId));

  console.log(post);
});

/* **************************************** *
 * FN
 * **************************************** */

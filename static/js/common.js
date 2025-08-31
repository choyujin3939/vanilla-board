
/* **************************************** *
 * GLOBAL
 * **************************************** */
let editor = null;

/* **************************************** *
 * FN
 * **************************************** */
export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
export function getRandomElement(array) {
  return array[getRandomInt(array.length)];
}
export function maskName(name) {
  return `${name[0]}*${name.slice(-1)}`;
}
export function getRandomPastDate(maxDaysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - getRandomInt(maxDaysAgo));
  return date.toISOString().split('T')[0];
}
export function getUtf8Bytes(str) {
  return new TextEncoder().encode(str).length;
}
export function getEditorText(editor) {
  const viewRoot = editor.editing.view.document.getRoot();
  const domRoot = editor.editing.view.domConverter.mapViewToDom(viewRoot);
  const text = domRoot.innerText || '';

  const cleaned = text.replace(/\u200B/g, '').trim();

  return cleaned;
}
export function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = '/';
  }
}
export async function initEditor(initialContent = '') {
  try {
    const editorEl = document.querySelector('#editor');

    if (!editorEl) {
      console.error('#editor 요소가 존재하지 않습니다.');
      return null;
    }

    if (editor) {
      await editor.destroy();
      editor = null;
      editorEl.innerHTML = '';
    }

    editor = await window.ClassicEditor.create(editorEl, {
      toolbar: ['heading','|','undo','redo'],
      removePlugins: ['ImageUpload','MediaEmbed','Table','CKFinder','EasyImage']
    });

    if (initialContent) editor.setData(initialContent);

    const counterEl = document.createElement('div');
    counterEl.style.textAlign = 'right';
    counterEl.style.marginTop = '8rem';
    document.querySelector('.ck-editor').appendChild(counterEl);

    const updateCounter = () => {
      const text = getEditorText(editor);
      counterEl.textContent = `byte: ${getUtf8Bytes(text)}`;
    };

    updateCounter();
    const domRoot = editor.editing.view.document.getRoot();
    const domEl = editor.editing.view.domConverter.mapViewToDom(domRoot);

    domEl.addEventListener('input', updateCounter);
    domEl.addEventListener('keyup', updateCounter);

    return editor;
  } catch(e) {
    console.error(e);
  }
}

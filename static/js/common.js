/* **************************************** *
 * GLOBAL
 * **************************************** */
let editor = null;

/* **************************************** *
 * UTILS
 * **************************************** */
export function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = '/';
  }
}

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

/* **************************************** *
 * EDITOR
 * **************************************** */
export function getEditorText(editor) {
  const viewRoot = editor.editing.view.document.getRoot();
  const domRoot = editor.editing.view.domConverter.mapViewToDom(viewRoot);
  const text = domRoot.innerText || '';
  const cleaned = text.replace(/\u200B/g, ''); // zero-width space 제거
  return cleaned;
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
    counterEl.style.marginTop = '8px';
    document.querySelector('.ck-editor').appendChild(counterEl);

    const updateCounter = () => {
      let text = getEditorText(editor);

      if (text === '\n') text = '';

      // 비표준 공백(u00A0) → 일반 공백으로
      const normalizedText = text.replace(/\u00A0/g, ' ');

      counterEl.textContent = `byte: ${getUtf8Bytes(normalizedText)}`;
    };

    updateCounter();

    // DOM 이벤트로 실시간 반영
    const domRoot = editor.editing.view.document.getRoot();
    const domEl = editor.editing.view.domConverter.mapViewToDom(domRoot);
    domEl.addEventListener('input', updateCounter);
    domEl.addEventListener('keyup', updateCounter);
    domEl.addEventListener('keydown', updateCounter);

    return editor;
  } catch (e) {
    console.error(e);
  }
}

/* **************************************** *
 * VALIDATION
 * **************************************** */
export function checkRequired(fields) {
  for (const field of fields) {
    if (!field.value || !field.value.trim()) {
      alert(`${field.name}을(를) 입력하세요`);
      return false;
    }
  }
  return true;
}
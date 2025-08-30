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
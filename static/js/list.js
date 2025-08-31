import {
  getRandomElement,
  getRandomInt,
  maskName,
  getRandomPastDate,
} from './common.js';

/*
 * Dependency : common.js
 */

/* **************************************** *
 * GLOBAL
 * **************************************** */
const TITLES = [
  '테슬라 전기 픽업 출시', '아이폰17 공개', 'AI 반도체 혁신',
  '넷플릭스 한국 드라마 1위', '서울 아파트 매매가 상승',
  '엔비디아 GPU 공개', '구글 AI 강화', '현대차 수소차 확대'
];

const DUMMY_SENTENCES = [
  "이 글은 테스트용 더미 텍스트입니다.",
  "내용 확인을 위해 작성되었습니다.",
  "게시판 동작 테스트용 문장입니다.",
  "여기에 더미 데이터를 넣어보세요.",
];

const NAMES = ['홍길동', '김철수', '이영희', '박민수', '장준', '이수현', '최영준'];

const PAGINATION = {
  FIRST: 'first',
  LAST: 'last'
};

/* **************************************** *
 * READY
 * **************************************** */
window.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#boardTable tbody');
  const pageSizeSelect = document.querySelector('#pageSize');
  const pagination = document.querySelector('#pagination');

  let data = JSON.parse(sessionStorage.getItem('boardData'));
  if (!data) {
    data = generateDummyData(40);
    sessionStorage.setItem('boardData', JSON.stringify(data));
  }

  let currentPage = 1;
  let pageSize = parseInt(pageSizeSelect.value);

  function updateBoard(page) {
    currentPage = page;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = data.slice(start, end);

    renderTable(tbody, pageData);
    renderPagination(pagination, currentPage, Math.ceil(data.length / pageSize), updateBoard);
  }

  pageSizeSelect.addEventListener('change', () => {
    pageSize = parseInt(pageSizeSelect.value);
    updateBoard(1);
  });

  updateBoard(1);
});

/* **************************************** *
 * FN
 * **************************************** */
export function generateDummyData(count) {
  const data = Array.from({ length: count }, () => {
    const name = getRandomElement(NAMES);
    const title = getRandomElement(TITLES);

    const sentenceCount = 2 + getRandomInt(3);
    let content = "";
    for (let i = 0; i < sentenceCount; i++) {
      content += `<p>${getRandomElement(DUMMY_SENTENCES)}</p>`;
    }

    return {
      title,
      writer: maskName(name),
      regDt: getRandomPastDate(30),
      viewCount: getRandomInt(500),
      content
    };
  });

  data.sort((a, b) => new Date(b.regDt) - new Date(a.regDt));

  return data.map((item, index) => ({
    ...item,
    id: count - index
  }));
}

export function renderTable(tbody, pageData) {
  tbody.innerHTML = pageData.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>
        <a href='edit.html?id=${item.id}' class='subject'>${item.title}</a>
      </td>
      <td>${item.writer}</td>
      <td>${item.regDt}</td>
      <td>${item.viewCount}</td>
    </tr>
  `).join('');
}

export function renderPagination(paginationEl, currentPage, totalPages, onPageClick) {
  let html = `<a href='#' class='page move first' data-page='${PAGINATION.FIRST}'><</a>`;

  html += Array.from({ length: totalPages }, (_, i) => {
    const pageNum = i + 1;
    return `<a href='#' class='page ${pageNum === currentPage ? 'active' : ''}' data-page='${pageNum}'>${pageNum}</a>`;
  }).join('');

  html += `<a href='#' class='page move last' data-page='${PAGINATION.LAST}'>></a>`;

  paginationEl.innerHTML = html;

  paginationEl.querySelectorAll('a.page').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const pageAttr = a.dataset.page;
      let page = currentPage;

      if (pageAttr === PAGINATION.FIRST) page = 1;
      else if (pageAttr === PAGINATION.LAST) page = totalPages;
      else page = parseInt(pageAttr);

      onPageClick(page);
    });
  });
}
let currentType = window.APP && window.APP.initialType ? window.APP.initialType : 'detai';

document.addEventListener('DOMContentLoaded', () => {
  // tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.dataset.type;
      loadList();
    });
  });

  document.getElementById('saveProfile').addEventListener('click', async () => {
    const name = document.getElementById('name').value;
    const faculty = document.getElementById('faculty').value;
    const department = document.getElementById('department').value;
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, faculty, department })
    });
    const data = await res.json();
    const msg = document.getElementById('profileMsg');
    if (data.ok) { msg.textContent = 'Đã lưu'; setTimeout(()=>msg.textContent='',2000); }
  });

  document.getElementById('addItem').addEventListener('click', showAddForm);

  loadList();
});

async function loadList() {
  const listEl = document.getElementById('list');
  listEl.innerHTML = '<p>Đang tải...</p>';
  const res = await fetch('/api/items?type=' + currentType);
  const items = await res.json();
  if(!items || items.length === 0) {
    listEl.innerHTML = '<p>Chưa có mục nào. Nhấn "Thêm mục" để tạo.</p>';
    return;
  }
  listEl.innerHTML = '';
  items.forEach(it => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <h4>${escapeHtml(it.title)}</h4>
      <div>Loại: ${escapeHtml(it.kind || '')}</div>
      <div>Thành viên: ${escapeHtml((it.members||[]).join(', '))}</div>
      <div class="notes">${escapeHtml(it.notes || '')}</div>
      <div class="actions">
        <button class="delete" data-id="${it._id}">Xóa</button>
      </div>
    `;
    listEl.appendChild(div);
  });
  document.querySelectorAll('.delete').forEach(b => {
    b.addEventListener('click', async () => {
      if(!confirm('Xóa mục này?')) return;
      await fetch('/api/items/' + b.dataset.id, { method: 'DELETE' });
      loadList();
    });
  });
}

function showAddForm() {
  const list = document.getElementById('list');
  list.innerHTML = `
    <div class="add-form">
      <label>Tiêu đề</label>
      <input id="f_title" />
      <label>Loại</label>
      <input id="f_kind" />
      <label>Thành viên (ngăn cách bằng , )</label>
      <input id="f_members" />
      <label>Ghi chú</label>
      <textarea id="f_notes"></textarea>
      <div class="form-actions">
        <button id="saveItem">Lưu</button>
        <button id="cancelAdd">Hủy</button>
      </div>
    </div>
  `;
  document.getElementById('cancelAdd').addEventListener('click', loadList);
  document.getElementById('saveItem').addEventListener('click', async () => {
    const title = document.getElementById('f_title').value.trim();
    if(!title) return alert('Nhập tiêu đề');
    const kind = document.getElementById('f_kind').value;
    const members = document.getElementById('f_members').value;
    const notes = document.getElementById('f_notes').value;
    await fetch('/api/items', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ type: currentType, title, kind, members, notes })
    });
    loadList();
  });
}

function escapeHtml(s) {
  if(!s) return '';
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

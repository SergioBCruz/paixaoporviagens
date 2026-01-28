// URLs de busca afiliadas (substitua pelos seus deep links oficiais)
const affiliateSearchLinks = {
  kayak: 'https://www.kayak.com.br/flights/POA-LON',
  skyscanner: 'https://www.skyscanner.com.br/transport/flights/POA/LON/',
  travelpayouts: 'https://emrldtp.cc/NDkzMjQ5?origin=POA&destination=LON&adults=1&depart_date=2026-02-05&return_date=2026-02-17',
  decolar: 'https://www.decolar.com/shop/flights/results/roundtrip/POA/LON/2026-02-05/2026-02-17/1/0/0/NA/NA/NA/NA/NA',
  booking: 'https://www.booking.com/flights/POA.LON.html'
};

const searchForm = document.getElementById('searchForm');
const resultsGrid = document.getElementById('resultsGrid');
const messageEl = document.getElementById('formMessage');

function validateDates(ida, volta) {
  return new Date(volta) >= new Date(ida);
}

function renderMockResults(formData) {
  // Simulação sem preços fixos para evitar oferta enganosa
  const mock = [
    { title: 'Porto Alegre → Londres', tag: 'Melhor custo-benefício' },
    { title: 'Porto Alegre → Londres', tag: 'Tarifa flexível' },
    { title: 'Porto Alegre → Londres', tag: 'Direto + bagagem' }
  ];

  resultsGrid.innerHTML = mock
    .map(
      (item) => `
      <div class="col-md-4">
        <div class="deal-card p-4 h-100">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-primary">${item.tag}</span>
            <span class="text-muted small">1 pax</span>
          </div>
          <h3 class="h6 mb-2">${item.title}</h3>
          <p class="text-muted mb-2">Ida: 2026-02-05 · Volta: 2026-02-17</p>
          <p class="text-muted small mb-3">Preço variável conforme datas e disponibilidade</p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="fw-semibold text-primary">Consulte o preço atualizado</span>
            <button class="btn btn-outline-primary btn-sm" data-redirect="${formData.partner}">Ver preços atualizados</button>
          </div>
        </div>
      </div>`
    )
    .join('');

  bindDealButtons();
}

function redirectToPartner(partnerKey) {
  // Centraliza o redirecionamento; troque URLs em affiliateSearchLinks para seus IDs
  const url = affiliateSearchLinks[partnerKey] || affiliateSearchLinks.kayak;
  window.open(url, '_blank');
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = {
    origem: searchForm.origem.value.trim(),
    destino: searchForm.destino.value.trim(),
    dataIda: searchForm.dataIda.value,
    dataVolta: searchForm.dataVolta.value,
    passageiros: searchForm.passageiros.value,
    partner: document.getElementById('partner').value
  };

  if (!formData.origem || !formData.destino) {
    messageEl.textContent = 'Preencha origem e destino.';
    return;
  }

  if (!validateDates(formData.dataIda, formData.dataVolta)) {
    messageEl.textContent = 'A data de volta deve ser igual ou posterior à ida.';
    return;
  }

  messageEl.textContent = '';
  renderMockResults(formData);
  redirectToPartner(formData.partner);
});

// Handler para botões de ofertas fixas
function bindDealButtons() {
  document.querySelectorAll('[data-redirect]').forEach((btn) => {
    if (btn.dataset.bound === 'true') return;
    btn.addEventListener('click', () => {
      const partnerKey = btn.getAttribute('data-redirect');
      redirectToPartner(partnerKey);
    });
    btn.dataset.bound = 'true';
  });
}

bindDealButtons();

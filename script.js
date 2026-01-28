// Configuração simples de parceiros (troque pelas URLs com seus IDs de afiliado)
const affiliateLinks = {
  kayak: 'https://www.kayak.com.br/flights',
  skyscanner: 'https://www.skyscanner.com.br',
  decolar: 'https://www.decolar.com',
  booking: 'https://www.booking.com/flights'
};

const searchForm = document.getElementById('searchForm');
const resultsGrid = document.getElementById('resultsGrid');
const messageEl = document.getElementById('formMessage');

function validateDates(ida, volta) {
  return new Date(volta) >= new Date(ida);
}

function renderMockResults(formData) {
  const { origem, destino, dataIda, dataVolta, passageiros } = formData;
  const mock = [
    {
      title: `${origem} → ${destino}`,
      price: 'R$ 2.550',
      tag: 'Melhor custo-benefício'
    },
    {
      title: `${origem} → ${destino}`,
      price: 'R$ 2.320',
      tag: 'Tarifa flexível'
    },
    {
      title: `${origem} → ${destino}`,
      price: 'R$ 2.980',
      tag: 'Direto + bagagem'
    }
  ];

  resultsGrid.innerHTML = mock
    .map(
      (item) => `
      <div class="col-md-4">
        <div class="deal-card p-4 h-100">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-primary">${item.tag}</span>
            <span class="text-muted small">${passageiros} pax</span>
          </div>
          <h3 class="h6 mb-2">${item.title}</h3>
          <p class="text-muted mb-3">Ida: ${dataIda} · Volta: ${dataVolta}</p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="fw-bold text-primary">${item.price}</span>
            <button class="btn btn-outline-primary btn-sm" data-redirect="${formData.partner}">Ver oferta</button>
          </div>
        </div>
      </div>`
    )
    .join('');

  bindDealButtons();
}

function redirectToPartner(partnerKey) {
  // Centraliza o redirecionamento; substitua a URL no objeto affiliateLinks acima
  const url = affiliateLinks[partnerKey] || affiliateLinks.kayak;
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

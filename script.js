// Aviso legal: Este site não vende passagens. O redirecionamento é feito para parceiros
// afiliados, responsáveis pelos preços e disponibilidade.

// Marker do afiliado (troque pelo seu marker oficial Travelpayouts)
const MARKER = '493249';

// Estrutura base dos deep links Travelpayouts (centralizada para manutenção futura)
const travelpayoutsLinks = {
  base: 'https://search.travelpayouts.com/flights',
  marker: MARKER,
  locale: 'pt',
  currency: 'BRL'
};

// URLs de busca afiliadas (substitua pelos seus deep links oficiais)
const affiliateSearchLinks = {
  kayak: 'https://www.kayak.com.br/flights/POA-LON',
  skyscanner: 'https://www.skyscanner.com.br/transport/flights/POA/LON/',
  travelpayouts: null, // gerado dinamicamente por generateFlightDeepLink
  decolar: 'https://www.decolar.com/shop/flights/results/roundtrip/POA/LON/2026-02-05/2026-02-17/1/0/0/NA/NA/NA/NA/NA',
  booking: 'https://www.booking.com/flights/POA.LON.html'
};

let lastSearchFormData = null;

const searchForm = document.getElementById('searchForm');
const resultsGrid = document.getElementById('resultsGrid');
const messageEl = document.getElementById('formMessage');

function validateDates(ida, volta) {
  return new Date(volta) >= new Date(ida);
}

// Gera deep link Travelpayouts com parâmetros reais e rastreamento do marker
function generateFlightDeepLink(origem, destino, dataIda, dataVolta, passageiros) {
  const origin = (origem || '').trim().toUpperCase();
  const destination = (destino || '').trim().toUpperCase();
  if (!origin || !destination || !dataIda || !dataVolta) return null;

  const params = new URLSearchParams({
    marker: travelpayoutsLinks.marker,
    origin,
    destination,
    departure_at: dataIda,
    return_at: dataVolta,
    adults: passageiros || 1,
    children: 0,
    infants: 0,
    currency: travelpayoutsLinks.currency,
    locale: travelpayoutsLinks.locale
  });

  return `${travelpayoutsLinks.base}?${params.toString()}`;
}

function renderMockResults(formData) {
  // Simulação sem preços fixos para evitar oferta enganosa
  const mock = [
    { title: `${formData.origem} → ${formData.destino}`, tag: 'Melhor custo-benefício' },
    { title: `${formData.origem} → ${formData.destino}`, tag: 'Tarifa flexível' },
    { title: `${formData.origem} → ${formData.destino}`, tag: 'Direto + bagagem' }
  ];

  resultsGrid.innerHTML = mock
    .map(
      (item) => `
      <div class="col-md-4">
        <div class="deal-card p-4 h-100">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-primary">${item.tag}</span>
            <span class="text-muted small">${formData.passageiros} pax</span>
          </div>
          <h3 class="h6 mb-2">${item.title}</h3>
          <p class="text-muted mb-2">Ida: ${formData.dataIda} · Volta: ${formData.dataVolta}</p>
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

// Usa dados do formulário para gerar deep link Travelpayouts quando selecionado
function redirectWithFormData(partnerKey, formData) {
  if (partnerKey === 'travelpayouts') {
    const deepLink = generateFlightDeepLink(
      formData.origem,
      formData.destino,
      formData.dataIda,
      formData.dataVolta,
      formData.passageiros
    );
    if (deepLink) {
      window.open(deepLink, '_blank');
      return;
    }
  }
  redirectToPartner(partnerKey);
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
  lastSearchFormData = formData;
  redirectWithFormData(formData.partner, formData);
});

// Handler para botões de ofertas fixas
function bindDealButtons() {
  document.querySelectorAll('[data-redirect]').forEach((btn) => {
    if (btn.dataset.bound === 'true') return;
    btn.addEventListener('click', () => {
      const partnerKey = btn.getAttribute('data-redirect');
      if (partnerKey === 'travelpayouts' && lastSearchFormData) {
        redirectWithFormData(partnerKey, lastSearchFormData);
        return;
      }
      redirectToPartner(partnerKey);
    });
    btn.dataset.bound = 'true';
  });
}

bindDealButtons();

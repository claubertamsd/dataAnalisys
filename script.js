const checklistItems = [
  'Chave Reserva',
  'Manual',
  'Ar-condicionado',
  'Itens Elétricos',
  'CRLV',
  'Manual de Garantia',
  'Itens Obrigatórios',
  'Tapetes',
  'Parafuso de Rodas',
  'Cartão de Memória',
  'Cartão GPS',
  'Carregador Portátil',
  'Wall Box'
];

const terms = [
  { text: 'Recebi explicações sobre revisões', required: true },
  { text: 'Recebi explicações da garantia', required: true },
  { text: 'Veículo em perfeitas condições', required: true },
  { text: 'Garantia Auto Parvi (opcional)', required: false },
  { text: 'Garantia Legal 90 dias', required: false },
];

// Render checklist
const checklistEl = document.getElementById('checklist');
checklistItems.forEach((item, i) => {
  checklistEl.innerHTML += `
    <div class="flex justify-between items-center border p-2 rounded text-sm">
      <span>${i + 1}. ${item}</span>
      <div class="flex gap-4">
        <label><input type="radio" name="item_${i}" value="ok"> OK</label>
        <label><input type="radio" name="item_${i}" value="faltando"> Faltando</label>
      </div>
    </div>
  `;
});

// Render termos
const termsEl = document.getElementById('terms');
terms.forEach((t, i) => {
  termsEl.innerHTML += `
    <label class="flex gap-2">
      <input type="checkbox" id="term_${i}" ${t.required ? 'required' : ''}>
      <span>${i + 14}. ${t.text}</span>
    </label>
  `;
});

function generatePrint() {
  const data = {
    vehicle: {
      brand: brand.value,
      model: model.value,
      plate: plate.value,
      year: year.value
    },
    customer: customer.value,
    odometer: odometer.value,
    deliveryDate: deliveryDate.value,
    nextRevisionDate: nextRevisionDate.value,
    nextRevisionKm: nextRevisionKm.value,
    serviceCenter: document.querySelector('input[name="serviceCenter"]:checked').value,
    checkItems: {},
    legal: {}
  };

  checklistItems.forEach((_, i) => {
    const v = document.querySelector(`input[name="item_${i}"]:checked`);
    data.checkItems[`item_${i}`] = v ? v.value : '';
  });

  terms.forEach((_, i) => {
    data.legal[`term_${i}`] = document.getElementById(`term_${i}`).checked;
  });

  openPrintWindow(data);
}
function openPrintWindow(data) {
  const w = window.open('', '_blank');

  w.document.write(`
    <html>
      <head>
        <title>Checklist ${data.vehicle.plate}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { size: A4; margin: 12mm; }
          body { -webkit-print-color-adjust: exact; }
        </style>
      </head>
      <body class="text-[10px] font-sans p-6">
        
        <h2 class="text-center font-bold text-lg mb-4">
          TERMO DE ENTREGA
        </h2>

        <div class="grid grid-cols-5 gap-2 mb-4">
          <div><strong>Marca:</strong> ${data.vehicle.brand}</div>
          <div><strong>Modelo:</strong> ${data.vehicle.model}</div>
          <div><strong>Placa:</strong> ${data.vehicle.plate}</div>
          <div><strong>Ano:</strong> ${data.vehicle.year}</div>
          <div><strong>Cliente:</strong> ${data.customer}</div>
        </div>

        <h3 class="font-bold mb-2">Checklist</h3>
        ${checklistItems.map((item, i) => `
          <div class="flex justify-between border-b py-1">
            <span>${item}</span>
            <span>${data.checkItems[`item_${i}`] || ''}</span>
          </div>
        `).join('')}

        <h3 class="font-bold mt-4 mb-2">Termos</h3>
        ${terms.map((t, i) => (
          data.legal[`term_${i}`]
            ? `<p>${i + 14}. ${t.text}</p>`
            : ''
        )).join('')}

        <script>
          setTimeout(() => window.print(), 500);
        </script>

      </body>
    </html>
  `);

  w.document.close();
}

function ajustarCodigo(cor) {
  cor = cor.trim();
  if (cor && !cor.startsWith('#')) {
    cor = '#' + cor;
  }
  return cor.toUpperCase();
}

function corEhClara(hex) {
  hex = hex.replace('#', '');
  var r = parseInt(hex.substring(0,2), 16);
  var g = parseInt(hex.substring(2,4), 16);
  var b = parseInt(hex.substring(4,6), 16);
  var brilho = (r * 299 + g * 587 + b * 114) / 1000;
  return brilho > 150;
}

let coresGeradas = [];

function gerarPaleta() {
  const input = document.getElementById('colorCodes').value;
  const colors = input.split(/[\s,;]+/)
                      .map(ajustarCodigo)
                      .filter(c => /^#([0-9A-F]{6})$/i.test(c));

  if (colors.length === 0) {
    alert('Nenhuma cor válida encontrada! Por favor, cole códigos corretos.');
    return;
  }

  coresGeradas = colors;

  const palette = document.getElementById('palette');
  palette.innerHTML = '';

  palette.style.gridTemplateColumns = 'repeat(8, 1fr)';

  const canvas = document.getElementById('canvas');
  const blocosPorLinha = 8;
  const blocoLargura = 100;
  const blocoAltura = 100;

  const linhas = Math.ceil(colors.length / blocosPorLinha);

  canvas.width = blocosPorLinha * blocoLargura;
  canvas.height = linhas * blocoAltura;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  colors.forEach((color, i) => {
    const block = document.createElement('div');
    block.className = 'color-block';
    block.style.backgroundColor = color;
    block.textContent = color;

    if (corEhClara(color)) {
      block.style.color = '#000000';
      block.style.textShadow = '1px 1px 2px white';
    } else {
      block.style.color = '#FFFFFF';
      block.style.textShadow = '1px 1px 2px black';
    }

    palette.appendChild(block);

    const x = (i % blocosPorLinha) * blocoLargura;
    const y = Math.floor(i / blocosPorLinha) * blocoAltura;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, blocoLargura, blocoAltura);

    ctx.fillStyle = corEhClara(color) ? '#000000' : '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = corEhClara(color) ? 'white' : 'black';
    ctx.shadowBlur = 2;
    ctx.fillText(color, x + blocoLargura/2, y + blocoAltura/2);
  });
}

function baixarPaleta() {
  if (coresGeradas.length === 0) {
    alert('Gere a paleta primeiro!');
    return;
  }
  const canvas = document.getElementById('canvas');
  const link = document.createElement('a');
  link.download = 'paleta.png';
  link.href = canvas.toDataURL();
  link.click();
}

function copiarCodigos() {
  if (coresGeradas.length === 0) {
    alert('Gere a paleta primeiro!');
    return;
  }
  navigator.clipboard.writeText(coresGeradas.join('\n'))
    .then(() => alert('Códigos copiados para a área de transferência!'))
    .catch(err => alert('Erro ao copiar: ' + err));
}

function baixarTXT() {
  if (coresGeradas.length === 0) {
    alert('Gere a paleta primeiro!');
    return;
  }
  const blob = new Blob([coresGeradas.join('\n')], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'paleta.txt';
  link.click();
}
function limparTudo() {
  document.getElementById('colorCodes').value = '';
  document.getElementById('palette').innerHTML = '';
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  coresGeradas = [];
}

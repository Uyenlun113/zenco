const axios = require('axios');

function decodeHtml(html) {
  if (!html) return '';
  const entities = {
    'nbsp': ' ', 'amp': '&', 'quot': '"', 'lt': '<', 'gt': '>',
    'apos': "'", 'ndash': '–', 'mdash': '—', 'hellip': '…',
    'aacute': 'á', 'agrave': 'à', 'acirc': 'â', 'atilde': 'ã', 'abreve': 'ă',
    'eacute': 'é', 'egrave': 'è', 'ecirc': 'ê',
    'iacute': 'í', 'igrave': 'ì', 'itilde': 'ĩ',
    'oacute': 'ó', 'ograve': 'ò', 'ocirc': 'ô', 'otilde': 'õ',
    'uacute': 'ú', 'ugrave': 'ù', 'uxsml': 'ư',
    'yacute': 'ý', 'ygrave': 'ỳ',
    'Aacute': 'Á', 'Agrave': 'À', 'Acirc': 'Â', 'Atilde': 'Ã',
    'Eacute': 'É', 'Egrave': 'È', 'Ecirc': 'Ê',
    'Iacute': 'Í', 'Igrave': 'Ì',
    'Oacute': 'Ó', 'Ograve': 'Ò', 'Ocirc': 'Ô', 'Otilde': 'Õ',
    'Uacute': 'Ú', 'Ugrave': 'Ù',
    'Yacute': 'Ý',
    'rsquo': '’', 'lsquo': '‘', 'ldquo': '“', 'rdquo': '”'
  };
  return html.replace(/&([a-z0-9]+);/gi, (match, name) => {
    return entities[name] || match;
  });
}

async function test() {
  const url = 'https://tuananhmachines.com/dien-may-tuan-anh-khep-lai-hanh-trinh-tai-ciame-asia-vietnam-2026-mot-dau-moc-dang-nho';
  const res = await axios.get(url);
  const html = decodeHtml(res.data);
  
  // Search for typical Vietnamese tag words like 'Tags', 'Tag', 'Từ khóa', 'Từ khoá', 'Chủ đề'
  const keywords = ['tag', 'từ khóa', 'từ khoá', 'chu de', 'chủ đề'];
  for (const kw of keywords) {
    let idx = 0;
    while ((idx = html.toLowerCase().indexOf(kw, idx)) !== -1) {
      console.log(`Match found for "${kw}" at index ${idx}:`);
      console.log(html.substring(idx - 50, idx + 150));
      idx += kw.length;
    }
  }
}

test();

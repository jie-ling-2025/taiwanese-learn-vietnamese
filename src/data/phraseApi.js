const GAS_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbzCrERurUtlAyvl8nxCTVn0gUthzsAUCBKHGnK08EibkW3w656EKX6qtpxZyG1TtBE4/exec';

export async function fetchApprovedPhrases({ signal } = {}) {
  const response = await fetch(`${GAS_ENDPOINT}?cacheBust=${Date.now()}`, {
    method: 'GET',
    cache: 'no-store',
    signal,
  });
  if (!response.ok) throw new Error('教材伺服器暫時無法連線。');

  const result = await response.json();
  if (!result?.success || !Array.isArray(result.data)) {
    throw new Error('教材資料格式不正確。');
  }

  return result.data
    .map((item) => ({
      id: String(item.id ?? '').trim(),
      category: String(item.category ?? '').trim(),
      chinese: String(item.chinese ?? '').trim(),
      vietnamese: String(item.vietnamese ?? '').trim().normalize('NFC'),
    }))
    .filter((item) => item.id && item.category && item.chinese && item.vietnamese);
}

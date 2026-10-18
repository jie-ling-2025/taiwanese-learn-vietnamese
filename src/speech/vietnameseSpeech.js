function getVietnameseVoice() {
  return new Promise((resolve) => {
    const synthesis = window.speechSynthesis;
    const currentVoices = synthesis.getVoices();
    if (currentVoices.length) {
      resolve(selectVietnameseVoice(currentVoices));
      return;
    }

    const finish = () => {
      window.clearTimeout(timeoutId);
      synthesis.removeEventListener('voiceschanged', onVoicesChanged);
      resolve(selectVietnameseVoice(synthesis.getVoices()));
    };
    const onVoicesChanged = () => {
      if (synthesis.getVoices().length) finish();
    };
    synthesis.addEventListener('voiceschanged', onVoicesChanged, { once: true });
    const timeoutId = window.setTimeout(finish, 2000);
  });
}

function selectVietnameseVoice(voices) {
  return (
    voices.find((voice) => voice.lang.toLowerCase() === 'vi-vn') ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith('vi-')) ??
    null
  );
}

export async function speakVietnamese(text) {
  const normalizedText = String(text ?? '').trim().normalize('NFC');
  if (!normalizedText) return 'unsupported';
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    return 'unsupported';
  }

  const voice = await getVietnameseVoice();
  if (!voice) return 'voice-unavailable';

  const synthesis = window.speechSynthesis;
  synthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(normalizedText);
  utterance.lang = 'vi-VN';
  utterance.voice = voice;
  utterance.rate = 0.85;
  synthesis.speak(utterance);
  return 'spoken';
}

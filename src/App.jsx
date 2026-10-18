import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, BookOpen, LoaderCircle, Volume2 } from 'lucide-react';
import { fetchApprovedPhrases } from './data/phraseApi.js';
import { speakVietnamese } from './speech/vietnameseSpeech.js';

export default function App() {
  const [phrases, setPhrases] = useState([]);
  const [loadState, setLoadState] = useState('loading');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [notice, setNotice] = useState('');

  async function loadPhrases(signal) {
    setLoadState('loading');
    setPhrases([]);
    setNotice('');
    try {
      const approvedPhrases = await fetchApprovedPhrases({ signal });
      setPhrases(approvedPhrases);
      setLoadState('ready');
      setSelectedCategory('全部');
    } catch (error) {
      if (error.name === 'AbortError') return;
      setPhrases([]);
      setLoadState('error');
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadPhrases(controller.signal);
    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => ['全部', ...new Set(phrases.map((phrase) => phrase.category))],
    [phrases],
  );
  const visiblePhrases = useMemo(
    () => selectedCategory === '全部'
      ? phrases
      : phrases.filter((phrase) => phrase.category === selectedCategory),
    [phrases, selectedCategory],
  );

  async function playVietnamese(text) {
    try {
      const result = await speakVietnamese(text);
      if (result === 'unsupported') {
        setNotice('目前的瀏覽器不支援語音播放，請改用最新版 Chrome 或 Edge。');
      } else if (result === 'voice-unavailable') {
        setNotice('裝置目前沒有越南語語音。請在 Windows「設定 → 時間與語言 → 語音」新增越南語語音，安裝後重新整理。');
      } else {
        setNotice('');
      }
    } catch {
      setNotice('語音播放失敗，請確認瀏覽器與裝置的語音設定。');
    }
  }

  return (
    <main className="page-shell">
      <header className="hero">
        <div className="hero-mark"><BookOpen aria-hidden="true" /></div>
        <p className="eyebrow">照顧情境・越南語練習</p>
        <h1>台灣人學越南語</h1>
        <p className="hero-copy">看中文提示、練習越南語。點選播放，聽聽裝置提供的越南語發音。</p>
        <div className="hero-note"><span className="note-dot" />教材會與核准後的長照情境內容同步</div>
      </header>

      <section className="lesson-area" aria-label="越南語教材">
        <div className="section-heading">
          <div><p className="eyebrow">PRACTICE</p><h2>情境句子</h2></div>
          {loadState === 'ready' && <span className="count">{visiblePhrases.length} 句</span>}
        </div>

        {loadState === 'ready' && phrases.length > 0 && (
          <nav className="categories" aria-label="教材分類">
            {categories.map((category) => (
              <button
                type="button"
                className={selectedCategory === category ? 'category is-active' : 'category'}
                key={category}
                aria-pressed={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >{category}</button>
            ))}
          </nav>
        )}

        {notice && <p className="notice" role="status"><AlertCircle aria-hidden="true" />{notice}</p>}

        {loadState === 'loading' && <div className="status-card" role="status"><LoaderCircle className="spin" />正在載入核准教材…</div>}
        {loadState === 'error' && (
          <div className="status-card error-card" role="alert">
            <AlertCircle aria-hidden="true" /><p>目前無法載入教材；為避免顯示未核准內容，教材暫不顯示。</p>
            <button className="retry-button" type="button" onClick={() => loadPhrases()}>重新載入</button>
          </div>
        )}
        {loadState === 'ready' && phrases.length === 0 && <div className="status-card">目前沒有核准教材。</div>}
        {loadState === 'ready' && phrases.length > 0 && visiblePhrases.length === 0 && <div className="status-card">此分類目前沒有句子。</div>}

        {loadState === 'ready' && visiblePhrases.length > 0 && (
          <div className="phrase-list">
            {visiblePhrases.map((phrase, index) => (
              <article className="phrase-card" key={phrase.id}>
                <div className="card-topline"><span className="phrase-number">{String(index + 1).padStart(2, '0')}</span><span className="phrase-category">{phrase.category}</span></div>
                <p className="chinese" lang="zh-Hant-TW">{phrase.chinese}</p>
                <p className="vietnamese" lang="vi">{phrase.vietnamese}</p>
                <button className="play-button" type="button" aria-label={`播放越南語：${phrase.vietnamese}`} onClick={() => playVietnamese(phrase.vietnamese)}>
                  <Volume2 aria-hidden="true" /><span>播放越南語</span>
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
      <footer>越南語語音由你的瀏覽器與裝置提供；可用語音依系統設定而異。</footer>
    </main>
  );
}

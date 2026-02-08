const QUOTE_URL = 'https://your-energy.b.goit.study/api/quote';
const STORAGE_KEY = 'quote-cache-v1';

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function readCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(payload) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
  }
}

async function fetchQuote() {
  const res = await fetch(QUOTE_URL);
  if (!res.ok) throw new Error('Quote request failed');
  return res.json();
}

async function getQuoteData() {
  const cache = readCache();
  const today = todayKey();

  if (cache?.date === today && cache?.quote && cache?.author) {
    return { quote: cache.quote, author: cache.author };
  }

  try {
    const data = await fetchQuote();
    const normalized = {
      date: today,
      quote: data.quote,
      author: data.author,
    };

    writeCache(normalized);
    return { quote: normalized.quote, author: normalized.author };
  } catch {
    if (cache?.quote && cache?.author) {
      return { quote: cache.quote, author: cache.author };
    }
    return null;
  }
}

export async function displayQuote() {
  const quoteText = document.getElementById('js-exercises-quote-text');
  const quoteAuthor = document.getElementById('js-exercises-quote-author');

  const data = await getQuoteData();
  if (!data) return;

  if (quoteText) quoteText.textContent = data.quote;
  if (quoteAuthor) quoteAuthor.textContent = data.author;
}

import { Marked } from "marked";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function sanitizeChatHref(value) {
  const href = String(value ?? "").trim();
  if (!href) return null;

  if (href.startsWith("#") || /^\/(?!\/)/.test(href)) {
    return href;
  }

  try {
    const url = new URL(href);
    return ALLOWED_PROTOCOLS.has(url.protocol) ? href : null;
  } catch {
    return null;
  }
}

const chatMarkdown = new Marked({
  async: false,
  breaks: true,
  gfm: true,
  renderer: {
    html({ text }) {
      return escapeHtml(text);
    },
    link({ href, title, tokens }) {
      const label = this.parser.parseInline(tokens);
      const safeHref = sanitizeChatHref(href);

      if (!safeHref) {
        return label;
      }

      const safeTitle = title ? ` title="${escapeHtml(title)}"` : "";
      return `<a href="${escapeHtml(
        safeHref
      )}"${safeTitle} target="_blank" rel="noopener noreferrer">${label}</a>`;
    },
    image({ text }) {
      return `<span class="chat-markdown__image-label">${escapeHtml(text)}</span>`;
    },
  },
});

export function renderChatMarkdown(content) {
  return chatMarkdown.parse(String(content ?? ""));
}

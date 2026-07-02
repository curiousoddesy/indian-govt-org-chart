import test from "node:test";
import assert from "node:assert/strict";

import {
  escapeHtml,
  renderChatMarkdown,
  sanitizeChatHref,
} from "../src/lib/chat-markdown.mjs";

test("renders the Markdown structures used in long AI answers", () => {
  const html = renderChatMarkdown(`# Answer

The **Union government** sets policy and *states implement it*.

## Escalation

1. Contact the district office.
2. Escalate to the state department.

- Keep the complaint number.
- Cite the responsible scheme.

> Verify the current office holder before acting.

| Level | Responsibility |
| --- | --- |
| Union | Policy |
| District | Delivery |

Use \`official contacts\` only.`);

  assert.match(html, /<h1>Answer<\/h1>/);
  assert.match(html, /<strong>Union government<\/strong>/);
  assert.match(html, /<em>states implement it<\/em>/);
  assert.match(html, /<h2>Escalation<\/h2>/);
  assert.match(html, /<ol>/);
  assert.match(html, /<ul>/);
  assert.match(html, /<blockquote>/);
  assert.match(html, /<table>/);
  assert.match(html, /<code>official contacts<\/code>/);
});

test("renders line breaks and fenced code blocks", () => {
  const html = renderChatMarkdown(`First line
Second line

\`\`\`text
District Magistrate
\`\`\``);

  assert.match(html, /First line<br>Second line/);
  assert.match(html, /<pre><code class="language-text">District Magistrate/);
});

test("allows safe external, contact, relative, and fragment links", () => {
  for (const href of [
    "https://example.gov.in/contact",
    "http://example.gov.in",
    "mailto:office@example.gov.in",
    "tel:+911122223333",
    "/docs/methodology",
    "#sources",
  ]) {
    assert.equal(sanitizeChatHref(href), href);
  }

  const html = renderChatMarkdown(
    "[Official source](https://example.gov.in \"Government source\")"
  );
  assert.match(html, /href="https:\/\/example\.gov\.in"/);
  assert.match(html, /title="Government source"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener noreferrer"/);

  const untitledLink = renderChatMarkdown(
    "[Methodology](/docs/methodology)"
  );
  assert.match(untitledLink, /href="\/docs\/methodology"/);
  assert.doesNotMatch(untitledLink, /title=/);
});

test("removes unsafe and malformed link destinations", () => {
  for (const href of [
    "",
    "   ",
    "//malicious.example",
    "javascript:alert(1)",
    "data:text/html,unsafe",
    "not a URL",
    null,
    undefined,
  ]) {
    assert.equal(sanitizeChatHref(href), null);
  }

  const html = renderChatMarkdown("[Read this](javascript:alert(1))");
  assert.match(html, /Read this/);
  assert.doesNotMatch(html, /href=/);
  assert.doesNotMatch(html, /javascript:/);
});

test("escapes raw HTML instead of executing it", () => {
  assert.equal(
    escapeHtml(`<script data-name="x">'unsafe' & more</script>`),
    "&lt;script data-name=&quot;x&quot;&gt;&#39;unsafe&#39; &amp; more&lt;/script&gt;"
  );

  const html = renderChatMarkdown(
    `<script>alert("unsafe")</script>\n\n<strong>not trusted</strong>`
  );
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /<strong>not trusted<\/strong>/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&lt;strong&gt;not trusted&lt;\/strong&gt;/);
});

test("does not load remote images from AI output", () => {
  const html = renderChatMarkdown("![map preview](https://example.com/map.png)");
  assert.doesNotMatch(html, /<img/);
  assert.doesNotMatch(html, /example\.com/);
  assert.match(html, /chat-markdown__image-label/);
  assert.match(html, /map preview/);
});

test("handles empty and non-string content without throwing", () => {
  assert.equal(renderChatMarkdown(""), "");
  assert.equal(renderChatMarkdown(null), "");
  assert.equal(renderChatMarkdown(undefined), "");
  assert.match(renderChatMarkdown(42), /<p>42<\/p>/);
  assert.equal(escapeHtml(42), "42");
});

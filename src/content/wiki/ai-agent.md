# AI Agent

The AI Agent answers natural-language questions about government offices,
current office holders, public contacts, responsibility, and escalation paths.
It is designed as a discovery aid, not as an authoritative substitute for an
official government source.

## How an answer is produced

1. The browser sends the bounded user/assistant conversation to `/api/chat`.
2. The Netlify Function validates roles, message lengths, and total payload size.
3. Question-specific retrieval selects relevant records from `ai-context.json`.
4. DeepSeek receives an evidence-first system prompt and the retrieved records.
5. The browser renders the response as safe GitHub-flavored Markdown.

The full raw dataset is not sent with every question. See [[metrics]] for the
generated AI context and [[methodology]] for verification rules.

## Response formatting

Answers can use:

- headings and paragraphs
- ordered and unordered lists
- bold and italic emphasis
- blockquotes and code
- horizontally scrollable tables
- links to official sources

Raw HTML is displayed as text rather than executed. Links are limited to web,
email, telephone, relative, and page-fragment destinations. Images from model
output are not loaded, which prevents an answer from silently contacting a
third-party image host.

## Reliability and use

- Treat names, appointments, and contact details as time-sensitive.
- Follow cited official sources where available.
- Check the Data Quality page before relying on a record.
- Do not submit private, financial, medical, or identity information in chat.
- Confirm high-stakes legal, safety, or benefits guidance with the responsible
  government office.

## Maintainer checks

```bash
npm run test:chat:coverage
npm run test:chat-format:coverage
npm run typecheck
npm run build
```

The first coverage suite tests validation, retrieval, prompt construction, and
upstream failures. The second tests Markdown rendering and output safety.

Back to [[index]] · See [[data-model]]

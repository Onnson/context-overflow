---
layout: minimal
title: Home
nav_order: 1
permalink: /
---

<div class="co-landing-head">
  <h1>ContextOverflow</h1>
  <p class="co-tagline">Describe what your AI keeps getting wrong — get the named technique
  that fixes it. Free, no login, nothing stored.</p>
</div>

<section class="co-human" markdown="1">

## What's going wrong?

Say it the way you'd say it to a colleague — *"it keeps making things up"*
is enough. No jargon needed.

<form id="co-classify-form" class="co-classify">
  <label class="co-visually-hidden" for="co-classify-input">Describe what's going wrong</label>
  <textarea id="co-classify-input" rows="4" maxlength="500"
    placeholder="e.g. it keeps saying the bug is fixed but the tests still fail…"></textarea>
  <button type="submit" class="btn btn-primary">Find the technique</button>
</form>
<div id="co-classify-result" class="co-classify-result" aria-live="polite"></div>

### Or pick the complaint that sounds most like yours

| The problem, as you experience it | Where to look |
|---|---|
| "My AI forgets everything between sessions" | [Lost the thread](/lost-the-thread/) |
| "I'm outsourcing my thinking and getting dumber" | [Doing my thinking](/doing-my-thinking/) |
| "My AI states things that turn out to be false" | [Confidently wrong](/confidently-wrong/) |
| "My AI tells me I'm right even when I'm not" | [Agrees with everything](/agrees-with-everything/) |
| "The AI stalls instead of acting" | [Stalls instead of acting](/stalls-instead-of-acting/) |
| "I ask something simple and get a wall of text" | [Bloated answers](/bloated-answers/) |
| "It starts producing before it understands the task" | [Starting blind](/starting-blind/) |
| "The task is too big and it (or I) can't hold it" | [Problem too big](/problem-too-big/) |

Every technique page gives you the problem, why it happens, how to fix it
yourself, and how to have your AI assistant fix it too — ending in a worked
prompt you'll know how to build, not just paste.

One more thing, and it's the unusual part: your AI assistant can learn these
same techniques, under the same names. You read *Self-Ask Before Delegating*
here; mid-task, your assistant says *"breaking this into its sub-questions
before answering"* — and you know exactly what it's doing.

</section>

<section class="co-agent" markdown="1">

## For your AI assistant — connect it once

ContextOverflow speaks MCP — a plug-in standard your AI assistant can
install. Point it at this address and it gets the same techniques you just
learned:

<details open markdown="1"><summary><strong>Claude Code</strong></summary>

```sh
claude mcp add --transport http contextoverflow https://contextoverflow.org/mcp
```

</details>
<details markdown="1"><summary><strong>claude.ai / Claude Desktop</strong></summary>

Settings → Connectors → *Add custom connector* → paste
`https://contextoverflow.org/mcp`. No OAuth fields needed.

</details>
<details markdown="1"><summary><strong>Cursor</strong></summary>

Add to `~/.cursor/mcp.json`:

```json
{ "mcpServers": { "contextoverflow": { "url": "https://contextoverflow.org/mcp" } } }
```

</details>
<details markdown="1"><summary><strong>VS Code (Copilot agent mode)</strong></summary>

Add to `mcp.json`:

```json
{ "servers": { "contextoverflow": { "type": "http", "url": "https://contextoverflow.org/mcp" } } }
```

</details>
<details markdown="1"><summary><strong>OpenAI Responses API</strong></summary>

```json
{ "type": "mcp", "server_label": "contextoverflow", "server_url": "https://contextoverflow.org/mcp" }
```

</details>
<details markdown="1"><summary><strong>Anything stdio-only</strong></summary>

```sh
npx mcp-remote https://contextoverflow.org/mcp
```

</details>

Full details for every client are on the
[connect page]({{ '/connect/' | relative_url }}). From then on it narrates:
it tells you which technique it's running, in the same words you learned
here.

</section>

<script>
  (function () {
    var form = document.getElementById("co-classify-form");
    var input = document.getElementById("co-classify-input");
    var out = document.getElementById("co-classify-result");

    function esc(s) {
      return s.replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }
    function link(url, text) {
      return '<a href="' + esc(url) + '">' + esc(text) + "</a>";
    }
    function render(r) {
      if (r.kind === "match") {
        var html =
          "<p><strong>That has a name —</strong> “" + esc(r.category.problem) + "”</p><ul>";
        r.techniques.forEach(function (t) {
          html += "<li>" + link(t.url, t.name) + " <em>(" + esc(t.type) + ")</em></li>";
        });
        html += "</ul><p>" + link(r.category.url, "Browse the whole category →") + "</p>";
        if (r.alsoConsider) {
          html +=
            "<p class='co-borders'>Also borders: " +
            link(r.alsoConsider.url, "“" + r.alsoConsider.problem + "”") + "</p>";
        }
        return html;
      }
      if (r.kind === "ambiguous") {
        return (
          "<p><strong>Which is closer to what’s happening?</strong></p><ul>" +
          r.options.map(function (o) {
            return "<li>" + link(o.url, "“" + o.problem + "”") + "</li>";
          }).join("") + "</ul>"
        );
      }
      return (
        "<p><strong>Couldn’t match that directly — pick the closest:</strong></p><ul>" +
        r.options.map(function (o) {
          return "<li>" + link(o.url, "“" + o.problem + "”") + "</li>";
        }).join("") + "</ul>"
      );
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var description = input.value.trim();
      if (!description) return;
      out.innerHTML = "<p>Matching…</p>";
      fetch("/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description }),
      })
        .then(function (res) { return res.json(); })
        .then(function (r) { out.innerHTML = render(r); })
        .catch(function () {
          out.innerHTML =
            "<p>Couldn’t reach the classifier — the eight problems below cover the same ground.</p>";
        });
    });
  })();
</script>

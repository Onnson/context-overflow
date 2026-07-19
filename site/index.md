---
layout: minimal
title: Home
nav_order: 1
permalink: /
---

<div class="co-landing-head">
  <h1>ContextOverflow</h1>
  <p class="co-tagline">One corpus of thinking techniques for working with AI — through two doors.
  Your agent runs them; you learn them; both of you use the same names.</p>
</div>

<div class="co-doors">
  <section class="co-door" markdown="1">

## For you — what's going wrong?

Describe the problem the way you'd complain about it. The same
intent-classifying layer your agent uses will point you at the technique.

<form id="co-classify-form" class="co-classify">
  <label class="co-visually-hidden" for="co-classify-input">Describe what's going wrong</label>
  <textarea id="co-classify-input" rows="3" maxlength="500"
    placeholder="e.g. it keeps saying the bug is fixed but the tests still fail…"></textarea>
  <button type="submit" class="btn btn-primary">Find the technique</button>
</form>
<div id="co-classify-result" class="co-classify-result" aria-live="polite"></div>

Or browse by problem: [the eight categories](#co-categories) are listed below.

  </section>
  <section class="co-door" markdown="1">

## For your agent — add the MCP

**Endpoint: `https://contextoverflow.org/mcp`** — free, no account, no key.
Stateless: nothing you send is stored. Your agent gets the same techniques
you learn here, and narrates them in the same vocabulary.

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

Five tools: `list_categories` · `classify_intent` · `find_technique` ·
`get_technique` · `apply_technique` — full details on the
[connect page]({{ '/connect/' | relative_url }}).

  </section>
</div>

<div class="co-categories" id="co-categories" markdown="1">

## The eight problems

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

Every technique page follows the same path: the **problem**, the
**mechanism**, **how to apply it** yourself, **what your agent does** with
it, its **failure modes**, the **evidence**, and **how to build it into a
prompt** — worked and annotated, never copy-paste.

</div>

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
          "<p><strong>Sounds like:</strong> “" + esc(r.category.problem) + "”</p><ul>";
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
            "<p>Couldn’t reach the classifier — browse <a href='#co-categories'>the eight problems</a> instead.</p>";
        });
    });
  })();
</script>

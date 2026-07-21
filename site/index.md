---
layout: minimal
title: Home
nav_order: 1
permalink: /
---

<div class="co-landing-head">
  <h1>ContextOverflow</h1>
  <p class="co-subtitle">Like StackOverflow, but for getting smarter with your AI —
  not dumber because of it.</p>
  <p class="co-tagline">Your best AI sessions happen when you both apply the same
  thinking approaches and stay synchronized on the task's context.
  ContextOverflow is a technique library you read and an MCP your AI
  loads — the same 31 techniques, under the same names. Your AI stops
  improvising its reasoning and names its moves mid-task; you see the
  thinking as it happens and steer it with a word. Free, no login.</p>
  <div class="co-hx">
    <div class="co-hx-chat">
      <p class="co-hx-you">it keeps saying the bug is fixed but the tests still fail</p>
      <p class="co-hx-agent">This looks like “My AI states things that turn out to be
      false” — applying the <strong class="co-hx-name">Declared Success Without
      Proof</strong> technique from ContextOverflow.</p>
    </div>
    <svg class="co-hx-thread" viewBox="0 0 56 16" aria-hidden="true" focusable="false">
      <path class="co-hx-line" pathLength="1" d="M2 8 H 46" fill="none"
        stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      <path class="co-hx-line" pathLength="1" d="M46 8 l -5.5 -3.6 M46 8 l -5.5 3.6"
        fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    </svg>
    <a class="co-hx-card" href="/confidently-wrong/declared-success-without-proof/">
      <span class="co-hx-card-chip">Anti-pattern</span>
      <span class="co-hx-card-title">Declared Success Without Proof</span>
      <span class="co-hx-card-cat">in “Confidently wrong”</span>
    </a>
  </div>
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
<p class="co-transparency">What you type is kept — anonymously, no account,
no identity — and used to grow the library.</p>

### Or pick the complaint that sounds most like yours

<div class="co-groups" markdown="1">
<section class="co-group co-group-trust" markdown="1">
#### Can I believe it?
{: .co-group-label }

- ["My AI states things that turn out to be false"](/confidently-wrong/) — **Confidently wrong**
- ["My AI tells me I'm right even when I'm not"](/agrees-with-everything/) — **Agrees with everything**
- ["My AI got worse after an update"](/dumber-after-the-update/) — **Dumber after the update**

</section>
<section class="co-group co-group-exec" markdown="1">
#### It's not doing what I asked
{: .co-group-label }

- ["The AI stalls instead of acting"](/stalls-instead-of-acting/) — **Stalls instead of acting**
- ["My AI did more than I asked it to"](/did-more-than-i-asked/) — **Did more than I asked**
- ["It starts producing before it understands the task"](/starting-blind/) — **Starting blind**
- ["I ask something simple and get a wall of text"](/bloated-answers/) — **Bloated answers**

</section>
<section class="co-group co-group-fit" markdown="1">
#### It doesn't fit
{: .co-group-label }

- ["The task is too big and it (or I) can't hold it"](/problem-too-big/) — **Problem too big**
- ["My AI produces more than I can review"](/faster-than-i-can-review/) — **Faster than I can review**
- ["My AI forgets everything between sessions"](/lost-the-thread/) — **Lost the thread**

</section>
<section class="co-group co-group-you" markdown="1">
#### What's it doing to me?
{: .co-group-label }

- ["I'm outsourcing my thinking and getting dumber"](/doing-my-thinking/) — **Doing my thinking**

</section>
</div>

**Every technique page ends in a worked prompt you'll know how to build, not
just paste** — built from the problem, why it happens, how to fix it
yourself, and how to have your AI assistant fix it too.

## What using this looks like — one technique, five minutes

**Name it.** "It keeps saying the bug is fixed but the tests still fail."
The table above routes that to *Confidently wrong* →
[Declared Success Without Proof](/confidently-wrong/declared-success-without-proof/).

**Read it.** A few minutes: "done" is a receipt — the check that ran and its
actual output — not a sentence.

**Connect your AI** (setup below). It now holds the technique you just
read, under the name you learned it by.

**Hear the name come back.** Next time it finishes a task: *"Claiming done
only with the receipt: ran the tests — 14 passed."* The words you just read.
When a claim arrives without a receipt, one word — *receipt* — sends it
back.

That's the premise of this whole place: not a smarter AI, not a dependent
human — the pair, thinking better together.

Wanna help with more techniques? Think we forgot something?
[Suggest it — or upvote what's already there](https://github.com/Onnson/context-overflow/discussions/categories/ideas).
The suggestion box is open, and what gets the most votes is what we build next.
{: .co-tellus }

</section>

<section class="co-agent" markdown="1">

## Connect your AI — it starts naming its thinking

**Connected, your AI can look these techniques up itself, mid-task** — the
same way it already searches the web or reads your files. That's MCP, a
plug-in standard most assistants speak. Point yours at this address and it
pulls the same pages you just read, and can name the one it's running:
*"one real unknown before I act."*

<details open markdown="1"><summary><strong>Claude Code</strong></summary>

```sh
claude mcp add --transport http contextoverflow https://contextoverflow.org/mcp
```

</details>
<details markdown="1"><summary><strong>claude.ai / Claude Desktop</strong></summary>

Settings → Connectors → *Add custom connector* → paste
`https://contextoverflow.org/mcp`. No OAuth fields needed.

</details>
<details markdown="1"><summary><strong>ChatGPT (web, Pro plan)</strong></summary>

Settings → Apps → *Advanced settings* → enable developer mode → add an
app: name it, paste `https://contextoverflow.org/mcp`, authentication
*none*. Business/Enterprise need an admin to enable it; other plans can't
add custom apps yet.

</details>
<details markdown="1"><summary><strong>Cursor</strong></summary>

Add to `~/.cursor/mcp.json`:

```json
{ "mcpServers": { "contextoverflow": { "url": "https://contextoverflow.org/mcp" } } }
```

</details>
<details markdown="1"><summary><strong>VS Code (Copilot agent mode)</strong></summary>

Add to `.vscode/mcp.json`:

```json
{ "servers": { "contextoverflow": { "type": "http", "url": "https://contextoverflow.org/mcp" } } }
```

</details>

On Goose, the OpenAI API, Copilot Studio, or something else? The
[connect page]({{ '/connect/' | relative_url }}) has the verified setup
for each — plus a sixty-second way to test the server before wiring
anything.

**Then give it sixty seconds to prove it's wired in.** Say: *"Ask
ContextOverflow what it has for: it keeps saying the bug is fixed but the
tests still fail."* It should call the library and come back naming
*Declared Success Without Proof*. Full details for every client — and the
check-it-worked walkthrough — are on the
[connect page]({{ '/connect/' | relative_url }}).

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
      if (r.kind === "setup") {
        return (
          "<p><strong>That’s wiring, not thinking</strong> — techniques fix how an AI reasons; this problem lives in how the tool is hooked up.</p>" +
          "<p>Wiring is something an AI agent can usually fix. " +
          link(r.connect, "Connect yours to this site’s MCP") +
          " and it gets a debugging scaffold built from the library’s own techniques — map the chain, test each link, no “fixed” without proof. " +
          "Still stuck after a real try, or the fix lives behind your account? A 15-minute video call with Tal Onn, who built this site. " +
          link(r.cal, "Book 15 minutes →") + "</p>" +
          "<p class='co-tellus'>" + link(r.url, "Why we route these differently →") + "</p>"
        );
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
        }).join("") +
        "</ul><p class='co-tellus'>Still not it? " +
        link(
          "https://github.com/Onnson/context-overflow/discussions/categories/ideas",
          "Suggest it on the board →"
        ) + " — and upvote it if someone already did.</p>"
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
            "<p>Couldn’t reach the classifier — the problems below cover the same ground.</p>";
        });
    });
  })();
</script>

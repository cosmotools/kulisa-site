# The pictures' scenarios

One entry per picture of the site: what the visitor should understand from it, how it is made, and what it must
show. Read this before changing a picture, a scene or a feature's text; keep it current when one changes. Only what sets
Kulisa apart is on the page (the author, 2026-10-15): the grid, a browser's tabs and the like were taken off. The code:
`scenes.ts` (screenshots, played in this order on one stage), `src/components/scenes/` (scenes drawn in HTML).

**The world.** Hearth & Co, a small marketplace for handmade homeware (`shop/`): Anna Berg, a buyer
(`anna@hearth.shop`, fox); Ben Okafor, a seller (`ben@hearth.shop`, frog); Cleo Duarte, the admin
(`cleo@hearth.shop`, panda). Signed in by name, no passwords. Its back end is a second repository, `hearth-api`
(`shop-api/`). The agents are a real Claude Code and a real Codex. Profiles in columns unless a scene says otherwise;
light theme; the window 1440×900, pictures at 2×.

**Screenshot or drawn scene.** A screenshot where the window itself shows the feature (panes, outlines, dialogs).
A scene drawn in HTML where a picture of the window would show less than the feature does: a key held, a voice, a
story in steps. Drawn scenes are set inside a small Kulisa window, and are always light, as the screenshots
are, whatever the page's theme (`Media.astro`). The agents in them: Claude Code's own pixel mascot (orange), Codex a
little blue terminal "›_" with legs. A drawn scene shows only what the guide says the app does, in the site's look; no invented feature,
no brand logos (Codex is a blue "›_ Codex" pill).

**Always.** The accounts' emails never in a picture: the stage shows `you@hearth.shop` in their place (Codex is shown
by its id, `codex-3`). Never the author's own Kulisa or profiles.

---

## hero-window — the hero (`hero.media`), also the social card

- **The idea:** the loop. The agent did the work as one user and checked it as the others, by itself, and shows
  you where; you could have been away.
- **Kind:** screenshot, the whole window.
- **Scenario:** the real Claude Code gets this prompt, typed into its terminal: *"The Hearth & Co shop runs at
  http://localhost:4580/ and anna, ben and cleo are signed in in their profiles. As anna, put the Stoneware mug and
  the Beeswax candle in the cart and place the order. Then check that the new order shows up for ben and for cleo,
  point at it in both their pages with a short label, and tell me in two short lines what you saw. Change no code."*
  It runs to the end on its own.
- **In the picture:** Anna's "Your orders" with the new order; the order outlined in Ben's and Cleo's pages with
  "agent: points at …" over their panes; Claude Code's two-line report in the terminal; the task named by the agent
  in the bar.
- **Then:** `public/og.png` is rendered from it (`tools/og.html`, headless Chrome at 1200×630).

## highlight — "The agent points back" (drawn: `scenes/Highlight.astro`)

- **The idea:** ask where something is, and the agent shows you, right on the page, in every page it is in.
- **Scenario (a loop):** Ben's orders and Cleo's all-orders side by side; you type "where is Anna's order?" into
  Claude Code's input and send it → the agent's pointer, Claude beside it, goes to #1044 in Ben's page: outlined,
  "agent: points at: #1044" over his pane → the same in Cleo's → Claude: "Here, in both pages: outlined for Ben and
  for Cleo." → your pointer clicks in Ben's page: his outline goes (it stays until you click or type there), Cleo's
  stays → again.
- **Still:** both outlined, the answer below.
- **The screenshot** of the real thing (`_highlight.png`) shows the known `locator('aria-ref=…')` label.

## profiles — "Sign in once, for every task"

- **The idea:** a profile is a person: who it is (the agent picks by it), a test user for your local app, and Sign
  In… once for every task.
- **Kind:** screenshot of Settings on Anna's profile page (the dialog alone).
- **In the picture:** Projects / Agents / Profiles tree; Name, About, Test login and password, Sign In… with "once for
  every task of its projects".

## agents — "The agent you choose"

- **The idea:** Claude Code or Codex, several accounts, one of them the project's default.
- **Kind:** screenshot of Settings on the project's page.
- **In the picture:** Code (hearth), Agents (Claude Code · you@hearth.shop, default; Codex · codex-3), the three
  profiles with what they are.

## tasks — "Several tasks at once"

- **The idea:** several pieces of work at once, each a tab with its own agent.
- **Kind:** screenshot, the whole window.
- **Scenario:** the first task renamed `checkout`, two more made and named `refund-button` and `search`, the first one
  shown again.
- **In the picture:** the three tabs in the bar under the grid; the hero's report still in the terminal.

## watch — "See what the agent does" (drawn: `scenes/Watch.astro`)

- **The idea:** every action of the agent is marked on the page while it happens; and it is the agent's pointer, not
  yours (the author: Claude beside the pointer).
- **Why drawn:** a screenshot catches one frozen moment; the point is the pointer moving and the marks coming.
- **Scenario (a loop):** in a small Kulisa, Anna's shop page and Ben's orders side by side, Claude Code's tab below
  saying what it does. The agent's pointer, a little Claude beside it, goes to the Stoneware mug's Add to cart → the
  button outlined, a ring where it clicks, "agent: click" over Anna's pane, the cart 0 → 1 → the pointer to Place
  order, the same marks, the cart empty again → "agent: navigate" over Ben's pane, the new order #1044 in his list →
  "agent: points at: #1044", the row outlined → again.
- **Still:** the end (the order outlined in Ben's page).
- **The screenshot** of the real thing is still taken (`_watch.png`): the last frame before the cart changed.

## pick — "Point and tell" (drawn: `scenes/Pick.astro`)

- **The idea:** click Pick, then the thing on the page; it lands in the agent's prompt, you write the rest; picks
  from several panes in one message. Your pointer, a person's: no Claude beside it (the pair of `watch`).
- **Scenario (a loop):** Anna's shop and Ben's orders, each pane with its address bar and the Pick button at its end;
  Claude Code's input below → your pointer clicks Anna's Pick (lit) → over "Stoneware mug": outlined dashed → click:
  outlined, "🦊 Stoneware mug" drops into the input → "was ordered here, but" typed after it → Ben's Pick → his
  "Orders to ship" list, dashed, then picked: "🐸 Orders to ship" drops in → "doesn't show it" typed → again.
- **Still:** the whole message.
- **The screenshot** of the real thing is still taken (`_pick.png`): the real reference is text (`[kulisa pick: …]`);
  the drawn chips stand for it.

## handover — "One agent runs out, another goes on" (wide; drawn: `scenes/Handover.astro`)

- **The idea:** your agents are friends who cover for each other: when one is worn out (out of tokens), the other
  takes the same work over and finishes it, nothing started again. The author asked for it abstract and human (no
  branches, profiles or tabs in it): two characters, not the dialog.
- **Truth kept:** agents do not talk to each other or hand over by themselves: you do (Hand over). So Claude says
  only that it is out of tokens, a small pointer presses Hand over, and Codex answers in its own words, as it does
  after a real hand-over.
- **Where:** inside a small Kulisa window (the author: not a laptop): the title bar with the logo, three profile
  panes (🦊 buyer, 🐸 seller, 🐼 admin, their pages as soft blocks), the terminal island with the agents' tabs.
- **The friends:** Claude Code is its own pixel mascot, as Claude Code draws it in its terminal (orange, two eyes,
  arms, four legs); Codex is a little blue terminal "›_" with a blinking cursor and two legs (no OpenAI logo).
- **Scenario (a loop):** Claude works in the terminal (bobbing, lines running in orange), its clicks land in the
  panes as orange rings → out of tokens: eyes half shut, "I'm out of tokens…", a bell on its tab → a pointer on its
  tab, the menu "Hand over · Codex" → Claude shrinks into its tab and sleeps there ("z z"); Codex's tab comes and
  Codex jumps into the terminal: "I've got it!" → Codex works (lines in blue, legs stepping, blue rings in the
  panes) → a ✓ in every pane, Codex hops for joy, Claude's tab still asleep.
- **Still:** the end.
- **The screenshot** of the real dialog is still taken (`_handover.png`), and what Codex says after it
  (`_handover-done.png`): Codex's first start asks to trust the folder and Kulisa's hooks, and to read Kulisa's skill
  outside its sandbox, answered in the scene as a person would (told to the app's author).

## dictation — "Say it instead of typing" (drawn: `scenes/Dictation.astro`)

- **The idea:** hold the right Ctrl, speak, let go: your words are in the agent's message, to read and send.
- **Why drawn:** the stage has no microphone, and a picture of the microphone button says nothing.
- **Scenario (a loop):** Ctrl up, the input empty → Ctrl down, the microphone lit with a wave → the words arrive one by
  one: "the refund button does nothing for Ben, check it as the seller" → Ctrl up, the text stays → again.
- **Still (reduced motion, no JavaScript):** Ctrl down, the microphone lit, the whole phrase.

## repos — "Front end and back end in one task" (drawn: `scenes/Repos.astro`)

- **The idea:** a task starts with one repository; when the work needs another, it is added, and the agent goes on in
  both, on one branch.
- **Why drawn:** a screenshot is a terminal of paths; the story (needs it, adds it, works in both) is the point.
- **Scenario (a loop, the line under the terminal tells each step):** Codex reads `shop/src/RefundButton.tsx`; the
  `api` card dashed, "not in this task" → "The refund itself is made by the API: that is another repository." →
  the tab's menu: Add Repository → api → the `api` card appears and its chip lights up next to `shop`: "api is in
  the task now, on its branch: refund-button" → Codex hops to `api`, edits `routes/refunds.ts` → back to `shop`,
  edits `RefundButton.tsx` → to `api`, runs its tests → "Done in both, on one branch: refund-button", a green dot on
  each file edited.
- **Still:** the end.
- **The screenshot** of the real thing is still taken (`_repos.png`, to look at): the terminal as a column, both
  chips, Claude Code saying it works in both.

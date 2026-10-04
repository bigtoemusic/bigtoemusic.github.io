// BigToe Music site scripts.

// Phone-width ☰ menu: open/close, and close after picking a link or pressing Escape.
const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");
if (nav && navToggle) {
  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open);
  };
  navToggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  nav.querySelectorAll("#nav-links a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
}

// Email signup forms → Kit (form action set in index.html).
// Sent in the background so visitors stay on the page; Kit replies with JSON
// {status: "success"} or {status: "failed", errors: {messages: [...]}}.
document.querySelectorAll(".js-signup").forEach((form) => {
  const note = form.querySelector(".form-note");
  const button = form.querySelector("button");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    button.disabled = true;
    note.textContent = "Sending…";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (data.status === "success") {
        form.reset();
        note.textContent = "Thanks! Check your email to confirm your spot for founder pricing.";
      } else {
        const messages = data.errors?.messages || [];
        note.textContent = messages.some((m) => /email/i.test(m))
          ? "That email address doesn't look right. Please check it and try again."
          : "Sorry, something went wrong. Please try again.";
      }
    } catch {
      note.textContent = "Couldn't reach the signup service. Please check your connection and try again.";
    } finally {
      button.disabled = false;
    }
  });
});

// Contact form → Web3Forms (action and access key set in contact.html), emailed to info@.
// Sent in the background; Web3Forms replies with JSON {success: true|false, message}.
const contact = document.querySelector(".js-contact");
if (contact) {
  const note = contact.querySelector(".form-note");
  const button = contact.querySelector("button");

  contact.addEventListener("submit", async (e) => {
    e.preventDefault();
    button.disabled = true;
    note.textContent = "Sending…";
    try {
      const res = await fetch(contact.action, {
        method: "POST",
        body: new FormData(contact),
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        contact.reset();
        note.textContent = "Thanks! Your message was sent. We'll get back to you soon.";
      } else {
        note.textContent = "Sorry, your message couldn't be sent. Please try again in a moment.";
      }
    } catch {
      note.textContent = "Couldn't reach the server. Please check your connection and try again.";
    } finally {
      button.disabled = false;
    }
  });
}

// FAQ tabs, single-open accordion, and search.
const faq = document.querySelector(".faq-list");
if (faq) {
  const tabs = [...document.querySelectorAll(".faq-tabs button")];
  const items = [...faq.querySelectorAll("details")];
  const search = document.querySelector(".faq-search input");
  const empty = document.querySelector(".faq-empty");

  const render = () => {
    const query = search.value.trim().toLowerCase();
    const active = tabs.find((t) => t.getAttribute("aria-selected") === "true").dataset.tab;
    let shown = 0;
    items.forEach((item) => {
      const match = query
        ? item.textContent.toLowerCase().includes(query)
        : item.dataset.tab === active;
      item.hidden = !match;
      if (match) shown++;
    });
    empty.hidden = shown > 0;
  };

  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", t === tab));
      search.value = "";
      items.forEach((i) => (i.open = false));
      render();
    })
  );

  items.forEach((item) =>
    item.addEventListener("toggle", () => {
      if (item.open) items.forEach((other) => other !== item && (other.open = false));
    })
  );

  search.addEventListener("input", render);
  render();
}

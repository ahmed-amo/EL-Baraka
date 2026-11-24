"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { answerChat, quickPrompts, type ChatbotFacts } from "@/lib/chatbot-knowledge";
import { trackEvent } from "./tracker";

type Msg = { id: string; role: "bot" | "user"; text: string; links?: { label: string; href: string }[] };

export function SiteChatbot({ facts, lift = false }: { facts: ChatbotFacts; lift?: boolean }) {
  const t = useTranslations("chatbot");
  const locale = useLocale();
  const titleId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);

  useEffect(() => {
    if (!open || messages.length) return;
    setMessages([
      {
        id: "welcome",
        role: "bot",
        text: t("welcome", { name: facts.legalName }),
      },
    ]);
  }, [open, messages.length, t, facts.legalName]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;
    const reply = answerChat(trimmed, facts, locale);
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: trimmed },
      { id: `b-${Date.now() + 1}`, role: "bot", text: reply.text, links: reply.links },
    ]);
    setInput("");
    trackEvent("chatbot_ask");
  }

  const prompts = locale === "ar" ? quickPrompts.ar : quickPrompts.fr;

  return (
    <div className={`chatbot no-print${lift ? " is-lifted" : ""}`}>
      {open ? (
        <section className="chatbot-panel" role="dialog" aria-labelledby={titleId} aria-modal="false">
          <header className="chatbot-head">
            <div>
              <p className="chatbot-kicker">{t("kicker")}</p>
              <h2 id={titleId}>{t("title")}</h2>
            </div>
            <button type="button" className="chatbot-close" aria-label={t("close")} onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </header>

          <div className="chatbot-messages" ref={listRef}>
            {messages.map((message) => (
              <div key={message.id} className={`chatbot-bubble is-${message.role}`}>
                <p>{message.text}</p>
                {message.links?.length ? (
                  <div className="chatbot-links">
                    {message.links.map((link) =>
                      link.href.startsWith("http") || link.href.startsWith("tel:") || link.href.startsWith("mailto:") ? (
                        <a key={link.href + link.label} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                          {link.label}
                        </a>
                      ) : (
                        <Link key={link.href + link.label} href={link.href} onClick={() => setOpen(false)}>
                          {link.label}
                        </Link>
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="chatbot-prompts" aria-label={t("suggestions")}>
            {prompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => ask(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="chatbot-form"
            onSubmit={(event) => {
              event.preventDefault();
              ask(input);
            }}
          >
            <label className="sr-only" htmlFor="chatbot-input">
              {t("placeholder")}
            </label>
            <input
              id="chatbot-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t("placeholder")}
              autoComplete="off"
            />
            <button type="submit" aria-label={t("send")} disabled={!input.trim()}>
              <Send size={16} />
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className={`chatbot-fab${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-label={open ? t("close") : t("open")}
        onClick={() => {
          setOpen((value) => !value);
          if (!open) trackEvent("chatbot_open");
        }}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open ? <span>{t("open")}</span> : null}
      </button>
    </div>
  );
}

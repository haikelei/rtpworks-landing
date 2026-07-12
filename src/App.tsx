import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowRight,
  ChartLineUp,
  Check,
  Code,
  EnvelopeSimple,
  GameController,
  PuzzlePiece,
  ShieldCheck,
  SlidersHorizontal,
  TelegramLogo,
  WechatLogo,
  WhatsappLogo,
  Wrench,
} from '@phosphor-icons/react'
import './App.css'

type Service = {
  title: string
  copy: string
  icon: string
}

type PortfolioItem = {
  title: string
  focus: string
  tone: string
  image: string
}

const services: Service[] = [
  {
    title: 'Slot Product Delivery',
    copy: 'Turn concepts, existing code, or partial builds into launch-ready slot products with clear delivery ownership.',
    icon: 'check',
  },
  {
    title: 'Game Customization & Reskin',
    copy: 'Themes, reels, feature logic, UX, RTP tuning, and market-specific packaging without starting from zero.',
    icon: 'sliders',
  },
  {
    title: 'Platform Module Development',
    copy: 'Lobby, game management, wallet flows, promo modules, reporting, and admin tools built for operations.',
    icon: 'module',
  },
  {
    title: 'RTP / Product / Operations Support',
    copy: 'RTP, volatility, feature specs, operations configuration, and data-driven product decisions.',
    icon: 'chart',
  },
  {
    title: 'RGS/API Integration',
    copy: 'Game APIs, RGS flows, wallet callbacks, round lifecycle, bonus logic, and back-office systems.',
    icon: 'code',
  },
  {
    title: 'Launch QA & Maintenance',
    copy: 'Device QA, edge-case testing, release checks, bug fixes, monitoring, and post-launch updates.',
    icon: 'shield',
  },
]

const portfolioItems: PortfolioItem[] = [
  { title: 'Mythic reels', focus: 'Reskin system', tone: 'emerald', image: '/slot-mock/zeus-hades.jpg' },
  { title: 'Candy bonus flow', focus: 'Feature logic', tone: 'steel', image: '/slot-mock/sweet-bonanza.jpg' },
  { title: 'Jackpot state', focus: 'Win presentation', tone: 'violet', image: '/slot-mock/olympus.jpg' },
  { title: 'Anime feature round', focus: 'Launch QA', tone: 'moss', image: '/slot-mock/moon-princess.jpg' },
]

const steps = [
  {
    title: 'Map the launch path',
    copy: 'Share the product goal, market, constraints, and current build. We identify the fastest safe path to launch.',
  },
  {
    title: 'Ship a playable build',
    copy: 'We deliver a runnable build so your team can test mechanics, validate flow, and give concrete feedback.',
  },
  {
    title: 'Integrate and verify',
    copy: 'We connect it to your environment, verify APIs, wallet flows, performance, QA, and sign-off criteria.',
  },
  {
    title: 'Maintain and extend',
    copy: 'We monitor, maintain, and evolve the solution as your roadmap and customer needs grow.',
  },
]

const engagementModels = [
  {
    title: 'Pilot Scope',
    copy: 'A small proof build or delivery slice that validates fit before a larger launch sprint.',
  },
  {
    title: 'Launch Sprint',
    copy: 'Time-boxed delivery with clear scope, milestones, QA, and a launch-ready outcome.',
  },
  {
    title: 'Monthly Maintenance',
    copy: 'Ongoing support, updates, monitoring, and improvements after the product is live.',
  },
  {
    title: 'Product Delivery',
    copy: 'End-to-end delivery for games, modules, integrations, and longer product roadmaps.',
  },
]

const contactChannels = [
  {
    title: 'Telegram',
    detail: 'Fastest for product fit and integration questions.',
    value: '@Gary_Luck',
    href: 'https://t.me/Gary_Luck',
    icon: 'telegram',
  },
  {
    title: 'WhatsApp',
    detail: 'Best for voice notes, screenshots, and quick launch context.',
    value: '+86 18357040465',
    href: 'https://wa.me/8618357040465',
    icon: 'whatsapp',
  },
  {
    title: 'WeChat',
    detail: 'Useful for China-based teams, partners, and payment follow-up.',
    value: 'WeChat ID: 18357040465',
    href: '#contact-form',
    icon: 'wechat',
  },
  {
    title: 'Email',
    detail: 'Best for specs, source access, timelines, and commercial notes.',
    value: 'lujialei08@gmail.com',
    href: 'mailto:lujialei08@gmail.com',
    icon: 'email',
  },
]

function Icon({ name }: { name: string }) {
  if (name === 'sliders') return <SlidersHorizontal aria-hidden="true" />
  if (name === 'module') return <PuzzlePiece aria-hidden="true" />
  if (name === 'chart') return <ChartLineUp aria-hidden="true" />
  if (name === 'code') return <Code aria-hidden="true" />
  if (name === 'shield') return <ShieldCheck aria-hidden="true" />
  if (name === 'game') return <GameController aria-hidden="true" />
  if (name === 'wrench') return <Wrench aria-hidden="true" />
  return <Check aria-hidden="true" />
}

function Arrow() {
  return <ArrowRight className="arrow" aria-hidden="true" />
}

function ChannelIcon({ name }: { name: string }) {
  if (name === 'telegram') return <TelegramLogo aria-hidden="true" />
  if (name === 'whatsapp') return <WhatsappLogo aria-hidden="true" />
  if (name === 'wechat') return <WechatLogo aria-hidden="true" />
  return <EnvelopeSimple aria-hidden="true" />
}

function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="network-grid" />
      <img className="hero-game-shot" src="/slot-mock/sweet-bonanza.jpg" alt="" />
      <div className="panel reel-panel">
        <div className="panel-title">REEL LOGIC</div>
        <div className="reel-grid">
          {['7', 'A', 'K', 'W', 'Q', 'J', '9', 'S', 'R'].map((symbol, index) => (
            <span className={index === 3 ? 'active' : ''} key={`${symbol}-${index}`}>
              {symbol}
            </span>
          ))}
        </div>
        <code>{'ReelEngine.evaluate()'}</code>
      </div>
      <div className="panel curve-panel">
        <div className="panel-title">RTP CURVE</div>
        <div className="curve">
          <span />
          <strong>Verified</strong>
        </div>
      </div>
      <div className="panel api-panel">
        <div className="panel-title">API FLOW</div>
        <div className="flow">
          <span>Client</span>
          <b />
          <span>Game API</span>
          <b />
          <span>RGS</span>
          <b />
          <span>Wallet</span>
        </div>
      </div>
      <div className="panel library-panel">
        <div className="panel-title">GAME LIBRARY</div>
        <div className="mini-games">
          <i />
          <i />
          <i />
          <em>+</em>
        </div>
      </div>
      <div className="panel status-panel">
        <div className="status-item">RGS Connected</div>
        <div className="status-item">Math Verified</div>
        <div className="status-item">RTP Validated</div>
      </div>
    </div>
  )
}

function GameArt({ tone, image, title }: { tone: string; image: string; title: string }) {
  return (
    <div className={`game-art ${tone}`}>
      <img src={image} alt={`${title} slot game reference`} />
      <span className="horizon" />
      <span className="monolith" />
      <span className="orbit" />
    </div>
  )
}

function App() {
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const formStartedAt = useRef(Date.now())

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setSubmitState('sending')

    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          submissionId: crypto.randomUUID(),
          startedAt: formStartedAt.current,
          consent: formData.get('consent') === 'on',
        }),
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Form submission failed')
      }

      form.reset()
      formStartedAt.current = Date.now()
      setSubmitState('sent')
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <main>
      <section className="hero-section" id="top">
        <header className="site-header">
          <a className="brand" href="#top" aria-label="RTPWorks home">
            <span>RTP</span>Works
          </a>
          <nav aria-label="Primary navigation">
            <a href="#services">Services</a>
            <a href="#work">Work</a>
            <a href="#process">Process</a>
            <a href="#contact">Contact</a>
          </nav>
          <a className="header-cta" href="#contact">
            Map a launch path <Arrow />
          </a>
        </header>

        <div className="hero-layout">
          <div className="hero-copy">
            <h1>Launch slot products <span>faster.</span></h1>
            <p>
              RTPWorks turns slot concepts, code, modules, and integrations into launch-ready products with lower delivery risk.
            </p>
            <a className="primary-cta" href="#contact">
              <span className="terminal-mark">›_</span>
              Map a launch path
              <Arrow />
            </a>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="section-heading">
          <h2>Engineering that ships<span>.</span></h2>
          <p>Start with the product you need to launch, then shape the fastest path through games, modules, integration, QA, and maintenance.</p>
        </div>

        <div className="service-list">
          {services.map((service) => (
            <article className="service-row" key={service.title}>
              <div className="service-icon">
                <Icon name={service.icon} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
              <Arrow />
            </article>
          ))}
        </div>

        <div className="portfolio-block" id="work">
          <div className="portfolio-head">
            <h2>Demo build areas</h2>
            <a href="#contact">Discuss your build <Arrow /></a>
          </div>
          <div className="portfolio-grid">
            {portfolioItems.map((item) => (
              <article className="portfolio-card" key={item.title}>
                <GameArt image={item.image} title={item.title} tone={item.tone} />
                <div className="portfolio-meta">
                  <h3>{item.title}</h3>
                  <div>
                    <span>{item.focus}</span>
                    <span>Demo ready</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="process-head">
          <h2>From launch goal to live product<span>.</span></h2>
          <p>A clear delivery path. Flexible engagement. Built for real-world launches.</p>
        </div>

        <div className="steps">
          {steps.map((step, index) => (
            <article className="step" key={step.title}>
              <div className="step-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="step-node">
                <Icon name={index === 0 ? 'sliders' : index === 1 ? 'module' : index === 2 ? 'shield' : 'check'} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>

        <div className="engagement-layout">
          <div>
            <h2>Engagement models<span>.</span></h2>
            <p>Right-sized options for every need.</p>
            <div className="models">
              {engagementModels.map((model, index) => (
                <article key={model.title}>
                  <Icon name={index === 0 ? 'check' : index === 1 ? 'chart' : index === 2 ? 'sliders' : 'module'} />
                  <h3>{model.title}</h3>
                  <p>{model.copy}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="focus-map" aria-label="Technical focus areas">
            <h2>Technical focus areas<span>.</span></h2>
            <p>Our core capabilities working together.</p>
            <div className="map-canvas">
              <span className="map-line one" />
              <span className="map-line two" />
              <span className="map-node math">Math</span>
              <span className="map-node code">Game Code</span>
              <span className="map-node rgs">RGS/API</span>
              <span className="map-node platform">Platform</span>
              <span className="map-node qa">QA</span>
              <span className="map-node maintain">Maintenance</span>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <h2>
            Tell us what you want to launch. <span>We will map the fastest path.</span>
          </h2>
          <p>
            Send a game concept, platform module, integration issue, or launch target. We will respond
            with a practical delivery path.
          </p>
          <div className="risk-note">
            <Icon name="shield" />
            <span>We clarify market, integration, and operational responsibilities before delivery starts.</span>
          </div>

          <div className="contact-actions" aria-label="Direct contact channels">
            {contactChannels.map((channel) => (
              <a
                className="contact-channel"
                href={channel.href}
                key={channel.title}
                rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
                target={channel.href.startsWith('http') ? '_blank' : undefined}
              >
                <span className="channel-icon">
                  <ChannelIcon name={channel.icon} />
                </span>
                <span>
                  <strong>{channel.title}</strong>
                  <small>{channel.detail}</small>
                  <em>{channel.value}</em>
                </span>
              </a>
            ))}
          </div>
        </div>

        <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
          <label className="form-honeypot" aria-hidden="true">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <label>
            Name
            <input name="name" placeholder="Your full name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="you@company.com" required />
          </label>
          <label>
            Company
            <input name="company" placeholder="Company or studio" required />
          </label>
          <label>
            Your role
            <input name="role" placeholder="Founder, CTO, product, integration..." required />
          </label>
          <label>
            Target market
            <input name="market" placeholder="Regulated market or launch region" required />
          </label>
          <label>
            What are you launching?
            <textarea name="need" placeholder="Describe the game, module, integration, or launch goal..." required />
          </label>
          <label>
            What support do you need?
            <select name="support" defaultValue="" required>
              <option value="" disabled>Select support type</option>
              <option>Game customization</option>
              <option>Platform module</option>
              <option>RGS/API integration</option>
              <option>Launch QA</option>
              <option>Maintenance and extension</option>
            </select>
          </label>
          <label>
            Timeline
            <select name="timeline" defaultValue="" required>
              <option value="" disabled>Select timeline</option>
              <option>This week</option>
              <option>2-4 weeks</option>
              <option>This quarter</option>
              <option>Exploring options</option>
            </select>
          </label>
          <label>
            Product stage
            <select name="stage" defaultValue="" required>
              <option value="" disabled>Select product stage</option>
              <option>Concept or game idea</option>
              <option>Existing code or prototype</option>
              <option>Ready for integration</option>
              <option>Live product needing maintenance</option>
            </select>
          </label>
          <label className="consent-field">
            <input name="consent" type="checkbox" required />
            <span>I agree that RTPWorks may use these details to assess and respond to this project request.</span>
          </label>
          <button type="submit">
            {submitState === 'sending' ? 'Sending request' : 'Request a launch path'} <Arrow />
          </button>
          {submitState === 'sent' && <p className="form-state">Thanks. We will review your launch context and respond with next steps.</p>}
          {submitState === 'error' && <p className="form-state form-state-error">We could not send this request. Please contact us by Telegram, WhatsApp, or email.</p>}
        </form>
      </section>

      <footer className="site-footer">
        <a className="brand" href="#top">
          <span>RTP</span>Works
        </a>
        <nav aria-label="Footer navigation">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
      </footer>
    </main>
  )
}

export default App

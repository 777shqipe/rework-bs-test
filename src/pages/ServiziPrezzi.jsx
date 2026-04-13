import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Check, HelpCircle, ArrowRight, Sparkles, Building2, Rocket, Menu, X } from 'lucide-react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass border-b border-subtle shadow-soft' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center shadow-soft">
                <span className="text-lg font-bold text-stone-50">B</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-stone-900 tracking-tight leading-none">Back Software</h1>
                <p className="text-xs text-stone-500 mt-0.5">Soluzioni Digitali</p>
              </div>
            </a>

            <nav className="hidden lg:flex items-center gap-10">
              <a href="/" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Home</a>
              <a href="/servizi" className="text-sm font-medium text-stone-900">Prezzi</a>
              <a href="/portfolio" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Portfolio</a>
              <a href="/contatti" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Contatti</a>
            </nav>

            <a href="/contatti" className="hidden lg:inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-stone-50 text-sm font-semibold rounded-full hover:bg-stone-800 transition-colors shadow-soft">
              Inizia Ora
              <ChevronRight className="w-4 h-4" />
            </a>

            <motion.button
              className="lg:hidden p-2.5 rounded-xl hover:bg-stone-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-stone-700" /> : <Menu className="w-6 h-6 text-stone-700" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  )
}

const Hero = () => (
  <section className="pt-32 pb-20 bg-stone-50">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-kicker mb-6">Prezzi</p>

        <h1 className="heading-xl text-stone-900 max-w-3xl mx-auto mb-6">
          Piani chiari, nessuna sorpresa.
        </h1>

        <p className="text-body-lg text-stone-600 max-w-2xl mx-auto">
          Scegli il pacchetto adatto o contattaci per una soluzione su misura.
        </p>
      </motion.div>
    </div>
  </section>
)

const PricingCards = () => {
  const plans = [
    {
      name: 'Starter',
      icon: Sparkles,
      price: '1.500',
      period: 'a progetto',
      description: 'Perfetto per piccole aziende e startup che vogliono iniziare con il piede giusto.',
      features: [
        'Sito web responsive (5 pagine)',
        'Design personalizzato',
        'SEO base ottimizzata',
        'Form di contatto avanzato',
        'Integrazione social media',
        'Supporto 30 giorni',
        'Hosting 1 anno incluso'
      ],
      highlighted: false,
      cta: 'Inizia con Starter',
      delay: 0
    },
    {
      name: 'Business',
      icon: Building2,
      price: '3.500',
      period: 'a progetto',
      description: 'Ideale per aziende in crescita che necessitano di una presenza digitale completa.',
      features: [
        'Sito web completo (10+ pagine)',
        'CMS personalizzato (Wordpress/Headless)',
        'SEO avanzato + blog',
        'Integrazione analytics avanzata',
        'Multi-lingua (fino a 3 lingue)',
        'Supporto prioritario 90 giorni',
        'Hosting 2 anni incluso',
        'Report mensili performance'
      ],
      highlighted: true,
      badge: 'Più Popolare',
      cta: 'Scegli Business',
      delay: 0.1
    },
    {
      name: 'Enterprise',
      icon: Rocket,
      price: 'Su misura',
      period: 'contattaci',
      description: 'Soluzioni complesse per grandi aziende con esigenze specifiche e complesse.',
      features: [
        'Sistema completamente personalizzato',
        'CRM e integrazioni dedicate',
        'API su misura e microservizi',
        'Architettura cloud scalabile',
        'Team dedicato al progetto',
        'Formazione team cliente',
        'SLA e supporto 24/7',
        'Manutenzione e aggiornamenti continui'
      ],
      highlighted: false,
      cta: 'Parla con noi',
      delay: 0.2
    }
  ]

  return (
    <section className="py-20 bg-stone-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              className={`relative ${plan.highlighted ? 'lg:-mt-2 lg:mb-2' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: plan.delay }}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1.5 bg-stone-900 text-stone-50 text-xs font-semibold rounded-full shadow-soft">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className={`h-full p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? 'bg-stone-900 text-stone-50 border-stone-800 shadow-soft-xl'
                  : 'bg-stone-50 text-stone-900 border-subtle shadow-soft hover:shadow-soft-lg'
              }`}>
                {/* Header */}
                <div className="mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    plan.highlighted ? 'bg-stone-800' : 'bg-stone-200'
                  }`}>
                    <plan.icon className={`w-6 h-6 ${plan.highlighted ? 'text-stone-50' : 'text-stone-700'}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className={`text-sm ${plan.highlighted ? 'text-stone-400' : 'text-stone-600'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-subtle">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-sm ${plan.highlighted ? 'text-stone-400' : 'text-stone-500'}`}>€</span>
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                  </div>
                  <span className={`text-sm ${plan.highlighted ? 'text-stone-500' : 'text-stone-500'}`}>
                    {plan.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? 'text-stone-400' : 'text-stone-600'
                      }`} />
                      <span className={`text-sm ${plan.highlighted ? 'text-stone-300' : 'text-stone-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.a
                  href="/contatti"
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 font-semibold rounded-xl transition-all ${
                    plan.highlighted
                      ? 'bg-stone-50 text-stone-900 hover:bg-stone-100 shadow-soft'
                      : 'bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-soft'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: 'Quanto tempo ci vuole per realizzare un sito web?',
      answer: 'I tempi dipendono dalla complessità del progetto. Un sito Starter viene consegnato in 2-3 settimane, mentre progetti Business richiedono 4-6 settimane. Per progetti Enterprise creiamo un piano dettagliato personalizzato.'
    },
    {
      question: 'I prezzi includono il dominio e l\'hosting?',
      answer: 'Sì! Tutti i nostri pacchetti includono il dominio e l\'hosting per il primo anno (Starter) o due anni (Business). Per Enterprise valutiamo insieme la soluzione infrastrutturale più adatta.'
    },
    {
      question: 'Posso vedere il sito mentre lo sviluppate?',
      answer: 'Assolutamente sì. Utilizziamo ambienti di staging dove puoi vedere e testare il sito in tempo reale durante tutto il processo di sviluppo. Riceverai aggiornamenti regolari sullo stato del progetto.'
    },
    {
      question: 'Cosa succede dopo la consegna del sito?',
      answer: 'Offriamo un periodo di supporto post-lancio incluso nel prezzo (30-90 giorni a seconda del pacchetto). Successivamente puoi sottoscrivere un piano di manutenzione o richiedere assistenza on-demand.'
    },
    {
      question: 'Il sito sarà ottimizzato per i motori di ricerca?',
      answer: 'Tutti i nostri siti sono sviluppati seguendo le best practice SEO tecniche. I pacchetti Business ed Enterprise includono anche una strategia SEO content e monitoraggio continuo delle performance.'
    }
  ]

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-kicker mb-4">FAQ</p>
          <h2 className="heading-xl text-stone-900 mb-4">
            Domande frequenti.
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-stone-50 rounded-2xl border border-subtle shadow-soft overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-stone-900 pr-4">{faq.question}</span>
                <HelpCircle className={`w-5 h-5 text-stone-500 flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`} />
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6"
                >
                  <p className="text-stone-600 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const CTA = () => (
  <section className="py-24 bg-stone-900">
    <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="heading-lg text-stone-50 mb-4">
          Non sei sicuro?
        </h2>
        <p className="text-body-lg text-stone-400 mb-8 max-w-2xl mx-auto">
          Prenota una consulenza gratuita. Analizzeremo insieme le tue esigenze.
        </p>
        <motion.a
          href="/contatti"
          className="inline-flex items-center gap-2 px-8 py-4 bg-stone-50 text-stone-900 font-semibold rounded-full hover:bg-stone-100 transition-colors shadow-soft"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Consulenza gratuita
          <ArrowRight className="w-5 h-5" />
        </motion.a>
      </motion.div>
    </div>
  </section>
)

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-stone-950 border-t border-stone-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-stone-500 text-sm">{currentYear} Back Software. Tutti i diritti riservati.</p>
          <a href="/" className="text-stone-500 hover:text-stone-50 transition-colors text-sm">
            Torna alla Home
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function ServiziPrezzi() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <Hero />
      <PricingCards />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}

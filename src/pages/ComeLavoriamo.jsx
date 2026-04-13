import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Search, Lightbulb, Code2, TestTube, Rocket, MessageSquare, ArrowRight, CheckCircle2, Clock, Users, Target, Zap, Menu, X } from 'lucide-react'

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
              <a href="/servizi" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Prezzi</a>
              <a href="/come-lavoriamo" className="text-sm font-medium text-stone-900">Processo</a>
              <a href="/portfolio" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Portfolio</a>
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
        <p className="text-kicker mb-6">Processo</p>

        <h1 className="heading-xl text-stone-900 max-w-3xl mx-auto mb-6">
          Metodo collaudato, risultati concreti.
        </h1>

        <p className="text-body-lg text-stone-600 max-w-2xl mx-auto">
          Dalla call al lancio, un processo trasparente che garantisce qualità e tempi certi.
        </p>
      </motion.div>
    </div>
  </section>
)

const ProcessSteps = () => {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      number: '01',
      icon: MessageSquare,
      title: 'Discovery Call',
      subtitle: 'Conoscersi è fondamentale',
      description: 'Partiamo da un\'call gratuita di 30 minuti dove ascoltiamo le tue esigenze, obiettivi e visione. Definiamo insieme il perimetro del progetto e ti presentiamo le possibili soluzioni.',
      duration: '1-2 giorni',
      deliverables: ['Analisi preliminare', 'Proposta di valore', 'Stima budget/tempi'],
      color: 'stone'
    },
    {
      number: '02',
      icon: Search,
      title: 'Analisi & Strategia',
      subtitle: 'Pianificare per eccellere',
      description: 'Studiamo il tuo mercato, analizziamo la concorrenza e definiamo una strategia digitale su misura. Creiamo un documento di progetto dettagliato con roadmap, milestone e KPI.',
      duration: '3-5 giorni',
      deliverables: ['Documento strategico', 'User personas', 'Moodboard visuale', 'Technical requirements'],
      color: 'stone'
    },
    {
      number: '03',
      icon: Lightbulb,
      title: 'Design & Prototipazione',
      subtitle: 'Dall\'idea al mockup',
      description: 'I nostri designer creano wireframe e mockup ad alta fedeltà. Lavoriamo iterativamente con te per perfezionare ogni dettaglio fino all\'approvazione finale del design system.',
      duration: '1-2 settimane',
      deliverables: ['Wireframe navigazione', 'UI Design completo', 'Prototipo interattivo', 'Guideline brand'],
      color: 'stone'
    },
    {
      number: '04',
      icon: Code2,
      title: 'Sviluppo Agile',
      subtitle: 'Codice pulito, risultati concreti',
      description: 'Gli sviluppatori danno vita al progetto seguendo metodologie agile. Ricevi aggiornamenti settimanali e puoi testare su ambiente staging fin dal primo sprint.',
      duration: '2-6 settimane',
      deliverables: ['Sviluppo frontend/backend', 'Integrazione CMS/API', ' Ottimizzazione SEO', 'Responsive testing'],
      color: 'stone'
    },
    {
      number: '05',
      icon: TestTube,
      title: 'Testing & QA',
      subtitle: 'Qualità senza compromessi',
      description: 'Testiamo ogni funzionalità su diversi device e browser. Eseguiamo audit di performance, sicurezza e accessibilità per garantirti un prodotto robusto e performante.',
      duration: '3-5 giorni',
      deliverables: ['Test funzionali', 'Performance audit', 'Security check', 'Accessibility audit'],
      color: 'stone'
    },
    {
      number: '06',
      icon: Rocket,
      title: 'Lancio & Supporto',
      subtitle: 'Il tuo progetto prende vita',
      description: 'Deploy su server di produzione, configurazione DNS e verifica finale. Ti forniamo training per gestire autonomamente il sito e restiamo al tuo fianco per il supporto post-lancio.',
      duration: '1-2 giorni',
      deliverables: ['Deploy produzione', 'Training documentazione', 'Supporto 30-90 giorni', 'Report finale'],
      color: 'stone'
    }
  ]

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Steps List */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  activeStep === index
                    ? 'bg-stone-100 border-stone-300 shadow-soft'
                    : 'bg-stone-50 border-subtle hover:border-stone-300'
                }`}
                onClick={() => setActiveStep(index)}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-stone-200 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-6 h-6 text-stone-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-stone-400">{step.number}</span>
                      <h3 className="text-lg font-bold text-stone-900">{step.title}</h3>
                    </div>
                    <p className="text-sm text-stone-500">{step.subtitle}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-stone-400 transition-transform ${
                    activeStep === index ? 'rotate-90 text-stone-700' : ''
                  }`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Active Step Detail */}
          <motion.div
            className="lg:sticky lg:top-32 h-fit"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            key={activeStep}
          >
            <div className="p-8 bg-stone-100 rounded-2xl border border-subtle shadow-soft">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-stone-900 text-stone-50">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold">{steps[activeStep].duration}</span>
              </div>

              <h3 className="text-2xl font-bold text-stone-900 mb-4">
                {steps[activeStep].title}
              </h3>

              <p className="text-stone-600 leading-relaxed mb-8">
                {steps[activeStep].description}
              </p>

              <div>
                <h4 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4">
                  Cosa ricevi
                </h4>
                <ul className="space-y-3">
                  {steps[activeStep].deliverables.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-stone-600 flex-shrink-0" />
                      <span className="text-stone-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const Methodology = () => {
  const methods = [
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Mettiamo l\'utente al centro di ogni decisione. Ricerche e feedback guidano il processo creativo.',
      stats: '98% soddisfazione'
    },
    {
      icon: Zap,
      title: 'Agile',
      description: 'Sprint brevi, consegne frequenti. Vedi i progressi in tempo reale.',
      stats: '2 settimane sprint'
    },
    {
      icon: Target,
      title: 'Orientati ai Risultati',
      description: 'Ogni feature viene misurata. Report su traffico, conversioni e ROI.',
      stats: '+150% conversioni'
    }
  ]

  return (
    <section className="py-24 bg-stone-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-kicker text-stone-400 mb-4">Metodologia</p>
          <h2 className="heading-xl text-stone-50 mb-4">
            Principi che guidano il nostro lavoro.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {methods.map((method, index) => (
            <motion.div
              key={method.title}
              className="p-8 bg-stone-800/50 rounded-2xl border border-stone-700 hover:border-stone-600 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-14 h-14 rounded-xl bg-stone-700 flex items-center justify-center mb-6">
                <method.icon className="w-7 h-7 text-stone-50" />
              </div>
              <h3 className="text-xl font-bold text-stone-50 mb-3">{method.title}</h3>
              <p className="text-stone-400 leading-relaxed mb-6">{method.description}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-700/50 rounded-full">
                <span className="text-stone-300 text-sm font-semibold">{method.stats}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const CTA = () => (
  <section className="py-24 bg-stone-800">
    <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="heading-lg text-stone-50 mb-4">
          Pronto a iniziare?
        </h2>
        <p className="text-body-lg text-stone-400 mb-8 max-w-2xl mx-auto">
          Prenota una discovery call gratuita.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="/contatti"
            className="inline-flex items-center gap-2 px-8 py-4 bg-stone-50 text-stone-900 font-semibold rounded-full hover:bg-stone-100 transition-colors shadow-soft"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Discovery call
            <ArrowRight className="w-5 h-5" />
          </motion.a>
          <motion.a
            href="/servizi"
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-stone-50 font-semibold rounded-full border border-stone-600 hover:bg-stone-700/50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Vedi prezzi
          </motion.a>
        </div>
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

export default function ComeLavoriamo() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <Hero />
      <ProcessSteps />
      <Methodology />
      <CTA />
      <Footer />
    </div>
  )
}

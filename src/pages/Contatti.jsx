import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Mail, Phone, MapPin, Send, Clock, MessageSquare, CheckCircle2, ArrowRight, Sparkles, Globe, Code, Menu, X } from 'lucide-react'

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
              <a href="/portfolio" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Portfolio</a>
              <a href="/contatti" className="text-sm font-medium text-stone-900">Contatti</a>
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
        <p className="text-kicker mb-6">Contatti</p>

        <h1 className="heading-xl text-stone-900 max-w-3xl mx-auto mb-6">
          Parliamo del tuo progetto.
        </h1>

        <p className="text-body-lg text-stone-600 max-w-2xl mx-auto">
          Siamo a un messaggio di distanza. Ti risponderemo entro 24 ore.
        </p>
      </motion.div>
    </div>
  </section>
)

const ContactSection = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    azienda: '',
    servizio: '',
    budget: '',
    messaggio: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'info@backsoftware.it',
      href: 'mailto:info@backsoftware.it'
    },
    {
      icon: Phone,
      title: 'Telefono',
      value: '+39 351 305 2627',
      href: 'tel:+393513052627'
    },
    {
      icon: MapPin,
      title: 'Dove siamo',
      value: 'Italia (Remote)',
      href: '#'
    },
    {
      icon: Clock,
      title: 'Orari',
      value: 'Lun-Ven: 9-18',
      href: '#'
    }
  ]

  const services = [
    'Sito Web',
    'E-commerce',
    'App Mobile',
    'Brand Identity',
    'SEO & Marketing',
    'Manutenzione',
    'Altro'
  ]

  const budgets = [
    '1.000 - 3.000 €',
    '3.000 - 5.000 €',
    '5.000 - 10.000 €',
    '10.000 - 25.000 €',
    '25.000+ €',
    'Da definire'
  ]

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: Contact Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-kicker mb-4">Contatti</p>
              <h2 className="heading-lg text-stone-900 mb-6">
                Come raggiungerci.
              </h2>
              <p className="text-body text-stone-600 mb-8">
                Scegli il modo più comodo. Siamo sempre disponibili.
              </p>

              {/* Contact Cards */}
              <div className="space-y-4 mb-8">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-4 p-4 bg-stone-100 rounded-2xl border border-subtle hover:border-stone-300 transition-colors group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-stone-200 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-stone-700" />
                    </div>
                    <div>
                      <div className="text-sm text-stone-500">{item.title}</div>
                      <div className="text-stone-900 font-semibold">{item.value}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-stone-400 ml-auto group-hover:text-stone-700 transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="p-8 bg-stone-100 rounded-2xl border border-subtle shadow-soft">
              {isSubmitted ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-stone-200 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-stone-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-3">
                    Messaggio inviato!
                  </h3>
                  <p className="text-stone-600 mb-6">
                    Grazie. Ti risponderemo entro 24 ore.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({ nome: '', email: '', azienda: '', servizio: '', budget: '', messaggio: '' })
                    }}
                    className="text-stone-600 font-semibold hover:text-stone-900 transition-colors"
                  >
                    Invia un altro messaggio
                  </button>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">
                    Richiedi preventivo
                  </h3>
                  <p className="text-stone-600 mb-8">
                    Compila il form e ti invieremo una proposta entro 24 ore.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Nome *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          className="w-full px-4 py-3 bg-stone-50 border border-subtle rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors"
                          placeholder="Mario Rossi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 bg-stone-50 border border-subtle rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors"
                          placeholder="mario@email.it"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Azienda
                        </label>
                        <input
                          type="text"
                          value={formData.azienda}
                          onChange={(e) => setFormData({...formData, azienda: e.target.value})}
                          className="w-full px-4 py-3 bg-stone-50 border border-subtle rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors"
                          placeholder="Nome azienda"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Servizio *
                        </label>
                        <select
                          required
                          value={formData.servizio}
                          onChange={(e) => setFormData({...formData, servizio: e.target.value})}
                          className="w-full px-4 py-3 bg-stone-50 border border-subtle rounded-xl text-stone-900 focus:outline-none focus:border-stone-500 transition-colors"
                        >
                          <option value="">Seleziona</option>
                          {services.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Budget
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {budgets.map((budget) => (
                          <button
                            key={budget}
                            type="button"
                            onClick={() => setFormData({...formData, budget})}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              formData.budget === budget
                                ? 'bg-stone-900 text-stone-50'
                                : 'bg-stone-50 border border-subtle text-stone-600 hover:border-stone-300'
                            }`}
                          >
                            {budget}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Progetto *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.messaggio}
                        onChange={(e) => setFormData({...formData, messaggio: e.target.value})}
                        className="w-full px-4 py-3 bg-stone-50 border border-subtle rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors resize-none"
                        placeholder="Descrivi la tua idea..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-stone-900 text-stone-50 font-semibold rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-70"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-stone-400 border-t-stone-50 rounded-full animate-spin" />
                          Invio...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Invia richiesta
                        </>
                      )}
                    </motion.button>

                    <p className="text-xs text-stone-500 text-center">
                      Cliccando "Invia" accetti la Privacy Policy.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const FAQSimple = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      q: 'Quanto tempo per un preventivo?',
      a: 'Entro 24 ore. Per progetti complessi potremmo chiederti una call di 15 minuti.'
    },
    {
      q: 'Offrite assistenza post-lancio?',
      a: 'Sì, tutti i pacchetti includono supporto post-lancio. Offriamo anche piani di manutenzione mensili.'
    },
    {
      q: 'Posso vedere esempi di lavori?',
      a: 'Certo! Visita la pagina Portfolio per vedere i progetti realizzati.'
    },
    {
      q: 'Lavorate solo in Italia?',
      a: 'Principalmente Italia, ma abbiamo esperienza anche con progetti internazionali.'
    }
  ]

  return (
    <section className="py-24 bg-stone-100">
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
                <span className="font-semibold text-stone-900 pr-4">{faq.q}</span>
                <ChevronRight className={`w-5 h-5 text-stone-400 flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-90' : ''
                }`} />
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="px-6 pb-6"
                >
                  <p className="text-stone-600 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

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

export default function Contatti() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <Hero />
      <ContactSection />
      <FAQSimple />
      <Footer />
    </div>
  )
}

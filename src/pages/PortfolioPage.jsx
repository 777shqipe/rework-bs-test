import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, X, ExternalLink, ChevronLeft, Menu } from 'lucide-react'

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
              <a href="/come-lavoriamo" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Processo</a>
              <a href="/portfolio" className="text-sm font-medium text-stone-900">Portfolio</a>
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
        <p className="text-kicker mb-6">Portfolio</p>

        <h1 className="heading-xl text-stone-900 max-w-3xl mx-auto mb-6">
          Lavori che parlano di noi.
        </h1>

        <p className="text-body-lg text-stone-600 max-w-2xl mx-auto">
          Ogni progetto è una storia di successo. Scopri come abbiamo aiutato clienti a crescere.
        </p>
      </motion.div>
    </div>
  </section>
)

const ProjectsGrid = () => {
  const [filter, setFilter] = useState('Tutti')
  const [selectedProject, setSelectedProject] = useState(null)

  const categories = ['Tutti', 'E-commerce', 'Siti Web', 'App Mobile', 'Brand Identity']

  const projects = [
    {
      id: 1,
      title: 'Luxe Boutique',
      category: 'E-commerce',
      client: 'Fashion Brand Milano',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      description: 'Piattaforma e-commerce premium per un brand di moda italiano. Implementazione di un sistema di personalizzazione prodotti, wishlist avanzata e checkout ottimizzato per mobile.',
      challenge: 'Aumentare le conversioni online mantenendo l\'esperienza di lusso del brand.',
      solution: 'Design minimalista con UX studiata per guidare l\'utente all\'acquisto. Integrazione con magazzino in tempo reale.',
      results: [
        { label: 'Conversioni', value: '+180%' },
        { label: 'Traffico', value: '+250%' },
        { label: 'Carrello', value: '-40% abbandono' }
      ],
      tags: ['React', 'Shopify Plus', 'Tailwind', 'Stripe'],
      testimonial: {
        text: 'Back Software ha trasformato la nostra presenza online. Le vendite sono aumentate del 180% in soli 3 mesi.',
        author: 'Maria Rossi',
        role: 'CEO, Luxe Boutique'
      },
      link: '#'
    },
    {
      id: 2,
      title: 'TechStart Dashboard',
      category: 'Siti Web',
      client: 'Fintech Startup',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      description: 'Dashboard analytics real-time per una startup fintech. Visualizzazione dati complessi in modo intuitivo con grafici interattivi e report automatizzati.',
      challenge: 'Visualizzare dati finanziari complessi in modo comprensibile per utenti non tecnici.',
      solution: 'Interfaccia pulita con widget personalizzabili e drill-down dei dati.',
      results: [
        { label: 'Engagement', value: '+95%' },
        { label: 'Utenti', value: '10K+' },
        { label: 'Rete cliente', value: '+60%' }
      ],
      tags: ['Next.js', 'D3.js', 'PostgreSQL', 'AWS'],
      testimonial: {
        text: 'La dashboard ha rivoluzionato come i nostri clienti interagiscono con i dati.',
        author: 'Luca Bianchi',
        role: 'CTO, TechStart'
      },
      link: '#'
    },
    {
      id: 3,
      title: 'Bella Vita Resort',
      category: 'Siti Web',
      client: 'Resort Toscana',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      description: 'Sito web immersivo per un resort di lusso in Toscana. Esperienza 360° con tour virtuale, booking engine integrato e gallery fotografica curata.',
      challenge: 'Trasmettere l\'atmosfera di lusso del resort attraverso lo schermo.',
      solution: 'Design elegante con animazioni fluide e fotografie immersive a tutto schermo.',
      results: [
        { label: 'Prenotazioni', value: '+145%' },
        { label: 'Tempo sito', value: '+3min' },
        { label: 'Tasso rimbalzo', value: '-35%' }
      ],
      tags: ['GSAP', 'Three.js', 'CMS Custom', 'Booking Engine'],
      testimonial: {
        text: 'Il sito cattura perfettamente l\'essenza del nostro resort. I clienti amano prenotare online.',
        author: 'Giulia Verdi',
        role: 'Marketing Director'
      },
      link: '#'
    },
    {
      id: 4,
      title: 'FitPro App',
      category: 'App Mobile',
      client: 'Fitness Startup',
      image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=600&fit=crop',
      description: 'App mobile fitness con tracking allenamenti, piani personalizzati e community integrata. Disponibile su iOS e Android.',
      challenge: 'Creare un\'esperienza coinvolgente che mantenga gli utenti motivati nel tempo.',
      solution: 'Gamification con badge e challenge, integrazione con wearable devices.',
      results: [
        { label: 'Download', value: '50K+' },
        { label: 'Rating', value: '4.8★' },
        { label: 'Retention', value: '70%' }
      ],
      tags: ['React Native', 'Firebase', 'Node.js', 'HealthKit'],
      testimonial: {
        text: 'L\'app ha superato ogni aspettativa. I nostri utenti adorano la community.',
        author: 'Marco Neri',
        role: 'Founder, FitPro'
      },
      link: '#'
    },
    {
      id: 5,
      title: 'Artisan Coffee',
      category: 'Brand Identity',
      client: 'Torrefazione Artigianale',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
      description: 'Restyling completo brand identity per torrefazione artigianale. Logo, packaging, sito web e strategia social media coordinata.',
      challenge: 'Differenziarsi in un mercato saturo di torrefazioni artigianali.',
      solution: 'Brand storytelling autentico con packaging premium e presenza digitale forte.',
      results: [
        { label: 'Brand awareness', value: '+200%' },
        { label: 'Vendite', value: '+85%' },
        { label: 'Follower', value: '+300%' }
      ],
      tags: ['Brand Strategy', 'Packaging', 'Web Design', 'Social Media'],
      testimonial: {
        text: 'Il nuovo brand ci ha permesso di posizionarci nel segmento premium con successo.',
        author: 'Anna Gialli',
        role: 'Proprietaria'
      },
      link: '#'
    },
    {
      id: 6,
      title: 'MediCare Portal',
      category: 'Siti Web',
      client: 'Centro Medico',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
      description: 'Portale sanitario per prenotazioni online, gestione cartelle cliniche e telemedicina. Conforme a standard HIPAA e GDPR.',
      challenge: 'Semplificare l\'accesso ai servizi sanitari mantenendo sicurezza e privacy.',
      solution: 'Interfaccia accessibile, workflow ottimizzati e crittografia end-to-end.',
      results: [
        { label: 'Pazienti', value: '+15K' },
        { label: 'Efficienza', value: '+60%' },
        { label: 'Soddisfazione', value: '4.9★' }
      ],
      tags: ['Vue.js', 'Laravel', 'HIPAA', 'Telemedicina'],
      testimonial: {
        text: 'Il portale ha rivoluzionato la nostra efficienza operativa. I pazienti lo adorano.',
        author: 'Dr. Paolo Blu',
        role: 'Direttore Sanitario'
      },
      link: '#'
    }
  ]

  const filteredProjects = filter === 'Tutti' 
    ? projects 
    : projects.filter(p => p.category === filter)

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                filter === category
                  ? 'bg-stone-900 text-stone-50 shadow-soft'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-subtle'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative bg-stone-50 rounded-2xl border border-subtle shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover Info */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-stone-200 text-sm mb-1">{project.client}</span>
                      <h3 className="text-xl font-bold text-stone-50">{project.title}</h3>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-stone-50/95 backdrop-blur-sm text-stone-900 text-xs font-semibold rounded-full border border-subtle">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-stone-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-stone-600 text-sm line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-full border border-subtle">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-stone-50 rounded-2xl shadow-2xl"
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-stone-100 hover:bg-stone-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-stone-600" />
                </button>

                {/* Modal Content */}
                <div>
                  {/* Hero Image */}
                  <div className="relative h-64 sm:h-80">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="inline-block px-3 py-1 bg-stone-900 text-stone-50 text-sm font-semibold rounded-full mb-3">
                        {selectedProject.category}
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-bold text-stone-50">
                        {selectedProject.title}
                      </h2>
                      <p className="text-stone-200 mt-1">{selectedProject.client}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8">
                    {/* Description */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-stone-900 mb-3">Il Progetto</h3>
                      <p className="text-stone-600 leading-relaxed">{selectedProject.description}</p>
                    </div>

                    {/* Challenge & Solution */}
                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                      <div className="p-4 bg-stone-100 rounded-xl border border-subtle">
                        <h4 className="font-semibold text-stone-900 mb-2">Sfida</h4>
                        <p className="text-stone-600 text-sm">{selectedProject.challenge}</p>
                      </div>
                      <div className="p-4 bg-stone-100 rounded-xl border border-subtle">
                        <h4 className="font-semibold text-stone-900 mb-2">Soluzione</h4>
                        <p className="text-stone-600 text-sm">{selectedProject.solution}</p>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-stone-900 mb-4">Risultati</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedProject.results.map((result, index) => (
                          <div key={index} className="text-center p-4 bg-stone-100 rounded-xl">
                            <div className="text-2xl font-extrabold text-stone-900 mb-1">{result.value}</div>
                            <div className="text-xs text-stone-600">{result.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-stone-900 mb-3">Tecnologie</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1.5 bg-stone-200 text-stone-700 text-sm font-medium rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="p-6 bg-stone-100 rounded-2xl border border-subtle mb-8">
                      <blockquote className="text-stone-700 italic mb-4">
                        "{selectedProject.testimonial.text}"
                      </blockquote>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-stone-50 font-bold">
                          {selectedProject.testimonial.author[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-900">{selectedProject.testimonial.author}</div>
                          <div className="text-sm text-stone-500">{selectedProject.testimonial.role}</div>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <a
                      href={selectedProject.link}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-stone-50 font-semibold rounded-xl hover:bg-stone-800 transition-colors"
                    >
                      Visita il sito
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
          Il tuo progetto è il prossimo?
        </h2>
        <p className="text-body-lg text-stone-400 mb-8 max-w-2xl mx-auto">
          Parliamo delle tue idee.
        </p>
        <motion.a
          href="/contatti"
          className="inline-flex items-center gap-2 px-8 py-4 bg-stone-50 text-stone-900 font-semibold rounded-full hover:bg-stone-100 transition-colors shadow-soft"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Inizia il tuo progetto
          <ChevronRight className="w-5 h-5" />
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

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <Hero />
      <ProjectsGrid />
      <CTA />
      <Footer />
    </div>
  )
}

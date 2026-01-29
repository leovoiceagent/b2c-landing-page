import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Lightbulb,
  CheckCircle,
  Shield,
  HeartHandshake,
  Clock,
  Banknote,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';
import VoiceDemo from './components/VoiceDemo';
import LeoLogo from './assets/Leo_logo_round.png';

/**
 * LEO B2C Landing Page - German HVAC Error Code Help
 *
 * Single-page app for leovoiceagent.de
 * Target: Consumers with heating problems searching error codes
 */

function App() {
  const [showVoiceDemo, setShowVoiceDemo] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'impressum' | 'datenschutz'>('home');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Handle hash navigation for legal pages
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#impressum') {
        setCurrentPage('impressum');
      } else if (hash === '#datenschutz') {
        setCurrentPage('datenschutz');
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll to top when changing pages
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Legal Pages
  if (currentPage === 'impressum') {
    return <ImpressumPage onBack={() => { window.location.hash = ''; }} />;
  }

  if (currentPage === 'datenschutz') {
    return <DatenschutzPage onBack={() => { window.location.hash = ''; }} />;
  }

  // Main Landing Page
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white pt-8 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-leo-dark">
              LEO <span className="text-leo-blue">Heizungs-Soforthilfe</span>
            </h2>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Headline + Trust */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-leo-dark leading-tight mb-6">
                Heizung zeigt Fehler?
                <br />
                <span className="text-leo-blue">Wir helfen sofort.</span>
              </h1>

              <p className="text-xl text-leo-gray mb-6">
                Kostenlose Erstberatung — wir erklären, was los ist und ob Sie wirklich einen Techniker brauchen.
              </p>

              {/* Trust Line */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-leo-gray mb-6">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Keine Verkaufsgespräche
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Keine versteckten Kosten
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Sofort Hilfe
                </span>
              </div>

              {/* Mobile CTA Button (visible on small screens) */}
              <button
                onClick={() => setShowVoiceDemo(true)}
                className="lg:hidden w-full bg-leo-yellow hover:bg-leo-yellow/90 text-leo-dark px-6 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] shadow-md"
              >
                <Phone className="w-5 h-5" />
                Jetzt kostenlos anrufen
              </button>
            </div>

            {/* Right: LEO Icon CTA */}
            <div className="hidden lg:flex flex-col items-center">
              <button
                onClick={() => setShowVoiceDemo(true)}
                className="group cursor-pointer transition-transform duration-300 hover:scale-105 focus:outline-none"
              >
                <img
                  src={LeoLogo}
                  alt="LEO Sprachassistent"
                  className="w-48 h-48 lg:w-64 lg:h-64 drop-shadow-lg"
                />
              </button>
              <p className="mt-4 text-xl text-leo-gray font-medium">
                Jetzt mit LEO sprechen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-leo-dark text-center mb-4">
            So funktioniert's
          </h2>
          <p className="text-leo-gray text-center mb-12 max-w-2xl mx-auto">
            In drei einfachen Schritten zu Ihrer Lösung
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: 'Anrufen oder Formular',
                description: 'Beschreiben Sie Ihr Problem oder nennen Sie den Fehlercode',
              },
              {
                icon: Lightbulb,
                title: 'Verstehen',
                description: 'Wir erklären, was der Fehler bedeutet und was Sie selbst prüfen können',
              },
              {
                icon: CheckCircle,
                title: 'Entscheiden',
                description: 'Sie entscheiden, ob Sie einen Techniker brauchen — kein Druck',
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-leo-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-leo-blue" />
                </div>
                <div className="text-sm font-semibold text-leo-blue mb-2">
                  Schritt {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-leo-dark mb-2">
                  {step.title}
                </h3>
                <p className="text-leo-gray">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Error Codes Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-leo-dark text-center mb-4">
            Diese Fehlercodes kennen wir
          </h2>
          <p className="text-leo-gray text-center mb-12 max-w-2xl mx-auto">
            Wir helfen bei den häufigsten Heizungsfehlern
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { brand: 'Vaillant', codes: ['F22', 'F28', 'F29', 'F75'] },
              { brand: 'Buderus', codes: ['6A 227', '6A 504'] },
              { brand: 'Wolf', codes: ['005', '007'] },
              { brand: 'Junkers/Bosch', codes: ['EA', 'E9'] },
              { brand: 'Viessmann', codes: ['F5', 'F02'] },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-leo-dark mb-3">{item.brand}</h3>
                <div className="flex flex-wrap gap-2">
                  {item.codes.map((code) => (
                    <span
                      key={code}
                      className="bg-gray-100 text-leo-dark px-3 py-1 rounded-full text-sm font-mono"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-leo-gray mb-4">
              Ihr Code nicht dabei? Sprechen Sie trotzdem mit LEO — wir helfen bei den meisten Herstellern.
            </p>
            <button
              onClick={() => setShowVoiceDemo(true)}
              className="inline-flex items-center gap-2 bg-leo-yellow hover:bg-leo-yellow/90 text-leo-dark px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
            >
              Jetzt mit LEO sprechen
            </button>
          </div>
        </div>
      </section>

      {/* Why LEO Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-leo-dark text-center mb-4">
            Warum LEO?
          </h2>
          <p className="text-leo-gray text-center mb-12 max-w-2xl mx-auto">
            Ehrliche Hilfe statt Verkaufsgespräche
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            {[
              {
                icon: Shield,
                title: 'Keine Abzocke',
                description: 'Wir verkaufen nichts. Wir helfen Ihnen zu verstehen, was los ist.',
              },
              {
                icon: HeartHandshake,
                title: 'Ehrliche Einschätzung',
                description: 'Wenn Sie es selbst beheben können, sagen wir Ihnen wie.',
              },
              {
                icon: Clock,
                title: 'Sofort erreichbar',
                description: 'Kein Kontaktformular-Pingpong. Sprechen Sie direkt mit LEO.',
              },
              {
                icon: Banknote,
                title: 'Kostenlos',
                description: 'Die Beratung kostet Sie nichts.',
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-12 h-12 bg-leo-yellow/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-leo-dark" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-leo-dark mb-1">
                    {item.title}
                  </h3>
                  <p className="text-leo-gray">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-leo-dark text-center mb-4">
            Häufige Fragen
          </h2>
          <p className="text-leo-gray text-center mb-12">
            Alles, was Sie wissen müssen
          </p>

          <div className="space-y-4">
            {[
              {
                q: 'Ist das wirklich kostenlos?',
                a: 'Ja. Die Beratung kostet nichts. Nur wenn Sie einen Techniker möchten, entstehen Kosten.',
              },
              {
                q: 'Wer ist LEO?',
                a: 'LEO ist ein KI-gestützter Assistent, der Ihnen hilft, Heizungsprobleme zu verstehen.',
              },
              {
                q: 'Was passiert mit meinen Daten?',
                a: 'Ihre Daten werden nur für die Beratung verwendet und nicht an Dritte verkauft. Siehe Datenschutzerklärung.',
              },
              {
                q: 'Können Sie auch einen Techniker schicken?',
                a: 'Ja, wenn nötig vermitteln wir Sie an geprüfte Fachbetriebe in Ihrer Region.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-leo-dark">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-leo-gray transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4 text-leo-gray">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-leo-dark text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-2">LEO Heizungs-Soforthilfe</h3>
              <p className="text-gray-400">
                Kostenlose Fehlercode-Beratung für Ihre Heizung.
              </p>
            </div>
            <div className="md:text-right">
              <h4 className="font-semibold mb-2">Rechtliches</h4>
              <div className="space-x-4 text-gray-400">
                <a href="#impressum" className="hover:text-white transition-colors">
                  Impressum
                </a>
                <a href="#datenschutz" className="hover:text-white transition-colors">
                  Datenschutz
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 LEO Voice Agent. Ein Service der FERO GmbH.</p>
          </div>
        </div>
      </footer>

      {/* Voice Demo Modal */}
      {showVoiceDemo && (
        <VoiceDemo onClose={() => setShowVoiceDemo(false)} />
      )}
    </div>
  );
}

// Impressum Page Component
function ImpressumPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-leo-dark hover:text-leo-blue transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Zurück zur Startseite</span>
        </button>

        <h1 className="text-4xl font-bold text-leo-dark mb-8">Impressum</h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              Angaben gemäß § 5 TMG
            </h2>
            <p>
              FERO GmbH<br />
              Isestraße 139<br />
              20149 Hamburg<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              Vertreten durch
            </h2>
            <p>Dr. Florian Willert (Geschäftsführer)</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              Kontakt
            </h2>
            <p>
              Telefon: +49 40 30897755<br />
              E-Mail: kontakt@feropartners.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              Registereintrag
            </h2>
            <p>
              Registergericht: Amtsgericht Hamburg<br />
              Registernummer: HRB 130173
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              Umsatzsteuer-ID
            </h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
              DE293343101
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p>
              Dr. Florian Willert<br />
              Isestraße 139<br />
              20149 Hamburg
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              EU-Streitschlichtung
            </h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-leo-blue hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              Verbraucherstreitbeilegung
            </h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

// Datenschutz Page Component
function DatenschutzPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-leo-dark hover:text-leo-blue transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Zurück zur Startseite</span>
        </button>

        <h1 className="text-4xl font-bold text-leo-dark mb-8">Datenschutzerklärung</h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              1. Verantwortlicher
            </h2>
            <p>
              FERO GmbH<br />
              Isestraße 139<br />
              20149 Hamburg<br />
              E-Mail: kontakt@feropartners.com<br />
              Telefon: +49 40 30897755
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              2. Erhebung und Speicherung personenbezogener Daten
            </h2>
            <h3 className="text-lg font-medium text-leo-dark mt-4 mb-2">
              Beim Besuch der Website:
            </h3>
            <p>
              Beim Aufrufen unserer Website werden durch den Browser automatisch Informationen an den
              Server übermittelt: IP-Adresse, Datum und Uhrzeit der Anfrage, Browsertyp und -version,
              verwendetes Betriebssystem, Referrer URL. Diese Daten werden ausschließlich zur
              Gewährleistung eines störungsfreien Betriebs der Website erhoben und nach 7 Tagen
              automatisch gelöscht.
            </p>

            <h3 className="text-lg font-medium text-leo-dark mt-4 mb-2">
              Bei Kontaktaufnahme:
            </h3>
            <p>
              Wenn Sie uns per Telefon oder Formular kontaktieren, speichern wir Ihre Angaben zur
              Bearbeitung Ihrer Anfrage. Eine Weitergabe an Dritte erfolgt nicht.
            </p>

            <h3 className="text-lg font-medium text-leo-dark mt-4 mb-2">
              Bei Nutzung des Sprachassistenten:
            </h3>
            <p>
              Wenn Sie unseren KI-Sprachassistenten nutzen, wird das Gespräch aufgezeichnet und
              verarbeitet, um Ihnen bestmöglich zu helfen. Die Aufzeichnung wird nach 30 Tagen
              automatisch gelöscht.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              3. Rechtsgrundlage
            </h2>
            <p>
              Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
              und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              4. Weitergabe von Daten
            </h2>
            <p>
              Eine Übermittlung Ihrer persönlichen Daten an Dritte erfolgt nur wenn Sie ausdrücklich
              eingewilligt haben, wenn dies zur Vertragsabwicklung erforderlich ist, oder wenn wir
              gesetzlich dazu verpflichtet sind.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              5. Ihre Rechte
            </h2>
            <p>Sie haben das Recht auf:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              6. Beschwerderecht
            </h2>
            <p>
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
            </p>
            <p className="mt-2">
              Zuständige Aufsichtsbehörde:<br />
              Der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit<br />
              Ludwig-Erhard-Str. 22<br />
              20459 Hamburg
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              7. SSL-Verschlüsselung
            </h2>
            <p>
              Diese Website nutzt aus Sicherheitsgründen eine SSL-Verschlüsselung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-leo-dark mb-3">
              8. Aktualität
            </h2>
            <p>
              Diese Datenschutzerklärung ist aktuell gültig. Stand: Januar 2026.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;

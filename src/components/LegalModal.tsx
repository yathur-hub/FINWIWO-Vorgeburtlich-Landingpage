import React, { useState, useEffect } from 'react';
import { X, FileText, Shield, Info, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LegalModalProps {
  isOpen: boolean;
  initialTab: 'impressum' | 'datenschutz' | null;
  onClose: () => void;
}

export default function LegalModal({ isOpen, initialTab, onClose }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<'impressum' | 'datenschutz'>('impressum');

  // Sync active tab with initialTab prop when modal opens
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-teal-deep/50 backdrop-blur-md"
          id="legal-backdrop"
        />

        {/* Modal container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative bg-cream text-teal-deep rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col border border-teal-deep/10 overflow-hidden"
          id="legal-content-container"
        >
          {/* Header & Tabs */}
          <div className="border-b border-teal-deep/10 bg-cream/90 backdrop-blur px-6 pt-6 pb-2 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img 
                  src="https://finwiwo.ch/wp-content/uploads/2024/03/FINWIWO1.png" 
                  alt="FINWIWO Logo" 
                  className="h-8 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="h-5 w-px bg-teal-deep/20 mx-2 hidden sm:inline" />
                <span className="text-xs uppercase tracking-widest font-mono text-teal hidden sm:inline">
                  Rechtliche Dokumente
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-teal-deep/5 text-teal-deep/70 hover:text-teal-deep transition-all cursor-pointer"
                aria-label="Schliessen"
                id="legal-close-button-top"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('impressum')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer border ${
                  activeTab === 'impressum'
                    ? 'bg-teal-deep text-white border-teal-deep shadow-sm'
                    : 'bg-white hover:bg-cream-dark text-teal-deep border-teal-deep/10'
                }`}
                id="tab-impressum"
              >
                <Info className="w-4 h-4" />
                <span>Impressum &amp; Disclaimer</span>
              </button>
              <button
                onClick={() => setActiveTab('datenschutz')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer border ${
                  activeTab === 'datenschutz'
                    ? 'bg-teal-deep text-white border-teal-deep shadow-sm'
                    : 'bg-white hover:bg-cream-dark text-teal-deep border-teal-deep/10'
                }`}
                id="tab-datenschutz"
              >
                <Shield className="w-4 h-4" />
                <span>Datenschutzerklärung</span>
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto px-6 py-8 md:px-8 space-y-6" id="legal-scroll-area">
            {activeTab === 'impressum' ? (
              <div className="space-y-6 text-teal-deep/80 text-sm leading-relaxed" id="impressum-section">
                <div>
                  <h2 className="text-2xl font-black font-display text-teal-deep mb-2">Impressum</h2>
                  <p className="text-base text-teal font-medium mb-6">Verantwortlich für den Inhalt der Seiten</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-teal-deep/5 shadow-xs space-y-4">
                  <p className="font-semibold text-teal-deep">
                    Verantwortliche Stelle im Sinne der Datenschutzgesetze, insbesondere der EU-Datenschutzgrundverordnung (DSGVO), ist:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <p className="text-xs font-mono uppercase tracking-wider text-teal">Firma</p>
                      <p className="font-bold text-base text-teal-deep">FINWIWO AG</p>
                      <p>Oberstrasse 153</p>
                      <p>9000 St. Gallen</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-mono uppercase tracking-wider text-teal">Kontakt</p>
                      <p>Telefon: <span className="font-semibold text-teal-deep">071 552 30 00</span></p>
                      <p>E-Mail: <a href="mailto:info@finwiwo.ch" className="text-teal hover:underline font-semibold">info@finwiwo.ch</a></p>
                      <p>Website: <a href="https://finwiwo.ch/" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline font-semibold inline-flex items-center gap-1">https://finwiwo.ch/ <ExternalLink className="w-3 h-3" /></a></p>
                    </div>
                  </div>
                  <div className="border-t border-teal-deep/5 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-teal">MWST-Nr.</p>
                      <p className="font-semibold">CHE-297.970.593</p>
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-teal">Handelsregister-Nr.</p>
                      <p className="font-semibold">CH-320-4088864-8</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral inline-block"></span>
                    Copyright
                  </h3>
                  <p>
                    Das Copyright für sämtliche Inhalte dieser Website liegt bei <strong className="text-teal-deep">FINWIWO AG</strong>.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep flex items-center gap-2 border-b border-teal-deep/10 pb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral inline-block"></span>
                    Disclaimer
                  </h3>
                  <p>
                    Alle Texte und Links wurden sorgfältig geprüft und werden laufend aktualisiert. Wir sind bemüht, richtige und vollständige Informationen auf dieser Website bereitzustellen, übernehmen aber keinerlei Verantwortung, Garantien oder Haftung dafür, dass die durch diese Website bereitgestellten Informationen, richtig, vollständig oder aktuell sind.
                  </p>
                  <p>
                    Wir behalten uns das Recht vor, jederzeit und ohne Vorankündigung die Informationen auf dieser Website zu ändern und verpflichten uns auch nicht, die enthaltenen Informationen zu aktualisieren. Alle Links zu externen Anbietern wurden zum Zeitpunkt ihrer Aufnahme auf ihre Richtigkeit überprüft, dennoch haften wir nicht für Inhalte und Verfügbarkeit von Websites, die mittels Hyperlinks zu erreichen sind.
                  </p>
                  <p>
                    Für illegale, fehlerhafte oder unvollständige Inhalte und insbesondere für Schäden, die durch Inhalte verknüpfter Seiten entstehen, haftet allein der Anbieter der Seite, auf welche verwiesen wurde. Dabei ist es gleichgültig, ob der Schaden direkter, indirekter oder finanzieller Natur ist oder ein sonstiger Schaden vorliegt, der sich aus Datenverlust, Nutzungsausfall oder anderen Gründen aller Art ergeben könnte.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-teal-deep/80 text-sm leading-relaxed" id="datenschutz-section">
                <div>
                  <h2 className="text-2xl font-black font-display text-teal-deep mb-2">Datenschutzerklärung</h2>
                  <p className="text-xs font-mono uppercase tracking-wider text-teal">Stand: Juni 2026</p>
                </div>

                {/* 1. Präambel */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">1. Präambel</h3>
                  <p>
                    Wir nehmen den Schutz Ihrer Personendaten sehr ernst. Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Bearbeitung von Personendaten (hiernach als Daten bezeichnet) innerhalb unserer Webseite und der mit ihr verbundenen Webseiten, Funktionen und Inhalte sowie externen Onlinepräsenzen auf (hiernach gemeinsam als Webseite bezeichnet).
                  </p>
                  <p>
                    Das Unternehmen <strong className="text-teal-deep">FINWIWO AG</strong> (hiernach als Unternehmen bezeichnet) mit Sitz in St. Gallen an der Oberstrasse 153, CH-320-4088864-8, bearbeitet Informationen und Personendaten über Sie. Grundsätzlich erfolgt diese Informationsverarbeitung durch das Unternehmen im Rahmen bestehender oder anzubahnender Geschäftsbeziehungen, einschliesslich der Nutzung der Webseite. Das Unternehmen ist um den bestmöglichen Schutz Ihrer Personendaten bemüht.
                  </p>
                  <p>
                    Diese Datenschutzerklärung (nachfolgend „Erklärung“) beschreibt die Bearbeitung von Personendaten im Zusammenhang mit der Erbringung von Dienstleistungen durch das Unternehmen und deren Internetauftritt. Grundlage dieser Datenschutzerklärung bilden das Datenschutzgesetz (DSG), die Datenschutzverordnung (DSV) sowie die einschlägigen spezialgesetzlichen Regelungen.
                  </p>
                  <p>
                    Das Unternehmen behält sich das Recht vor, die Erklärung bei Bedarf anzupassen. Im Falle solcher Anpassungen sollten Sie überprüfen, ob Sie mit den Änderungen einverstanden sind.
                  </p>
                </div>

                {/* 2. Umfang der Bearbeitung von Personendaten */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-display text-teal-deep">2. Umfang der Bearbeitung von Personendaten</h3>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-teal-deep">a) Personendaten</h4>
                    <p>
                      Personendaten sind alle Angaben, die sich auf eine bestimmte oder bestimmbare natürliche Person beziehen. Hierzu zählen beispielsweise Name, Anschrift, E-Mail-Adresse, Telefonnummer, Geburtsdatum, Alter, Geschlecht, Steueridentifikationsnummer. Auch besonders schützenswerte Personendaten, wie Gesundheitsdaten oder Daten in Zusammenhang mit einem Strafverfahren, sind mit umfasst.
                    </p>
                    <p>
                      Das Unternehmen erhebt, bearbeitet und nutzt Ihre Personendaten ausschliesslich nach den Vorgaben des DSG bzw. der DSV.
                    </p>
                    <p>
                      Es werden nur solche Personendaten erhoben, die für die Durchführung und Abwicklung unserer Dienstleistungen erforderlich sind / die im Rahmen unserer Geschäftsbeziehung von Kunden oder Geschäftspartnern erhalten haben / zum Betrieb unserer Websites, Apps, etc. erforderlich sind oder von Ihnen freiwillig zur Verfügung gestellt wurden.
                    </p>
                    <p className="font-medium text-teal-deep mt-2">Arten der bearbeiteten Daten:</p>
                    <ul className="list-disc pl-5 space-y-1 bg-white p-4 rounded-lg border border-teal-deep/5">
                      <li>Bestandsdaten (z.B. Namen, Adressen)</li>
                      <li>Kontaktdaten (z.B. E-Mail, Telefonnummern)</li>
                      <li>Inhaltsdaten (z.B. Texteingaben, Fotografien, Videos)</li>
                      <li>Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten)</li>
                      <li>Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen)</li>
                      <li>Steuerunterlagen/Steuerlich relevante Unterlagen (z.B. Lohnausweis, Steuerbogen, etc.)</li>
                      <li>Versicherungsunterlagen/Versicherungsrelevante Unterlagen (z.B. Policen-Übersicht, Versicherungsunterlagen, etc.)</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-teal-deep">b) Bearbeitung von Personendaten</h4>
                    <p>
                      Das Unternehmen unterliegt beruflichen Vertraulichkeits- und Geheimhaltungspflichten, die sich aus dem Datenschutzrecht, dem Vertragsrecht oder dem Berufsgeheimnis ableiten lassen. Bei der Bearbeitung von Personendaten ist das Unternehmen an diese Pflichten gebunden. Die Bearbeitung von Personendaten unserer Nutzer beschränkt sich auf jene Daten, die zur Bereitstellung einer funktionsfähigen Internetseite sowie unserer Inhalte und Leistungen erforderlich sind. Es werden nur solche Personendaten erhoben, die für die Durchführung und Abwicklung unserer Aufgaben und Leistungen tatsächlich erforderlich sind oder die Sie uns freiwillig zur Verfügung gestellt haben.
                    </p>
                    <p>
                      Wir verwenden die von uns erhobenen Personendaten in erster Linie, um unsere Verträge mit unseren Kunden und Geschäftspartnern abzuschliessen und abzuwickeln.
                    </p>
                    <p className="font-medium text-teal-deep">Darüber hinaus bearbeiten wir Personendaten von Ihnen und weiteren Personen auch für folgende Zwecke:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Angebot und Weiterentwicklung unserer Angebote, Dienstleistungen, etc.</li>
                      <li>Kommunikation mit Dritten und Bearbeitung derer Anfragen (z.B. Offertenanfrage bei Partnergesellschaften, Medienanfragen);</li>
                      <li>Werbung und Marketing (auf unterschiedlichen Kommunikationswegen, einschliesslich Durchführung von Anlässen)</li>
                      <li>für interne Verwaltungszwecke (z.B. Gewährleistung von Stabilität und Betriebssicherheit des Systems);</li>
                      <li>für den Versand unseres Newsletters.</li>
                    </ul>
                  </div>
                </div>

                {/* 3. Ihre Rechte */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-display text-teal-deep">3. Ihre Rechte (Betroffenenrechte)</h3>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-teal-deep">a) Auskunftsrecht</h4>
                    <p>
                      Sie haben das Recht, Auskunft über Ihre von uns bearbeiteten Personendaten zu verlangen. Insbesondere können Sie Auskunft über die Bearbeitungszwecke, Aufbewahrungsdauer, Herkunft der Personendaten sowie gegebenenfalls das Vorliegen einer automatisierten Einzelentscheidung sowie die Logik, auf der die Entscheidung beruht und gegebenenfalls die Empfänger und Empfängerinnen oder die Kategorien von Empfängern, denen Personendaten bekanntgegeben werden.
                    </p>
                    <p>
                      Ein Auskunftsgesuch ist zusammen mit einem Identitätsnachweis in schriftlicher Form an den Verantwortlichen zu richten.
                    </p>
                    <p>
                      Nach Erhalt Ihres Auskunftsgesuchs wird Ihnen innert der gesetzlichen Frist von 30 Tagen mitgeteilt, ob Ihrem Auskunftsersuchen Folge geleistet werden kann. Die Auskunft kann verweigert, eingeschränkt oder aufgeschoben werden, soweit dies gesetzlich oder wegen überwiegendem Interesse eines Dritten oder des angefragten Unternehmens erforderlich ist.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-teal-deep">b) Recht auf Datenherausgabe oder -übertragung</h4>
                    <p>
                      Sie haben das Recht, die Herausgabe ihrer Personendaten vom Verantwortlichen in einem gängigen elektronischen Format zu verlangen, wenn
                    </p>
                    <ul className="list-decimal pl-5 space-y-1">
                      <li>Der Verantwortliche die Daten automatisiert bearbeitet und</li>
                      <li>Die Daten mit der Einwilligung der betroffenen Person oder in unmittelbaren Zusammenhang mit dem Abschluss oder der Abwicklung eines Vertrags zwischen dem Verantwortlichen und der betroffenen Person bearbeitet werden.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-teal-deep">c) Recht auf Berichtigung</h4>
                    <p>
                      Sie haben das Recht, eine Berichtigung unrichtiger Personendaten zu verlangen, es sei denn:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>eine gesetzliche Vorschrift verbietet die Änderung;</li>
                      <li>die Personendaten werden zu Archivzwecken im öffentlichen Interesse bearbeitet</li>
                    </ul>
                    <p className="mt-2">
                      Klagen zum Schutz der Persönlichkeit richten sich nach den Artikeln 28, 28a sowie 28 g–28l des Zivilgesetzbuchs. Die klagende Partei kann insbesondere verlangen, dass:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>eine bestimmte Datenbearbeitung verboten wird;</li>
                      <li>eine bestimmte Bekanntgabe von Personendaten an Dritte untersagt wird;</li>
                      <li>Personendaten gelöscht oder vernichtet werden.</li>
                    </ul>
                    <p className="mt-2">
                      Kann weder die Richtigkeit noch die Unrichtigkeit der betreffenden Personendaten festgestellt werden, so kann die klagende Partei verlangen, dass ein Bestreitungsvermerk angebracht wird.
                    </p>
                    <p>
                      Die klagende Partei kann zudem verlangen, dass die Berichtigung, die Löschung oder die Vernichtung, das Verbot der Bearbeitung oder der Bekanntgabe an Dritte, der Bestreitungsvermerk oder das Urteil Dritten mitgeteilt oder veröffentlicht wird.
                    </p>
                  </div>
                </div>

                {/* 4. Erfassung von allgemeinen Daten */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">4. Erfassung von allgemeinen Daten und Informationen</h3>
                  <p>
                    Wir führen auf unserer Internetseite eigene Webanalysen durch. Bei jedem Aufruf unserer Internetseite erfasst unser System automatisiert Daten und Informationen vom Computersystem des aufrufenden Rechners.
                  </p>
                  <p className="font-semibold text-teal-deep">Folgende Daten werden hierbei erhoben:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Information über den Browsertyp und verwendete Version</li>
                    <li>verwendetes Betriebssystem</li>
                    <li>Verweis-URL (die zuvor besuchte Website)</li>
                    <li>Hostname des zugreifenden Rechners (IP-Adresse)</li>
                    <li>Datum und Uhrzeit der Serveranfrage</li>
                    <li>übertragene Datenmenge</li>
                    <li>Meldung über erfolgreichen Abruf</li>
                  </ul>
                  <p className="mt-2">
                    Diese Informationen speichern wir über einen Zeitraum von maximal sechs Monaten. Die Speicherung erfolgt aus Gründen der Datensicherheit, um die Stabilität und die Betriebssicherheit unseres Systems zu gewährleisten. Die Daten werden intern für forensische Untersuchungen bei Hacker-Angriffen oder für andere sicherheitstechnisch relevanten Analysen verwendet. Dadurch garantieren wir die Sicherheit Ihrer Daten auf unseren Systemen und stellen sicher, dass in Verdachtsfällen schnell Gegenmassnahmen zur Wahrung Ihrer Daten ergriffen werden. Diese Daten werden nicht mit anderen zusammengeführt.
                  </p>
                </div>

                {/* 5. Datensicherheit */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">5. Datensicherheit</h3>
                  <p>
                    Wir verwenden innerhalb des Webseiten-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird. Ob eine einzelne Seite verschlüsselt übertragen wird, erkennen Sie an der geschlossenen Darstellung des Schlüssel- beziehungsweise Schloss-Symbols in der Adressleiste Ihres Browsers. Darüber hinaus wenden wir weitere geeignete technische und organisatorische Sicherheitsmassnahmen an, um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen Verlust, Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen. Unsere Sicherheitsmassnahmen werden entsprechend der technologischen Entwicklung fortlaufend verbessert.
                  </p>
                </div>

                {/* 6. Cookies */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">6. Cookies</h3>
                  <p>
                    Wir verwenden auf unserer Website Cookies, um Informationen über die Nutzung unserer Website zu erhalten und damit unser Angebot nutzerfreundlich zu gestalten. Cookies sind kleine Dateien, die Ihr Browser automatisch erstellt und die auf Ihrem Endgerät (Laptop, Tablet, Smartphone etc.) gespeichert werden, wenn Sie unsere Seite besuchen. Die Cookies bleiben so lange gespeichert, bis Sie diese löschen. Dadurch können wir Ihren Browser beim nächsten Besuch wiedererkennen. Sollten Sie dies nicht wünschen, können Sie Ihren Browser so einrichten, dass er Sie über das Setzen von Cookies informiert und Sie diese im Einzelfall erlauben. Wir weisen Sie allerdings darauf hin, dass eine Deaktivierung dazu führt, dass Sie nicht alle Funktionen unserer Website nutzen können.
                  </p>
                  <p>
                    Bei der Nutzung der Website des Unternehmens werden Zugriffsdaten (z.B. Log Files, IP-Adresse, Datum und Uhrzeit des Zugriffs, Name der aufgerufenen Datei, Zugriffsstatus, Top-Level Domain, verwendeter Webbrowser, verwendetes Betriebssystem) gespeichert. Das Unternehmen nutzt diese Daten für statistische Zwecke sowie für technische Auswertungen, für die Optimierung der Serverinfrastruktur, zur Feststellung der Zugriffshäufigkeiten und schliesslich, um Rückschlüsse für eine Verbesserung der Benutzerfreundlichkeit und der Funktionalitäten ziehen zu können.
                  </p>
                  <p className="font-semibold text-teal-deep mt-2">Die folgenden Cookie-Typen und Funktionen werden unterschieden:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Temporäre Cookies (Sitzungs-Cookies):</strong> Temporäre Cookies werden spätestens dann gelöscht, nachdem ein Nutzer ein Online-Angebot verlassen und seinen Browser geschlossen hat.</li>
                    <li><strong>Permanente Cookies:</strong> Permanente Cookies bleiben auch nach dem Schliessen des Browsers gespeichert. So kann beispielsweise der Login-Status gespeichert oder bevorzugte Inhalte direkt angezeigt werden, wenn der Nutzer eine Website erneut besucht. Ebenso können die Interessen von Nutzern, die zur Reichweitenmessung oder zu Marketingzwecken verwendet werden, in einem solchen Cookie gespeichert werden.</li>
                    <li><strong>First-Party-Cookies:</strong> First-Party-Cookies werden vom Unternehmen selbst gesetzt.</li>
                    <li><strong>Third-Party-Cookies (Drittanbieter-Cookies):</strong> Drittanbieter-Cookies werden hauptsächlich von Werbetreibenden (sog. Dritten) verwendet, um Benutzerinformationen zu bearbeiten.</li>
                    <li><strong>Notwendige (essentielle) Cookies:</strong> Cookies können zum einen für den Betrieb einer Website unbedingt erforderlich sein (z.B. um Logins oder andere Nutzereingaben zu speichern oder aus Gründen der Sicherheit).</li>
                    <li><strong>Statistik-, Marketing- und Personalisierungs-Cookies:</strong> Ferner werden Cookies im Regelfall auch im Rahmen der Reichweitenmessung eingesetzt sowie dann, wenn die Interessen eines Nutzers oder sein Verhalten (z.B. Betrachten bestimmter Inhalte, Nutzen von Funktionen etc.) auf einzelnen Websites in einem Nutzerprofil gespeichert werden.</li>
                  </ul>
                  <p className="mt-2">
                    <strong>Allgemeine Hinweise zum Widerruf und Widerspruch (Opt-Out):</strong> Sie haben jederzeit die Möglichkeit, eine erteilte Einwilligung zu widerrufen oder der Bearbeitung Ihrer Daten durch Cookie-Technologien zu widersprechen (zusammenfassend als „Opt-Out“ bezeichnet). Sie können Ihren Widerspruch zunächst mittels der Einstellungen Ihres Browsers erklären, z.B. indem Sie die Nutzung von Cookies deaktivieren (wobei hierdurch auch die Funktionsfähigkeit unseres Onlineangebotes eingeschränkt werden kann).
                  </p>
                  <p>
                    <strong>Bearbeitung von Cookie-Daten auf Grundlage einer Einwilligung:</strong> Bevor wir Daten im Rahmen der Nutzung von Cookies bearbeiten oder bearbeiten lassen, bitten wir die Nutzer um eine jederzeit widerrufbare Einwilligung. Bevor die Einwilligung nicht ausgesprochen wurde, werden allenfalls Cookies eingesetzt, die für den Betrieb unseres Onlineangebotes erforderlich sind. Deren Einsatz erfolgt auf der Grundlage unseres Interesses und des Interesses der Nutzer an der erwarteten Funktionsfähigkeit unseres Onlineangebotes.
                  </p>
                </div>

                {/* 7. Einbindung von Drittsoftware */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-display text-teal-deep">7. Einbindung von Drittsoftware, Skripten und Frameworks</h3>
                  <p>
                    Wir binden in unser Onlineangebot Software ein, die wir von Servern anderer Anbieter abrufen (z.B. Funktions-Bibliotheken, die wir zwecks Darstellung oder Nutzerfreundlichkeit unseres Onlineangebotes verwenden). Hierbei erheben die jeweiligen Anbieter die IP-Adresse der Nutzer und können diese zu Zwecken der Übermittlung der Software an den Browser der Nutzer sowie zu Zwecken der Sicherheit, als auch zur Auswertung und Optimierung ihres Angebotes verarbeiten.
                  </p>
                  
                  <div className="bg-white p-4 rounded-xl border border-teal-deep/5 space-y-2">
                    <p><strong>Bearbeitete Datenarten:</strong> Nutzungsdaten, Meta-/Kommunikationsdaten, Kontaktdaten, Inhaltsdaten.</p>
                    <p><strong>Betroffene Personen:</strong> Nutzer (z.B. Besucher der Website, Nutzer von Onlinediensten), Kommunikationspartner.</p>
                    <p><strong>Zwecke der Bearbeitung:</strong> Nutzerfreundlichkeit, Kontaktanfragen und Kommunikation, Direktmarketing, Tracking, Interessenbasiertes Marketing, Profiling, vertragliche Leistungen.</p>
                  </div>

                  <p className="font-semibold text-teal-deep">Folgende Drittsoftware, Skripten oder Frameworks werden verwendet:</p>
                  
                  <div className="space-y-4 pl-4 border-l-2 border-teal-deep/10">
                    <div className="space-y-1">
                      <h4 className="font-bold text-teal-deep">Verwendung von Google Maps</h4>
                      <p>
                        Diese Website nutzt das Angebot von Google Maps. Dadurch können wir Ihnen interaktive Karten direkt in der Website anzeigen und ermöglichen Ihnen die komfortable Nutzung der Karten-Funktion. Durch den Besuch auf der Website erhält Google die Information, dass Sie die entsprechende Unterseite unserer Website aufgerufen haben... Weitere Informationen zu Zweck und Umfang der Datenerhebung unter: <a href="https://www.google.de/intl/de/policies/privacy" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline font-semibold">www.google.de/intl/de/policies/privacy</a>.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-teal-deep">Google AdWords</h4>
                      <p>
                        Diese Website nutzt das Google Conversion-Tracking. Sind Sie über eine von Google geschaltete Anzeige auf unsere Website gelangt, wird von Google Adwords ein Cookie auf Ihrem Rechner gesetzt. Die mithilfe des Conversion-Cookies eingeholten Informationen dienen dazu, Conversion-Statistiken für AdWords-Kunden zu erstellen. Sie erhalten jedoch keine Informationen, mit denen sich Nutzer persönlich identifizieren lassen.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-teal-deep">Einsatz von Google Remarketing</h4>
                      <p>
                        Diese Website verwendet die Remarketing-Funktion der Google Inc. Die Funktion dient dazu, Websitebesuchern innerhalb des Google-Werbenetzwerks interessenbezogene Werbeanzeigen zu präsentieren. Sie können diese Funktion deaktivieren unter <a href="http://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline font-semibold">http://www.google.com/settings/ads</a>.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-teal-deep">Datenschutzerklärung für Google Analytics</h4>
                      <p>
                        Diese Website benutzt Google Analytics, einen Webanalienst der Google Ireland Limited. Rechtsgrundlage für die Nutzung von Google Analytics ist Art. 6 Abs. 1 S. 1 lit. f DS-GVO. Wir weisen darauf hin, dass auf dieser Website Google Analytics um den Code «_anonymizeIp();» erweitert wurde, um eine anonymisierte Erfassung von IP-Adressen zu gewährleisten.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-teal-deep">Datenschutzerklärung für Google Ads</h4>
                      <p>
                        Diese Website nutzt das Online-Marketing-Tool Google Ads von Google («Google Ads»). Google Ads setzt Cookies ein, um für die Nutzer relevante Anzeigen zu schalten, die Berichte zur Kampagnenleistung zu verbessern oder um zu vermeiden, dass ein Nutzer die gleichen Anzeigen mehrmals sieht.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-teal-deep">Datenschutzerklärung für Facebook</h4>
                      <p>
                        Diese Website verwendet Funktionen von Facebook Inc., 1601 S. California Ave, Palo Alto, CA 94304, USA. Bei Aufruf unserer Seiten mit Facebook-Plug-Ins wird eine Verbindung zwischen Ihrem Browser und den Servern von Facebook aufgebaut.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-teal-deep">Datenschutzerklärung für Instagram</h4>
                      <p>
                        Auf unserer Website sind Funktionen des Dienstes Instagram eingebunden. Diese Funktionen werden angeboten durch die Instagram Inc., 1601 Willow Road, Menlo Park, CA, 94025, USA.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-teal-deep">Newsletter – Mailchimp</h4>
                      <p>
                        Der Versand der Newsletter erfolgt mittels des Versanddienstleisters ‚MailChimp‘, einer Newsletterversandplattform des US-Anbieters Rocket Science Group, LLC, 675 Ponce De Leon Ave NE #5000, Atlanta, GA 30308, USA.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-teal-deep">Newsletter per WhatsApp</h4>
                      <p>
                        Unseren kostenlosen Newsletter können Sie auch über den Instant-Messaging-Dienst WhatsApp beziehen. WhatsApp ist ein Dienst der WhatsApp Ireland Limited, 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 8. Nutzung der Kontaktdaten */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">8. Nutzung der Kontaktdaten</h3>
                  <p>
                    Der Nutzung von im Rahmen der Impressums-Pflicht veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen. Wir behalten uns ausdrücklich rechtlicher Schritt im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam E-Mails, vor.
                  </p>
                </div>

                {/* 9. Hosting und E-Mail-Versand */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">9. Hosting und E-Mail-Versand</h3>
                  <p>
                    Die von uns in Anspruch genommene Hosting-Leistungen dienen der Zurverfügungstellung der folgenden Leistungen: Infrastruktur- und Plattformdienstleistungen, Rechenkapazität, Speicherplatz und Datenbankdienste, E-Mail-Versand, Sicherheitsleistungen sowie technische Wartungsleistungen, die wir zum Zwecke des Betriebs dieser Webseite einsetzen.
                  </p>
                </div>

                {/* 10. Bekanntgabe von Personendaten ins Ausland */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">10. Bekanntgabe von Personendaten ins Ausland</h3>
                  <p>
                    Die im Rahmen der Geschäftstätigkeit des Unternehmens erhobenen Personendaten werden in der Regel nicht an Dritte weitergegeben.
                  </p>
                  <p>
                    Zur Erfüllung geschäftlicher Aufträge ist es jedoch möglich, dass aufgrund abwicklungstechnischer Notwendigkeiten oder gesetzlicher Vorschriften Ihre Daten an Dritte weitergeleitet werden. Eine Weiterleitung Ihrer Daten erfolgt entsprechend der Vorschriften des DSG.
                  </p>
                  <p>
                    Weiters informieren wir Sie darüber, dass das Unternehmen im Rahmen seiner Geschäftstätigkeit und zur Erfüllung gesetzlicher Verpflichtungen Informationen über Sie von Dritten beziehen kann.
                  </p>
                  <p>
                    Das Unternehmen übermittelt Ihre Personendaten nur in Länder, denen der Bundesrat ein angemessenes Datenschutzniveau bescheinigt. Wenn das Unternehmen Ihre Personendaten in Länder übermittelt, die über kein als angemessen attestiertes Datenschutzniveau verfügen, setzt das Unternehmen Massnahmen, um den Schutz Ihrer Daten zu gewährleisten, in dem mit Empfängern in diesen Staaten zu den Standardvertragsklauseln kontrahiert wird.
                  </p>
                </div>

                {/* 11. Schutz der Personendaten */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">11. Schutz der Personendaten</h3>
                  <p>
                    Das Unternehmen trifft sowohl in Bezug auf die Datenbearbeitung und Datenspeicherung als auch in Bezug auf seinen Internetauftritt angemessene technische und organisatorische Massnahmen, um sämtliche Daten vor Verlust, unberechtigtem Zugriff oder Missbrauch zu schützen.
                  </p>
                  <p>
                    Ungeachtet der getroffenen Massnahmen zum Schutz der Daten müssen Sie sich bewusst sein, dass die Datenübermittlung über das Internet – dies gilt sowohl für Websites als auch E-Mail-Dienste – unkontrolliert und grenzüberschreitend erfolgt. Selbst wenn sich der Sender und der Empfänger im selben Land befinden, kann eine grenzüberschreitende Datenübermittlung gegeben sein. Das Unternehmen kann daher nicht für die vertrauliche Behandlung der Daten, die über das Internet übermittelt werden, garantieren...
                  </p>
                </div>

                {/* 12. Aufbewahrung der Personendaten */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">12. Aufbewahrung der Personendaten</h3>
                  <p>
                    Die zur Datenbearbeitung erforderlichen Systeme des Unternehmens befinden sich in der Schweiz. Die durch Sie übermittelten Daten werden sechs Monate aufbewahrt und bleiben solange gespeichert, wie dies operativ notwendig oder gesetzlich gefordert ist.
                  </p>
                  <p>
                    Ihre personenbezogenen Daten in Zusammenhang mit dem Versand unseres Newsletters werden umgehend gelöscht, sobald Sie sich für den Newsletter der FINWIWO AG abmelden.
                  </p>
                </div>

                {/* 13. Dateidownloads */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">13. Dateidownloads</h3>
                  <p>
                    Wir verlangen von Ihnen keine persönlichen Angaben, damit Sie Dateien von unserer Internetseite herunterladen können.
                  </p>
                </div>

                {/* 14. Kontakt */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">14. Kontakt</h3>
                  <p>
                    Bei Kontaktaufnahme per E-Mail oder sonstiger elektronischer Nachricht werden Ihre Angaben nur für die Bearbeitung der Anfrage und mögliche damit zusammenhängende weitere Fragen gespeichert und nur im Rahmen der Anfrage verwendet.
                  </p>
                  <p>
                    Bei Fragen zum Datenschutz und zur Datenbearbeitung wenden Sie sich bitte schriftlich an den Verantwortlichen. Sie erreichen den Verantwortlichen wie folgt:
                  </p>
                  <p className="font-mono bg-white p-3 rounded border border-teal-deep/5 inline-block">
                    admin(@)finwiwo.ch
                  </p>
                </div>

                {/* 15. Maklerleistungen */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">15. Maklerleistungen</h3>
                  <p>
                    Wir verarbeiten die Daten unserer Kunden, Klienten und Interessenten (einheitlich bezeichnet als «Kunden») gem. den datenschutzrechtlichen Bestimmungen des Bundes (Datenschutzgesetz, DSG) und der EU-DSGVO entsprechend Art. 6 Abs. 1 lit. b. DSGVO, um ihnen gegenüber unsere vertraglichen oder vorvertraglichen Leistungen zu erbringen... Dazu gehören grundsätzlich Bestands- und Stammdaten der Kunden (Name, Adresse, etc.), als auch die Kontaktdaten (E-Mailadresse, Telefon, etc.), die Vertragsdaten und Zahlungsdaten (Provisionen, Zahlungshistorie, etc.).
                  </p>
                  <p>
                    Im Rahmen unserer Beauftragung kann es auch erforderlich sein, dass wir besondere Kategorien von Daten gem. Art. 9 Abs. 1 DSGVO, hier insbesondere Angaben zur Gesundheit einer Person verarbeiten. Hierzu holen wir, sofern erforderlich, eine ausdrückliche Einwilligung der Kunden ein.
                  </p>
                  <p>
                    Sofern für die Vertragserfüllung oder gesetzlich erforderlich, offenbaren oder übermitteln wir die Daten der Kunden im Rahmen von Deckungsanfragen, Abschlüssen und Abwicklungen von Verträgen an Anbieter, Versicherer, Maklerpools, etc.
                  </p>
                </div>

                {/* 16. Vertragliche Leistungen */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">16. Vertragliche Leistungen</h3>
                  <p>
                    Wir verarbeiten die Daten unserer Vertragspartner und Interessenten sowie anderer Auftraggeber (einheitlich bezeichnet als «Vertragspartner») gem. den datenschutzrechtlichen Bestimmungen des Bundes (Datenschutzgesetz, DSG) und der EU-DSGVO entsprechend Art. 6 Abs. 1 lit. b. DSGVO, um ihnen gegenüber unsere vertraglichen oder vorvertraglichen Leistungen zu erbringen.
                  </p>
                  <p>
                    Zu den verarbeiteten Daten gehören die Stammdaten unserer Vertragspartner (z.B. Namen und Adressen), Kontaktdaten sowie Vertragsdaten und Zahlungsdaten. Die Löschung der Daten erfolgt, wenn die Daten zur Erfüllung vertraglicher oder gesetzlicher Fürsorgepflichten nicht mehr erforderlich sind.
                  </p>
                </div>

                {/* 17. Urheberrechte */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">17. Urheberrechte</h3>
                  <p>
                    Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf der Website, gehören ausschliesslich dem Betreiber dieser Website oder den speziell genannten Rechteinhabern. Für die Reproduktion von sämtlichen Dateien, ist die schriftliche Zustimmung des Urheberrechtsträgers im Voraus einzuholen.
                  </p>
                  <p>
                    Wer ohne Einwilligung des jeweiligen Rechteinhabers eine Urheberrechtsverletzung begeht, kann sich strafbar und allenfalls schadenersatzpflichtig machen.
                  </p>
                </div>

                {/* 18. Allgemeiner Haftungsausschluss */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">18. Allgemeiner Haftungsausschluss</h3>
                  <p>
                    Alle Angaben unseres Internetangebotes wurden sorgfältig geprüft. Wir bemühen uns, unser Informationsangebot aktuell, inhaltlich richtig und vollständig anzubieten. Trotzdem kann das Auftreten von Fehlern nicht völlig ausgeschlossen werden, womit wir keine Garantie für Vollständigkeit, Richtigkeit und Aktualität von Informationen übernehmen können.
                  </p>
                  <p>
                    Der Herausgeber kann nach eigenem Ermessen und ohne Ankündigung Texte verändern oder löschen. Die Benutzung bzw. der Zugang zu dieser Website geschieht auf eigene Gefahr des Besuchers.
                  </p>
                </div>

                {/* 19. Änderungen */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">19. Änderungen</h3>
                  <p>
                    Wir können diese Datenschutzerklärung jederzeit ohne Vorankündigung anpassen. Es gilt die jeweils aktuelle, auf unserer Website publizierte Fassung.
                  </p>
                </div>

                {/* 20. Fragen an den Datenschutzbeauftragten */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-teal-deep">20. Fragen an den Datenschutzbeauftragten</h3>
                  <p>
                    Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns bitte eine E-Mail oder wenden Sie sich direkt an die für den Datenschutz zu Beginn der Datenschutzerklärung aufgeführten, verantwortlichen Person in unserer Organisation.
                  </p>
                </div>

                {/* 21. SMS Dienst */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-display text-teal-deep">21. SMS Dienst</h3>
                  
                  <div className="space-y-2 pl-4 border-l-2 border-teal-deep/10">
                    <div>
                      <h4 className="font-bold text-teal-deep">1. INFORMATIONEN ZU DIESER DATENSCHUTZRICHTLINIE</h4>
                      <p>
                        Deine Privatsphäre ist uns wichtig. Deshalb haben wir diese Datenschutzrichtlinie entwickelt, in der erklärt wird, wie wir deine personenbezogenen Daten erfassen, verwenden und offenlegen. Wir erfassen personenbezogene Daten, wenn du unsere Website(s), mobilen Apps und andere Online- und Offline-Produkte, Dienstleistungen und Erlebnisse (zusammenfassend als „Dienstleistungen“ bezeichnet) verwendest. Bitte nimm dir einen Moment Zeit, um diese Richtlinie vollständig durchzulesen.
                      </p>
                      <p className="mt-1">
                        Wenn du Fragen, Bedenken oder Beschwerden bezüglich dieser Datenschutzrichtlinie oder der Verwendung deiner personenbezogenen Daten hast, kontaktiere uns bitte per E-Mail unter <a href="mailto:admin@finwiwo.ch" className="text-teal hover:underline font-semibold">admin@finwiwo.ch</a>.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-teal-deep">2. WELCHE PERSONENBEZOGENEN DATEN ERFASSEN WIR UND WIE ERFASSEN WIR SIE?</h4>
                      <p>Wir erfassen personenbezogene Daten, die du uns direkt zur Verfügung stellst:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li><strong>Kontaktdaten.</strong> Wenn du dich für den Empfang unseres Newsletters, unserer E-Mails oder Textnachrichten registrierst, erfassen wir deinen Namen, deine E-Mail-Adresse, deine Postanschrift, deine Telefonnummer und alle anderen Informationen, die erforderlich sind, um dich bezüglich der Dienste zu kontaktieren.</li>
                        <li><strong>Zahlungsinformationen.</strong> Um Produkte oder Dienstleistungen über die Dienste zu bestellen, musst du uns Zahlungsinformationen bereitstellen. Bitte beachte, dass deine Finanzinformationen von einem Drittanbieter für die Zahlungsabwicklung gesammelt und gespeichert werden.</li>
                        <li><strong>Umfrageinformationen.</strong> Du kannst uns weitere personenbezogene Daten zur Verfügung stellen, wenn du ein Formular ausfüllst, auf unsere Umfragen oder Fragebögen antwortest, uns Feedback gibst, an Werbeaktionen teilnimmst oder andere Funktionen der Services verwendest.</li>
                        <li><strong>Kommunikationsinformationen.</strong> Wir erfassen möglicherweise auch andere Informationen während unserer Kommunikation mit dir, einschliesslich Informationen, die du an uns sendest, wenn du mit unseren Kundendienstmitarbeitern interagierst, uns anrufst oder E-Mails oder Textnachrichten an uns sendest.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-teal-deep">3. WIE VERWENDEN WIR DEINE PERSONENBEZOGENEN DATEN?</h4>
                      <p>Wir verwenden die erfassten personenbezogenen Daten aus folgenden Gründen:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>Um dir unseren Newsletter oder andere Informationen oder Marketinginformationen zu unseren Services zu senden, von denen du denkst, dass sie für dich von Interesse sein könnten.</li>
                        <li>Um deine Fragen, Anfragen oder Kundenserviceanfragen zu beantworten oder um dir Benachrichtigungen, Updates, Sicherheitswarnungen, Support-bezogene oder administrative Nachrichten zu senden.</li>
                        <li>Um dir Informationen über die Dienstleistungen bereitzustellen, die du von uns anforderst oder von denen wir glauben, dass sie dich interessieren könnten.</li>
                        <li>Zur Überwachung und Analyse von Trends, Nutzung und Aktivitäten im Zusammenhang mit unseren Diensten und zur Verbesserung der Dienste.</li>
                        <li>Um Wettbewerbe, Gewinnspiele und Werbeaktionen zu ermöglichen, und um Einsendungen zu bearbeiten und Prämien und Belohnungen bereitzustellen.</li>
                        <li>Um betrügerische Transaktionen und andere illegale Aktivitäten innerhalb der Dienste aufzudecken, zu untersuchen und zu verhindern und die Rechte und das Eigentum von uns und unseren Kunden zu schützen.</li>
                        <li>Um unseren Verpflichtungen nachzukommen, die sich aus Verträgen ergeben, die zwischen dir und uns geschlossen wurden, einschliesslich Abrechnung und Inkasso.</li>
                        <li>Wir können deine personenbezogenen Daten auch verwenden, um unseren Verpflichtungen gemäss den geltenden Gesetzen nachzukommen, oder um andere Zwecke zu erfüllen, die dir zum Zeitpunkt der Erhebung mitgeteilt wurden.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="border-t border-teal-deep/10 bg-white px-6 py-4 flex justify-end gap-2 shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-white bg-teal-deep hover:bg-teal-deep/95 hover:shadow-md active:scale-98 rounded-lg transition-all cursor-pointer"
              id="legal-close-button-bottom"
            >
              Schliessen
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

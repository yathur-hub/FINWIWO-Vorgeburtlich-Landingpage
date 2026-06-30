import { BabyName, ZodiacInfo, FAQItem, FruitSize, Testimonial } from './types';

export const BABY_NAMES: BabyName[] = [
  // Mädchen - Klassisch
  { name: 'Sofia', gender: 'Mädchen', style: 'Klassisch', meaning: 'klassisch elegant & weise' },
  { name: 'Emma', gender: 'Mädchen', style: 'Klassisch', meaning: 'zeitlos & stark' },
  { name: 'Charlotte', gender: 'Mädchen', style: 'Klassisch', meaning: 'edel, frei & anmutig' },
  { name: 'Emilia', gender: 'Mädchen', style: 'Klassisch', meaning: 'fleissig & ehrgeizig' },
  { name: 'Helena', gender: 'Mädchen', style: 'Klassisch', meaning: 'die Strahlende' },
  { name: 'Hannah', gender: 'Mädchen', style: 'Klassisch', meaning: 'die Anmutige' },

  // Mädchen - Kurz
  { name: 'Mila', gender: 'Mädchen', style: 'Kurz', meaning: 'kurz & liebenswert' },
  { name: 'Lina', gender: 'Mädchen', style: 'Kurz', meaning: 'sanft & hell' },
  { name: 'Mia', gender: 'Mädchen', style: 'Kurz', meaning: 'beliebt & kurz' },
  { name: 'Lara', gender: 'Mädchen', style: 'Kurz', meaning: 'weich & heiter' },
  { name: 'Lea', gender: 'Mädchen', style: 'Kurz', meaning: 'die Löwin' },
  { name: 'Ella', gender: 'Mädchen', style: 'Kurz', meaning: 'die Schöne' },

  // Mädchen - Selten
  { name: 'Yara', gender: 'Mädchen', style: 'Selten', meaning: 'kleiner Schmetterling' },
  { name: 'Cleo', gender: 'Mädchen', style: 'Selten', meaning: 'die Glorreiche' },
  { name: 'Maila', gender: 'Mädchen', style: 'Selten', meaning: 'Hoffnungsstern' },
  { name: 'Aurelia', gender: 'Mädchen', style: 'Selten', meaning: 'die Goldene' },
  { name: 'Fiona', gender: 'Mädchen', style: 'Selten', meaning: 'die Weisse & Reine' },
  { name: 'Malea', gender: 'Mädchen', style: 'Selten', meaning: 'Blume' },

  // Junge - Klassisch
  { name: 'Elias', gender: 'Junge', style: 'Klassisch', meaning: 'klassisch, starker Klang' },
  { name: 'Matteo', gender: 'Junge', style: 'Klassisch', meaning: 'warm & Geschenk Gottes' },
  { name: 'Alexander', gender: 'Junge', style: 'Klassisch', meaning: 'Beschützer' },
  { name: 'Samuel', gender: 'Junge', style: 'Klassisch', meaning: 'von Gott erhört' },
  { name: 'Gabriel', gender: 'Junge', style: 'Klassisch', meaning: 'Stärke Gottes' },
  { name: 'David', gender: 'Junge', style: 'Klassisch', meaning: 'der Geliebte' },

  // Junge - Kurz
  { name: 'Leo', gender: 'Junge', style: 'Kurz', meaning: 'kurz, kraftvoll & mutig' },
  { name: 'Finn', gender: 'Junge', style: 'Kurz', meaning: 'klar, blond & klug' },
  { name: 'Luca', gender: 'Junge', style: 'Kurz', meaning: 'modern, hell & leuchtend' },
  { name: 'Ben', gender: 'Junge', style: 'Kurz', meaning: 'Sohn des Südens' },
  { name: 'Noah', gender: 'Junge', style: 'Kurz', meaning: 'sanft, Tröster & Ruhender' },
  { name: 'Max', gender: 'Junge', style: 'Kurz', meaning: 'der Grösste' },

  // Junge - Selten
  { name: 'Lio', gender: 'Junge', style: 'Selten', meaning: 'kleiner Löwe' },
  { name: 'Nelio', gender: 'Junge', style: 'Selten', meaning: 'der Strahlende' },
  { name: 'Jano', gender: 'Junge', style: 'Selten', meaning: 'Gott ist gnädig' },
  { name: 'Leano', gender: 'Junge', style: 'Selten', meaning: 'Geschenk der Sonne' },
  { name: 'Elio', gender: 'Junge', style: 'Selten', meaning: 'Sonnengott' },
  { name: 'Mailo', gender: 'Junge', style: 'Selten', meaning: 'der Friedliche' },

  // Beides - Klassisch
  { name: 'Alex', gender: 'Beides', style: 'Klassisch', meaning: 'klassisch & verlässlich' },
  { name: 'Robin', gender: 'Beides', style: 'Klassisch', meaning: 'zeitlos, glänzend & berühmt' },
  { name: 'Chris', gender: 'Beides', style: 'Klassisch', meaning: 'der Christusträger' },
  { name: 'Jordan', gender: 'Beides', style: 'Klassisch', meaning: 'der Herabfliessende' },
  { name: 'Jamie', gender: 'Beides', style: 'Klassisch', meaning: 'Fersenhalter' },
  { name: 'Taylor', gender: 'Beides', style: 'Klassisch', meaning: 'Schneider' },

  // Beides - Kurz
  { name: 'Mika', gender: 'Beides', style: 'Kurz', meaning: 'kurz, cool & Geschenk Gottes' },
  { name: 'Kim', gender: 'Beides', style: 'Kurz', meaning: 'neutral & Lichtung' },
  { name: 'Lou', gender: 'Beides', style: 'Kurz', meaning: 'weich, berühmt im Kampf' },
  { name: 'Toni', gender: 'Beides', style: 'Kurz', meaning: 'freundlich & wertvoll' },
  { name: 'Sam', gender: 'Beides', style: 'Kurz', meaning: 'von Gott erhört' },
  { name: 'Kai', gender: 'Beides', style: 'Kurz', meaning: 'der Kämpfer / das Meer' },

  // Beides - Selten
  { name: 'Noel', gender: 'Beides', style: 'Selten', meaning: 'Geburtstag (frz.)' },
  { name: 'Juri', gender: 'Beides', style: 'Selten', meaning: 'Bauer / Licht Gottes' },
  { name: 'Elia', gender: 'Beides', style: 'Selten', meaning: 'mein Gott ist Jahwe' },
  { name: 'Charlie', gender: 'Beides', style: 'Selten', meaning: 'freie Person' },
  { name: 'Sasha', gender: 'Beides', style: 'Selten', meaning: 'Helfer der Menschheit' },
  { name: 'Noa', gender: 'Beides', style: 'Selten', meaning: 'Trost & Ruhe' }
];

export const ZODIACS: ZodiacInfo[] = [
  {
    name: 'Widder',
    icon: '♈',
    dateRange: '21.03. - 19.04.',
    pregnancyQuote: 'Widder: Voller Energie, Tatendrang und ungeduldig, das neue Abenteuer Leben zu beginnen.',
    personality: 'voller Tatendrang, mutig und abenteuerlustig'
  },
  {
    name: 'Stier',
    icon: '♉',
    dateRange: '20.04. - 20.05.',
    pregnancyQuote: 'Stier: Ausgeglichen, naturverbunden und genussvoll – du machst es dir im Nest richtig gemütlich.',
    personality: 'geduldig, zuverlässig und sehr genussvoll'
  },
  {
    name: 'Zwillinge',
    icon: '♊',
    dateRange: '21.05. - 20.06.',
    pregnancyQuote: 'Zwillinge: Neugierig, kommunikativ und ständig am Lesen aller Schwangerschaftsbücher.',
    personality: 'neugierig, kommunikativ und geistig vielseitig'
  },
  {
    name: 'Krebs',
    icon: '♋',
    dateRange: '21.06. - 22.07.',
    pregnancyQuote: 'Krebs: Tief emotional, fürsorglich und am Dekorieren des schönsten Babyzimmers der Welt.',
    personality: 'sensibel, beschützend und absolut familienbezogen'
  },
  {
    name: 'Löwe',
    icon: '♌',
    dateRange: '23.07. - 22.08.',
    pregnancyQuote: 'Löwe: Stolz, beschützend und mit einer natürlichen Schwangerschafts-Aura, die alle anzieht.',
    personality: 'selbstbewusst, warmherzig und stolz'
  },
  {
    name: 'Jungfrau',
    icon: '♍',
    dateRange: '23.08. - 22.09.',
    pregnancyQuote: 'Jungfrau: Perfekt organisiert, strukturiert und hat bereits alle Kliniktaschen-Listen dreifach geprüft.',
    personality: 'klug, zuverlässig und sehr detailorientiert'
  },
  {
    name: 'Waage',
    icon: '♎',
    dateRange: '23.09. - 22.10.',
    pregnancyQuote: 'Waage: Harmoniesuchend, diplomatisch und wählt den Babynamen nach dem schönsten Klang aus.',
    personality: 'harmoniebedürftig, charmant und ausgesprochen gerecht'
  },
  {
    name: 'Skorpion',
    icon: '♏',
    dateRange: '23.10. - 21.11.',
    pregnancyQuote: 'Skorpion: Intensiv, beschützend und mit einem unfehlbaren Bauchgefühl für die Bedürfnisse des Babys.',
    personality: 'willensstark, tief und voller starkem Gefühl'
  },
  {
    name: 'Schütze',
    icon: '♐',
    dateRange: '22.11. - 21.12.',
    pregnancyQuote: 'Schütze: Unverbesserlich optimistisch, reiselustig und freut sich schon auf die grossen Abenteuer zu dritt.',
    personality: 'optimistisch, freiheitsliebend und weise'
  },
  {
    name: 'Steinbock',
    icon: '♑',
    dateRange: '22.12. - 19.01.',
    pregnancyQuote: 'Steinbock: Verantwortungsbewusst, diszipliniert und plant die finanzielle Zukunft des Babys vorausschauend.',
    personality: 'ehrgeizig, ausdauernd und absolut pflichtbewusst'
  },
  {
    name: 'Wassermann',
    icon: '♒',
    dateRange: '20.01. - 18.02.',
    pregnancyQuote: 'Wassermann: Unkonventionell, kreativ und findet ganz besondere, kreative Lösungsansätze im Familienalltag.',
    personality: 'unabhängig, kreativ und zukunftsorientiert'
  },
  {
    name: 'Fische',
    icon: '♓',
    dateRange: '19.02. - 20.03.',
    pregnancyQuote: 'Fische: Verträumt, hochsensibel und verbindet sich schon in der Schwangerschaft tief spirituell mit dem Baby.',
    personality: 'einfühlsam, träumerisch und voller Fantasie'
  }
];

export const FRUIT_SIZES: FruitSize[] = [
  { weekMin: 0, weekMax: 7, fruit: 'Samenkorn', size: 'ca. 2-5 mm', weight: 'ca. 1g', emoji: '🌱' },
  { weekMin: 8, weekMax: 11, fruit: 'Himbeere', size: 'ca. 1.6 - 3 cm', weight: 'ca. 1 - 4g', emoji: '🍓' },
  { weekMin: 12, weekMax: 15, fruit: 'Limette', size: 'ca. 5.4 - 8.5 cm', weight: 'ca. 14 - 45g', emoji: '🍋' },
  { weekMin: 16, weekMax: 19, fruit: 'Avocado', size: 'ca. 11.6 - 14.2 cm', weight: 'ca. 100 - 190g', emoji: '🥑' },
  { weekMin: 20, weekMax: 23, fruit: 'Banane', size: 'ca. 25 - 29 cm', weight: 'ca. 300 - 500g', emoji: '🍌' },
  { weekMin: 24, weekMax: 27, fruit: 'Maiskolben', size: 'ca. 30 - 34 cm', weight: 'ca. 600 - 900g', emoji: '🌽' },
  { weekMin: 28, weekMax: 31, fruit: 'Aubergine', size: 'ca. 37 - 41 cm', weight: 'ca. 1000 - 1500g', emoji: '🍆' },
  { weekMin: 32, weekMax: 35, fruit: 'Kürbis', size: 'ca. 42 - 46 cm', weight: 'ca. 1700 - 2300g', emoji: '🎃' },
  { weekMin: 36, weekMax: 39, fruit: 'Honigmelone', size: 'ca. 47 - 50 cm', weight: 'ca. 2600 - 3200g', emoji: '🍈' },
  { weekMin: 40, weekMax: 50, fruit: 'Wassermelone', size: 'ca. 51 - 53 cm', weight: 'ca. 3400 - 3800g', emoji: '🍉' }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: '„Der Baby-Check von FINWIWO hat uns extreme Sicherheit gegeben. Wir wussten davor gar nicht, dass eine spätere Ablehnung der Zusatzversicherung wegen kleiner Geburtskomplikationen so häufig ist. Jetzt ist unsere kleine Emily perfekt versichert, und die Beratung war super sympathisch.“',
    author: 'Sarah & Michael',
    role: 'Werdende Eltern',
    location: 'Zürich',
    isHebamme: false
  },
  {
    quote: '„Als freischaffende Hebamme sehe ich im Alltag oft, dass sich Paare erst nach der Geburt um Zusatzversicherungen kümmern. Wenn das Baby dann einen unruhigen Start hat, ist der Zug für viele tolle Zusatzdeckungen abgefahren. Die frühzeitige Anmeldung spart enormen Stress.“',
    author: 'Karin S.',
    role: 'Hebamme HF',
    location: 'St. Gallen',
    isHebamme: true
  },
  {
    quote: '„Ich hatte anfangs Bedenken, ob die Beratung wirklich unabhängig und kostenfrei ist. Aber FINWIWO vergleicht sachlich alle Kassen. Wir sparen dank des empfohlenen Familienrabatts über CHF 60.- jeden Monat und haben zudem das Starter-Set geschenkt bekommen.“',
    author: 'Julia & Thomas',
    role: 'Werdende Eltern',
    location: 'Winterthur',
    isHebamme: false
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 1,
    question: 'Wann ist der späteste Zeitpunkt für eine vorgeburtliche Anmeldung?',
    answer: 'Sinnvoll ist das zweite Schwangerschaftsdrittel (ca. 13. bis 28. Woche). Viele Kassen nehmen die Anmeldung bis kurz vor der Geburt entgegen. Je früher, desto entspannter. Nach der Geburt startet für Zusatzversicherungen oft eine strenge Gesundheitsprüfung, die zu Ausschlüssen oder Ablehnungen führen kann.'
  },
  {
    id: 2,
    question: 'Was passiert, wenn mein Baby mit einem Geburtsthema zur Welt kommt?',
    answer: 'Bei Zusatzversicherungen können nach der Geburt Gesundheitsfragen entscheidend sein. Wurde das Baby nicht bereits vorgeburtlich ohne Prüfung angemeldet, kann es bei angeborenen Krankheiten, Frühgeburt oder kleineren Komplikationen zu einer Ablehnung, einem Vorbehalt oder einer Wartezeit kommen. Vorgeburtlich ist der Zugang ohne Gesundheitsprüfung garantiert.'
  },
  {
    id: 3,
    question: 'Zahlt die Grundversicherung die halbprivate oder private Abteilung?',
    answer: 'Nein. Die gesetzliche Grundversicherung (KVG) übernimmt ausschliesslich die Behandlung in der allgemeinen Abteilung im Wohnkanton. Wenn du dein Kind halbprivat oder privat im Spital versichern möchtest (freie Arztwahl, Zweitbett- oder Einbettzimmer), benötigst du eine Zusatzversicherung (VVG). Genau darum ist die vorgeburtliche Anmeldung so wichtig.'
  },
  {
    id: 4,
    question: 'Muss mein Baby bei derselben Kasse versichert sein wie ich?',
    answer: 'Nein. Es gibt keinerlei Verpflichtung, das Baby bei deiner aktuellen Krankenkasse anzumelden. Oft macht es sogar grossen Sinn, das Baby separat bei einer Kasse zu versichern, die besonders vorteilhafte Kinderkonditionen, grosszügige Geburtspauschalen oder stärkere Zahnleistungen anbietet. Wir vergleichen alle Angebote vollkommen unabhängig für dich.'
  },
  {
    id: 5,
    question: 'Was kostet eine Zusatzversicherung fürs Baby?',
    answer: 'Das ist je nach gewünschtem Leistungsumfang (Zahn, Komplementärmedizin, Spitalzusatz) und Kasse unterschiedlich. Da das Risiko bei Babys statistisch noch gering ist, sind Baby-Zusatzversicherungen oft überraschend günstig (oft nur wenige Franken pro Monat). Häufig gibt es auch attraktive Familienrabatte ab dem 2. Kind.'
  },
  {
    id: 6,
    question: 'Bekomme ich wirklich bis zu CHF 3\'500 Geburtspauschale?',
    answer: 'Die genaue Höhe der Auszahlung hängt ganz vom gewählten Versicherungsprodukt und den genauen Versicherungsbedingungen der jeweiligen Kasse ab. Zum Beispiel zahlt das CSS Spital Baby grosszügige Beiträge, sofern die Bedingungen erfüllt sind. Deshalb kommunizieren wir absolut transparent mit „bis zu CHF 3\'500“ und prüfen im Beratungstermin gemeinsam, wo du den grössten Nutzen hast.'
  },
  {
    id: 7,
    question: 'Kann ich mein Baby nach der Geburt noch in eine bessere Lösung wechseln?',
    answer: 'Ein Wechsel nach der Geburt ist grundsätzlich möglich, unterliegt dann aber der vollen Gesundheitsprüfung. Hat das Baby bis dahin Allergien, Atemwegserkrankungen oder andere Befunde entwickelt, wird die Aufnahme oft abgelehnt. Deshalb ist die vorgeburtliche Anmeldung der sicherste, einfachste und stressfreiste Weg.'
  }
];

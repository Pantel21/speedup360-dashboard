import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Target, Zap, Database, ClipboardList, Users, BarChart3,
  ArrowRight, CheckCircle2, Clock, Euro,
  Monitor, MapPin, Bot, FileText, TrendingUp, Shield,
  Workflow, Bell, UserCheck, ShoppingCart, Activity, Gauge,
  ChevronRight, Star, Building2, Sparkles,
  GitBranch, Calendar, Send,
  Laptop, Home, PlayCircle, Printer
} from 'lucide-react'

/* ───────────────────────── DATA ───────────────────────── */

const kernprozessSchritte = [
  { nr: 1, name: 'Analyse (IST)', desc: 'Datenerfassung und Bestandsaufnahme ueber alle 6 Kompetenzfelder', icon: BarChart3, color: 'bg-blue-500' },
  { nr: 2, name: 'Score (Bewertung)', desc: '6-KF-Scoring (1-10) + Benchmark gegen Branchendaten', icon: Gauge, color: 'bg-indigo-500' },
  { nr: 3, name: 'Soll-Definition', desc: 'Zielwerte je KPI und Kompetenzfeld definieren', icon: Target, color: 'bg-violet-500' },
  { nr: 4, name: 'Gap-Analyse', desc: 'Delta IST vs. SOLL identifizieren, Prioritaeten A/B/C setzen', icon: Activity, color: 'bg-purple-500' },
  { nr: 5, name: 'Massnahmenplan', desc: 'Top 3-5 Hebel mit Verantwortlichen, Timeline, KPIs', icon: ClipboardList, color: 'bg-fuchsia-500' },
  { nr: 6, name: 'Systemaufbau', desc: 'SOPs, Automationen, KPI-Tracking, Standards einfuehren', icon: Workflow, color: 'bg-pink-500' },
  { nr: 7, name: 'Follow-up', desc: 'Umsetzung pruefen (30/60/90 Tage), Blockaden loesen', icon: CheckCircle2, color: 'bg-rose-500' },
  { nr: 8, name: 'Upsell', desc: 'Naechste Entwicklungsstufe anbieten (Coaching, Campus, Master)', icon: ShoppingCart, color: 'bg-orange-500' },
  { nr: 9, name: 'Wirkungsmessung', desc: 'KPI-Veraenderung messen: Bon, Rebooking, Umsatz vorher/nachher', icon: TrendingUp, color: 'bg-amber-500' },
  { nr: 10, name: 'Reaktivierung', desc: 'Reminder-Sequenz, erneute Diagnose bei Bedarf', icon: Bell, color: 'bg-yellow-500' },
]

const kompetenzfelder = [
  { kf: 'KF1', name: 'Strategie & Positionierung', fragen: 'USP klar? Zielgruppe definiert? Wettbewerbsanalyse aktuell?' },
  { kf: 'KF2', name: 'Marketing & Sichtbarkeit', fragen: 'Google-Bewertung? Social Media? Online-Buchungsrate? Neukundenquote?' },
  { kf: 'KF3', name: 'Kunden & Service', fragen: 'Wiederkehrrate? NPS? Durchschnittsbon? Beschwerdequote?' },
  { kf: 'KF4', name: 'Fuehrung & Team', fragen: 'Fluktuation? Krankenstand? Delegationsklarheit? Feedback-Kultur?' },
  { kf: 'KF5', name: 'Wirtschaft & Planung', fragen: 'Umsatz/Kopf? Personalquote? Rohertrag? Liquiditaetspuffer?' },
  { kf: 'KF6', name: 'Prozesse & Systeme', fragen: 'Digitalisierungsgrad? SOP-Abdeckung? Automatisierung? Routinen?' },
]

const crmFelder = {
  stammdaten: [
    { feld: 'Salonname', typ: 'Text', pflicht: true },
    { feld: 'Ansprechpartner', typ: 'Text', pflicht: true },
    { feld: 'Standort (PLZ, Stadt)', typ: 'Text', pflicht: true },
    { feld: 'Mitarbeiteranzahl', typ: 'Zahl', pflicht: true },
    { feld: 'Umsatzklasse', typ: 'Picklist (< 250k / 250-500k / 500k-1M / > 1M)', pflicht: true },
    { feld: 'Produkt', typ: 'Picklist (Digital / Vor-Ort)', pflicht: true },
    { feld: 'Trainer', typ: 'Lookup (User)', pflicht: false },
    { feld: 'Persona-Zuordnung', typ: 'Picklist (P01-P06)', pflicht: true },
    { feld: 'Kassensystem', typ: 'Picklist (Vectron / Salonware / PC-Salon / Sonstige)', pflicht: false },
    { feld: 'Analyse-Datum', typ: 'Datum', pflicht: true },
  ],
  scores: [
    { feld: 'Score KF1: Strategie', typ: 'Zahl (1-10)', auto: false },
    { feld: 'Score KF2: Sichtbarkeit', typ: 'Zahl (1-10)', auto: false },
    { feld: 'Score KF3: Kunden', typ: 'Zahl (1-10)', auto: false },
    { feld: 'Score KF4: Fuehrung', typ: 'Zahl (1-10)', auto: false },
    { feld: 'Score KF5: Wirtschaft', typ: 'Zahl (1-10)', auto: false },
    { feld: 'Score KF6: Prozesse', typ: 'Zahl (1-10)', auto: false },
    { feld: 'Gesamtscore', typ: 'Formel (Durchschnitt KF1-6)', auto: true },
    { feld: 'Ampelstatus', typ: 'Formel (Rot < 4 / Gelb 4-6 / Gruen > 6)', auto: true },
    { feld: 'Reifegrad', typ: 'Formel (Starter/Aufbau/Professionell/Excellence)', auto: true },
  ],
  sollFelder: [
    { feld: 'Ziel Durchschnittsbon', typ: 'Waehrung (EUR)', quelle: 'Benchmark + Berater' },
    { feld: 'Ziel Rebooking-Quote', typ: 'Prozent (%)', quelle: 'Benchmark (Ziel: > 75%)' },
    { feld: 'Ziel Zusatzverkauf-Quote', typ: 'Prozent (%)', quelle: 'Benchmark (Ziel: > 25%)' },
    { feld: 'Ziel Auslastung', typ: 'Prozent (%)', quelle: 'Benchmark (Ziel: > 80%)' },
    { feld: 'Ziel Google-Bewertung', typ: 'Dezimal (1-5)', quelle: 'Benchmark (Ziel: > 4.5)' },
    { feld: 'Ziel Minutenpreis', typ: 'Waehrung (EUR)', quelle: 'Preiskalkulation Agent' },
    { feld: 'Ziel Personalquote', typ: 'Prozent (%)', quelle: 'BWA Analyse (Ziel: < 50%)' },
  ],
  gap: [
    { feld: 'Delta je KPI', typ: 'Formel (SOLL - IST)', auto: true },
    { feld: 'Groesste Abweichung', typ: 'Formel (MAX Delta)', auto: true },
    { feld: 'Prioritaet A/B/C', typ: 'Formel (nach Delta-Groesse)', auto: true },
    { feld: 'Gap-Score gesamt', typ: 'Formel (gewichteter Durchschnitt)', auto: true },
  ],
  massnahmen: [
    { feld: 'Top 1 Massnahme', typ: 'Text + Rich Text' },
    { feld: 'Top 2 Massnahme', typ: 'Text + Rich Text' },
    { feld: 'Top 3 Massnahme', typ: 'Text + Rich Text' },
    { feld: 'Verantwortliche Person', typ: 'Lookup (User/Salon)' },
    { feld: 'Deadline', typ: 'Datum' },
    { feld: 'Massnahmen-Status', typ: 'Picklist (Geplant/In Arbeit/Abgeschlossen)' },
  ],
  system: [
    { feld: 'SOP eingefuehrt', typ: 'Checkbox', trigger: 'Wenn ja: Scoring +0.5' },
    { feld: 'Automation aktiv', typ: 'Checkbox', trigger: 'Wenn ja: Effizienz-Badge' },
    { feld: 'KPI-Tracking aktiv', typ: 'Checkbox', trigger: 'Wenn ja: Messung moeglich' },
    { feld: 'Standards definiert', typ: 'Checkbox', trigger: 'Wenn ja: Qualitaets-Badge' },
  ],
  followup: [
    { feld: 'Follow-up Datum', typ: 'Datum' },
    { feld: 'Umsetzungsstatus', typ: 'Slider (0-100%)', auto: false },
    { feld: 'Blockaden', typ: 'Text (Multiline)' },
    { feld: 'Naechster Schritt', typ: 'Text' },
  ],
  upsell: [
    { feld: 'Empfohlene Produkte', typ: 'Multi-Picklist', auto: true },
    { feld: 'Abschlussstatus', typ: 'Picklist (Offen/Angeboten/Abgeschlossen/Verloren)' },
    { feld: 'Potenzialwert', typ: 'Waehrung (EUR)', auto: true },
    { feld: 'Conversion-Quelle', typ: 'Picklist (SpeedUp > Coaching / Campus / Master)' },
  ],
  wirkung: [
    { feld: 'Bon vorher', typ: 'Waehrung (EUR)' },
    { feld: 'Bon nachher', typ: 'Waehrung (EUR)' },
    { feld: 'Bon Delta', typ: 'Formel', auto: true },
    { feld: 'Rebooking vorher', typ: 'Prozent (%)' },
    { feld: 'Rebooking nachher', typ: 'Prozent (%)' },
    { feld: 'Umsatz vorher', typ: 'Waehrung (EUR)' },
    { feld: 'Umsatz nachher', typ: 'Waehrung (EUR)' },
    { feld: 'ROI', typ: 'Formel (Umsatzsteigerung / Preis SpeedUp360)', auto: true },
  ],
  reaktivierung: [
    { feld: 'Letzter Kontakt', typ: 'Datum', auto: true },
    { feld: 'Reminder gesetzt', typ: 'Checkbox' },
    { feld: 'Reaktivierungsstatus', typ: 'Picklist (Aktiv/Inaktiv/Reaktiviert/Abgesagt)' },
    { feld: 'Tage seit letztem Kontakt', typ: 'Formel', auto: true },
  ],
}

const automationen = [
  { trigger: 'Nach Analyse abgeschlossen', aktion: 'PDF-Bericht generieren (DocGen)', zeit: 'Sofort', system: 'n8n + Claude API', prio: 'P1' },
  { trigger: 'Nach Analyse abgeschlossen', aktion: 'E-Mail an Kunde mit Bericht', zeit: '< 2h', system: 'n8n + Zoho', prio: 'P1' },
  { trigger: 'Nach Analyse abgeschlossen', aktion: 'Aufgabe fuer Sales erstellen', zeit: 'Sofort', system: 'Zoho Tasks', prio: 'P1' },
  { trigger: 'Nach Analyse abgeschlossen', aktion: 'Angebot automatisch generiert', zeit: '< 4h', system: 'n8n + Zoho', prio: 'P1' },
  { trigger: '14 Tage nach Analyse', aktion: 'Reminder an Kunde', zeit: 'Tag 14', system: 'n8n + E-Mail', prio: 'P2' },
  { trigger: '14 Tage nach Analyse', aktion: 'WhatsApp Impuls-Nachricht', zeit: 'Tag 14', system: 'n8n + WA API', prio: 'P2' },
  { trigger: '30 Tage nach Analyse', aktion: 'Follow-up Termin automatisch', zeit: 'Tag 30', system: 'Cal.com + n8n', prio: 'P1' },
  { trigger: 'Umsetzung < 30% nach 30 Tagen', aktion: 'Reaktivierungssequenz starten', zeit: 'Automatisch', system: 'n8n + Zoho', prio: 'P2' },
  { trigger: 'Gap-Score > 7 (hoch)', aktion: 'Automatisch Upsell triggern', zeit: 'Sofort', system: 'Zoho Workflow', prio: 'P2' },
  { trigger: '90 Tage nach Analyse', aktion: 'Wirkungsmessung anstossen', zeit: 'Tag 90', system: 'n8n + Fragebogen', prio: 'P1' },
  { trigger: '180 Tage ohne Kontakt', aktion: 'Reaktivierungs-E-Mail-Sequenz', zeit: 'Automatisch', system: 'n8n + E-Mail', prio: 'P3' },
]

const personas = [
  { id: 'P01', name: 'Marco', beschreibung: 'Single Unit, 3 MA, datenorientiert', einstieg: 'SpeedUp360', upsell: 'Coaching > Campus', conversion: '~70%', typischAngebot: '5.000 EUR Coaching + 299 EUR/Mo Campus' },
  { id: 'P02', name: 'Nina', beschreibung: '8 MA, Wachstums-Saloninhaberin', einstieg: 'SpeedUp360 / Coaching', upsell: 'Campus > SalonOS', conversion: '~60%', typischAngebot: '699 EUR/Mo + 5.000 EUR Coaching' },
  { id: 'P03', name: 'Sarah', beschreibung: '22 MA, Multi-Location', einstieg: 'Master-Begleitung', upsell: 'SalonOS > Multi-Standort', conversion: '~55%', typischAngebot: '399 EUR/Mo Master (12 Mo) + 8.000 EUR Coaching' },
  { id: 'P04', name: 'Elena', beschreibung: '5 MA, Premium-Positionierung', einstieg: 'Premium Markenarchitektur', upsell: 'Campus > Community', conversion: '~75%', typischAngebot: '7.000 EUR Positionierung + 599 EUR/Mo Campus' },
  { id: 'P05', name: 'Heike', beschreibung: '6 MA, Overwhelmed/Burnout-Risiko', einstieg: 'SpeedUp360', upsell: 'Coaching > Entlastungs-Modul', conversion: '~65%', typischAngebot: '5.500 EUR Team-Coaching + 3x 299 EUR/Mo Campus' },
  { id: 'P06', name: 'Thorsten', beschreibung: '4 MA, Preis-Optimierung', einstieg: 'Campus (Preislisten)', upsell: 'SpeedUp360 > Coaching', conversion: '~50%', typischAngebot: '299 EUR/Mo Campus > SpeedUp360' },
]

const rollen = [
  { rolle: 'Trainer/Field Consultant', person: 'Tobias (+ Joern/Dominik)', aufgabe: 'Vor-Ort-Analyse, Datenerhebung, Voice-Notizen, Bericht-Review' },
  { rolle: 'Digital Analyst', person: 'KI-Agents + Berater', aufgabe: 'Datenauswertung, Benchmark, Scoring, Berichterstellung' },
  { rolle: 'Senior Consultant', person: 'Joern / Dominik', aufgabe: 'Massnahmenplan, Abschlussgespraech, QA bei Gate < 4' },
  { rolle: 'Customer Success', person: 'Lea / Simone', aufgabe: 'Follow-up Calls, Umsetzungsbegleitung, Blockaden loesen' },
  { rolle: 'Sales / Closer', person: 'Joern', aufgabe: 'Upsell-Angebot, Vertragsabschluss, Pipeline-Management' },
  { rolle: 'PM Revenue', person: 'Katrin', aufgabe: 'Kapazitaetsplanung, Accountable fuer Delivery-Qualitaet' },
  { rolle: 'Finance', person: 'Nadja', aufgabe: 'Vertrag, Rechnungsstellung, AVV-Koordination' },
  { rolle: 'Automation Manager', person: 'Mo + Gabriel', aufgabe: 'n8n Workflows, KI-Agents, Systemintegration' },
]

/* ───────────────────────── COMPONENTS ───────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'P1': 'bg-red-100 text-red-800 border-red-200',
    'P2': 'bg-amber-100 text-amber-800 border-amber-200',
    'P3': 'bg-green-100 text-green-800 border-green-200',
  }
  return <span className={`px-2 py-0.5 text-xs font-medium rounded border ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function ScoreRing({ label, score, max = 10 }: { label: string; score: number; max?: number }) {
  const pct = (score / max) * 100
  const color = pct >= 70 ? 'text-emerald-500' : pct >= 40 ? 'text-amber-500' : 'text-red-500'
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${pct}, 100`} className={color} strokeLinecap="round" />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${color}`}>{score}</span>
      </div>
      <span className="text-[11px] text-gray-500 text-center leading-tight">{label}</span>
    </div>
  )
}

function ProcessStep({ step, isLast }: { step: typeof kernprozessSchritte[0]; isLast: boolean }) {
  const Icon = step.icon
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className={`${step.color} text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold shrink-0`}>
          {step.nr}
        </div>
        {!isLast && <div className="w-0.5 h-8 bg-gray-200 mt-1" />}
      </div>
      <div className="pb-6">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-gray-900 text-sm">{step.name}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
      </div>
    </div>
  )
}

/* ───────────────────── TAB 1: KONZEPTLOGIK ───────────────────── */

function KonzeptTab() {
  const exampleScores = [7, 5, 8, 4, 6, 3]
  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Grundidee
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 leading-relaxed">
            SpeedUp360 ist kein Analysetag. Es ist ein <strong>standardisiertes Diagnose- und Entwicklungssystem</strong>.
            Aus IST-Zustand werden klare Ziele, strukturierte Umsetzung und messbare Wirkung.
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm font-medium text-blue-800">Strategische Bedeutung</p>
            <p className="text-xs text-blue-700 mt-1">
              SpeedUp360 ist das Einstiegsprodukt und gleichzeitig der wichtigste Konversionshebel in der Value Chain.
              Es transformiert einen Lead in einen qualifizierten Beratungskunden. Conversion-Rate Erstgespraech zu Beratung steigt um ~40%.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Workflow className="w-5 h-5 text-indigo-500" />
            Der 10-Stufen Kernprozess
          </CardTitle>
          <CardDescription>Gilt identisch fuer Digital und Vor-Ort</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div>
              {kernprozessSchritte.slice(0, 5).map((s, i) => (
                <ProcessStep key={s.nr} step={s} isLast={i === 4} />
              ))}
            </div>
            <div>
              {kernprozessSchritte.slice(5).map((s, i) => (
                <ProcessStep key={s.nr} step={s} isLast={i === 4} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Die 6 Kompetenzfelder (Scoring-Dimensionen)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            {kompetenzfelder.map((kf, i) => (
              <ScoreRing key={kf.kf} label={kf.name} score={exampleScores[i]} />
            ))}
          </div>
          <p className="text-xs text-center text-gray-400 mb-4 italic">Beispiel-Visualisierung eines Salons</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {kompetenzfelder.map(kf => (
              <div key={kf.kf} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px]">{kf.kf}</Badge>
                  <span className="text-sm font-medium">{kf.name}</span>
                </div>
                <p className="text-xs text-gray-500">{kf.fragen}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-500" />
            Standard-Output fuer den Kunden
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: 'Scorecard', desc: '6 KF-Scores (1-10), Ampellogik, Radar-Chart, Gesamt-Reifegrad', icon: 'chart' },
              { name: 'Soll-Profil', desc: 'Zielwerte: Bon, Rebooking, Zusatzverkauf, Auslastung, Bewertung, Minutenpreis', icon: 'target' },
              { name: 'Gap-Analyse', desc: 'Groesste Luecken, groesste Chancen, Prioritaet A/B/C, gewichteter Gap-Score', icon: 'gap' },
              { name: 'Massnahmenplan', desc: 'Top 3 Hebel, konkrete Umsetzung, Verantwortliche, Zeitrahmen, KPIs', icon: 'plan' },
              { name: 'Systemaufbau', desc: 'SOPs (Beratungsleitfaden), Automationen (Follow-up), KPIs (Tagesbon), Standards', icon: 'system' },
              { name: 'Entwicklungsfahrplan', desc: '30-60-90 Tage Timeline mit Meilensteinen und Kontrollpunkten', icon: 'timeline' },
            ].map(item => (
              <div key={item.name} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                <span className="font-medium text-sm">{item.name}</span>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-500" />
            Rollen im System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Rolle</TableHead>
                <TableHead className="text-xs">Person</TableHead>
                <TableHead className="text-xs">Aufgabe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rollen.map(r => (
                <TableRow key={r.rolle}>
                  <TableCell className="font-medium text-xs">{r.rolle}</TableCell>
                  <TableCell className="text-xs">{r.person}</TableCell>
                  <TableCell className="text-xs text-gray-500">{r.aufgabe}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-amber-400 bg-amber-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Einfache Erklaerung fuer Trainer</CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="text-sm italic text-gray-700 border-l-2 border-amber-300 pl-3">
            "Wir schauen nicht nur, was schlecht laeuft. Wir definieren, wo der Salon hin muss,
            bauen ein System dafuer und sorgen dafuer, dass es umgesetzt wird."
          </blockquote>
        </CardContent>
      </Card>
    </div>
  )
}

/* ───────────────────── TAB 2: PRODUKTVARIANTEN ───────────────────── */

function ProdukteTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-t-4 border-t-emerald-500">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-emerald-500" />
              <CardTitle className="text-lg">SpeedUp360 Digital</CardTitle>
            </div>
            <CardDescription>100% remote, skalierbar, datengetrieben</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-emerald-50 rounded">
                <div className="text-2xl font-bold text-emerald-600">990 EUR</div>
                <div className="text-[10px] text-gray-500">Einmalig</div>
              </div>
              <div className="text-center p-2 bg-emerald-50 rounded">
                <div className="text-2xl font-bold text-emerald-600">3-4h</div>
                <div className="text-[10px] text-gray-500">Berater-Aufwand</div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700">Analyse erfolgt durch:</p>
              {[
                'Online-Fragebogen (Salon + Team)',
                'KPI-Upload (BWA, Umsatz, Bon, Auslastung)',
                'Social Media + Google Analyse',
                'CRM-/Terminlogik (wenn vorhanden)',
                'Kassendaten-Extraktion (CSV/PDF via OCR)',
                'Optional: Videoeinsendung Beratungssituation',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-gray-600">{item}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-gray-700">5-Phasen-Prozess:</p>
              {[
                { phase: '1. Onboarding', dauer: '15 Min (Berater)', detail: 'E-Mail, Upload-Link, AVV, Termin' },
                { phase: '2. Datenerfassung', dauer: '0 Min (Berater)', detail: 'Kassendaten-Upload, OCR-Extraktion' },
                { phase: '3. Fragebogen', dauer: '0 Min (Berater)', detail: 'Harte Fakten + Weiche Faktoren' },
                { phase: '4. KI-Analyse', dauer: '30-45 Min', detail: 'Scoring, Benchmark, Bericht-Review' },
                { phase: '5. Abschlussgespraech', dauer: '90-120 Min', detail: 'Video-Call mit Ergebnispraesentation' },
              ].map(p => (
                <div key={p.phase} className="flex items-center gap-2 text-xs">
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                  <span className="font-medium w-36">{p.phase}</span>
                  <Badge variant="outline" className="text-[10px]">{p.dauer}</Badge>
                </div>
              ))}
            </div>
            <Separator />
            <div className="p-2 bg-gray-50 rounded text-xs space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Kapazitaet/Monat</span><span className="font-medium">25-35 Analysen</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Reichweite</span><span className="font-medium">DE + AT + CH</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Reisekosten</span><span className="font-medium text-emerald-600">0 EUR</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Interne Kosten</span><span className="font-medium">~550 EUR</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Deckungsbeitrag</span><span className="font-bold text-emerald-600">~440 EUR (+ Upsell)</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Upsell-Conversion</span><span className="font-medium">~50%</span></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">SpeedUp360 Vor-Ort</CardTitle>
            </div>
            <CardDescription>Intensiv, emotionaler Impact, direkter Eingriff</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">2.500 EUR</div>
                <div className="text-[10px] text-gray-500">Einmalig</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">1.5-2d</div>
                <div className="text-[10px] text-gray-500">Gesamtaufwand</div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700">Analyse erfolgt durch:</p>
              {[
                'Live-Beobachtung im Salon (6h Kernleistung)',
                'Leitfaden-Interview mit Inhaber (45 Min)',
                'Kundenfluss & Rezeption beobachten',
                'Beratungsgespraeche live analysieren',
                'Ablaeufe & Zeitstruktur pruefen',
                'BWA + Kassendaten vor Ort sichten',
                'Team-Dynamik & Atmosphaere erfassen',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-gray-600">{item}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-gray-700">6-Stunden-Struktur (Vor-Ort):</p>
              {[
                { phase: 'Stunde 1', detail: 'Salon-Rundgang, Team kennenlernen' },
                { phase: 'Stunde 2', detail: 'Interview Inhaber: Ziele, Probleme, Vision' },
                { phase: 'Stunde 3', detail: 'KF1-3: Positionierung, Service, Sichtbarkeit' },
                { phase: 'Stunde 4', detail: 'KF4-6: Fuehrung, Wirtschaft, Systeme' },
                { phase: 'Stunde 5', detail: 'Kassendaten, Preislisten, BWA-Analyse' },
                { phase: 'Stunde 6', detail: 'Zusammenfassung, Quick-Wins' },
              ].map(p => (
                <div key={p.phase} className="flex items-center gap-2 text-xs">
                  <ChevronRight className="w-3 h-3 text-blue-400" />
                  <span className="font-medium w-20">{p.phase}</span>
                  <span className="text-gray-500">{p.detail}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="p-2 bg-gray-50 rounded text-xs space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Kapazitaet/Monat</span><span className="font-medium">~12 Analysen/Person</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Reichweite</span><span className="font-medium">~200km Radius</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Reisekosten</span><span className="font-medium text-red-500">150-300 EUR</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Interne Kosten</span><span className="font-medium">~1.000 EUR</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Deckungsbeitrag</span><span className="font-bold text-blue-600">~1.500 EUR (+ Upsell)</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Upsell-Conversion</span><span className="font-medium">~60%</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-l-4 border-l-violet-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-violet-500" />
            Identischer Output beider Varianten
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-600">
            Unabhaengig von der Durchfuehrungsvariante erhaelt jeder Kunde denselben hochwertigen Output:
            Scorecard, Soll-Profil, Gap-Analyse, Massnahmenplan, Systemaufbau-Empfehlung und 30-60-90-Tage Entwicklungsfahrplan.
            Der PDF-Analysebericht (20-30 Seiten) wird vom SpeedUp360 KI-Agent generiert und vom Berater geprueft.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Entscheidungslogik: Digital oder Vor-Ort?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { wenn: 'Single Location, einfache Daten, < 50km', dann: 'Vor-Ort', grund: 'Hoeheres Rapport, Umfeldbeobachtung' },
              { wenn: 'Multi-Location, > 200km, komplexe Koordination', dann: 'Digital', grund: 'Effizienter, fokussierter' },
              { wenn: 'Hohe Sensibilitaet, schnelle Umsetzung gewuenscht', dann: 'Digital', grund: 'Schnellerer Start moeglich' },
              { wenn: 'Erste Beziehung, tiefes Vertrauen noetig', dann: 'Vor-Ort', grund: 'Persoenlich, hoehere Conversion' },
            ].map((item, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Wenn: {item.wenn}</p>
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" />
                  <Badge className={item.dann === 'Digital' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}>
                    {item.dann}
                  </Badge>
                  <span className="text-xs text-gray-400">({item.grund})</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Persona-Zuordnung & Upsell-Pfade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Persona</TableHead>
                  <TableHead className="text-xs">Profil</TableHead>
                  <TableHead className="text-xs">Einstieg</TableHead>
                  <TableHead className="text-xs">Upsell-Pfad</TableHead>
                  <TableHead className="text-xs">Conversion</TableHead>
                  <TableHead className="text-xs">Typ. Angebot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personas.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="text-xs font-medium">{p.id} {p.name}</TableCell>
                    <TableCell className="text-xs text-gray-500">{p.beschreibung}</TableCell>
                    <TableCell className="text-xs">{p.einstieg}</TableCell>
                    <TableCell className="text-xs">{p.upsell}</TableCell>
                    <TableCell className="text-xs font-medium">{p.conversion}</TableCell>
                    <TableCell className="text-xs text-gray-500">{p.typischAngebot}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Euro className="w-5 h-5 text-green-500" />
            Revenue-Szenarien (Digital)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Szenario</TableHead>
                <TableHead className="text-xs">Einsaetze/Mo</TableHead>
                <TableHead className="text-xs">Preis</TableHead>
                <TableHead className="text-xs">Umsatz/Mo</TableHead>
                <TableHead className="text-xs">Umsatz/Jahr</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { sz: 'Konservativ (MVP)', einsaetze: '5', preis: '1.800 EUR', monat: '9.000 EUR', jahr: '~108.000 EUR' },
                { sz: 'Realistisch (ab M4)', einsaetze: '15', preis: '1.600 EUR', monat: '24.000 EUR', jahr: '~288.000 EUR' },
                { sz: 'Optimistisch (ab M8)', einsaetze: '30', preis: '1.500 EUR', monat: '45.000 EUR', jahr: '~540.000 EUR' },
                { sz: 'Mit Wella B2B', einsaetze: '50+', preis: '800-1.200 EUR', monat: '40-60k EUR', jahr: '500-720k EUR' },
              ].map(s => (
                <TableRow key={s.sz}>
                  <TableCell className="text-xs font-medium">{s.sz}</TableCell>
                  <TableCell className="text-xs">{s.einsaetze}</TableCell>
                  <TableCell className="text-xs">{s.preis}</TableCell>
                  <TableCell className="text-xs font-medium">{s.monat}</TableCell>
                  <TableCell className="text-xs font-bold text-green-600">{s.jahr}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

/* ───────────────────── TAB 3: CRM-STRUKTUR ───────────────────── */

function CRMTab() {
  const sections = [
    { key: 'stammdaten', label: 'Stammdaten', icon: Building2, data: crmFelder.stammdaten.map(f => ({ feld: f.feld, typ: f.typ, info: f.pflicht ? 'Pflichtfeld' : 'Optional' })) },
    { key: 'scores', label: 'Score-Felder (1-10)', icon: Gauge, data: crmFelder.scores.map(f => ({ feld: f.feld, typ: f.typ, info: f.auto ? 'Auto-Berechnung' : 'Manuelle Eingabe' })) },
    { key: 'sollFelder', label: 'Soll-Felder (Zielwerte)', icon: Target, data: crmFelder.sollFelder.map(f => ({ feld: f.feld, typ: f.typ, info: f.quelle })) },
    { key: 'gap', label: 'Gap-Logik (automatisch)', icon: Activity, data: crmFelder.gap.map(f => ({ feld: f.feld, typ: f.typ, info: f.auto ? 'Auto-Berechnung' : '' })) },
    { key: 'massnahmen', label: 'Massnahmen', icon: ClipboardList, data: crmFelder.massnahmen.map(f => ({ feld: f.feld, typ: f.typ, info: '' })) },
    { key: 'system', label: 'Systemstatus', icon: Shield, data: crmFelder.system.map(f => ({ feld: f.feld, typ: f.typ, info: f.trigger })) },
    { key: 'followup', label: 'Follow-up', icon: Clock, data: crmFelder.followup.map(f => ({ feld: f.feld, typ: f.typ, info: '' })) },
    { key: 'upsell', label: 'Upsell', icon: ShoppingCart, data: crmFelder.upsell.map(f => ({ feld: f.feld, typ: f.typ, info: (f as any).auto ? 'Auto-Berechnung' : '' })) },
    { key: 'wirkung', label: 'Wirkungsmessung', icon: TrendingUp, data: crmFelder.wirkung.map(f => ({ feld: f.feld, typ: f.typ, info: (f as any).auto ? 'Auto-Berechnung' : '' })) },
    { key: 'reaktivierung', label: 'Reaktivierung', icon: Bell, data: crmFelder.reaktivierung.map(f => ({ feld: f.feld, typ: f.typ, info: (f as any).auto ? 'Auto-Berechnung' : '' })) },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-500" />
            Zoho CRM Modul: SpeedUp360 Analyse
          </CardTitle>
          <CardDescription>Alle Felder, Typen und Automatisierungen — Zoho-ready</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {sections.map(s => (
              <Badge key={s.key} variant="outline" className="text-xs">{s.data.length} Felder: {s.label}</Badge>
            ))}
            <Badge className="bg-orange-100 text-orange-800 text-xs">
              Gesamt: {sections.reduce((sum, s) => sum + s.data.length, 0)} Felder
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Accordion type="multiple" defaultValue={['stammdaten', 'scores']}>
        {sections.map(section => {
          const Icon = section.icon
          return (
            <AccordionItem key={section.key} value={section.key}>
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  {section.label}
                  <Badge variant="outline" className="text-[10px] ml-2">{section.data.length}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Feldname</TableHead>
                      <TableHead className="text-xs">Typ</TableHead>
                      <TableHead className="text-xs">Info</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {section.data.map((f, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs font-medium">{f.feld}</TableCell>
                        <TableCell className="text-xs"><code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">{f.typ}</code></TableCell>
                        <TableCell className="text-xs text-gray-500">{f.info}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="w-5 h-5 text-red-500" />
            Automationen (Zoho + n8n)
          </CardTitle>
          <CardDescription>Kritische Workflows fuer den SpeedUp360 Lifecycle</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Prio</TableHead>
                <TableHead className="text-xs">Trigger</TableHead>
                <TableHead className="text-xs">Aktion</TableHead>
                <TableHead className="text-xs">Timing</TableHead>
                <TableHead className="text-xs">System</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automationen.map((a, i) => (
                <TableRow key={i}>
                  <TableCell><StatusBadge status={a.prio} /></TableCell>
                  <TableCell className="text-xs">{a.trigger}</TableCell>
                  <TableCell className="text-xs font-medium">{a.aktion}</TableCell>
                  <TableCell className="text-xs">{a.zeit}</TableCell>
                  <TableCell className="text-xs text-gray-500">{a.system}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

/* ───────────────────── TAB 4: PROZESSLOGIK ───────────────────── */

function ProzessTab() {
  const teilprozesse = [
    {
      tp: 'TP1', name: 'Vorbereitung', dauer: '1-2h',
      responsible: 'Tobias', accountable: 'Katrin',
      schritte: [
        'Daten-Review: Alle Salon-Daten durcharbeiten (Stammdata, Umsatztrends, Teamstruktur)',
        'Analyse-Framework: SpeedUp360 Agent erstellt Analyse-Basis auf Persona',
        'BWA-Vorbereitung: BWA Agent wertet Jahresabschluesse aus',
        'Reiselogistik (Vor-Ort) / Zoom-Setup (Digital)',
        'Materialien: 6-KF-Scoring-Bogen, Preislisten-Template, Interview-Leitfaden',
      ],
      handoff: 'Dokumentenordner, Agenda, Analyse-Checkliste',
    },
    {
      tp: 'TP2', name: 'Analyse (Kernleistung)', dauer: '6h (Vor-Ort) / 4h (Digital)',
      responsible: 'Tobias', accountable: 'Joern/Dominik',
      schritte: [
        'Stunde 1: Salon-Rundgang, Team kennenlernen, Atmosphaere',
        'Stunde 2: Inhaber-Interview (Ziele, Probleme, Geschichte, Vision)',
        'Stunde 3: KF1-3 Analyse (Positionierung, Service, Sichtbarkeit)',
        'Stunde 4: KF4-6 Analyse (Fuehrung, Wirtschaft, Systeme)',
        'Stunde 5: Kassendaten-Review, Preislisten, BWA-Tiefenanalyse',
        'Stunde 6: Zusammenfassung, Quick-Wins identifizieren',
      ],
      handoff: 'Rohnotizen, Voice-Memos, Datenausdrucke, Fotos',
    },
    {
      tp: 'TP3', name: 'Berichterstellung', dauer: '45min KI + 30min Review',
      responsible: 'KI-Agents', accountable: 'Tobias',
      schritte: [
        'Voice-Einsprache: Stichpunkte/Erkenntnisse per Voice-Memo',
        'SpeedUp360 Agent: 6-KF-Scoring, Gap-Analyse, Radar-Chart, Top-3-Hebel',
        'BWA Agent: Kennzahlen-Ampel, Trends, Benchmarking',
        'Preiskalkulation Agent: IST vs. SOLL Minutenpreis, Break-Even',
        'Positionierungs-Agent: Markenklarheits-Score, USP-Vorschlag',
        'Berater-Review (30 Min): Korrigieren, Kontext ergaenzen, freigeben',
        'DocGen: PDF im Salonimpuls-Corporate-Design (20-25 Seiten)',
      ],
      handoff: 'Finaler PDF-Bericht + Gespraechs-Agenda',
    },
    {
      tp: 'TP4', name: 'Massnahmenplan', dauer: '1h',
      responsible: 'Joern/Dominik', accountable: 'Katrin',
      schritte: [
        'Top-3-Massnahmen aus Bericht auswaehlen (Impact x Machbarkeit)',
        'Verantwortungsmatrix: Was macht Salon? Was Salonimpuls? Was extern?',
        'Realitaetscheck: Kann dieser Salon das umsetzen? Ressourcen?',
        'KPI-Definition: Finanzielle + Operative + Qualitative KPIs',
        '90-Tage-Plan mit Meilensteinen (Woche 1-4, 5-8, 9-12)',
      ],
      handoff: 'Massnahmenplan-Dokument mit Timeline + KPIs',
    },
    {
      tp: 'TP5', name: 'Abschlussgespraech', dauer: '90-120 Min',
      responsible: 'Joern/Dominik (Gate < 4) oder Tobias (Gate 4+)', accountable: 'Katrin',
      schritte: [
        'Einstieg (10 Min): Rapport aufbauen, Bericht NICHT vorab zeigen',
        'Analyse-Praesentation (25 Min): Kennzahlen, Benchmark, Radar-Chart',
        'Ziele & Vision (20 Min): "Was wollen Sie wirklich erreichen?"',
        'Machbarkeit (15 Min): Realistisch vs. ambitioniert vs. unrealistisch',
        'Massnahmenplan (20 Min): Top 3-5 gemeinsam priorisieren',
        'Umsetzungsbegleitung (10 Min): Passendes SI-Paket empfehlen',
      ],
      handoff: 'Commitment des Salons + ggf. Kaufentscheidung',
    },
    {
      tp: 'TP6', name: 'Folgeangebot & Uebergabe', dauer: '30 Min',
      responsible: 'Joern/Dominik', accountable: 'Katrin + Nadja',
      schritte: [
        'Produkt-Logik: Quick Fix (1-2 KF) = Coaching / Breite Transformation (3+) = Campus+Coaching / Langfristig = Master',
        'Angebot erstellen basierend auf Massnahmenplan',
        'Bei "Ja": Uebergabe Finance (Vertrag) + Delivery (Kickoff)',
        'Bei "Noch nicht": Campus-Funnel, 30-Tage Follow-up',
      ],
      handoff: 'Vertrag oder Follow-up-Pipeline',
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-teal-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-teal-500" />
            6 Teilprozesse — SpeedUp360 Delivery
          </CardTitle>
          <CardDescription>
            Gesamtaufwand: Vor-Ort 12-16h (1.5-2 Tage) / Digital ~3-4h
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="multiple" defaultValue={['TP1', 'TP2']}>
        {teilprozesse.map(tp => (
          <AccordionItem key={tp.tp} value={tp.tp}>
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-3">
                <Badge className="bg-teal-100 text-teal-800 text-xs">{tp.tp}</Badge>
                <span className="font-medium">{tp.name}</span>
                <Badge variant="outline" className="text-[10px]">{tp.dauer}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pl-2">
                <div className="flex gap-4 text-xs">
                  <span className="text-gray-500">Responsible: <strong className="text-gray-700">{tp.responsible}</strong></span>
                  <span className="text-gray-500">Accountable: <strong className="text-gray-700">{tp.accountable}</strong></span>
                </div>
                <div className="space-y-1.5">
                  {tp.schritte.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-xs text-gray-600">{s}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 p-2 bg-teal-50 rounded text-xs">
                  <span className="font-medium text-teal-700">Handoff:</span>{' '}
                  <span className="text-teal-600">{tp.handoff}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            Follow-up & Automations-Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { tag: 'Tag 0', aktion: 'Analyse abgeschlossen', detail: 'PDF + E-Mail + Angebot automatisch', color: 'bg-green-500' },
              { tag: 'Tag 3-5', aktion: 'Follow-up Call (CS)', detail: 'Lea/Simone: 15 Min Fragen zum Angebot', color: 'bg-blue-500' },
              { tag: 'Tag 14', aktion: 'Reminder + WhatsApp Impuls', detail: 'Automatisch: Wie laeuft die Umsetzung?', color: 'bg-amber-500' },
              { tag: 'Tag 30', aktion: 'Follow-up Termin', detail: 'Automatisch gebucht, Umsetzungsstatus pruefen', color: 'bg-purple-500' },
              { tag: 'Tag 60', aktion: 'Zwischenmessung', detail: 'Erste KPI-Veraenderungen erfassen', color: 'bg-indigo-500' },
              { tag: 'Tag 90', aktion: 'Wirkungsmessung', detail: 'Bon/Rebooking/Umsatz vorher vs. nachher', color: 'bg-teal-500' },
              { tag: 'Tag 180+', aktion: 'Reaktivierung', detail: 'Bei Inaktivitaet: E-Mail-Sequenz starten', color: 'bg-red-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`${item.color} text-white rounded px-2 py-1 text-xs font-mono w-20 text-center shrink-0`}>
                  {item.tag}
                </div>
                <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />
                <div>
                  <span className="text-xs font-medium">{item.aktion}</span>
                  <span className="text-xs text-gray-400 ml-2">{item.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="w-5 h-5 text-violet-500" />
            KI-Agent Pipeline (10 Stufen)
          </CardTitle>
          <CardDescription>SpeedUp360 Agent orchestriert die komplette Diagnose-Pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[
              { nr: 1, name: 'Multi-Channel-Eingang', sys: 'E-Mail/WA/Upload' },
              { nr: 2, name: 'Kundenzuordnung', sys: '3-Stufen Match' },
              { nr: 3, name: 'OCR', sys: 'Surya' },
              { nr: 4, name: 'Klassifikation', sys: 'Qwen 4B' },
              { nr: 5, name: 'Extraktion', sys: 'Qwen 30B / Claude' },
              { nr: 6, name: 'Vollstaendigkeit', sys: 'Regelwerk' },
              { nr: 7, name: 'Zusammenfuehrung', sys: 'Supabase' },
              { nr: 8, name: 'Benchmark', sys: 'pgvector' },
              { nr: 9, name: 'Scoring', sys: 'Claude + Regeln' },
              { nr: 10, name: 'Bericht', sys: 'DocGen PDF' },
            ].map(s => (
              <div key={s.nr} className="p-2 border rounded text-center">
                <div className="text-lg font-bold text-violet-500">{s.nr}</div>
                <div className="text-[10px] font-medium">{s.name}</div>
                <div className="text-[9px] text-gray-400">{s.sys}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-orange-500" />
            Gate-Modell: Tobias Qualifizierung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { gate: 0, name: 'Nachfolger fuer Preislisten', bedingung: 'Tobias kann erst loslassen wenn Nachfolger eigenstaendig', status: 'SOFORT' },
              { gate: 1, name: '5-Schichten-Modell lernen', bedingung: 'Kann Analyse interpretieren und erklaeren', status: 'M1-M2' },
              { gate: 2, name: '3 Gespraeche beobachten', bedingung: 'Versteht Struktur, kennt Einwaende', status: 'M2-M3' },
              { gate: 3, name: 'Eigenstaendig mit stiller Begleitung', bedingung: 'Gespraechsfuehrung eigenstaendig, J/D greift nur bei Kritischem ein', status: 'M3-M4' },
              { gate: 4, name: 'Vollstaendig eigenstaendig', bedingung: 'Kundenzufriedenheit >= 4.2/5, Bericht-Qualitaet >= Standard', status: 'Ab M4' },
            ].map(g => (
              <div key={g.gate} className="flex items-center gap-3 p-2 rounded border">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-sm font-bold shrink-0">
                  G{g.gate}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium">{g.name}</span>
                  <p className="text-[10px] text-gray-400">{g.bedingung}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">{g.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ───────────────────── TAB 5: ABLAUFPLAN (SWIMLANE) ───────────────────── */

const swimlaneRollen = [
  { id: 'tobias', name: 'Tobias', rolle: 'Trainer / Field Consultant', color: 'bg-blue-500', lightBg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  { id: 'joern', name: 'Joern / Dominik', rolle: 'Senior Consultant / Sales', color: 'bg-violet-500', lightBg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
  { id: 'ki', name: 'KI-Agents', rolle: 'Automatisierte Analyse', color: 'bg-emerald-500', lightBg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  { id: 'katrin', name: 'Katrin', rolle: 'PM Revenue', color: 'bg-amber-500', lightBg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  { id: 'cs', name: 'Lea / Simone', rolle: 'Customer Success', color: 'bg-pink-500', lightBg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
  { id: 'nadja', name: 'Nadja', rolle: 'Finance', color: 'bg-slate-500', lightBg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' },
  { id: 'mo', name: 'Mo + Gabriel', rolle: 'Automation Manager', color: 'bg-cyan-500', lightBg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700' },
  { id: 'auto', name: 'n8n / System', rolle: 'Automatisierung', color: 'bg-gray-500', lightBg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' },
]

type ProzessSchritt = {
  id: string
  tp: string
  phase: string
  wer: string
  was: string
  wo: string
  dauer: string
  details: string
  handoff?: string
  tagLabel: string
  digital: boolean
  vorOrt: boolean
  digitalVariante?: string
}

const prozessSchritte: ProzessSchritt[] = [
  // TP1: Vorbereitung
  { id: 'v1', tp: 'TP1', phase: 'Vorbereitung', wer: 'katrin', was: 'Lead qualifizieren & Produkt zuordnen', wo: 'Zoho CRM', dauer: '15 Min', details: 'Persona-Zuordnung (P01-P06), Digital oder Vor-Ort entscheiden, Trainer zuweisen', tagLabel: 'Tag -7', digital: true, vorOrt: true },
  { id: 'v2', tp: 'TP1', phase: 'Vorbereitung', wer: 'auto', was: 'Buchungsbestaetigung & AVV senden', wo: 'n8n + E-Mail', dauer: 'Automatisch', details: 'AVV nach Art. 28 DSGVO, Terminbestaetigung, Upload-Link (Digital) oder Reiseinfos (Vor-Ort)', tagLabel: 'Tag -7', digital: true, vorOrt: true },
  { id: 'v3', tp: 'TP1', phase: 'Vorbereitung', wer: 'nadja', was: 'Vertrag & AVV pruefen', wo: 'E-Mail / Zoho', dauer: '15 Min', details: 'AVV-Ruecklauf kontrollieren, Rechnung vorbereiten', tagLabel: 'Tag -5', digital: true, vorOrt: true },
  { id: 'v4', tp: 'TP1', phase: 'Vorbereitung', wer: 'auto', was: 'Fragebogen an Salon senden', wo: 'n8n + Typeform', dauer: 'Automatisch', details: 'Harte Fakten (~15 Min) + Weiche Faktoren (~20 Min) — Salon fuellt selbst aus', tagLabel: 'Tag -5', digital: true, vorOrt: true },
  { id: 'v5', tp: 'TP1', phase: 'Vorbereitung', wer: 'ki', was: 'Salon-Daten vorab analysieren', wo: 'Supabase + KI', dauer: '15 Min auto', details: 'Stammdata-Review, Umsatztrends, Teamstruktur, Fragebogen-Auswertung', tagLabel: 'Tag -2', digital: true, vorOrt: true },
  { id: 'v6', tp: 'TP1', phase: 'Vorbereitung', wer: 'tobias', was: 'Analyse-Framework vorbereiten', wo: 'Notion / Templates', dauer: '30-60 Min', details: 'SpeedUp360 Agent Analyse-Basis, 6-KF-Scoring-Bogen, Interview-Leitfaden, Materialien checken', tagLabel: 'Tag -1', digital: true, vorOrt: true, digitalVariante: 'Zoom-Link erstellen, Daten pruefen' },
  { id: 'v6b', tp: 'TP1', phase: 'Vorbereitung', wer: 'tobias', was: 'Reiselogistik planen', wo: 'Vor Ort', dauer: '15 Min', details: 'Anfahrt, Hotel falls noetig, Zeitplanung 6h-Block', tagLabel: 'Tag -1', digital: false, vorOrt: true },

  // TP2: Analyse (Kernleistung)
  { id: 'a1', tp: 'TP2', phase: 'Analyse', wer: 'tobias', was: 'Salon-Rundgang & Team kennenlernen', wo: 'Im Salon', dauer: '60 Min', details: 'Erste Eindruecke, Atmosphaere-Notizen, Teamdynamik beobachten, Small Talk', tagLabel: 'Tag 0 — Std. 1', digital: false, vorOrt: true },
  { id: 'a1d', tp: 'TP2', phase: 'Analyse', wer: 'ki', was: 'Kassendaten automatisch auswerten', wo: 'KI-Pipeline', dauer: '30 Min auto', details: 'OCR-Extraktion aus CSV/PDF, Klassifikation (BWA/Preisliste/MA), Daten in Supabase', tagLabel: 'Tag 0', digital: true, vorOrt: false },
  { id: 'a2', tp: 'TP2', phase: 'Analyse', wer: 'tobias', was: 'Interview Inhaber', wo: 'Im Salon / Zoom', dauer: '45-60 Min', details: 'Leitfaden-Interview: Ziele, Probleme, Geschichte, Vision. Pain Points identifizieren', tagLabel: 'Tag 0 — Std. 2', digital: true, vorOrt: true, digitalVariante: 'Video-Call statt vor Ort' },
  { id: 'a3', tp: 'TP2', phase: 'Analyse', wer: 'tobias', was: 'KF1-3 Analyse (Strategie, Marketing, Kunden)', wo: 'Im Salon / Zoom', dauer: '60 Min', details: 'Positionierungs-Clarity pruefen, Social Media & Google checken, Service-Gaps identifizieren', tagLabel: 'Tag 0 — Std. 3', digital: true, vorOrt: true, digitalVariante: 'Datenbasiert statt Beobachtung' },
  { id: 'a4', tp: 'TP2', phase: 'Analyse', wer: 'tobias', was: 'KF4-6 Analyse (Fuehrung, Wirtschaft, Prozesse)', wo: 'Im Salon / Zoom', dauer: '60 Min', details: 'Delegations-Gaps, Personalquote, Prozess-Walkthrough, BWA-Tiefenanalyse', tagLabel: 'Tag 0 — Std. 4', digital: true, vorOrt: true, digitalVariante: 'BWA + KPI-Upload auswerten' },
  { id: 'a5', tp: 'TP2', phase: 'Analyse', wer: 'tobias', was: 'Kassendaten-Review & Preisanalyse', wo: 'Im Salon', dauer: '60 Min', details: 'IST-Minutenpreis berechnen, Preisstruktur-Gaps, Rechencheck mit BWA', tagLabel: 'Tag 0 — Std. 5', digital: false, vorOrt: true },
  { id: 'a6', tp: 'TP2', phase: 'Analyse', wer: 'tobias', was: 'Zusammenfassung & Quick-Wins teilen', wo: 'Im Salon', dauer: '60 Min', details: 'Erste Erkenntnisse praesentieren, Fragen beantworten, Erwartungen fuer Bericht setzen', tagLabel: 'Tag 0 — Std. 6', digital: false, vorOrt: true },
  { id: 'a6d', tp: 'TP2', phase: 'Analyse', wer: 'tobias', was: 'KI-Ergebnisse validieren & ergaenzen', wo: 'Dashboard', dauer: '30-45 Min', details: 'Automatische Auswertung pruefen, fehlende Daten ergaenzen, Kontext hinzufuegen', tagLabel: 'Tag 0', digital: true, vorOrt: false },

  // TP3: Berichterstellung
  { id: 'b1', tp: 'TP3', phase: 'Berichterstellung', wer: 'tobias', was: 'Voice-Einsprache / Notizen digitalisieren', wo: 'Voice-Memo / App', dauer: '15 Min', details: 'Alle Erkenntnisse, Stichpunkte, Einschaetzungen per Voice oder Text festhalten', tagLabel: 'Tag 1', digital: true, vorOrt: true, digitalVariante: 'Notizen aus Video-Call zusammenfassen' },
  { id: 'b2', tp: 'TP3', phase: 'Berichterstellung', wer: 'ki', was: 'Komplette KI-Analyse durchfuehren', wo: 'KI-Pipeline (Hetzner)', dauer: '30-45 Min auto', details: 'SpeedUp360 Agent: 6-KF-Scoring + Gap-Analyse + Radar-Chart | BWA Agent: Kennzahlen-Ampel | Preiskalkulation Agent: Minutenpreis | Positionierungs-Agent: USP', tagLabel: 'Tag 1', digital: true, vorOrt: true },
  { id: 'b3', tp: 'TP3', phase: 'Berichterstellung', wer: 'tobias', was: 'Berater-Review & Freigabe', wo: 'Dashboard', dauer: '30 Min', details: 'KI-Ergebnis korrigieren, Kontext ergaenzen, Benchmark validieren, Bericht freigeben', tagLabel: 'Tag 1-2', digital: true, vorOrt: true },
  { id: 'b4', tp: 'TP3', phase: 'Berichterstellung', wer: 'ki', was: 'PDF-Bericht generieren', wo: 'DocGen', dauer: '5 Min auto', details: 'Corporate-Design Bericht (20-25 Seiten): Radar-Chart, KF-Scores, Gap-Matrix, Massnahmenvorschlaege', tagLabel: 'Tag 2', digital: true, vorOrt: true },

  // TP4: Massnahmenplan
  { id: 'm1', tp: 'TP4', phase: 'Massnahmenplan', wer: 'joern', was: 'Top-3-Massnahmen auswählen', wo: 'Intern', dauer: '30 Min', details: 'Hoechster Impact x Machbarkeit, Verantwortungsmatrix (Salon/Salonimpuls/Extern), Realitaetscheck', tagLabel: 'Tag 2-3', digital: true, vorOrt: true },
  { id: 'm2', tp: 'TP4', phase: 'Massnahmenplan', wer: 'joern', was: 'KPI-Definition & 90-Tage-Plan erstellen', wo: 'Intern / Zoho', dauer: '30 Min', details: 'Finanzielle + operative + qualitative KPIs, Meilensteine Woche 1-4, 5-8, 9-12', tagLabel: 'Tag 3', digital: true, vorOrt: true },
  { id: 'm3', tp: 'TP4', phase: 'Massnahmenplan', wer: 'katrin', was: 'QA & Freigabe Massnahmenplan', wo: 'Intern', dauer: '15 Min', details: 'Plausibilitaet pruefen, Delivery-Kapazitaet sicherstellen', tagLabel: 'Tag 3', digital: true, vorOrt: true },

  // TP5: Abschlussgespraech
  { id: 'g1', tp: 'TP5', phase: 'Abschlussgespraech', wer: 'joern', was: 'Einstieg & Vertrauensaufbau', wo: 'Zoom / Vor-Ort', dauer: '10 Min', details: 'Persoenliche Begruessung. Bericht NICHT vorab zeigen! Rapport aufbauen, offene Atmosphaere', tagLabel: 'Tag 5-7', digital: true, vorOrt: true, digitalVariante: 'Video-Call (Zoom)' },
  { id: 'g2', tp: 'TP5', phase: 'Abschlussgespraech', wer: 'joern', was: 'Analyse-Praesentation', wo: 'Zoom / Vor-Ort', dauer: '25 Min', details: 'Screen-Sharing: Radar-Chart, Kennzahlen, Benchmark. Reaktionen des Inhabers beobachten', tagLabel: 'Tag 5-7', digital: true, vorOrt: true },
  { id: 'g3', tp: 'TP5', phase: 'Abschlussgespraech', wer: 'joern', was: 'Ziele & Vision erarbeiten', wo: 'Zoom / Vor-Ort', dauer: '20 Min', details: '"Was wollen Sie wirklich erreichen?" — 3x "Warum?" fragen. Verstehen, nicht analysieren', tagLabel: 'Tag 5-7', digital: true, vorOrt: true },
  { id: 'g4', tp: 'TP5', phase: 'Abschlussgespraech', wer: 'joern', was: 'Massnahmenplan priorisieren', wo: 'Zoom / Vor-Ort', dauer: '20 Min', details: 'Top 3-5 gemeinsam priorisieren. KI-Vorschlaege zeigen, Inhaber entscheidet', tagLabel: 'Tag 5-7', digital: true, vorOrt: true },
  { id: 'g5', tp: 'TP5', phase: 'Abschlussgespraech', wer: 'joern', was: 'Umsetzungsbegleitung empfehlen', wo: 'Zoom / Vor-Ort', dauer: '10 Min', details: 'Passendes SI-Paket authentisch empfehlen (Coaching / Campus / Master). Kein Druck!', tagLabel: 'Tag 5-7', digital: true, vorOrt: true },

  // TP6: Folgeangebot & Follow-up
  { id: 'f1', tp: 'TP6', phase: 'Folgeangebot', wer: 'auto', was: 'Bericht + Massnahmenplan per E-Mail', wo: 'n8n + E-Mail', dauer: '< 2h auto', details: 'Automatischer Versand nach Gespraechsende. PDF-Bericht + Massnahmenplan als Attachment', tagLabel: 'Tag 5-7', digital: true, vorOrt: true },
  { id: 'f2', tp: 'TP6', phase: 'Folgeangebot', wer: 'auto', was: 'Angebot automatisch generieren', wo: 'n8n + Zoho', dauer: '< 4h auto', details: 'Basierend auf Persona + Massnahmen: Quick Fix = Coaching / Breit = Campus+Coaching / Lang = Master', tagLabel: 'Tag 5-7', digital: true, vorOrt: true },
  { id: 'f3', tp: 'TP6', phase: 'Folgeangebot', wer: 'joern', was: 'Angebot finalisieren & senden', wo: 'Zoho / E-Mail', dauer: '15 Min', details: 'Automatisch generiertes Angebot pruefen, personalisieren, an Kunden senden', tagLabel: 'Tag 6-8', digital: true, vorOrt: true },
  { id: 'f4', tp: 'TP6', phase: 'Folgeangebot', wer: 'cs', was: 'Follow-up Call: Fragen zum Angebot', wo: 'Telefon', dauer: '15 Min', details: 'Lea/Simone rufen an: Bericht verstanden? Fragen? Unklarheiten zum Angebot?', tagLabel: 'Tag 8-10', digital: true, vorOrt: true },
  { id: 'f5', tp: 'TP6', phase: 'Folgeangebot', wer: 'nadja', was: 'Vertrag & Rechnung bei Zusage', wo: 'E-Mail / Zoho', dauer: '30 Min', details: 'Bei "Ja": Vertrag erstellen, Rechnung stellen, Kickoff-Termin planen', tagLabel: 'Bei Zusage', digital: true, vorOrt: true },

  // Follow-up Phase
  { id: 'fu1', tp: 'Follow-up', phase: 'Follow-up', wer: 'auto', was: 'Reminder + WhatsApp Impuls', wo: 'n8n + WA API', dauer: 'Automatisch', details: '"Wie laeuft die Umsetzung?" — Automatischer Check-in bei offenen Angeboten', tagLabel: 'Tag 14', digital: true, vorOrt: true },
  { id: 'fu2', tp: 'Follow-up', phase: 'Follow-up', wer: 'auto', was: 'Follow-up Termin automatisch buchen', wo: 'Cal.com + n8n', dauer: 'Automatisch', details: 'Automatisch gebuchter Termin: Umsetzungsstatus pruefen, Blockaden loesen', tagLabel: 'Tag 30', digital: true, vorOrt: true },
  { id: 'fu3', tp: 'Follow-up', phase: 'Follow-up', wer: 'cs', was: 'Umsetzungsbegleitung aktiv', wo: 'Telefon / Zoom', dauer: '30 Min', details: 'Lea/Simone: Was wurde umgesetzt? Wo hakt es? Braucht der Salon mehr Unterstuetzung?', tagLabel: 'Tag 30-60', digital: true, vorOrt: true },
  { id: 'fu4', tp: 'Follow-up', phase: 'Follow-up', wer: 'auto', was: 'Wirkungsmessung anstossen', wo: 'n8n + Fragebogen', dauer: 'Automatisch', details: 'Fragebogen an Salon: Bon vorher/nachher, Rebooking, Umsatz. ROI berechnen', tagLabel: 'Tag 90', digital: true, vorOrt: true },
  { id: 'fu5', tp: 'Follow-up', phase: 'Follow-up', wer: 'auto', was: 'Reaktivierung bei Inaktivitaet', wo: 'n8n + E-Mail', dauer: 'Automatisch', details: 'E-Mail-Sequenz: "Wir haben noch nicht gehoert..." — Erneute Diagnose anbieten', tagLabel: 'Tag 180+', digital: true, vorOrt: true },
]

/* Detaillierte Schritt-Beschreibungen: Ziel + Anleitung */
const schrittDetails: Record<string, { ziel: string; anleitung: string[] }> = {
  // TP1: Vorbereitung
  v1: {
    ziel: 'Sicherstellen, dass der richtige Kunde das passende Produkt bekommt und ein Trainer zugewiesen ist.',
    anleitung: [
      'Lead im Zoho CRM oeffnen und Kontaktdaten pruefen',
      'Persona-Zuordnung (P01-P06) anhand des Erstgespraeches festlegen',
      'Budget, Bereitschaft und Standort bewerten → Digital oder Vor-Ort empfehlen',
      'Trainer zuweisen (Region + Kapazitaet beachten)',
      'Status im CRM auf "Qualifiziert" setzen und Produkt-Variante eintragen',
    ]
  },
  v2: {
    ziel: 'Dem Kunden sofort alle notwendigen Unterlagen zusenden, damit der Prozess starten kann.',
    anleitung: [
      'Wird automatisch durch n8n ausgeloest sobald CRM-Status auf "Qualifiziert" steht',
      'E-Mail enthaelt: Terminbestaetigung, AVV nach Art. 28 DSGVO, Upload-Link (Digital) oder Reiseinfos (Vor-Ort)',
      'Pruefen: Wurde die E-Mail erfolgreich zugestellt? (n8n-Log checken)',
    ]
  },
  v3: {
    ziel: 'Rechtliche Absicherung — keine Datenverarbeitung ohne unterzeichnete AVV.',
    anleitung: [
      'Im E-Mail-Postfach pruefen ob die unterschriebene AVV zurueckgekommen ist',
      'Falls nicht: Erinnerung nach 2 Tagen senden',
      'AVV im CRM-Kontakt hinterlegen (Anhang)',
      'Rechnung vorbereiten und zur Freigabe bereitstellen',
    ]
  },
  v4: {
    ziel: 'Alle relevanten Salon-Daten VOR der Analyse einsammeln, damit die KI und der Berater vorbereitet sind.',
    anleitung: [
      'Wird automatisch durch n8n 5 Tage vor dem Analysetermin gesendet',
      'Fragebogen besteht aus 2 Teilen: Harte Fakten (~15 Min, z.B. Umsatz, MA-Zahl) + Weiche Faktoren (~20 Min, z.B. Fuehrungsstil)',
      'Der Salon fuellt selbst aus — kein Berater-Aufwand',
      'Bei Nicht-Ausfuellen: Automatische Erinnerung nach 2 Tagen',
    ]
  },
  v5: {
    ziel: 'Erste datenbasierte Einschaetzung des Salons erstellen, bevor der Berater aktiv wird.',
    anleitung: [
      'KI-Agent liest automatisch die eingegangenen Fragebogen-Daten aus Supabase',
      'Analysiert: Stammdata, Umsatztrends, Teamstruktur, Fragebogen-Antworten',
      'Erstellt ein Vorab-Profil mit ersten Auffaelligkeiten und Hypothesen',
      'Ergebnis steht dem Berater im Dashboard zur Verfuegung',
    ]
  },
  v6: {
    ziel: 'Der Berater ist vollstaendig vorbereitet und hat alle Materialien griffbereit.',
    anleitung: [
      'SpeedUp360 Analyse-Template in Notion oeffnen und Salon-Daten eintragen',
      '6-KF-Scoring-Bogen vorbereiten (leer oder mit KI-Vorab-Daten)',
      'Interview-Leitfaden durchgehen und salon-spezifische Fragen notieren',
      'Digital: Zoom-Link erstellen und testen, Screen-Sharing vorbereiten',
      'Vor-Ort: Materialien-Checkliste pruefen (Tablet, Leitfaden, Visitenkarten)',
    ]
  },
  v6b: {
    ziel: 'Reibungslose Anreise sicherstellen — keine Zeitverluste am Analysetag.',
    anleitung: [
      'Google Maps Route pruefen und Fahrtzeit + Puffer einplanen',
      'Bei > 2h Anfahrt: Hotel buchen (Abend vorher anreisen)',
      'Zeitplanung: 6h-Block plus 30 Min Puffer vor und nach dem Termin',
      'Parkmoeglichkeiten am Salon pruefen',
    ]
  },

  // TP2: Analyse
  a1: {
    ziel: 'Ersten persoenlichen Eindruck gewinnen und Vertrauen zum Team aufbauen.',
    anleitung: [
      'Persoenlich vorstellen — Name, Rolle, was heute passiert',
      'Salon-Rundgang: Jeden Arbeitsplatz, Rezeption, Lager, Pausenraum anschauen',
      'Atmosphaere-Notizen machen: Sauberkeit, Musik, Geruch, Lichtverhaeltnisse',
      'Teamdynamik beobachten: Wer spricht mit wem? Wie ist die Stimmung?',
      'Small Talk mit Mitarbeitern — NICHT sofort analysieren, erst ankommen',
    ]
  },
  a1d: {
    ziel: 'Kassendaten strukturiert auswerten, damit Zahlen fuer die Analyse bereitstehen.',
    anleitung: [
      'KI-Pipeline empfaengt automatisch hochgeladene CSV/PDF-Dateien',
      'OCR-Extraktion: Erkennt Dokumenttyp (BWA, Preisliste, MA-Umsatz)',
      'Klassifikation und Normalisierung der Daten',
      'Ergebnisse werden in Supabase gespeichert und im Dashboard angezeigt',
      'Bei Fehlern: Berater wird benachrichtigt zur manuellen Nachbearbeitung',
    ]
  },
  a2: {
    ziel: 'Die wahren Ziele, Probleme und die Vision des Inhabers verstehen — nicht nur Zahlen.',
    anleitung: [
      'Leitfaden-Interview starten (45-60 Min)',
      'Fragen: "Was laeuft gut?", "Was frustriert Sie am meisten?", "Wo sehen Sie sich in 3 Jahren?"',
      'Pain Points aktiv identifizieren und priorisieren',
      'WICHTIG: Zuhoeren, nicht beraten! Notizen machen, nicht bewerten',
      'Am Ende zusammenfassen: "Habe ich richtig verstanden, dass...?"',
    ]
  },
  a3: {
    ziel: 'Strategie, Marketing und Kundenservice des Salons systematisch bewerten.',
    anleitung: [
      'KF1 Strategie: Ist die Positionierung klar? Wer ist die Zielgruppe? USP vorhanden?',
      'KF2 Marketing: Google-Bewertung checken, Social Media Praesenz bewerten, Online-Buchung vorhanden?',
      'KF3 Kunden: Wiederkehrrate erfragen, Beschwerdemanagement pruefen, Serviceerlebnis beobachten',
      'Digital-Variante: Alles datenbasiert ueber Fragebogen + Online-Recherche statt Beobachtung',
      'Scoring 1-10 fuer jedes Kompetenzfeld eintragen',
    ]
  },
  a4: {
    ziel: 'Fuehrung, Wirtschaftlichkeit und Prozessreife des Salons systematisch bewerten.',
    anleitung: [
      'KF4 Fuehrung: Delegationsklarheit pruefen, Feedback-Kultur erfragen, Konfliktmanagement',
      'KF5 Wirtschaft: BWA-Analyse (Personalquote, Rohertrag, Umsatz/Kopf), Preisstruktur pruefen',
      'KF6 Prozesse: Digitalisierungsgrad, SOPs vorhanden?, Tagesablauf strukturiert?',
      'Digital-Variante: BWA + KPI-Upload auswerten statt Beobachtung',
      'Scoring 1-10 fuer jedes Kompetenzfeld eintragen',
    ]
  },
  a5: {
    ziel: 'Finanzielle Ist-Situation exakt erfassen — Minutenpreis und Preisstruktur als Kern-KPI.',
    anleitung: [
      'Kassendaten gemeinsam mit Inhaber durchgehen',
      'IST-Minutenpreis berechnen: Umsatz / produktive Minuten',
      'Preisstruktur-Gaps identifizieren: Welche DL sind zu guenstig?',
      'Rechencheck: Stimmen Kassendaten mit BWA ueberein?',
      'Ergebnisse dokumentieren und mit Benchmark vergleichen',
    ]
  },
  a6: {
    ziel: 'Dem Inhaber erste Erkenntnisse geben und realistische Erwartungen fuer den Bericht setzen.',
    anleitung: [
      'Die 3 wichtigsten Erkenntnisse des Tages praesentieren',
      'Quick-Wins benennen: "Das koennen Sie sofort aendern"',
      'Zeitrahmen fuer den fertigen Bericht kommunizieren (3-5 Werktage)',
      'Offene Fragen des Inhabers beantworten',
      'Verabschiedung: Positiv enden, Motivation geben',
    ]
  },
  a6d: {
    ziel: 'Automatische KI-Ergebnisse auf Plausibilitaet pruefen und mit Berater-Kontext anreichern.',
    anleitung: [
      'KI-Dashboard oeffnen und generierte Scores reviewen',
      'Automatische Auswertung mit eigenen Einschaetzungen abgleichen',
      'Fehlende Daten manuell ergaenzen (z.B. qualitative Beobachtungen)',
      'Kontext hinzufuegen: Was die KI nicht sehen kann (Atmosphaere, Teamdynamik)',
      'Scores ggf. korrigieren und Aenderungen begruenden',
    ]
  },

  // TP3: Berichterstellung
  b1: {
    ziel: 'Alle Erkenntnisse sichern, bevor Details vergessen werden.',
    anleitung: [
      'Direkt nach der Analyse (idealer Zeitpunkt: im Auto / nach dem Termin)',
      'Voice-Memo aufnehmen: Wichtigste Einschaetzungen, Auffaelligkeiten, Emotionen',
      'Stichpunkte zu jedem KF notieren',
      'Besondere Zitate oder Aussagen des Inhabers festhalten',
      'Digital: Notizen aus Video-Call zusammenfassen und strukturieren',
    ]
  },
  b2: {
    ziel: 'Vollstaendige, datenbasierte Analyse mit allen KI-Agents erstellen.',
    anleitung: [
      'Laeuft automatisch ueber die KI-Pipeline auf Hetzner',
      'SpeedUp360 Agent: Erstellt 6-KF-Scoring + Gap-Analyse + Radar-Chart',
      'BWA Agent: Analysiert Kennzahlen und erzeugt Ampel-Darstellung',
      'Preiskalkulations-Agent: Berechnet optimalen Minutenpreis + SOLL-Preisliste',
      'Positionierungs-Agent: Bewertet USP und Marktposition',
      'Alle Ergebnisse fliessen automatisch in den Berichts-Entwurf',
    ]
  },
  b3: {
    ziel: 'Sicherstellen, dass der Bericht korrekt, vollstaendig und fuer den Kunden verstaendlich ist.',
    anleitung: [
      'KI-generierten Bericht im Dashboard oeffnen',
      'Jeden KF-Score pruefen: Stimmt die Bewertung mit meiner Einschaetzung ueberein?',
      'Benchmark-Werte validieren: Sind die Vergleichsdaten realistisch?',
      'Kontext ergaenzen: Qualitative Beobachtungen, die die KI nicht hat',
      'Bericht freigeben → loest automatisch die PDF-Generierung aus',
    ]
  },
  b4: {
    ziel: 'Professionellen Bericht im Corporate Design generieren, bereit fuer den Kunden.',
    anleitung: [
      'Wird automatisch ausgeloest nach Berater-Freigabe',
      'DocGen erstellt PDF (20-25 Seiten) mit: Radar-Chart, KF-Scores, Gap-Matrix, Massnahmenvorschlaege',
      'Corporate-Design wird automatisch angewendet',
      'PDF wird im CRM beim Kontakt hinterlegt',
      'Berater erhaelt Benachrichtigung wenn PDF fertig ist',
    ]
  },

  // TP4: Massnahmenplan
  m1: {
    ziel: 'Die 3 wirkungsvollsten Hebel identifizieren, die den groessten Unterschied machen.',
    anleitung: [
      'Gap-Analyse-Ergebnisse oeffnen: Welche KFs haben die groessten Deltas?',
      'Impact x Machbarkeit Matrix erstellen: Was bringt viel UND ist umsetzbar?',
      'Top 3 Massnahmen auswaehlen und priorisieren',
      'Verantwortungsmatrix erstellen: Wer macht was? (Salon / Salonimpuls / Extern)',
      'Realitaetscheck: Kann der Salon das personell und finanziell stemmen?',
    ]
  },
  m2: {
    ziel: 'Messbare Ziele und einen konkreten 90-Tage-Fahrplan erstellen.',
    anleitung: [
      'Fuer jede Massnahme KPIs definieren: Finanziell (Umsatz, Bon), Operativ (Auslastung), Qualitativ (NPS)',
      '90-Tage-Plan strukturieren: Woche 1-4 (Quick Wins), Woche 5-8 (Aufbau), Woche 9-12 (Festigung)',
      'Meilensteine mit konkreten Daten versehen',
      'Plan im Zoho CRM als Massnahmenplan hinterlegen',
      'Vorlage: Je Massnahme → Ziel → KPI → Verantwortlich → Deadline → Status',
    ]
  },
  m3: {
    ziel: 'Qualitaetssicherung — sicherstellen, dass der Plan realistisch und lieferbar ist.',
    anleitung: [
      'Massnahmenplan auf Plausibilitaet pruefen',
      'Delivery-Kapazitaet checken: Haben wir die Ressourcen fuer die Begleitung?',
      'Bei Gate-Score < 4: Eskalation an Senior Consultant, erweitertes Review',
      'Freigabe erteilen oder Anpassungen einfordern',
    ]
  },

  // TP5: Abschlussgespraech
  g1: {
    ziel: 'Persoenliche Verbindung aufbauen — der Inhaber soll sich verstanden fuehlen, nicht bewertet.',
    anleitung: [
      'Persoenliche Begruessung — auf den Inhaber eingehen',
      'WICHTIG: Bericht NICHT vorab per E-Mail senden! Erst gemeinsam durchgehen',
      'Offene Atmosphaere schaffen: "Heute ist Ihr Tag, wir schauen gemeinsam auf die Ergebnisse"',
      'Kurz den Ablauf erklaeren: Ergebnisse → Ziele → Massnahmen → naechste Schritte',
      'Digital: Zoom-Call, Kamera an, Screen-Sharing vorbereitet',
    ]
  },
  g2: {
    ziel: 'Dem Inhaber klar und visuell zeigen, wo sein Salon steht — ohne zu ueberwaeltigen.',
    anleitung: [
      'Screen-Sharing starten: Radar-Chart als Einstieg',
      'Jeden KF-Score erklaeren: "Hier stehen Sie bei X, der Branchenschnitt liegt bei Y"',
      'Benchmark-Vergleich zeigen: Wo ist der Salon besser, wo schlechter?',
      'Reaktionen des Inhabers beobachten: Ueberraschung? Zustimmung? Widerstand?',
      'Nicht alles auf einmal — Pausen lassen fuer Fragen',
    ]
  },
  g3: {
    ziel: 'Die persoenliche Vision des Inhabers verstehen — das ist die Basis fuer jeden Massnahmenplan.',
    anleitung: [
      'Offene Frage: "Was wollen Sie wirklich erreichen in den naechsten 12 Monaten?"',
      '3x "Warum?" fragen — um zum Kern der Motivation vorzudringen',
      'WICHTIG: Verstehen, nicht analysieren! Zuhoeren und mitschreiben',
      'Vision mit den Analyse-Ergebnissen verknuepfen: "Dafuer muessten wir hier ansetzen..."',
      'Gemeinsames Zielbild formulieren',
    ]
  },
  g4: {
    ziel: 'Gemeinsam mit dem Inhaber die wichtigsten Massnahmen festlegen — er entscheidet, nicht wir.',
    anleitung: [
      'KI-generierte Massnahmenvorschlaege zeigen (Top 5)',
      'Gemeinsam priorisieren: "Welche 3 haben fuer Sie die hoechste Prioritaet?"',
      'Fuer jede Massnahme: Konkret erklaeren was zu tun ist und was es bringt',
      'Timeline gemeinsam festlegen: "Bis wann ist das realistisch?"',
      'Inhaber entscheidet — wir empfehlen, er waehlt',
    ]
  },
  g5: {
    ziel: 'Passende Begleitung anbieten — authentisch und ohne Verkaufsdruck.',
    anleitung: [
      'Basierend auf Massnahmen das passende SI-Paket empfehlen',
      'Quick Fix noetig → Coaching empfehlen',
      'Breite Entwicklung → Campus + Coaching empfehlen',
      'Langfristige Transformation → Master-Begleitung empfehlen',
      'WICHTIG: Kein Druck! "Das ist meine Empfehlung, Sie entscheiden"',
      'Angebot wird nach dem Gespraech automatisch erstellt und zugesendet',
    ]
  },

  // TP6: Folgeangebot
  f1: {
    ziel: 'Dem Kunden unmittelbar nach dem Gespraech alle Unterlagen bereitstellen.',
    anleitung: [
      'Wird automatisch ausgeloest nach Gespraechsende (n8n-Workflow)',
      'E-Mail enthaelt: PDF-Bericht (20-25 Seiten) + Massnahmenplan als Attachment',
      'Betreff und Text sind personalisiert mit Salon-Name',
      'Versand innerhalb von 2 Stunden nach Gespraechsende',
      'Pruefen: E-Mail-Zustellung erfolgreich? (n8n-Log)',
    ]
  },
  f2: {
    ziel: 'Automatisch ein passendes Angebot generieren, das auf den Salon zugeschnitten ist.',
    anleitung: [
      'n8n liest Persona-Typ + Massnahmen aus dem CRM',
      'Angebots-Logik: Quick Fix → Coaching-Angebot / Breit → Campus+Coaching / Lang → Master',
      'Angebot wird automatisch in Zoho erstellt mit korrekten Preisen und Konditionen',
      'Berater erhaelt Benachrichtigung zur finalen Pruefung',
      'Versand erst nach manueller Freigabe durch Berater',
    ]
  },
  f3: {
    ziel: 'Automatisches Angebot personalisieren und an den Kunden senden.',
    anleitung: [
      'Automatisch generiertes Angebot in Zoho oeffnen',
      'Pruefen: Stimmen Produkt, Preis und Konditionen?',
      'Persoenliche Notiz ergaenzen (Bezug auf Gespraech)',
      'Angebot per E-Mail an Kunden senden',
      'Follow-up Datum im CRM setzen (7 Tage)',
    ]
  },
  f4: {
    ziel: 'Offene Fragen klaeren und den Kunden bei der Entscheidung unterstuetzen.',
    anleitung: [
      'Lea oder Simone rufen den Kunden an (Tag 8-10 nach Gespraech)',
      'Fragen: "Haben Sie den Bericht gelesen? Gibt es Fragen?"',
      '"Gibt es Unklarheiten zum Angebot?"',
      'Bei Einwaenden: Notieren und an Berater/Sales weiterleiten',
      'Bei Interesse: Termin fuer Vertragsgespraech vereinbaren',
    ]
  },
  f5: {
    ziel: 'Bei Zusage den Vertrag schnell und professionell abwickeln.',
    anleitung: [
      'Vertrag aus der Vorlage erstellen (Zoho)',
      'Konditionen wie im Angebot uebernehmen',
      'Vertrag per E-Mail an Kunden zur Unterschrift senden',
      'Nach Ruecklauf: Rechnung erstellen und versenden',
      'Kickoff-Termin planen und im CRM hinterlegen',
    ]
  },

  // Follow-up
  fu1: {
    ziel: 'Den Kunden an die Umsetzung erinnern und Motivation aufrechterhalten.',
    anleitung: [
      'Automatischer Versand 14 Tage nach der Analyse',
      'E-Mail: "Wie laeuft die Umsetzung der Massnahmen?"',
      'WhatsApp Impuls: Kurze motivierende Nachricht + Quick-Tipp',
      'Bei offenen Angeboten: Erinnerung an das Angebot integriert',
      'Antworten werden im CRM protokolliert',
    ]
  },
  fu2: {
    ziel: 'Automatisch einen Kontrolltermin buchen, damit der Salon nicht "vergessen" wird.',
    anleitung: [
      'n8n loest 30 Tage nach Analyse einen Cal.com-Buchungslink aus',
      'Kunde erhaelt E-Mail mit Terminvorschlaegen',
      'Bei Buchung: Termin wird automatisch im CRM eingetragen',
      'Bei Nicht-Buchung: Erinnerung nach 5 Tagen',
      'Termin-Inhalt: Umsetzungsstatus pruefen, Blockaden loesen',
    ]
  },
  fu3: {
    ziel: 'Aktiv pruefen ob der Salon die Massnahmen umsetzt und bei Problemen helfen.',
    anleitung: [
      'Lea oder Simone fuehren den Follow-up Call (30 Min)',
      'Checkliste: Welche Massnahmen wurden umgesetzt? (0-100%)',
      'Wo hakt es? Typische Blockaden: Zeit, Geld, Team-Widerstand',
      'Konkrete Hilfe anbieten: Ressourcen, Templates, Kontakte',
      'Umsetzungsstatus im CRM aktualisieren',
      'Bei < 30% Umsetzung: Eskalation an Berater',
    ]
  },
  fu4: {
    ziel: 'Messbare Ergebnisse erfassen — beweisen, dass SpeedUp360 wirkt.',
    anleitung: [
      'Automatischer Fragebogen 90 Tage nach Analyse',
      'Erfasst: Durchschnittsbon vorher/nachher, Rebooking-Quote, Umsatz',
      'ROI-Berechnung: (Umsatzsteigerung - Investition) / Investition',
      'Ergebnisse werden automatisch im CRM gespeichert',
      'Positive Ergebnisse → Testimonial anfragen, Case Study erstellen',
    ]
  },
  fu5: {
    ziel: 'Inaktive Kunden reaktivieren und erneut ins Gespraech bringen.',
    anleitung: [
      'Automatische E-Mail-Sequenz nach 180 Tagen ohne Kontakt',
      'Sequenz: 3 E-Mails ueber 3 Wochen mit steigendem Mehrwert',
      'E-Mail 1: "Wir haben lange nichts gehoert — wie geht es Ihrem Salon?"',
      'E-Mail 2: Branchen-Insight oder neues Feature teilen',
      'E-Mail 3: Erneute Diagnose kostenlos oder vergünstigt anbieten',
      'Bei Reaktion: Lead erneut qualifizieren (zurueck zu v1)',
    ]
  },
}

const phasenFarben: Record<string, { bg: string; border: string; text: string; headerBg: string }> = {
  'Vorbereitung': { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-700', headerBg: 'bg-indigo-100' },
  'Analyse': { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', headerBg: 'bg-blue-100' },
  'Berichterstellung': { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', headerBg: 'bg-emerald-100' },
  'Massnahmenplan': { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', headerBg: 'bg-amber-100' },
  'Abschlussgespraech': { bg: 'bg-violet-50', border: 'border-violet-300', text: 'text-violet-700', headerBg: 'bg-violet-100' },
  'Folgeangebot': { bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-700', headerBg: 'bg-pink-100' },
  'Follow-up': { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', headerBg: 'bg-gray-100' },
}

function AblaufTab() {
  const [variante, setVariante] = useState<'digital' | 'vorOrt'>('digital')
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null)
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [isPrintMode, setIsPrintMode] = useState(false)

  const filteredSchritte = prozessSchritte.filter(s =>
    variante === 'digital' ? s.digital : s.vorOrt
  )

  const phasen = [...new Set(filteredSchritte.map(s => s.phase))]

  const getRolle = (id: string) => swimlaneRollen.find(r => r.id === id)
  const isAutomated = (schritt: ProzessSchritt) => schritt.wer === 'ki' || schritt.wer === 'auto'

  const handlePrint = () => {
    setIsPrintMode(true)
    // Kurz warten bis React gerendert hat, dann drucken
    setTimeout(() => {
      window.print()
      // Nach dem Drucken wieder normal
      setTimeout(() => setIsPrintMode(false), 500)
    }, 300)
  }

  // Farben: Gruen fuer automatisiert, einheitlich Slate fuer manuell
  const autoStyle = { circle: 'bg-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500', rowBg: 'bg-emerald-50/60' }
  const manualStyle = { circle: 'bg-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', dot: 'bg-slate-400', rowBg: 'bg-white' }

  return (
    <div className="space-y-6">
      {/* Print-only Titelseite */}
      {isPrintMode && (
        <div className="hidden print:block text-center py-8 border-b-2 border-gray-300 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">SpeedUp360 — Ablaufplan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Variante: {variante === 'digital' ? 'Digital (990 EUR)' : 'Vor-Ort (2.500 EUR)'} — {filteredSchritte.length} Schritte — {filteredSchritte.filter(s => isAutomated(s)).length} automatisiert / {filteredSchritte.filter(s => !isAutomated(s)).length} manuell
          </p>
          <p className="text-xs text-gray-400 mt-2">Salonimpuls GmbH — Vertraulich — Stand: April 2026</p>
        </div>
      )}

      {/* Header mit Toggle */}
      <Card className="border-l-4 border-l-cyan-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-cyan-500" />
                Ablaufplan — Wer macht Wann Was Wo
              </CardTitle>
              <CardDescription>Kompletter Prozess von Lead bis Wirkungsmessung</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1" data-print-hide="true">
                <button
                  onClick={() => setVariante('digital')}
                  className={`px-4 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    variante === 'digital'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  Digital (990 EUR)
                </button>
                <button
                  onClick={() => setVariante('vorOrt')}
                  className={`px-4 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    variante === 'vorOrt'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  Vor-Ort (2.500 EUR)
                </button>
              </div>
              <button
                onClick={handlePrint}
                data-print-hide="true"
                className="px-3 py-2 rounded-md text-xs font-medium bg-gray-700 text-white hover:bg-gray-800 transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Drucken
              </button>
            </div>
            {/* Print-only Varianten-Anzeige */}
            <div className="hidden print:block">
              <Badge className="text-xs bg-gray-100 text-gray-700 border border-gray-300">
                Variante: {variante === 'digital' ? 'Digital (990 EUR)' : 'Vor-Ort (2.500 EUR)'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500">Gesamtdauer:</span>
              <strong>{variante === 'digital' ? '~3-4h Berater + 90 Tage Follow-up' : '~12-16h (1.5-2 Tage) + 90 Tage Follow-up'}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500">Beteiligte:</span>
              <strong>{variante === 'digital' ? '6 Rollen + KI-Agents' : '7 Rollen + KI-Agents'}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <PlayCircle className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500">Schritte:</span>
              <strong>{filteredSchritte.length} Aktivitaeten</strong>
            </div>
          </div>
          {/* Legende: Automatisiert vs. Manuell */}
          <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-medium text-emerald-700">Automatisiert (KI / n8n)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-500 flex items-center justify-center">
                <Users className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-medium text-slate-700">Manuell (Person)</span>
            </div>
            <div className="ml-auto text-[10px] text-gray-400">
              {filteredSchritte.filter(s => isAutomated(s)).length} automatisiert / {filteredSchritte.filter(s => !isAutomated(s)).length} manuell
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phasen-Swimlanes */}
      {phasen.map((phase, phaseIdx) => {
        const farbe = phasenFarben[phase] || phasenFarben['Follow-up']
        const phasenSchritte = filteredSchritte.filter(s => s.phase === phase)
        const isExpanded = expandedPhase === phase
        const tp = phasenSchritte[0]?.tp || ''
        const autoCount = phasenSchritte.filter(s => isAutomated(s)).length
        const manualCount = phasenSchritte.length - autoCount

        return (
          <div key={phase} className={`border rounded-xl overflow-hidden ${farbe.border} ${phaseIdx > 0 ? 'print-phase-break' : ''}`}>
            {/* Phase Header */}
            <button
              onClick={() => setExpandedPhase(isExpanded ? null : phase)}
              className={`w-full flex items-center justify-between px-4 py-3 ${farbe.headerBg} hover:brightness-95 transition-all`}
            >
              <div className="flex items-center gap-3">
                <Badge className={`${farbe.bg} ${farbe.text} border ${farbe.border} text-[10px]`}>{tp}</Badge>
                <span className={`font-semibold text-sm ${farbe.text}`}>{phase}</span>
                <div className="flex items-center gap-1.5">
                  {autoCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">{autoCount} auto</span>
                  )}
                  {manualCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">{manualCount} manuell</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-500 font-mono">
                  {phasenSchritte[0]?.tagLabel} — {phasenSchritte[phasenSchritte.length - 1]?.tagLabel}
                </span>
                <ChevronRight className={`w-4 h-4 ${farbe.text} transition-transform ${isExpanded ? 'rotate-90' : ''} no-print`} />
              </div>
            </button>

            {/* Phase Content */}
            {(isExpanded || isPrintMode) && (
              <div className="divide-y divide-gray-100">
                {phasenSchritte.map((schritt, idx) => {
                  const rolle = getRolle(schritt.wer)
                  if (!rolle) return null
                  const auto = isAutomated(schritt)
                  const style = auto ? autoStyle : manualStyle
                  const detail = schrittDetails[schritt.id]
                  const isStepExpanded = expandedStep === schritt.id || isPrintMode
                  return (
                    <div key={schritt.id} className={`px-4 py-3 ${style.rowBg} hover:brightness-[0.98] transition-colors print-step`}>
                      <div className="flex items-start gap-3">
                        {/* Schritt-Nummer — klickbar */}
                        <div className="flex flex-col items-center shrink-0">
                          <button
                            onClick={() => setExpandedStep(isStepExpanded ? null : schritt.id)}
                            title="Klicke fuer Details: Ziel & Anleitung"
                            className={`w-7 h-7 rounded-full ${style.circle} text-white flex items-center justify-center text-[10px] font-bold cursor-pointer hover:ring-2 hover:ring-offset-1 ${auto ? 'hover:ring-emerald-300' : 'hover:ring-slate-300'} transition-all ${isStepExpanded ? (auto ? 'ring-2 ring-emerald-400 ring-offset-1' : 'ring-2 ring-slate-400 ring-offset-1') : ''}`}
                          >
                            {auto ? <Bot className="w-3.5 h-3.5" /> : idx + 1}
                          </button>
                          {idx < phasenSchritte.length - 1 && <div className="w-0.5 h-4 bg-gray-200 mt-1" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => setExpandedStep(isStepExpanded ? null : schritt.id)}
                              className={`text-sm font-medium text-left hover:underline cursor-pointer ${auto ? 'text-emerald-800' : 'text-gray-900'}`}
                            >
                              {schritt.was}
                            </button>
                            {auto && (
                              <Badge className="text-[9px] bg-emerald-100 text-emerald-700 border border-emerald-200">
                                Automatisiert
                              </Badge>
                            )}
                            {schritt.digitalVariante && variante === 'digital' && (
                              <Badge variant="outline" className="text-[9px] bg-cyan-50 text-cyan-600 border-cyan-200">
                                Digital: {schritt.digitalVariante}
                              </Badge>
                            )}
                            {detail && !isPrintMode && (
                              <button
                                onClick={() => setExpandedStep(isStepExpanded ? null : schritt.id)}
                                className={`text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition-colors ${isStepExpanded ? 'bg-blue-200 text-blue-800' : 'bg-blue-50 text-blue-500 hover:bg-blue-100'} no-print`}
                              >
                                {isStepExpanded ? 'Anleitung ausblenden ▲' : 'Anleitung anzeigen ▼'}
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{schritt.details}</p>

                          {/* Aufgeklappte Detail-Ansicht */}
                          {isStepExpanded && detail && (
                            <div className="mt-3 p-3 rounded-lg border bg-white shadow-sm space-y-3">
                              <div>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Target className="w-3.5 h-3.5 text-blue-500" />
                                  <span className="text-xs font-semibold text-blue-700">Ziel dieses Schritts</span>
                                </div>
                                <p className="text-xs text-gray-700 leading-relaxed">{detail.ziel}</p>
                              </div>
                              <Separator />
                              <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <ClipboardList className="w-3.5 h-3.5 text-violet-500" />
                                  <span className="text-xs font-semibold text-violet-700">So wird's gemacht</span>
                                </div>
                                <div className="space-y-1.5">
                                  {detail.anleitung.map((step, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                      <span className="text-[10px] font-bold text-violet-400 mt-0.5 shrink-0 w-4 text-right">{i + 1}.</span>
                                      <span className="text-xs text-gray-600 leading-relaxed">{step}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Meta-Infos */}
                          <div className="flex flex-wrap gap-3 mt-2">
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${style.bg} border ${style.border}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                              <span className={`text-[10px] font-medium ${style.text}`}>{rolle.name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {schritt.wo}
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] ${auto ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                              <Clock className="w-3 h-3" />
                              {schritt.dauer}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400">
                              <Calendar className="w-3 h-3" />
                              {schritt.tagLabel}
                            </div>
                          </div>

                          {/* Handoff */}
                          {schritt.handoff && (
                            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                              <Send className="w-3 h-3" />
                              <strong>Handoff:</strong> {schritt.handoff}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* Zusammenfassungs-Karte: Manueller Aufwand pro Person */}
      <Card className="print-summary-break">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-500" />
            Manueller Aufwand pro Person — {variante === 'digital' ? 'Digital' : 'Vor-Ort'}
          </CardTitle>
          <CardDescription>Nur manuelle Schritte — automatisierte Schritte sind nicht enthalten</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Person / Rolle</TableHead>
                <TableHead className="text-xs">Typ</TableHead>
                <TableHead className="text-xs">Anzahl Schritte</TableHead>
                <TableHead className="text-xs">Aktivitaeten</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {swimlaneRollen.map(rolle => {
                const rollenSchritte = filteredSchritte.filter(s => s.wer === rolle.id)
                if (rollenSchritte.length === 0) return null
                const auto = rolle.id === 'ki' || rolle.id === 'auto'
                return (
                  <TableRow key={rolle.id} className={auto ? 'bg-emerald-50/50' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${auto ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                        <span className="text-xs font-medium">{rolle.name}</span>
                        <span className="text-[10px] text-gray-400">({rolle.rolle})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${auto ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {auto ? 'Automatisiert' : 'Manuell'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-bold ${auto ? 'text-emerald-600' : 'text-slate-700'}`}>{rollenSchritte.length}</span>
                    </TableCell>
                    <TableCell className="text-[10px] text-gray-500 max-w-xs">
                      {rollenSchritte.map(s => s.was).join(' · ')}
                    </TableCell>
                  </TableRow>
                )
              })}
              {/* Summenzeile */}
              <TableRow className="border-t-2 border-gray-300 font-bold">
                <TableCell className="text-xs">Gesamt</TableCell>
                <TableCell />
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-700">{filteredSchritte.filter(s => !isAutomated(s)).length} manuell</span>
                    <span className="text-[10px] text-gray-400">+</span>
                    <span className="text-sm text-emerald-600">{filteredSchritte.filter(s => isAutomated(s)).length} auto</span>
                  </div>
                </TableCell>
                <TableCell className="text-[10px] text-gray-400">= {filteredSchritte.length} Schritte total</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

/* ───────────────────── MAIN APP ───────────────────── */

export default function App() {
  const [activeTab, setActiveTab] = useState('konzept')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">SpeedUp360</h1>
                <p className="text-[11px] text-gray-500">Konzeptpapier — Diagnose- und Entwicklungssystem</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
              <span>Salonimpuls GmbH</span>
              <span>|</span>
              <span>v1.0 — April 2026</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full justify-start flex-wrap h-auto gap-1 bg-white border p-1">
            <TabsTrigger value="konzept" className="text-xs gap-1.5 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Sparkles className="w-3.5 h-3.5" /> Konzeptlogik
            </TabsTrigger>
            <TabsTrigger value="produkte" className="text-xs gap-1.5 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              <Monitor className="w-3.5 h-3.5" /> Produktvarianten
            </TabsTrigger>
            <TabsTrigger value="crm" className="text-xs gap-1.5 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
              <Database className="w-3.5 h-3.5" /> CRM-Struktur
            </TabsTrigger>
            <TabsTrigger value="prozess" className="text-xs gap-1.5 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
              <ClipboardList className="w-3.5 h-3.5" /> Prozesslogik
            </TabsTrigger>
            <TabsTrigger value="ablauf" className="text-xs gap-1.5 data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700">
              <GitBranch className="w-3.5 h-3.5" /> Ablaufplan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="konzept"><KonzeptTab /></TabsContent>
          <TabsContent value="produkte"><ProdukteTab /></TabsContent>
          <TabsContent value="crm"><CRMTab /></TabsContent>
          <TabsContent value="prozess"><ProzessTab /></TabsContent>
          <TabsContent value="ablauf"><AblaufTab /></TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <p className="text-xs text-gray-400">
            SpeedUp360 Konzeptpapier — Salonimpuls GmbH — Vertraulich — April 2026
          </p>
        </div>
      </footer>
    </div>
  )
}

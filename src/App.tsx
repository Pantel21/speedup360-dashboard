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
  ChevronRight, Star, Building2, Sparkles
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
          </TabsList>

          <TabsContent value="konzept"><KonzeptTab /></TabsContent>
          <TabsContent value="produkte"><ProdukteTab /></TabsContent>
          <TabsContent value="crm"><CRMTab /></TabsContent>
          <TabsContent value="prozess"><ProzessTab /></TabsContent>
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

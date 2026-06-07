import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid, Legend } from 'recharts'
import { Flag, Timer, Trophy, Zap, MapPin, ChevronRight } from 'lucide-react'

const JOLPICA_BASE = 'https://api.jolpi.ca/ergast/f1'

const C = {
  bg: '#080808',
  surface: '#111111',
  card: '#141414',
  red: '#E8002D',
  redGlow: 'rgba(232,0,45,0.35)',
  redDim: 'rgba(232,0,45,0.12)',
  gold: '#C9A84C',
  text: '#F5F5F5',
  muted: '#888888',
  border: '#222222',
}

const TEAM_COLORS = {
  Mercedes: '#00D2BE', Ferrari: '#DC0000', McLaren: '#FF8700',
  'Red Bull': '#1E3BC2', Alpine: '#0090FF', 'Racing Bulls': '#6692FF',
  Haas: '#B30000', Williams: '#00C2FF', Audi: '#C0C0C0',
  Cadillac: '#1C1C1C', 'Aston Martin': '#006F62',
  'Red Bull Racing': '#1E3BC2', 'RB F1 Team': '#6692FF',
  'Visa Cash App RB': '#6692FF',
}

const FLAGS = {
  Italy: '🇮🇹', 'Great Britain': '🇬🇧', Monaco: '🇲🇨', Netherlands: '🇳🇱',
  Spain: '🇪🇸', Australia: '🇦🇺', France: '🇫🇷', Germany: '🇩🇪',
  Finland: '🇫🇮', Japan: '🇯🇵', Mexico: '🇲🇽', Canada: '🇨🇦',
  Belgium: '🇧🇪', Austria: '🇦🇹', Switzerland: '🇨🇭', Denmark: '🇩🇰',
  Sweden: '🇸🇪', Brazil: '🇧🇷', USA: '🇺🇸', China: '🇨🇳',
  Thailand: '🇹🇭', Indonesia: '🇮🇩', India: '🇮🇳', Russia: '🇷🇺',
  Argentina: '🇦🇷', 'New Zealand': '🇳🇿', Portugal: '🇵🇹', Hungary: '🇭🇺',
  Ireland: '🇮🇪', Poland: '🇵🇱', Czech: '🇨🇿', Colombia: '🇨🇴',
  Venezuela: '🇻🇪', 'South Africa': '🇿🇦',
}

function teamColor(teamName) {
  return TEAM_COLORS[teamName] || C.red
}

const FALLBACK = {
  season: '2026',
  drivers: [
    { driverId: 'antonelli', fullName: 'Kimi Antonelli', shortName: 'ANT', number: 12, team: 'Mercedes', nationality: 'Italy', points: 131, wins: 4, podiums: 4, poles: 0, fastestLaps: 2, championshipPosition: 1, funFact: 'At 19, Antonelli is the youngest championship leader in F1 history.', history: [], career: null },
    { driverId: 'russell', fullName: 'George Russell', shortName: 'RUS', number: 63, team: 'Mercedes', nationality: 'Great Britain', points: 88, wins: 1, podiums: 2, poles: 3, fastestLaps: 1, championshipPosition: 2, funFact: 'Won the season opener in Australia after a late-race pass on Antonelli.', history: [], career: null },
    { driverId: 'leclerc', fullName: 'Charles Leclerc', shortName: 'LEC', number: 16, team: 'Ferrari', nationality: 'Monaco', points: 75, wins: 0, podiums: 3, poles: 1, fastestLaps: 1, championshipPosition: 3, funFact: 'Leclerc has qualified inside the top four at every round of 2026 so far.', history: [], career: null },
    { driverId: 'hamilton', fullName: 'Lewis Hamilton', shortName: 'HAM', number: 44, team: 'Ferrari', nationality: 'Great Britain', points: 72, wins: 0, podiums: 2, poles: 0, fastestLaps: 0, championshipPosition: 4, funFact: 'Hamilton scored back-to-back podiums in Miami and Canada for Ferrari.', history: [], career: null },
    { driverId: 'norris', fullName: 'Lando Norris', shortName: 'NOR', number: 4, team: 'McLaren', nationality: 'Great Britain', points: 58, wins: 0, podiums: 1, poles: 1, fastestLaps: 1, championshipPosition: 5, funFact: 'Norris grabbed second place in Miami after a stunning final lap.', history: [], career: null },
    { driverId: 'piastri', fullName: 'Oscar Piastri', shortName: 'PIA', number: 81, team: 'McLaren', nationality: 'Australia', points: 48, wins: 0, podiums: 2, poles: 0, fastestLaps: 0, championshipPosition: 6, funFact: 'Piastri finished second in Japan and third in Miami for McLaren.', history: [], career: null },
    { driverId: 'max_verstappen', fullName: 'Max Verstappen', shortName: 'VER', number: 1, team: 'Red Bull Racing', nationality: 'Netherlands', points: 43, wins: 0, podiums: 1, poles: 0, fastestLaps: 0, championshipPosition: 7, funFact: 'Verstappens third place in Canada was his first podium of the 2026 season.', history: [], career: null },
    { driverId: 'gasly', fullName: 'Pierre Gasly', shortName: 'GAS', number: 10, team: 'Alpine', nationality: 'France', points: 20, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 8, funFact: 'Gasly has been Alpines top scorer in every race of 2026 so far.', history: [], career: null },
    { driverId: 'bearman', fullName: 'Oliver Bearman', shortName: 'BEA', number: 87, team: 'Haas', nationality: 'Great Britain', points: 18, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 9, funFact: 'Bearman scored points in three of the first five rounds for Haas.', history: [], career: null },
    { driverId: 'lawson', fullName: 'Liam Lawson', shortName: 'LAW', number: 30, team: 'Racing Bulls', nationality: 'New Zealand', points: 16, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 10, funFact: 'Lawson outqualified his more experienced teammate at every race so far.', history: [], career: null },
    { driverId: 'colapinto', fullName: 'Franco Colapinto', shortName: 'COL', number: 43, team: 'Alpine', nationality: 'Argentina', points: 15, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 11, funFact: 'Colapinto scored his first F1 points for Alpine in Canada with P6.', history: [], career: null },
    { driverId: 'hadjar', fullName: 'Isack Hadjar', shortName: 'HAD', number: 22, team: 'Red Bull Racing', nationality: 'France', points: 14, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 12, funFact: 'Hadjar replaced Perez at Red Bull and scored points in Canada.', history: [], career: null },
    { driverId: 'sainz', fullName: 'Carlos Sainz', shortName: 'SAI', number: 55, team: 'Williams', nationality: 'Spain', points: 6, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 13, funFact: 'Sainz moved to Williams after Ferrari opted for Hamilton.', history: [], career: null },
    { driverId: 'lindblad', fullName: 'Arvid Lindblad', shortName: 'LIN', number: 37, team: 'Racing Bulls', nationality: 'Great Britain', points: 5, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 14, funFact: 'Lindblad scored on debut in Australia finishing eighth at 18 years old.', history: [], career: null },
    { driverId: 'bortoleto', fullName: 'Gabriel Bortoleto', shortName: 'BOR', number: 5, team: 'Audi', nationality: 'Brazil', points: 2, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 15, funFact: 'Bortoleto scored Audis first-ever F1 point in Australia.', history: [], career: null },
    { driverId: 'ocon', fullName: 'Esteban Ocon', shortName: 'OCO', number: 31, team: 'Haas', nationality: 'France', points: 1, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 16, funFact: 'Ocon moved to Haas for 2026 alongside fellow Frenchman Bearman.', history: [], career: null },
    { driverId: 'albon', fullName: 'Alexander Albon', shortName: 'ALB', number: 23, team: 'Williams', nationality: 'Thailand', points: 1, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 17, funFact: 'Albon scored a point in Japan with a gritty drive to P10.', history: [], career: null },
    { driverId: 'hulkenberg', fullName: 'Nico Hulkenberg', shortName: 'HUL', number: 27, team: 'Audi', nationality: 'Germany', points: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 18, funFact: 'Hulkenberg joined Audi for their F1 entry in 2026.', history: [], career: null },
    { driverId: 'bottas', fullName: 'Valtteri Bottas', shortName: 'BOT', number: 77, team: 'Cadillac', nationality: 'Finland', points: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 19, funFact: 'Bottas leads Cadillacs debut F1 campaign alongside Perez.', history: [], career: null },
    { driverId: 'perez', fullName: 'Sergio Perez', shortName: 'PER', number: 11, team: 'Cadillac', nationality: 'Mexico', points: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 20, funFact: 'Perez joined Cadillac after leaving Red Bull at the end of 2025.', history: [], career: null },
    { driverId: 'stroll', fullName: 'Lance Stroll', shortName: 'STR', number: 18, team: 'Aston Martin', nationality: 'Canada', points: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 21, funFact: 'Stroll has finished every race of 2026 but has yet to score a point.', history: [], career: null },
    { driverId: 'alonso', fullName: 'Fernando Alonso', shortName: 'ALO', number: 14, team: 'Aston Martin', nationality: 'Spain', points: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 22, funFact: 'At 44, Alonso is chasing his 33rd F1 win in what may be his final season.', history: [], career: null },
  ],
  constructors: [
    { name: 'Mercedes-AMG PETRONAS F1 Team', shortName: 'Mercedes', points: 219, wins: 5, position: 1, powerUnit: 'Mercedes', base: 'Brackley', color: '#00D2BE' },
    { name: 'Scuderia Ferrari HP', shortName: 'Ferrari', points: 147, wins: 0, position: 2, powerUnit: 'Ferrari', base: 'Maranello', color: '#DC0000' },
    { name: 'McLaren Mastercard F1 Team', shortName: 'McLaren', points: 106, wins: 0, position: 3, powerUnit: 'Mercedes', base: 'Woking', color: '#FF8700' },
    { name: 'Oracle Red Bull Racing', shortName: 'Red Bull', points: 57, wins: 0, position: 4, powerUnit: 'Red Bull Ford', base: 'Milton Keynes', color: '#1E3BC2' },
    { name: 'BWT Alpine Formula One Team', shortName: 'Alpine', points: 35, wins: 0, position: 5, powerUnit: 'Mercedes', base: 'Enstone', color: '#0090FF' },
    { name: 'Visa Cash App Racing Bulls', shortName: 'Racing Bulls', points: 21, wins: 0, position: 6, powerUnit: 'Red Bull Ford', base: 'Faenza', color: '#6692FF' },
    { name: 'TGR Haas F1 Team', shortName: 'Haas', points: 19, wins: 0, position: 7, powerUnit: 'Ferrari', base: 'Kannapolis', color: '#B30000' },
    { name: 'Atlassian Williams F1 Team', shortName: 'Williams', points: 7, wins: 0, position: 8, powerUnit: 'Mercedes', base: 'Grove', color: '#00C2FF' },
    { name: 'Audi Revolut F1 Team', shortName: 'Audi', points: 2, wins: 0, position: 9, powerUnit: 'Audi', base: 'Hinwil', color: '#C0C0C0' },
    { name: 'Cadillac Formula One Team', shortName: 'Cadillac', points: 0, wins: 0, position: 10, powerUnit: 'Ferrari', base: 'Warren', color: '#1C1C1C' },
    { name: 'Aston Martin Aramco F1 Team', shortName: 'Aston Martin', points: 0, wins: 0, position: 11, powerUnit: 'Honda', base: 'Silverstone', color: '#006F62' },
  ],
  calendar: [
    { round: 1, grandPrixName: 'Australian Grand Prix', officialName: 'Formula 1 Qatar Airways Australian Grand Prix 2026', circuit: 'Albert Park Circuit', city: 'Melbourne', country: 'Australia', continent: 'Oceania', date: '2026-03-08', status: 'completed', winner: 'RUS' },
    { round: 2, grandPrixName: 'Chinese Grand Prix', officialName: 'Formula 1 Heineken Chinese Grand Prix 2026', circuit: 'Shanghai International Circuit', city: 'Shanghai', country: 'China', continent: 'Asia', date: '2026-03-15', status: 'completed', winner: 'ANT' },
    { round: 3, grandPrixName: 'Japanese Grand Prix', officialName: 'Formula 1 Aramco Japanese Grand Prix 2026', circuit: 'Suzuka International Racing Course', city: 'Suzuka', country: 'Japan', continent: 'Asia', date: '2026-03-29', status: 'completed', winner: 'ANT' },
    { round: 4, grandPrixName: 'Bahrain Grand Prix', officialName: 'Formula 1 Gulf Air Bahrain Grand Prix 2026', circuit: 'Bahrain International Circuit', city: 'Sakhir', country: 'Bahrain', continent: 'Asia', date: '2026-04-12', status: 'completed', winner: null },
    { round: 5, grandPrixName: 'Saudi Arabian Grand Prix', officialName: 'Formula 1 STC Saudi Arabian Grand Prix 2026', circuit: 'Jeddah Corniche Circuit', city: 'Jeddah', country: 'Saudi Arabia', continent: 'Middle East', date: '2026-04-19', status: 'completed', winner: null },
    { round: 6, grandPrixName: 'Miami Grand Prix', officialName: 'Formula 1 Crypto.com Miami Grand Prix 2026', circuit: 'Miami International Autodrome', city: 'Miami', country: 'USA', continent: 'North America', date: '2026-05-03', status: 'completed', winner: 'ANT' },
    { round: 7, grandPrixName: 'Canadian Grand Prix', officialName: 'Formula 1 Lenovo Grand Prix du Canada 2026', circuit: 'Circuit Gilles Villeneuve', city: 'Montreal', country: 'Canada', continent: 'North America', date: '2026-05-24', status: 'completed', winner: 'ANT' },
    { round: 8, grandPrixName: 'Monaco Grand Prix', officialName: 'Formula 1 Louis Vuitton Grand Prix de Monaco 2026', circuit: 'Circuit de Monaco', city: 'Monte Carlo', country: 'Monaco', continent: 'Europe', date: '2026-06-07', status: 'next', winner: null },
    { round: 9, grandPrixName: 'Spanish Grand Prix', officialName: 'Formula 1 MSC Cruises Gran Premio de Espana 2026', circuit: 'Circuit de Barcelona-Catalunya', city: 'Barcelona', country: 'Spain', continent: 'Europe', date: '2026-06-14', status: 'upcoming', winner: null },
    { round: 10, grandPrixName: 'Austrian Grand Prix', officialName: 'Formula 1 Lenovo Austrian Grand Prix 2026', circuit: 'Red Bull Ring', city: 'Spielberg', country: 'Austria', continent: 'Europe', date: '2026-06-28', status: 'upcoming', winner: null },
    { round: 11, grandPrixName: 'British Grand Prix', officialName: 'Formula 1 Pirelli British Grand Prix 2026', circuit: 'Silverstone Circuit', city: 'Silverstone', country: 'Great Britain', continent: 'Europe', date: '2026-07-05', status: 'upcoming', winner: null },
    { round: 12, grandPrixName: 'Belgian Grand Prix', officialName: 'Formula 1 Moet & Chandon Belgian Grand Prix 2026', circuit: 'Circuit de Spa-Francorchamps', city: 'Spa', country: 'Belgium', continent: 'Europe', date: '2026-07-19', status: 'upcoming', winner: null },
    { round: 13, grandPrixName: 'Hungarian Grand Prix', officialName: 'Formula 1 Hungarian Grand Prix 2026', circuit: 'Hungaroring', city: 'Budapest', country: 'Hungary', continent: 'Europe', date: '2026-07-26', status: 'upcoming', winner: null },
    { round: 14, grandPrixName: 'Dutch Grand Prix', officialName: 'Formula 1 Heineken Dutch Grand Prix 2026', circuit: 'Circuit Zandvoort', city: 'Zandvoort', country: 'Netherlands', continent: 'Europe', date: '2026-08-23', status: 'upcoming', winner: null },
    { round: 15, grandPrixName: 'Italian Grand Prix', officialName: 'Formula 1 Pirelli Gran Premio dItalia 2026', circuit: 'Autodromo Nazionale di Monza', city: 'Monza', country: 'Italy', continent: 'Europe', date: '2026-09-06', status: 'upcoming', winner: null },
    { round: 16, grandPrixName: 'Spanish Grand Prix', officialName: 'Formula 1 Tag Heuer Gran Premio de Espana 2026', circuit: 'Madring Circuit', city: 'Madrid', country: 'Spain', continent: 'Europe', date: '2026-09-13', status: 'upcoming', winner: null },
    { round: 17, grandPrixName: 'Azerbaijan Grand Prix', officialName: 'Formula 1 Qatar Airways Azerbaijan Grand Prix 2026', circuit: 'Baku City Circuit', city: 'Baku', country: 'Azerbaijan', continent: 'Asia', date: '2026-09-27', status: 'upcoming', winner: null },
    { round: 18, grandPrixName: 'Singapore Grand Prix', officialName: 'Formula 1 Singapore Airlines Singapore Grand Prix 2026', circuit: 'Marina Bay Street Circuit', city: 'Singapore', country: 'Singapore', continent: 'Asia', date: '2026-10-11', status: 'upcoming', winner: null },
    { round: 19, grandPrixName: 'United States Grand Prix', officialName: 'Formula 1 United States Grand Prix 2026', circuit: 'Circuit of the Americas', city: 'Austin', country: 'USA', continent: 'North America', date: '2026-10-25', status: 'upcoming', winner: null },
    { round: 20, grandPrixName: 'Mexico City Grand Prix', officialName: 'Formula 1 Gran Premio de la Ciudad de Mexico 2026', circuit: 'Autodromo Hermanos Rodriguez', city: 'Mexico City', country: 'Mexico', continent: 'North America', date: '2026-11-01', status: 'upcoming', winner: null },
    { round: 21, grandPrixName: 'Sao Paulo Grand Prix', officialName: 'Formula 1 Lenovo Grande Premio de Sao Paulo 2026', circuit: 'Autodromo Jose Carlos Pace', city: 'Sao Paulo', country: 'Brazil', continent: 'South America', date: '2026-11-08', status: 'upcoming', winner: null },
    { round: 22, grandPrixName: 'Las Vegas Grand Prix', officialName: 'Formula 1 Heineken Las Vegas Grand Prix 2026', circuit: 'Las Vegas Strip Circuit', city: 'Las Vegas', country: 'USA', continent: 'North America', date: '2026-11-21', status: 'upcoming', winner: null },
    { round: 23, grandPrixName: 'Qatar Grand Prix', officialName: 'Formula 1 Qatar Airways Qatar Grand Prix 2026', circuit: 'Lusail International Circuit', city: 'Lusail', country: 'Qatar', continent: 'Middle East', date: '2026-11-29', status: 'upcoming', winner: null },
    { round: 24, grandPrixName: 'Abu Dhabi Grand Prix', officialName: 'Formula 1 Etihad Airways Abu Dhabi Grand Prix 2026', circuit: 'Yas Marina Circuit', city: 'Abu Dhabi', country: 'UAE', continent: 'Middle East', date: '2026-12-06', status: 'upcoming', winner: null },
  ],
  circuitDetails: [
    { name: 'Albert Park Circuit', country: 'Australia', city: 'Melbourne', firstGrandPrix: 1996, lapRecord: '1:19.813', lapRecordHolder: 'Charles Leclerc', lapRecordYear: 2024, trackLength: '5.278 km', numberOfCorners: 14, numberOfDRSZones: 3, atmosphericDescription: 'A high-speed temporary street circuit winding through Melbourne scenic parklands with lakeside vistas.' },
    { name: 'Shanghai International Circuit', country: 'China', city: 'Shanghai', firstGrandPrix: 2004, lapRecord: '1:31.095', lapRecordHolder: 'Lewis Hamilton', lapRecordYear: 2024, trackLength: '5.451 km', numberOfCorners: 16, numberOfDRSZones: 3, atmosphericDescription: 'A sweeping modern circuit with the infamous climbing spiral Turn 1 that twists up and over itself.' },
    { name: 'Suzuka International Racing Course', country: 'Japan', city: 'Suzuka', firstGrandPrix: 1987, lapRecord: '1:30.983', lapRecordHolder: 'Lewis Hamilton', lapRecordYear: 2019, trackLength: '5.807 km', numberOfCorners: 18, numberOfDRSZones: 2, atmosphericDescription: 'A legendary figure-eight circuit that demands absolute precision through its high-speed esses.' },
    { name: 'Bahrain International Circuit', country: 'Bahrain', city: 'Sakhir', firstGrandPrix: 2004, lapRecord: '1:29.708', lapRecordHolder: 'Pedro de la Rosa', lapRecordYear: 2005, trackLength: '5.412 km', numberOfCorners: 15, numberOfDRSZones: 3, atmosphericDescription: 'A desert venue known for its long straights, heavy braking zones, and spectacular twilight racing.' },
    { name: 'Jeddah Corniche Circuit', country: 'Saudi Arabia', city: 'Jeddah', firstGrandPrix: 2021, lapRecord: '1:30.734', lapRecordHolder: 'Lewis Hamilton', lapRecordYear: 2021, trackLength: '6.174 km', numberOfCorners: 27, numberOfDRSZones: 3, atmosphericDescription: 'The fastest street circuit on the calendar with drivers flat-out through high-speed walls.' },
    { name: 'Miami International Autodrome', country: 'USA', city: 'Miami', firstGrandPrix: 2022, lapRecord: '1:29.708', lapRecordHolder: 'Max Verstappen', lapRecordYear: 2024, trackLength: '5.412 km', numberOfCorners: 19, numberOfDRSZones: 3, atmosphericDescription: 'A glitzy street circuit carved around Hard Rock Stadium with a yacht-lined marina section.' },
    { name: 'Circuit Gilles Villeneuve', country: 'Canada', city: 'Montreal', firstGrandPrix: 1978, lapRecord: '1:12.331', lapRecordHolder: 'Max Verstappen', lapRecordYear: 2025, trackLength: '4.361 km', numberOfCorners: 14, numberOfDRSZones: 2, atmosphericDescription: 'A high-speed semi-street circuit with the infamous Wall of Champions waiting to catch the unwary.' },
    { name: 'Circuit de Monaco', country: 'Monaco', city: 'Monte Carlo', firstGrandPrix: 1955, lapRecord: '1:10.166', lapRecordHolder: 'Lewis Hamilton', lapRecordYear: 2021, trackLength: '3.337 km', numberOfCorners: 19, numberOfDRSZones: 1, atmosphericDescription: 'The jewel of F1 where drivers dance between armco barriers at 280 km/h through casino square.' },
    { name: 'Circuit de Barcelona-Catalunya', country: 'Spain', city: 'Barcelona', firstGrandPrix: 1991, lapRecord: '1:16.330', lapRecordHolder: 'Max Verstappen', lapRecordYear: 2023, trackLength: '4.657 km', numberOfCorners: 14, numberOfDRSZones: 2, atmosphericDescription: 'A well-balanced circuit that serves as F1s ultimate pre-season testing benchmark.' },
    { name: 'Red Bull Ring', country: 'Austria', city: 'Spielberg', firstGrandPrix: 1970, lapRecord: '1:02.875', lapRecordHolder: 'Valtteri Bottas', lapRecordYear: 2020, trackLength: '4.318 km', numberOfCorners: 10, numberOfDRSZones: 3, atmosphericDescription: 'A short, muscular circuit set in the Styrian mountains with only ten corners of pure speed.' },
    { name: 'Silverstone Circuit', country: 'Great Britain', city: 'Silverstone', firstGrandPrix: 1950, lapRecord: '1:27.097', lapRecordHolder: 'Max Verstappen', lapRecordYear: 2024, trackLength: '5.891 km', numberOfCorners: 18, numberOfDRSZones: 2, atmosphericDescription: 'The spiritual home of F1 with flat-out sweeping corners that test a cars aerodynamic efficiency.' },
    { name: 'Circuit de Spa-Francorchamps', country: 'Belgium', city: 'Spa', firstGrandPrix: 1950, lapRecord: '1:42.553', lapRecordHolder: 'Lewis Hamilton', lapRecordYear: 2020, trackLength: '7.004 km', numberOfCorners: 19, numberOfDRSZones: 2, atmosphericDescription: 'The longest circuit on the calendar with the iconic Eau Rouge-Raidillon sequence that launches cars skyward.' },
    { name: 'Hungaroring', country: 'Hungary', city: 'Budapest', firstGrandPrix: 1986, lapRecord: '1:16.627', lapRecordHolder: 'Lewis Hamilton', lapRecordYear: 2020, trackLength: '4.381 km', numberOfCorners: 14, numberOfDRSZones: 2, atmosphericDescription: 'A tight, twisty circuit often called Monaco without the barriers where overtaking is a premium.' },
    { name: 'Circuit Zandvoort', country: 'Netherlands', city: 'Zandvoort', firstGrandPrix: 1952, lapRecord: '1:11.097', lapRecordHolder: 'Lewis Hamilton', lapRecordYear: 2021, trackLength: '4.259 km', numberOfCorners: 14, numberOfDRSZones: 2, atmosphericDescription: 'A classic seaside circuit reborn with banked corners that create a rollercoaster feel through the dunes.' },
    { name: 'Autodromo Nazionale di Monza', country: 'Italy', city: 'Monza', firstGrandPrix: 1950, lapRecord: '1:18.887', lapRecordHolder: 'Lewis Hamilton', lapRecordYear: 2020, trackLength: '5.793 km', numberOfCorners: 11, numberOfDRSZones: 2, atmosphericDescription: 'The Temple of Speed where cars exceed 350 km/h through the legendary Parabolica.' },
    { name: 'Madring Circuit', country: 'Spain', city: 'Madrid', firstGrandPrix: 2026, lapRecord: 'N/A', lapRecordHolder: 'TBD', lapRecordYear: 2026, trackLength: '5.470 km', numberOfCorners: 18, numberOfDRSZones: 3, atmosphericDescription: 'A brand-new circuit on the F1 calendar blending street sections with permanent track near the IFEMA exhibition center.' },
    { name: 'Baku City Circuit', country: 'Azerbaijan', city: 'Baku', firstGrandPrix: 2016, lapRecord: '1:43.009', lapRecordHolder: 'Charles Leclerc', lapRecordYear: 2024, trackLength: '6.003 km', numberOfCorners: 20, numberOfDRSZones: 2, atmosphericDescription: 'A dramatic anti-clockwise street circuit through Bakus old city with the narrow castle section.' },
    { name: 'Marina Bay Street Circuit', country: 'Singapore', city: 'Singapore', firstGrandPrix: 2008, lapRecord: '1:34.486', lapRecordHolder: 'Lewis Hamilton', lapRecordYear: 2023, trackLength: '4.940 km', numberOfCorners: 19, numberOfDRSZones: 3, atmosphericDescription: 'Asias only night race glows beneath floodlights through the streets of Singapore.' },
    { name: 'Circuit of the Americas', country: 'USA', city: 'Austin', firstGrandPrix: 2012, lapRecord: '1:34.486', lapRecordHolder: 'Max Verstappen', lapRecordYear: 2024, trackLength: '5.513 km', numberOfCorners: 20, numberOfDRSZones: 2, atmosphericDescription: 'A purpose-built American venue with a dramatic uphill blind Turn 1 and a stadium section.' },
    { name: 'Autodromo Hermanos Rodriguez', country: 'Mexico', city: 'Mexico City', firstGrandPrix: 1963, lapRecord: '1:17.774', lapRecordHolder: 'Max Verstappen', lapRecordYear: 2023, trackLength: '4.304 km', numberOfCorners: 17, numberOfDRSZones: 2, atmosphericDescription: 'The high-altitude stadium section roars as drivers thread through the baseball stadium at over 300 km/h.' },
    { name: 'Autodromo Jose Carlos Pace', country: 'Brazil', city: 'Sao Paulo', firstGrandPrix: 1973, lapRecord: '1:10.540', lapRecordHolder: 'Valtteri Bottas', lapRecordYear: 2018, trackLength: '4.309 km', numberOfCorners: 15, numberOfDRSZones: 2, atmosphericDescription: 'A bumpy, unpredictable anti-clockwise circuit where the Senna S sets the tone for the entire lap.' },
    { name: 'Las Vegas Strip Circuit', country: 'USA', city: 'Las Vegas', firstGrandPrix: 2023, lapRecord: '1:33.412', lapRecordHolder: 'Max Verstappen', lapRecordYear: 2024, trackLength: '6.201 km', numberOfCorners: 17, numberOfDRSZones: 3, atmosphericDescription: 'A neon-drenched straight-line blast down the Vegas Strip at nearly 340 km/h past the Bellagio.' },
    { name: 'Lusail International Circuit', country: 'Qatar', city: 'Lusail', firstGrandPrix: 2021, lapRecord: '1:22.384', lapRecordHolder: 'Max Verstappen', lapRecordYear: 2024, trackLength: '5.419 km', numberOfCorners: 16, numberOfDRSZones: 2, atmosphericDescription: 'A floodlit desert track where high-speed sweeping corners test tire endurance to the absolute limit.' },
    { name: 'Yas Marina Circuit', country: 'UAE', city: 'Abu Dhabi', firstGrandPrix: 2009, lapRecord: '1:22.384', lapRecordHolder: 'Max Verstappen', lapRecordYear: 2024, trackLength: '5.281 km', numberOfCorners: 16, numberOfDRSZones: 2, atmosphericDescription: 'A twilight marina circuit ending the season with a sunset-to-floodlit finale through the Yas Hotel.' },
  ],
  seasonStats: { totalRaces: 24, racesCompleted: 5, racesRemaining: 19, currentLeaderDriver: 'Kimi Antonelli', currentLeaderTeam: 'Mercedes', currentLeaderPoints: 131, closestTitleBattle: 'Russell is 43 points behind Antonelli in an all-Mercedes fight at the top of the standings.', mostWinsDriver: 'Kimi Antonelli' },
  latestRaceResult: { raceName: 'Canadian Grand Prix', date: '2026-05-24', winner: 'Kimi Antonelli', team: 'Mercedes', fastestLap: '1:14.215', fastestLapHolder: 'Kimi Antonelli', podium: [{ position: 1, driver: 'Kimi Antonelli', team: 'Mercedes' }, { position: 2, driver: 'Lewis Hamilton', team: 'Ferrari' }, { position: 3, driver: 'Max Verstappen', team: 'Red Bull Racing' }] },
  headlineNews: [
    'Antonelli dominates early 2026 season with four wins in five races for Mercedes.',
    'Ferrari and McLaren locked in tight battle for second as constructor standings take shape.',
    'New 2026 active aero regulations produce closest racing in F1 history across the opening rounds.',
  ],
}

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

const containerVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

const continentGradients = {
  Europe: 'from-emerald-900/60 via-black to-yellow-900/30',
  'Middle East': 'from-purple-900/60 via-black to-amber-900/30',
  'North America': 'from-blue-900/60 via-black to-red-900/30',
  'South America': 'from-teal-900/60 via-black to-green-900/30',
  Asia: 'from-indigo-900/60 via-black to-cyan-900/30',
  Oceania: 'from-sky-900/60 via-black to-blue-900/30',
}

function Section({ id, children, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      id={id}
      ref={ref}
      variants={sectionVariant}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`px-4 sm:px-8 lg:px-16 xl:px-24 py-20 md:py-32 ${className}`}
    >
      {children}
    </motion.section>
  )
}

function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9998, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.035\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '256px 256px', mixBlendMode: 'overlay' }}
    />
  )
}

function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const cursorRef = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    function move(e) {
      cursorRef.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    function animate() {
      ringPos.current.x += (cursorRef.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (cursorRef.current.y - ringPos.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`
      }
      raf = requestAnimationFrame(animate)
    }
    let raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <div ref={dotRef} className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none" style={{ zIndex: 99999, backgroundColor: C.red }} />
      <div ref={ringRef} className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none border" style={{ zIndex: 99999, borderColor: C.red, borderWidth: '1.5px', transition: 'border-width 0.2s' }} />
    </>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  return (
    <motion.div
      className="fixed top-0 left-0 h-[3px] z-[9999]"
      style={{ width, backgroundColor: C.red }}
    />
  )
}

function Navbar({ show, season, onSeasonChange, view, onViewChange, nextRace }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    function handle() { setScrolled(window.scrollY > 80) }
    window.addEventListener('scroll', handle)
    return () => window.removeEventListener('scroll', handle)
  }, [])

  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  useEffect(() => {
    if (!nextRace) return
    function tick() {
      const diff = new Date(nextRace.date).getTime() - Date.now()
      if (diff <= 0) { setCountdown(''); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setCountdown(`${d}d ${h}h ${m}m`)
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [nextRace])

  const years = Array.from({ length: 10 }, (_, i) => (2026 - i).toString())

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-[1000] px-4 sm:px-8 lg:px-16 xl:px-24 transition-all duration-300 ${scrolled ? 'bg-[#080808]/85 backdrop-blur-md' : 'bg-transparent'}`}
      style={scrolled ? { backdropFilter: 'blur(12px)' } : {}}
    >
      <div className="flex items-center justify-between h-16 md:h-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <span className="font-bebas text-3xl md:text-4xl tracking-wider" style={{ color: C.red }}>F1</span>
          {countdown && (
            <div className="hidden md:flex items-center gap-1.5 font-barlow text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, color: C.gold }}>
              <Timer size={10} />
              {nextRace?.grandPrixName}: {countdown}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(o => !o)}
              className="font-bebas text-2xl md:text-3xl tracking-wider flex items-center gap-1.5"
              style={{ color: C.text }}
            >
              {season}
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs inline-block"
                style={{ color: C.red }}
              >▾</motion.span>
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 top-full mt-2 rounded-lg overflow-hidden min-w-[5rem]"
                  style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                >
                  {years.map(y => (
                    <button
                      key={y}
                      onClick={() => { onSeasonChange(y); setOpen(false) }}
                      className={`block w-full text-left font-bebas text-xl tracking-wider px-4 py-2 transition-colors ${y === season ? '' : 'opacity-50 hover:opacity-100'}`}
                      style={{ color: y === season ? C.red : C.text, backgroundColor: y === season ? C.redDim : 'transparent' }}
                    >
                      {y}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            <button
              onClick={() => onViewChange('overview')}
              className={`font-barlow text-xs md:text-sm uppercase tracking-widest transition-colors ${view === 'overview' ? '' : 'opacity-40 hover:opacity-70'}`}
              style={{ color: view === 'overview' ? C.red : C.text }}
            >
              Overview
            </button>
            <button
              onClick={() => onViewChange('standings')}
              className={`font-barlow text-xs md:text-sm uppercase tracking-widest transition-colors ${view === 'standings' ? '' : 'opacity-40 hover:opacity-70'}`}
              style={{ color: view === 'standings' ? C.red : C.text }}
            >
              Standings
            </button>
            <button
              onClick={() => onViewChange('drivers')}
              className={`font-barlow text-xs md:text-sm uppercase tracking-widest transition-colors ${view === 'drivers' ? '' : 'opacity-40 hover:opacity-70'}`}
              style={{ color: view === 'drivers' ? C.red : C.text }}
            >
              Drivers
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

function Preloader({ loaded, year }) {
  const [minTime, setMinTime] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMinTime(true), 2000)
    return () => clearTimeout(t)
  }, [])

  const exit = loaded && minTime

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
          style={{ backgroundColor: C.bg }}
        >
          <motion.h1
            animate={{ scale: [0.97, 1.03, 0.97], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="font-bebas text-6xl md:text-8xl tracking-[0.08em]"
            style={{ color: C.red }}
          >
            FORMULA 1
          </motion.h1>
          <p className="font-barlow text-sm tracking-widest mt-8 uppercase" style={{ color: C.muted }}>Fetching {year} season data...</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function HeroSection({ seasonStats, latestRaceResult }) {
  const streaks = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    width: `${30 + Math.random() * 60}px`,
    height: `${1 + Math.random() * 2}px`,
    top: `${5 + Math.random() * 90}%`,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 4,
    opacity: 0.15 + Math.random() * 0.25,
  }))

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center" style={{ backgroundColor: C.bg }}>
      {streaks.map(s => (
        <motion.div
          key={s.id}
          className="absolute left-0"
          style={{
            width: s.width, height: s.height, top: s.top,
            background: `linear-gradient(90deg, transparent, ${C.red}, transparent)`,
            opacity: s.opacity,
          }}
          animate={{ x: ['-100vw', '100vw'] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'linear' }}
        />
      ))}
      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        className="text-center px-4 z-10"
      >
        <motion.p variants={cardVariant} className="font-barlow text-xs md:text-sm tracking-[0.25em] uppercase mb-4" style={{ color: C.red }}>
          2026 Formula One World Championship
        </motion.p>
        <motion.h1 variants={cardVariant} className="font-bebas leading-none" style={{ fontSize: 'clamp(2.5rem, 10vw, 14vw)' }}>
          <span className="block">WHERE TENTHS</span>
          <span className="block">OF SECONDS</span>
          <span className="block" style={{ color: C.red }}>DECIDE LEGENDS</span>
        </motion.h1>
        {seasonStats && (
          <motion.p variants={cardVariant} className="font-barlow text-sm md:text-base tracking-wider mt-4" style={{ color: C.muted }}>
            Led by {seasonStats.currentLeaderDriver} with {seasonStats.currentLeaderPoints} points
          </motion.p>
        )}
        <motion.p variants={cardVariant} className="font-playfair italic text-base md:text-lg mt-3" style={{ color: C.muted }}>
          350 km/h. 22 drivers. One crown.
        </motion.p>
        <motion.a
          variants={cardVariant}
          whileHover={{ boxShadow: `0 0 40px ${C.redGlow}, 0 0 80px ${C.redGlow}` }}
          href="#narrative"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-barlow text-sm uppercase tracking-widest mt-10 transition-all"
          style={{ backgroundColor: C.red, color: '#fff' }}
          onClick={e => { e.preventDefault(); document.querySelector('#narrative')?.scrollIntoView({ behavior: 'smooth' }) }}
        >
          Explore the Season <ChevronRight size={16} />
        </motion.a>
      </motion.div>
    </section>
  )
}

function MarqueeTicker({ drivers }) {
  if (!drivers?.length) return null
  const names = drivers.map(d => d.shortName).join(' · ')
  return (
    <div className="w-full overflow-hidden py-3 md:py-4" style={{ backgroundColor: C.red }}>
      <div className="whitespace-nowrap animate-marquee" style={{ display: 'inline-block', animation: 'marquee 30s linear infinite' }}>
        <span className="font-bebas text-lg md:text-2xl tracking-[0.2em] uppercase text-white" style={{ paddingRight: '4rem' }}>{names} · </span>
        <span className="font-bebas text-lg md:text-2xl tracking-[0.2em] uppercase text-white" style={{ paddingRight: '4rem' }}>{names} · </span>
      </div>
    </div>
  )
}

function SeasonNarrative({ seasonStats }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <Section id="narrative">
      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
        <div className="relative">
          <span className="font-bebas leading-none select-none" style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', color: C.red, opacity: 0.08, position: 'absolute', top: '-2rem', left: '-1rem' }}>2026</span>
          <h2 className="relative font-bebas leading-tight z-10" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: C.text }}>
            {seasonStats?.racesCompleted || 0} Races Down.
          </h2>
          <h2 className="relative font-bebas leading-tight z-10" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: C.text }}>
            {seasonStats?.racesRemaining || 0} To Go.
          </h2>
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-[3px] h-32 origin-top mt-6"
            style={{ backgroundColor: C.red }}
          />
        </div>
        <div className="font-barlow text-base md:text-lg leading-relaxed tracking-wide" style={{ color: C.muted }}>
          {seasonStats ? (
            <p>
              The 2026 season is unfolding with unprecedented intensity. <strong style={{ color: C.text }}>{seasonStats.currentLeaderDriver}</strong> leads the championship for <strong style={{ color: C.text }}>{seasonStats.currentLeaderTeam}</strong> with <strong style={{ color: C.text }}>{seasonStats.currentLeaderPoints}</strong> points. 
              {' '}{seasonStats.closestTitleBattle} The season has delivered {seasonStats.racesCompleted} thrilling races so far, with {seasonStats.racesRemaining} still to come across the globe.
            </p>
          ) : (
            <p>The 2026 season is unfolding with unprecedented intensity across a 22-race calendar that spans the globe.</p>
          )}
        </div>
      </div>
    </Section>
  )
}

const careerCache = new Map()

function DriverDetail({ driver, season, onClose }) {
  const [career, setCareer] = useState(() => careerCache.get(driver.driverId) || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (career) return
    if (careerCache.has(driver.driverId)) {
      setCareer(careerCache.get(driver.driverId))
      return
    }
    setLoading(true)
    const perPage = 100
    const firstUrl = `${JOLPICA_BASE}/drivers/${driver.driverId}/results.json?limit=${perPage}&offset=0`
    fetch(firstUrl)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(async firstPage => {
        const total = parseInt(firstPage.MRData.total)
        const allRaces = [...(firstPage.MRData.RaceTable?.Races || [])]
        const pages = Math.ceil(total / perPage)
        const extraPages = []
        for (let p = 1; p < pages; p++) {
          extraPages.push(
            fetch(`${JOLPICA_BASE}/drivers/${driver.driverId}/results.json?limit=${perPage}&offset=${p * perPage}`)
              .then(r => r.json())
              .then(d => d.MRData.RaceTable?.Races || [])
          )
        }
        const extraRaces = await Promise.all(extraPages)
        for (const races of extraRaces) allRaces.push(...races)

        let starts = 0, wins = 0, podiums = 0, fls = 0, totalPts = 0
        for (const race of allRaces) {
          for (const res of (race.Results || [])) {
            const pos = parseInt(res.position)
            if (isNaN(pos)) continue
            starts++
            if (pos === 1) wins++
            if (pos <= 3) podiums++
            if (res.FastestLap?.rank === '1') fls++
            totalPts += parseInt(res.points) || 0
          }
        }
        const processed = { starts, wins, podiums, fastestLaps: fls, points: totalPts }
        careerCache.set(driver.driverId, processed)
        setCareer(processed)
        setLoading(false)
      })
      .catch(e => {
        console.error('Career fetch failed:', driver.driverId, e)
        setLoading(false)
      })
  }, [driver.driverId])

  if (!driver) return null

  const positionColor = pos => {
    if (pos === 1) return '#C9A84C'
    if (pos === 2) return '#A0A0A0'
    if (pos === 3) return '#8B6914'
    return C.muted
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="h-2 flex-shrink-0" style={{ backgroundColor: C.red }} />
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center font-bebas text-4xl md:text-5xl flex-shrink-0" style={{ backgroundColor: C.redDim, color: C.red }}>
              {driver.shortName}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-bebas text-2xl md:text-3xl leading-tight" style={{ color: C.text }}>{FLAGS[driver.nationality]} {driver.fullName}</h2>
                  <p className="font-barlow text-sm tracking-wider uppercase mt-0.5" style={{ color: driver.teamColor || C.red }}>{driver.team}</p>
                </div>
                <button
                  onClick={onClose}
                  className="font-barlow text-lg leading-none p-1 rounded-full flex-shrink-0 -mr-1 -mt-1"
                  style={{ color: C.muted }}
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-barlow text-xs px-2 py-0.5 rounded" style={{ backgroundColor: C.redDim, color: C.red }}>P{driver.championshipPosition}</span>
                <span className="font-barlow text-xs tracking-wider" style={{ color: C.muted }}>#{driver.number} · {driver.nationality}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-3 mt-6">
            <StatBox label="PTS" value={driver.points} />
            <StatBox label="WINS" value={driver.wins} />
            <StatBox label="PODIUMS" value={driver.podiums} />
            <StatBox label="FASTEST" value={driver.fastestLaps} />
          </div>
          {career ? (
            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: C.surface }}>
              <p className="font-barlow text-xs tracking-widest uppercase mb-3" style={{ color: C.gold }}>Career</p>
              <div className="grid grid-cols-5 gap-2">
                <CareerStat label="STARTS" value={career.starts} />
                <CareerStat label="WINS" value={career.wins} />
                <CareerStat label="PODIUMS" value={career.podiums} />
                <CareerStat label="POINTS" value={career.points} />
                <CareerStat label="F. LAPS" value={career.fastestLaps} />
              </div>
            </div>
          ) : loading ? (
            <div className="mt-6 flex items-center justify-center py-6" style={{ backgroundColor: C.surface, borderRadius: '0.5rem' }}>
              <div className="w-5 h-5 rounded-full border-2 mr-3" style={{ borderColor: C.red, borderTopColor: 'transparent' }} />
              <span className="font-barlow text-xs tracking-wider" style={{ color: C.muted }}>Loading career stats…</span>
            </div>
          ) : (
            <div className="mt-6 p-4 rounded-lg text-center" style={{ backgroundColor: C.surface }}>
              <p className="font-barlow text-xs tracking-wider" style={{ color: C.muted }}>Career stats unavailable</p>
            </div>
          )}
          <div className="mt-6">
            <p className="font-barlow text-xs tracking-widest uppercase mb-3" style={{ color: C.muted }}>{season} Race Results</p>
            {driver.history?.length > 0 ? (
              <div className="space-y-1.5">
                {driver.history.map(h => (
                  <div
                    key={h.round}
                    className="flex items-center gap-3 px-3 py-2 rounded"
                    style={{ backgroundColor: C.surface }}
                  >
                    <span className="font-barlow text-xs tracking-widest w-6 flex-shrink-0" style={{ color: C.muted }}>R{h.round}</span>
                    <div className="flex items-center gap-2 w-8 flex-shrink-0 justify-center">
                      <span className="font-bebas text-lg leading-none" style={{ color: positionColor(h.position) }}>P{h.position}</span>
                    </div>
                    <span className="font-barlow text-xs tracking-wide flex-1 truncate" style={{ color: C.text }}>{h.raceName}</span>
                    <span className="font-barlow text-xs tracking-wider flex-shrink-0" style={{ color: C.muted }}>{h.points} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-barlow text-xs tracking-wide" style={{ color: C.muted }}>No result data available yet</p>
            )}
          </div>
          {driver.funFact && (
            <p className="font-playfair italic text-xs mt-5 leading-relaxed" style={{ color: C.muted }}>
              {driver.funFact}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function CareerStat({ label, value }) {
  return (
    <div className="text-center">
      <p className="font-bebas text-lg leading-none" style={{ color: C.text }}>{value}</p>
      <p className="font-barlow text-xs tracking-widest uppercase mt-1" style={{ color: C.muted }}>{label}</p>
    </div>
  )
}

function StatBox({ label, value, small }) {
  return (
    <div className="rounded-lg p-3 text-center" style={{ backgroundColor: C.surface }}>
      <p className={`font-barlow tracking-widest uppercase`} style={{ fontSize: small ? '8px' : '10px', color: C.muted }}>{label}</p>
      <p className={`font-bebas leading-none mt-1`} style={{ fontSize: small ? '1rem' : '1.5rem', color: C.text }}>{value}</p>
    </div>
  )
}

function CountUp({ value, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 800
    const step = Math.max(1, Math.floor(value / 20))
    const interval = setInterval(() => {
      start += step
      if (start >= value) { start = value; clearInterval(interval) }
      setDisplay(start)
    }, duration / (value / step))
    return () => clearInterval(interval)
  }, [isInView, value])

  return <span ref={ref} className={className}>{display}</span>
}

function DriversGrid({ drivers, season }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')

  if (!drivers?.length) return null

  const filtered = query
    ? drivers.filter(d =>
        d.fullName.toLowerCase().includes(query.toLowerCase()) ||
        d.team.toLowerCase().includes(query.toLowerCase()) ||
        d.shortName.toLowerCase().includes(query.toLowerCase())
      )
    : drivers

  return (
    <Section id="drivers">
      <AnimatePresence>
        {selected && <DriverDetail driver={selected} season={season} onClose={() => setSelected(null)} />}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          className="font-bebas mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.text }}
        >
          The {season} Grid
        </motion.h2>
        <div className="mb-6 max-w-xs">
          <input
            type="text"
            placeholder="Search driver or team…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg font-barlow text-sm tracking-wide outline-none transition-colors"
            style={{ backgroundColor: C.surface, color: C.text, border: `1px solid ${query ? C.red : C.border}` }}
          />
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-[3px] w-24 mb-12 origin-left"
          style={{ backgroundColor: C.red }}
        />
        <motion.div
          ref={ref}
          variants={containerVariant}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filtered.map(driver => (
            <motion.div
              key={driver.shortName}
              variants={cardVariant}
              whileHover={{ y: -6, boxShadow: `0 10px 40px ${driver.teamColor}33` }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden rounded p-5 border-t-[3px] transition-colors cursor-pointer"
              style={{ backgroundColor: C.card, borderTopColor: driver.teamColor }}
              onClick={() => setSelected(driver)}
              layout
            >
              <span className="font-bebas absolute -top-1 -right-1 leading-none select-none" style={{ fontSize: 'clamp(4rem, 8vw, 6rem)', color: driver.teamColor, opacity: 0.08 }}>{driver.number}</span>
              <h3 className="font-bebas text-xl md:text-2xl relative z-10" style={{ color: C.text }}>{FLAGS[driver.nationality]} {driver.fullName}</h3>
              <p className="font-barlow text-sm tracking-wider uppercase relative z-10" style={{ color: driver.teamColor }}>{driver.team}</p>
              <div className="flex items-center gap-2 mt-2 relative z-10">
                <span className="font-barlow text-xs px-2 py-0.5 rounded" style={{ backgroundColor: driver.teamColor + '22', color: driver.teamColor }}>P{driver.championshipPosition}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 relative z-10">
                <Pill label="PTS" value={driver.points} />
                <Pill label="WINS" value={driver.wins} />
                <Pill label="PODIUMS" value={driver.podiums} />
                <Pill label="POLES" value={driver.poles} />
              </div>
              {driver.funFact && (
                <p className="font-playfair italic text-xs mt-3 leading-relaxed relative z-10" style={{ color: C.muted }}>{driver.funFact}</p>
              )}
            </motion.div>
          ))}
        </motion.div>
        {query && !filtered.length && (
          <p className="font-barlow text-sm tracking-wider text-center py-12" style={{ color: C.muted }}>No drivers match &ldquo;{query}&rdquo;</p>
        )}
      </div>
    </Section>
  )
}

function Pill({ label, value }) {
  return (
    <span className="font-barlow text-xs tracking-wider uppercase px-2.5 py-1 rounded flex items-center gap-1" style={{ backgroundColor: C.surface, color: C.muted }}>
      <CountUp value={value} className="font-semibold" style={{ color: C.text }} /> {label}
    </span>
  )
}

function ConstructorDetail({ constructor, onClose }) {
  const [expandedRound, setExpandedRound] = useState(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!constructor) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="h-2 flex-shrink-0" style={{ backgroundColor: constructor.color }} />
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bebas text-3xl" style={{ color: C.text }}>{constructor.name}</h2>
              <p className="font-barlow text-xs tracking-widest uppercase mt-1" style={{ color: C.muted }}>P{constructor.position} · {constructor.points} pts · {constructor.wins} win{constructor.wins !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={onClose} className="font-barlow text-lg leading-none p-1 rounded-full flex-shrink-0" style={{ color: C.muted }}>✕</button>
          </div>

          <div className="mb-6">
            <p className="font-barlow text-xs tracking-widest uppercase mb-2" style={{ color: C.gold }}>Drivers</p>
            <div className="space-y-2">
              {constructor.drivers?.map(d => (
                <div key={d.number} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ backgroundColor: C.surface }}>
                  <span className="font-barlow text-sm font-semibold tracking-wide" style={{ color: C.text }}>{d.fullName}</span>
                  <span className="font-barlow text-xs tracking-wider" style={{ color: C.muted }}>{d.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          <p className="font-barlow text-xs tracking-widest uppercase mb-3" style={{ color: C.gold }}>Round-by-Round Points</p>
          <div className="space-y-1">
            {(constructor.pointsProgression || []).map(p => {
              const prev = constructor.pointsProgression[constructor.pointsProgression.indexOf(p) - 1]
              const roundPts = prev ? p.points - prev.points : p.points
              const open = expandedRound === p.round
              return (
                <div key={p.round} className="rounded-lg overflow-hidden" style={{ backgroundColor: C.surface }}>
                  <button onClick={() => setExpandedRound(open ? null : p.round)} className="w-full flex items-center justify-between px-3 py-2 text-left">
                    <div className="flex items-center gap-3">
                      <span className="font-barlow text-xs tracking-widest" style={{ color: C.muted }}>R{p.round}</span>
                      <span className="font-barlow text-xs font-semibold" style={{ color: C.text }}>+{roundPts} pts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-barlow text-xs tracking-wider" style={{ color: C.gold }}>{p.points} cum.</span>
                      <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-xs" style={{ color: C.muted }}>▾</motion.span>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ConstructorChart({ constructors }) {
  const [selected, setSelected] = useState(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const height = (constructors?.length || 0) * 52 + 40

  if (!constructors?.length) return null

  const maxPts = Math.max(...constructors.map(c => c.points))

  function CustomLabel({ x, y, width, height, value }) {
    return (
      <text x={Number(x) + Number(width) + 12} y={Number(y) + Number(height) / 2 + 1} fill={C.text} textAnchor="start" dominantBaseline="middle" className="font-bebas text-sm" style={{ fontFamily: 'Bebas Neue', fontSize: 14, letterSpacing: '0.03em' }}>
        {value}
      </text>
    )
  }

  function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="p-3 rounded" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
          <p className="font-barlow text-xs tracking-widest uppercase" style={{ color: C.muted }}>{d.name}</p>
        </div>
        <p className="font-bebas text-2xl tracking-wide" style={{ color: C.text }}>{d.points} <span className="font-barlow text-xs tracking-widest uppercase" style={{ color: C.muted }}>pts</span></p>
        <p className="font-barlow text-xs tracking-wider mt-1" style={{ color: C.muted }}>P{d.position} · {d.wins} win{d.wins !== 1 ? 's' : ''}</p>
        <p className="font-barlow text-xs tracking-wider mt-0.5" style={{ color: C.gold }}>Tap for details</p>
      </div>
    )
  }

  return (
    <Section id="constructors">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="font-bebas mb-10" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.text }}>
          Constructors&apos; Battle
        </h2>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={constructors} layout="vertical" margin={{ top: 0, right: 60, left: 0, bottom: 0 }} barCategoryGap={6}>
            <XAxis type="number" hide domain={[0, maxPts * 1.15]} />
            <YAxis type="category" dataKey="shortName" tick={{ fill: C.text, fontSize: 13, fontFamily: 'Barlow Condensed', letterSpacing: '0.05em', fontWeight: 600 }} axisLine={false} tickLine={false} width={85} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="points" radius={[0, 3, 3, 0]} animationDuration={1200} minBarSize={14} label={<CustomLabel />} onClick={(entry) => setSelected(constructors.find(c => c.shortName === entry.shortName))} style={{ cursor: 'pointer' }}>
              {constructors.map((entry, idx) => (
                <Cell key={idx} fill={entry.color || C.red} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
      <AnimatePresence>
        {selected && <ConstructorDetail constructor={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </Section>
  )
}

function LatestRaceResult({ latestRaceResult }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  if (!latestRaceResult) return null

  const { podium, raceName, date, fastestLap, fastestLapHolder } = latestRaceResult
  const sorted = [...(podium || [])].sort((a, b) => a.position - b.position)
  const p1 = sorted.find(p => p.position === 1)
  const p2 = sorted.find(p => p.position === 2)
  const p3 = sorted.find(p => p.position === 3)

  return (
    <Section id="results">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="font-bebas mb-1" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.text }}>{raceName}</h2>
        <p className="font-barlow text-sm tracking-wider uppercase mb-12" style={{ color: C.muted }}>{date}</p>
        <div className="flex items-end justify-center gap-4 md:gap-8">
          {p2 && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center p-6 rounded-lg w-36 md:w-48"
              style={{ backgroundColor: C.card }}
            >
              <span className="font-bebas text-5xl md:text-6xl" style={{ color: C.muted }}>P{p2.position}</span>
              <span className="font-bebas text-lg md:text-xl mt-1" style={{ color: C.text }}>{p2.driver}</span>
              <span className="font-barlow text-xs tracking-wider uppercase" style={{ color: C.red }}>{p2.team}</span>
            </motion.div>
          )}
          {p1 && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center p-8 rounded-lg w-44 md:w-60 -mt-8"
              style={{ backgroundColor: C.card, border: `2px solid ${C.gold}` }}
            >
              <Trophy size={32} style={{ color: C.gold }} />
              <span className="font-bebas text-6xl md:text-7xl" style={{ color: C.text }}>P{p1.position}</span>
              <span className="font-bebas text-xl md:text-2xl mt-1" style={{ color: C.text }}>{p1.driver}</span>
              <span className="font-barlow text-sm tracking-wider uppercase" style={{ color: C.red }}>{p1.team}</span>
            </motion.div>
          )}
          {p3 && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center p-6 rounded-lg w-36 md:w-48"
              style={{ backgroundColor: C.card }}
            >
              <span className="font-bebas text-5xl md:text-6xl" style={{ color: C.muted }}>P{p3.position}</span>
              <span className="font-bebas text-lg md:text-xl mt-1" style={{ color: C.text }}>{p3.driver}</span>
              <span className="font-barlow text-xs tracking-wider uppercase" style={{ color: C.red }}>{p3.team}</span>
            </motion.div>
          )}
        </div>
        {fastestLap && (
          <div className="flex justify-center mt-8">
            <span className="font-barlow text-xs tracking-wider uppercase px-3 py-1.5 rounded-full inline-flex items-center gap-1.5" style={{ backgroundColor: C.redDim, color: C.red }}>
              <Zap size={12} /> Fastest Lap: {fastestLapHolder} — {fastestLap}
            </span>
          </div>
        )}
      </motion.div>
    </Section>
  )
}

function CircuitSpotlight({ circuitDetails }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  if (!circuitDetails?.length) return null

  const grad = c => continentGradients[c.continent] || continentGradients.Europe

  return (
    <Section id="circuits">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          className="font-bebas mb-12" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.text }}
        >
          2026 Circuits
        </motion.h2>
        <motion.div
          ref={ref}
          variants={containerVariant}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {circuitDetails.map(circuit => (
            <motion.div
              key={circuit.name}
              variants={cardVariant}
              whileHover={{ boxShadow: `0 0 30px ${C.redGlow}` }}
              className="relative overflow-hidden rounded-lg p-6 min-h-[380px] flex flex-col justify-end"
              style={{ backgroundColor: C.card }}
            >
              {circuit.image && (
                <img
                  src={circuit.image}
                  alt={circuit.name}
                  className="absolute inset-0 w-full h-full object-contain p-4 select-none pointer-events-none"
                  style={{ opacity: 0.15 }}
                />
              )}
              <div className={`absolute inset-0 bg-gradient-to-br ${grad(circuit)}`} />
              <div className="relative z-10">
                <h3 className="font-bebas text-2xl md:text-3xl" style={{ color: C.text }}>{circuit.name}</h3>
                <p className="font-barlow text-sm tracking-wider uppercase" style={{ color: C.red }}>
                  <MapPin size={12} className="inline mr-1" />{circuit.city}, {circuit.country}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Pill label="Track" value={circuit.trackLength} />
                  <Pill label="Corners" value={circuit.numberOfCorners} />
                  <Pill label="DRS" value={circuit.numberOfDRSZones} />
                  <Pill label="Record" value={circuit.lapRecord} />
                  <Pill label="Holder" value={circuit.lapRecordHolder} />
                  <Pill label="Since" value={circuit.firstGrandPrix} />
                </div>
                <p className="font-playfair italic text-xs mt-4 leading-relaxed" style={{ color: C.muted }}>
                  {circuit.atmosphericDescription}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}

function QuoteSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const words = 'To finish first, first you must finish.'.split(' ')

  return (
    <section className="h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: C.bg }}>
      <div ref={ref} className="text-center max-w-4xl">
        <motion.p
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          className="font-playfair italic leading-relaxed" style={{ fontSize: 'clamp(1.5rem, 3vw, 4rem)', color: C.text }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block mr-[0.3em]"
            >
              {word}
            </motion.span>
          ))}
        </motion.p>
        <p className="font-barlow text-sm tracking-widest uppercase mt-6" style={{ color: C.muted }}>— Niki Lauda</p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-[2px] mt-8 mx-auto w-24"
          style={{ backgroundColor: C.red }}
        />
      </div>
    </section>
  )
}

function RaceCalendar({ calendar }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [expanded, setExpanded] = useState(null)

  if (!calendar?.length) return null

  const continentColors = {
    Europe: '#22c55e',
    'Middle East': '#d97706',
    'North America': '#3b82f6',
    'South America': '#14b8a6',
    Asia: '#8b5cf6',
    Oceania: '#06b6d4',
  }

  const sessionLabels = {
    FirstPractice: 'FP1',
    SecondPractice: 'FP2',
    ThirdPractice: 'FP3',
    Qualifying: 'Quali',
    SprintQualifying: 'SQ',
    SprintShootout: 'SS',
    Sprint: 'Sprint',
  }

  return (
    <Section id="calendar">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          className="font-bebas mb-8" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.text }}
        >
          2026 Race Calendar
        </motion.h2>
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {calendar.map(race => {
            const isOpen = expanded === race.round
            const sess = race.sessions || {}
            const hasSessions = Object.keys(sess).length > 0
            return (
              <div key={race.round} className="flex-shrink-0" style={{ width: isOpen ? 280 : 200 }}>
                <motion.div
                  animate={{ width: isOpen ? 280 : 200 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={`rounded-lg p-4 flex flex-col relative overflow-hidden ${
                    race.status === 'next' ? 'border-2' : 'border'
                  }`}
                  style={{
                    backgroundColor: C.card,
                    borderColor: race.status === 'next' ? C.red : C.border,
                    opacity: race.status === 'completed' ? 0.4 : 1,
                    minHeight: isOpen ? 300 : 240,
                  }}
                >
                  <div>
                    <p className="font-barlow text-xs tracking-widest uppercase" style={{ color: C.muted }}>Round {race.round}</p>
                    <h3 className="font-bebas text-lg mt-1 leading-tight" style={{ color: C.text }}>{race.grandPrixName}</h3>
                    <p className="font-barlow text-xs tracking-wider mt-1" style={{ color: C.muted }}>{race.circuit}</p>
                  </div>
                  <div className="mt-auto">
                    <p className="font-barlow text-sm tracking-wider uppercase" style={{ color: C.red, textDecoration: race.status === 'completed' ? 'line-through' : 'none' }}>
                      {race.date?.split('T')[0] || race.date}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: continentColors[race.continent] || C.muted }} />
                      {race.status === 'next' && (
                        <span className="font-barlow text-xs tracking-widest uppercase px-2 py-0.5 rounded" style={{ backgroundColor: C.red, color: '#fff' }}>Next</span>
                      )}
                      {race.status === 'completed' && race.winner && (
                        <span className="font-barlow text-xs tracking-widest uppercase px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>{race.winner}</span>
                      )}
                    </div>
                    {hasSessions && (
                      <button onClick={() => setExpanded(isOpen ? null : race.round)} className="mt-3 flex items-center gap-1 font-barlow text-xs tracking-widest uppercase transition-colors" style={{ color: C.muted }}>
                        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>▾</motion.span>
                        Session Times
                      </button>
                    )}
                    <AnimatePresence>
                      {isOpen && hasSessions && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="mt-3 space-y-1 overflow-hidden">
                          {Object.entries(sess).map(([key, time]) => (
                            <div key={key} className="flex items-center justify-between font-barlow text-xs tracking-wider" style={{ color: C.text }}>
                              <span style={{ color: C.red }}>{sessionLabels[key] || key}</span>
                              <span style={{ color: C.muted }}>{time}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

function NewsStrip({ headlineNews }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  if (!headlineNews?.length) return null

  return (
    <Section id="news">
      <motion.div
        ref={ref}
        variants={containerVariant}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto space-y-4"
      >
        {headlineNews.map((headline, idx) => (
          <motion.div
            key={idx}
            variants={cardVariant}
            className="p-5 md:p-6 rounded-lg flex items-start gap-4 border-l-4"
            style={{ backgroundColor: C.surface, borderLeftColor: C.red }}
          >
            <span className="font-barlow text-xs tracking-widest uppercase px-2 py-1 rounded flex-shrink-0" style={{ backgroundColor: C.redDim, color: C.red }}>Latest</span>
            <p className="font-barlow text-sm md:text-base tracking-wide" style={{ color: C.text }}>{headline}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

function Footer() {
  return (
    <footer className="px-4 sm:px-8 lg:px-16 xl:px-24 py-12" style={{ backgroundColor: C.bg }}>
      <div className="h-px w-full mb-12" style={{ backgroundColor: C.red, boxShadow: `0 0 8px ${C.red}` }} />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <span className="font-bebas text-3xl tracking-wider" style={{ color: C.red }}>F1</span>
        </div>
        <div>
          <p className="font-barlow text-sm tracking-wider" style={{ color: C.muted }}>Formula One 2026</p>
        </div>
        <div className="flex justify-center md:justify-end gap-6">
          {['News', 'Results', 'Teams'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-barlow text-sm tracking-wider uppercase"
              style={{ color: C.text }}
              onClick={e => { e.preventDefault(); document.querySelector(`#${item.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
      <p className="font-barlow text-xs tracking-wider text-center mt-8" style={{ color: C.muted }}>
        Fan-made concept. Not affiliated with Formula 1 or FOM. Data fetched live via web search.
      </p>
    </footer>
  )
}

function ErrorFallback() {
  return (
    <div className="h-screen flex flex-col items-center justify-center" style={{ backgroundColor: C.bg }}>
      <h1 className="font-bebas text-5xl tracking-wider" style={{ color: C.red }}>Failed to load season data.</h1>
      <p className="font-barlow text-sm tracking-widest uppercase mt-4" style={{ color: C.muted }}>Please refresh.</p>
    </div>
  )
}

function NavSpacer() {
  return <div className="h-24" />
}

function PointsProgressionChart({ drivers, season }) {
  const [selected, setSelected] = useState([])
  const [snapRound, setSnapRound] = useState(null)
  const topSix = [...drivers].sort((a, b) => b.points - a.points).slice(0, 6)
  const allDrivers = selected.length ? topSix.filter(d => selected.includes(d.number)) : topSix
  const allRounds = [...new Set(topSix.flatMap(d => d.pointsProgression?.map(p => p.round) || []))].sort((a, b) => a - b)

  const chartData = allRounds.map(r => {
    const row = { round: `R${r}` }
    for (const d of allDrivers) {
      const pt = d.pointsProgression?.find(p => p.round === r)
      row[d.shortName] = pt?.points ?? null
    }
    return row
  })

  const snapStandings = snapRound ? [...drivers].map(d => {
    const pt = d.pointsProgression?.find(p => p.round === snapRound)
    return { ...d, snapPoints: pt?.points ?? 0 }
  }).sort((a, b) => b.snapPoints - a.snapPoints) : null

  const colors = ['#E8002D', '#00D2BE', '#FF8700', '#DC0000', '#0090FF', '#C9A84C']

  return (
    <Section id="points-progression">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bebas mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.text }}>Points Progression</h2>
        <p className="font-barlow text-xs tracking-widest uppercase mb-8" style={{ color: C.muted }}>{season} Season · Top Drivers</p>
        <div className="flex flex-wrap gap-3 mb-8">
          {topSix.map((d, i) => {
            const active = allDrivers.find(a => a.number === d.number)
            return (
              <button key={d.number} onClick={() => setSelected(prev =>
                prev.includes(d.number) ? prev.filter(n => n !== d.number) : [...prev, d.number]
              )} className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-barlow tracking-widest uppercase transition-all" style={{
                backgroundColor: active ? colors[i] + '22' : 'transparent',
                border: `1px solid ${active ? colors[i] : C.border}`,
                color: active ? C.text : C.muted,
                opacity: active ? 1 : 0.5,
              }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }} />
                {d.shortName}
              </button>
            )
          })}
        </div>
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} onClick={e => {
            const label = e?.activeLabel
            if (label) {
              const r = parseInt(label.replace('R', ''))
              if (!isNaN(r)) setSnapRound(snapRound === r ? null : r)
            }
          }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="round" tick={{ fill: C.muted, fontSize: 13, fontFamily: 'Barlow Condensed', letterSpacing: '0.05em' }} axisLine={{ stroke: C.border }} />
            <YAxis tick={{ fill: C.muted, fontSize: 13, fontFamily: 'Barlow Condensed' }} axisLine={{ stroke: C.border }} />
            <Tooltip contentStyle={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: 'Barlow Condensed' }} labelStyle={{ color: C.text, fontFamily: 'Bebas Neue', fontSize: 16 }} />
            <Legend wrapperStyle={{ fontFamily: 'Barlow Condensed', fontSize: 13, letterSpacing: '0.05em' }} />
            {allDrivers.map((d, i) => (
              <Line key={d.number} type="monotone" dataKey={d.shortName} stroke={colors[i]} strokeWidth={2} dot={{ r: 3, fill: colors[i] }} activeDot={{ r: 5 }} connectNulls />
            ))}
          </LineChart>
        </ResponsiveContainer>
        {snapRound && snapStandings && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-xl overflow-hidden" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: C.border }}>
              <p className="font-barlow text-xs tracking-widest uppercase" style={{ color: C.gold }}>Standings after Round {snapRound}</p>
              <button onClick={() => setSnapRound(null)} className="font-barlow text-xs tracking-wider" style={{ color: C.muted }}>✕ Close</button>
            </div>
            <div className="divide-y" style={{ borderColor: C.border }}>
              {snapStandings.map((d, i) => (
                <div key={d.number} className="flex items-center gap-3 px-5 py-2.5">
                  <span className="font-barlow text-xs tracking-widest w-6 flex-shrink-0" style={{ color: i === 0 ? C.gold : i === 1 ? '#A0A0A0' : i === 2 ? '#8B6914' : C.muted }}>P{i + 1}</span>
                  <span className="w-6 h-6 rounded flex items-center justify-center font-bebas text-xs flex-shrink-0" style={{ backgroundColor: C.redDim, color: C.red }}>{d.shortName}</span>
                  <span className="font-barlow text-sm font-semibold tracking-wide flex-1" style={{ color: C.text }}>{d.fullName}</span>
                  <span className="font-barlow text-xs tracking-wider" style={{ color: C.muted }}>{d.team}</span>
                  <span className="font-bebas text-lg" style={{ color: C.text }}>{d.snapPoints}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        <div className="flex flex-wrap gap-2 mt-4">
          {allRounds.map(r => (
            <button key={r} onClick={() => setSnapRound(snapRound === r ? null : r)} className={`font-barlow text-xs tracking-widest px-2.5 py-1 rounded transition-colors`} style={{
              backgroundColor: snapRound === r ? C.redDim : 'transparent',
              border: `1px solid ${snapRound === r ? C.red : C.border}`,
              color: snapRound === r ? C.red : C.muted,
            }}>R{r}</button>
          ))}
        </div>
      </div>
    </Section>
  )
}

function ConstructorSpotlight({ constructors, season }) {
  const topCon = [...constructors].sort((a, b) => b.points - a.points).slice(0, 6)
  const rounds = [...new Set(topCon.flatMap(c => c.pointsProgression?.map(p => p.round) || []))].sort((a, b) => a - b)
  const chartData = rounds.map(r => {
    const row = { round: `R${r}` }
    for (const c of topCon) {
      const pt = c.pointsProgression?.find(p => p.round === r)
      row[c.shortName] = pt?.points ?? null
    }
    return row
  })

  return (
    <Section id="constructor-spotlight">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bebas mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.text }}>Constructor Spotlight</h2>
        <p className="font-barlow text-xs tracking-widest uppercase mb-8" style={{ color: C.muted }}>{season} Season · Points Accumulation</p>
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="round" tick={{ fill: C.muted, fontSize: 13, fontFamily: 'Barlow Condensed', letterSpacing: '0.05em' }} axisLine={{ stroke: C.border }} />
            <YAxis tick={{ fill: C.muted, fontSize: 13, fontFamily: 'Barlow Condensed' }} axisLine={{ stroke: C.border }} />
            <Tooltip contentStyle={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: 'Barlow Condensed' }} labelStyle={{ color: C.text, fontFamily: 'Bebas Neue', fontSize: 16 }} />
            <Legend wrapperStyle={{ fontFamily: 'Barlow Condensed', fontSize: 13, letterSpacing: '0.05em' }} />
            {topCon.map((c, i) => (
              <Line key={c.name} type="monotone" dataKey={c.shortName} stroke={c.color} strokeWidth={2} dot={{ r: 3, fill: c.color }} activeDot={{ r: 5 }} connectNulls />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Section>
  )
}

function RaceResultsList({ calendar, resultsByRound }) {
  const completed = calendar.filter(r => r.status === 'completed')
  const [expanded, setExpanded] = useState(null)

  return (
    <Section id="race-results">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bebas mb-10" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.text }}>Race Results</h2>
        <div className="space-y-3">
          {completed.map(race => {
            const isOpen = expanded === race.round
            const results = resultsByRound[race.round] || []
            return (
              <motion.div key={race.round} layout className="rounded-lg overflow-hidden" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                <button onClick={() => setExpanded(isOpen ? null : race.round)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <div className="flex items-center gap-4">
                    <span className="font-barlow text-xs tracking-widest" style={{ color: C.muted }}>R{race.round}</span>
                    <span className="font-barlow text-sm font-semibold tracking-wide" style={{ color: C.text }}>{race.grandPrixName}</span>
                    <span className="font-barlow text-xs tracking-widest uppercase px-2 py-0.5 rounded" style={{ backgroundColor: C.redDim, color: C.red }}>{race.winner}</span>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight size={14} color={C.muted} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <div className="border-t px-5 py-3" style={{ borderColor: C.border }}>
                        <div className="grid grid-cols-5 gap-2 pb-2 mb-2 border-b font-barlow text-xs tracking-widest uppercase" style={{ borderColor: C.border, color: C.muted }}>
                          <span>Pos</span>
                          <span className="col-span-2">Driver</span>
                          <span>Team</span>
                          <span className="text-right">Pts</span>
                        </div>
                        {results.map((res, i) => (
                          <div key={i} className="grid grid-cols-5 gap-2 py-1.5 font-barlow text-xs items-center" style={{ color: C.text }}>
                            <span className={parseInt(res.position) <= 3 ? 'font-semibold' : ''} style={{ color: parseInt(res.position) <= 3 ? C.gold : C.muted }}>
                              {parseInt(res.position) <= 3 ? ['🥇', '🥈', '🥉'][parseInt(res.position) - 1] : `P${res.position}`}
                            </span>
                            <span className="col-span-2 font-semibold tracking-wide">{res.Driver?.givenName} {res.Driver?.familyName}</span>
                            <span className="text-xs" style={{ color: C.muted }}>{res.Constructor?.name}</span>
                            <span className="text-right font-semibold">{res.points}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

function DriverHeadToHead({ drivers, season }) {
  const [d1, setD1] = useState(drivers[0]?.number || null)
  const [d2, setD2] = useState(drivers[1]?.number || null)
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const driver1 = drivers.find(d => d.number === d1)
  const driver2 = drivers.find(d => d.number === d2)

  useEffect(() => {
    function handle(e) { if (ref1.current && !ref1.current.contains(e.target)) setOpen1(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  useEffect(() => {
    function handle(e) { if (ref2.current && !ref2.current.contains(e.target)) setOpen2(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const allRounds = [...new Set([
    ...(driver1?.history || []).map(h => h.round),
    ...(driver2?.history || []).map(h => h.round),
  ])].sort((a, b) => a - b)

  return (
    <Section id="head-to-head">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bebas mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.text }}>Head-to-Head</h2>
        <p className="font-barlow text-xs tracking-widest uppercase mb-6" style={{ color: C.muted }}>{season} Season · Round-by-Round Comparison</p>
        <div className="flex flex-wrap gap-6 mb-8">
          <div className="flex-1 min-w-[200px]">
            <label className="block font-barlow text-xs tracking-widest uppercase mb-2" style={{ color: C.muted }}>Driver 1</label>
            <div className="relative" ref={ref1}>
              <button onClick={() => setOpen1(o => !o)} className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-barlow text-sm tracking-wide transition-colors" style={{ backgroundColor: C.surface, color: C.text, border: `1px solid ${C.border}` }}>
                <span>{driver1 ? `${driver1.shortName} — ${driver1.fullName}` : 'Select driver'}</span>
                <motion.span animate={{ rotate: open1 ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-xs" style={{ color: C.red }}>▾</motion.span>
              </button>
              <AnimatePresence>
                {open1 && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }} className="absolute left-0 top-full mt-1 rounded-lg overflow-hidden min-w-full z-50 max-h-64 overflow-y-auto" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                    {drivers.filter(d => d.number !== d2).map(d => (
                      <button key={d.number} onClick={() => { setD1(d.number); setOpen1(false) }} className={`block w-full text-left font-barlow text-sm tracking-wide px-4 py-2 transition-colors ${d.number === d1 ? '' : 'opacity-60 hover:opacity-100'}`} style={{ color: d.number === d1 ? C.red : C.text, backgroundColor: d.number === d1 ? C.redDim : 'transparent' }}>
                        <span className="font-semibold">{d.shortName}</span> — {d.fullName}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block font-barlow text-xs tracking-widest uppercase mb-2" style={{ color: C.muted }}>Driver 2</label>
            <div className="relative" ref={ref2}>
              <button onClick={() => setOpen2(o => !o)} className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-barlow text-sm tracking-wide transition-colors" style={{ backgroundColor: C.surface, color: C.text, border: `1px solid ${C.border}` }}>
                <span>{driver2 ? `${driver2.shortName} — ${driver2.fullName}` : 'Select driver'}</span>
                <motion.span animate={{ rotate: open2 ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-xs" style={{ color: C.red }}>▾</motion.span>
              </button>
              <AnimatePresence>
                {open2 && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }} className="absolute left-0 top-full mt-1 rounded-lg overflow-hidden min-w-full z-50 max-h-64 overflow-y-auto" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                    {drivers.filter(d => d.number !== d1).map(d => (
                      <button key={d.number} onClick={() => { setD2(d.number); setOpen2(false) }} className={`block w-full text-left font-barlow text-sm tracking-wide px-4 py-2 transition-colors ${d.number === d2 ? '' : 'opacity-60 hover:opacity-100'}`} style={{ color: d.number === d2 ? C.red : C.text, backgroundColor: d.number === d2 ? C.redDim : 'transparent' }}>
                        <span className="font-semibold">{d.shortName}</span> — {d.fullName}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        {driver1 && driver2 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr className="font-barlow text-xs tracking-widest uppercase" style={{ color: C.muted }}>
                  <th className="text-left pb-2 pr-3">Round</th>
                  <th className="text-left pb-2 px-3 border-r" style={{ borderColor: C.border, color: C.red }}>{driver1.shortName}</th>
                  <th className="text-center pb-2 px-3" style={{ color: C.muted }}>Result</th>
                  <th className="text-right pb-2 pl-3 border-l" style={{ borderColor: C.border, color: C.red }}>{driver2.shortName}</th>
                  <th className="text-right pb-2 pl-3">Round</th>
                </tr>
              </thead>
              <tbody>
                {allRounds.map(round => {
                  const h1 = driver1.history.find(h => h.round === round)
                  const h2 = driver2.history.find(h => h.round === round)
                  const p1 = h1?.position ?? '-'
                  const p2 = h2?.position ?? '-'
                  const pts1 = h1?.points ?? 0
                  const pts2 = h2?.points ?? 0
                  const won = typeof p1 === 'number' && typeof p2 === 'number' ? (p1 < p2 ? 'd1' : p1 > p2 ? 'd2' : 'tie') : 'none'
                  return (
                    <tr key={round} className="border-t" style={{ borderColor: C.border }}>
                      <td className="py-2.5 pr-3 font-barlow text-xs" style={{ color: C.muted }}>R{round}</td>
                      <td className={`py-2.5 px-3 border-r font-barlow text-sm font-semibold tracking-wide ${won === 'd1' ? '' : 'opacity-60'}`} style={{ borderColor: C.border, color: won === 'd1' ? C.text : C.muted }}>
                        {p1 !== '-' ? `P${p1}` : '-'} <span className="text-xs" style={{ color: C.muted }}>({pts1}pts)</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {won === 'd1' && <span className="text-xs" style={{ color: '#00D2BE' }}>▲</span>}
                        {won === 'd2' && <span className="text-xs" style={{ color: C.red }}>▼</span>}
                        {won === 'tie' && <span className="text-xs" style={{ color: C.muted }}>—</span>}
                        {won === 'none' && <span className="text-xs" style={{ color: C.muted }}>·</span>}
                      </td>
                      <td className={`py-2.5 pl-3 border-l font-barlow text-sm font-semibold tracking-wide text-right ${won === 'd2' ? '' : 'opacity-60'}`} style={{ borderColor: C.border, color: won === 'd2' ? C.text : C.muted }}>
                        {p2 !== '-' ? `P${p2}` : '-'} <span className="text-xs" style={{ color: C.muted }}>({pts2}pts)</span>
                      </td>
                      <td className="py-2.5 pl-3 font-barlow text-xs text-right" style={{ color: C.muted }}>R{round}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Section>
  )
}

function StandingsTable({ drivers, season }) {
  const sorted = [...drivers].sort((a, b) => a.championshipPosition - b.championshipPosition)

  return (
    <Section id="standings">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bebas mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.text }}>Championship Standings</h2>
        <p className="font-barlow text-xs tracking-widest uppercase mb-8" style={{ color: C.muted }}>{season} Season</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="font-barlow text-xs tracking-widest uppercase border-b" style={{ borderColor: C.border, color: C.muted }}>
                <th className="pb-3 pr-2 text-left">Pos</th>
                <th className="pb-3 px-2 text-left">Driver</th>
                <th className="pb-3 px-2 text-left">Team</th>
                <th className="pb-3 px-2 text-right">Pts</th>
                <th className="pb-3 px-2 text-right">Wins</th>
                <th className="pb-3 px-2 text-right">Podiums</th>
                <th className="pb-3 pl-2 text-right">Poles</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d, i) => (
                <tr key={d.number} className="border-b transition-colors hover:opacity-80" style={{ borderColor: C.border }}>
                  <td className="py-3 pr-2">
                    <span className={`font-bebas text-lg ${i < 3 ? '' : ''}`} style={{ color: i === 0 ? C.gold : i === 1 ? '#A0A0A0' : i === 2 ? '#8B6914' : C.muted }}>
                      {i === 0 ? 'P1' : i === 1 ? 'P2' : i === 2 ? 'P3' : `P${d.championshipPosition}`}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-md flex items-center justify-center font-bebas text-xs flex-shrink-0" style={{ backgroundColor: (d.teamColor || C.red) + '22', color: d.teamColor || C.red }}>{d.shortName}</span>
                      <span className="font-barlow text-sm font-semibold tracking-wide" style={{ color: C.text }}>{FLAGS[d.nationality]} {d.fullName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-barlow text-xs tracking-wider" style={{ color: C.muted }}>{d.team}</td>
                  <td className="py-3 px-2 text-right font-bebas text-lg" style={{ color: C.text }}>{d.points}</td>
                  <td className="py-3 px-2 text-right font-barlow text-sm font-semibold" style={{ color: d.wins > 0 ? C.gold : C.muted }}>{d.wins}</td>
                  <td className="py-3 px-2 text-right font-barlow text-sm" style={{ color: C.text }}>{d.podiums}</td>
                  <td className="py-3 pl-2 text-right font-barlow text-sm" style={{ color: C.text }}>{d.poles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  )
}

function ChampionshipGapChart({ drivers, season }) {
  const [d1, setD1] = useState(drivers[0]?.number || null)
  const [d2, setD2] = useState(drivers[1]?.number || null)
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const driver1 = drivers.find(d => d.number === d1)
  const driver2 = drivers.find(d => d.number === d2)

  useEffect(() => {
    function handle(e) { if (ref1.current && !ref1.current.contains(e.target)) setOpen1(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  useEffect(() => {
    function handle(e) { if (ref2.current && !ref2.current.contains(e.target)) setOpen2(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const rounds = [...new Set([
    ...(driver1?.pointsProgression || []).map(p => p.round),
    ...(driver2?.pointsProgression || []).map(p => p.round),
  ])].sort((a, b) => a - b)

  const chartData = rounds.map(r => {
    const p1 = driver1?.pointsProgression?.find(p => p.round === r)
    const p2 = driver2?.pointsProgression?.find(p => p.round === r)
    const pts1 = p1?.points ?? 0
    const pts2 = p2?.points ?? 0
    const gap = pts1 - pts2
    return { round: `R${r}`, gap: Math.abs(gap), leader: gap >= 0 ? driver1?.shortName : driver2?.shortName }
  })

  return (
    <Section id="championship-gap">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bebas mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.text }}>Championship Gap</h2>
        <p className="font-barlow text-xs tracking-widest uppercase mb-6" style={{ color: C.muted }}>{season} Season</p>
        <div className="flex flex-wrap gap-6 mb-8">
          <div className="flex-1 min-w-[200px]">
            <label className="block font-barlow text-xs tracking-widest uppercase mb-2" style={{ color: C.muted }}>Driver 1</label>
            <div className="relative" ref={ref1}>
              <button onClick={() => setOpen1(o => !o)} className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-barlow text-sm tracking-wide transition-colors" style={{ backgroundColor: C.surface, color: C.text, border: `1px solid ${C.border}` }}>
                <span>{driver1 ? `${driver1.shortName} — ${driver1.fullName}` : 'Select driver'}</span>
                <motion.span animate={{ rotate: open1 ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-xs" style={{ color: C.red }}>▾</motion.span>
              </button>
              <AnimatePresence>
                {open1 && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute left-0 top-full mt-1 rounded-lg overflow-hidden min-w-full z-50 max-h-64 overflow-y-auto" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                    {drivers.filter(d => d.number !== d2).map(d => (
                      <button key={d.number} onClick={() => { setD1(d.number); setOpen1(false) }} className={`block w-full text-left font-barlow text-sm tracking-wide px-4 py-2 transition-colors ${d.number === d1 ? '' : 'opacity-60 hover:opacity-100'}`} style={{ color: d.number === d1 ? C.red : C.text, backgroundColor: d.number === d1 ? C.redDim : 'transparent' }}>
                        <span className="font-semibold">{d.shortName}</span> — {d.fullName}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block font-barlow text-xs tracking-widest uppercase mb-2" style={{ color: C.muted }}>Driver 2</label>
            <div className="relative" ref={ref2}>
              <button onClick={() => setOpen2(o => !o)} className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-barlow text-sm tracking-wide transition-colors" style={{ backgroundColor: C.surface, color: C.text, border: `1px solid ${C.border}` }}>
                <span>{driver2 ? `${driver2.shortName} — ${driver2.fullName}` : 'Select driver'}</span>
                <motion.span animate={{ rotate: open2 ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-xs" style={{ color: C.red }}>▾</motion.span>
              </button>
              <AnimatePresence>
                {open2 && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute left-0 top-full mt-1 rounded-lg overflow-hidden min-w-full z-50 max-h-64 overflow-y-auto" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                    {drivers.filter(d => d.number !== d1).map(d => (
                      <button key={d.number} onClick={() => { setD2(d.number); setOpen2(false) }} className={`block w-full text-left font-barlow text-sm tracking-wide px-4 py-2 transition-colors ${d.number === d2 ? '' : 'opacity-60 hover:opacity-100'}`} style={{ color: d.number === d2 ? C.red : C.text, backgroundColor: d.number === d2 ? C.redDim : 'transparent' }}>
                        <span className="font-semibold">{d.shortName}</span> — {d.fullName}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        {driver1 && driver2 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="round" tick={{ fill: C.muted, fontSize: 13, fontFamily: 'Barlow Condensed', letterSpacing: '0.05em' }} axisLine={{ stroke: C.border }} />
              <YAxis tick={{ fill: C.muted, fontSize: 13, fontFamily: 'Barlow Condensed' }} axisLine={{ stroke: C.border }} label={{ value: 'Points Gap', angle: -90, position: 'insideLeft', style: { fill: C.muted, fontSize: 13, fontFamily: 'Barlow Condensed', letterSpacing: '0.05em' } }} />
              <Tooltip contentStyle={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: 'Barlow Condensed' }} labelStyle={{ color: C.text, fontFamily: 'Bebas Neue', fontSize: 16 }} formatter={(val, name, props) => [`${val} pts`, `${props.payload.leader} leads`]} />
              <Line type="monotone" dataKey="gap" stroke={C.red} strokeWidth={2} dot={{ r: 4, fill: C.red }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="font-barlow text-sm tracking-wider text-center py-12" style={{ color: C.muted }}>Select two drivers to compare</p>
        )}
      </div>
    </Section>
  )
}

function ConstructorHeadToHead({ constructors, season }) {
  const [c1, setC1] = useState(constructors[0]?.name || null)
  const [c2, setC2] = useState(constructors[1]?.name || null)
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const con1 = constructors.find(c => c.name === c1)
  const con2 = constructors.find(c => c.name === c2)

  useEffect(() => {
    function handle(e) { if (ref1.current && !ref1.current.contains(e.target)) setOpen1(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  useEffect(() => {
    function handle(e) { if (ref2.current && !ref2.current.contains(e.target)) setOpen2(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const allRounds = [...new Set([
    ...(con1?.pointsProgression || []).map(p => p.round),
    ...(con2?.pointsProgression || []).map(p => p.round),
  ])].sort((a, b) => a - b)

  return (
    <Section id="constructor-h2h">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bebas mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.text }}>Constructor Head-to-Head</h2>
        <p className="font-barlow text-xs tracking-widest uppercase mb-6" style={{ color: C.muted }}>{season} Season · Round-by-Round Points</p>
        <div className="flex flex-wrap gap-6 mb-8">
          <div className="flex-1 min-w-[200px]">
            <label className="block font-barlow text-xs tracking-widest uppercase mb-2" style={{ color: C.muted }}>Team 1</label>
            <div className="relative" ref={ref1}>
              <button onClick={() => setOpen1(o => !o)} className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-barlow text-sm tracking-wide transition-colors" style={{ backgroundColor: C.surface, color: C.text, border: `1px solid ${C.border}` }}>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: con1?.color }} />
                  {con1?.shortName || 'Select team'}
                </span>
                <motion.span animate={{ rotate: open1 ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-xs" style={{ color: C.red }}>▾</motion.span>
              </button>
              <AnimatePresence>
                {open1 && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute left-0 top-full mt-1 rounded-lg overflow-hidden min-w-full z-50" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                    {constructors.filter(c => c.name !== c2).map(c => (
                      <button key={c.name} onClick={() => { setC1(c.name); setOpen1(false) }} className={`block w-full text-left font-barlow text-sm tracking-wide px-4 py-2 transition-colors ${c.name === c1 ? '' : 'opacity-60 hover:opacity-100'}`} style={{ color: c.name === c1 ? C.red : C.text, backgroundColor: c.name === c1 ? C.redDim : 'transparent' }}>
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                          {c.shortName}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block font-barlow text-xs tracking-widest uppercase mb-2" style={{ color: C.muted }}>Team 2</label>
            <div className="relative" ref={ref2}>
              <button onClick={() => setOpen2(o => !o)} className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-barlow text-sm tracking-wide transition-colors" style={{ backgroundColor: C.surface, color: C.text, border: `1px solid ${C.border}` }}>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: con2?.color }} />
                  {con2?.shortName || 'Select team'}
                </span>
                <motion.span animate={{ rotate: open2 ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-xs" style={{ color: C.red }}>▾</motion.span>
              </button>
              <AnimatePresence>
                {open2 && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute left-0 top-full mt-1 rounded-lg overflow-hidden min-w-full z-50" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                    {constructors.filter(c => c.name !== c1).map(c => (
                      <button key={c.name} onClick={() => { setC2(c.name); setOpen2(false) }} className={`block w-full text-left font-barlow text-sm tracking-wide px-4 py-2 transition-colors ${c.name === c2 ? '' : 'opacity-60 hover:opacity-100'}`} style={{ color: c.name === c2 ? C.red : C.text, backgroundColor: c.name === c2 ? C.redDim : 'transparent' }}>
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                          {c.shortName}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        {con1 && con2 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr className="font-barlow text-xs tracking-widest uppercase" style={{ color: C.muted }}>
                  <th className="text-left pb-2 pr-3">Round</th>
                  <th className="text-left pb-2 px-3 border-r" style={{ borderColor: C.border, color: con1.color }}>{con1.shortName}</th>
                  <th className="text-center pb-2 px-3" style={{ color: C.muted }}>Leader</th>
                  <th className="text-right pb-2 pl-3 border-l" style={{ borderColor: C.border, color: con2.color }}>{con2.shortName}</th>
                  <th className="text-right pb-2 pl-3">Round</th>
                </tr>
              </thead>
              <tbody>
                {allRounds.map(round => {
                  const pts1 = con1.pointsProgression?.find(p => p.round === round)
                  const pts2 = con2.pointsProgression?.find(p => p.round === round)
                  const p1 = pts1?.points ?? 0
                  const p2 = pts2?.points ?? 0
                  const prev1 = con1.pointsProgression?.find(p => p.round === (round - 1))
                  const prev2 = con2.pointsProgression?.find(p => p.round === (round - 1))
                  const inc1 = p1 - (prev1?.points ?? 0)
                  const inc2 = p2 - (prev2?.points ?? 0)
                  const leader = p1 > p2 ? 'c1' : p2 > p1 ? 'c2' : 'tie'
                  return (
                    <tr key={round} className="border-t" style={{ borderColor: C.border }}>
                      <td className="py-2.5 pr-3 font-barlow text-xs" style={{ color: C.muted }}>R{round}</td>
                      <td className={`py-2.5 px-3 border-r font-barlow text-sm font-semibold tracking-wide ${leader === 'c1' ? '' : 'opacity-60'}`} style={{ borderColor: C.border, color: leader === 'c1' ? C.text : C.muted }}>
                        {p1}pts <span className="text-xs" style={{ color: inc1 > 0 ? '#22c55e' : C.muted }}>(+{inc1})</span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-xs" style={{ color: C.muted }}>
                        {leader === 'c1' && <span style={{ color: con1.color }}>▲</span>}
                        {leader === 'c2' && <span style={{ color: con2.color }}>▼</span>}
                        {leader === 'tie' && <span>—</span>}
                      </td>
                      <td className={`py-2.5 pl-3 border-l font-barlow text-sm font-semibold tracking-wide text-right ${leader === 'c2' ? '' : 'opacity-60'}`} style={{ borderColor: C.border, color: leader === 'c2' ? C.text : C.muted }}>
                        {p2}pts <span className="text-xs" style={{ color: inc2 > 0 ? '#22c55e' : C.muted }}>(+{inc2})</span>
                      </td>
                      <td className="py-2.5 pl-3 font-barlow text-xs text-right" style={{ color: C.muted }}>R{round}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Section>
  )
}

function AnimatedOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ perspective: '1000px' }}>
      <motion.div
        animate={{ x: [0, 100, -50, 0], y: [0, -80, 60, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-[0.04]"
        style={{ backgroundColor: C.red, filter: 'blur(80px)' }}
      />
      <motion.div
        animate={{ x: [0, -80, 120, 0], y: [0, 60, -100, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full opacity-[0.03]"
        style={{ backgroundColor: '#00D2BE', filter: 'blur(100px)' }}
      />
      <motion.div
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 70, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full opacity-[0.02]"
        style={{ backgroundColor: C.gold, filter: 'blur(120px)' }}
      />
    </div>
  )
}

function SeasonProgress({ calendar }) {
  const total = calendar.length
  const completed = calendar.filter(r => r.status === 'completed').length
  const pct = total ? (completed / total) * 100 : 0

  if (!total) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 xl:px-24">
      <div className="rounded-xl p-5" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-barlow text-xs tracking-widest uppercase" style={{ color: C.muted }}>Season Progress</span>
          <span className="font-barlow text-xs tracking-wider" style={{ color: C.gold }}>{completed}/{total} Races</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: C.surface }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="h-full rounded-full"
            style={{ backgroundColor: C.red }}
          />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [f1Data, setF1Data] = useState(null)
  const [error, setError] = useState(false)
  const [season, setSeason] = useState('2026')
  const [view, setView] = useState('overview')

  useEffect(() => {
    const OF1 = 'https://api.openf1.org/v1'

    async function fetchJolpica(path) {
      const res = await fetch(`${JOLPICA_BASE}${path}`)
      if (!res.ok) throw new Error(`${path} returned ${res.status}`)
      return res.json()
    }

    function continentOf(country) {
      const map = {
        Australia: 'Oceania', China: 'Asia', Japan: 'Asia', Bahrain: 'Asia',
        'Saudi Arabia': 'Middle East', USA: 'North America', Canada: 'North America',
        Monaco: 'Europe', Spain: 'Europe', Austria: 'Europe',
        'Great Britain': 'Europe', Belgium: 'Europe', Hungary: 'Europe',
        Netherlands: 'Europe', Italy: 'Europe', Azerbaijan: 'Asia',
        Singapore: 'Asia', Mexico: 'North America', Brazil: 'South America',
        Qatar: 'Middle East', UAE: 'Middle East',
      }
      return map[country] || 'Europe'
    }

    const circuitNameMap = {
      Melbourne: 'Albert Park Circuit', Shanghai: 'Shanghai International Circuit',
      Suzuka: 'Suzuka International Racing Course', Sakhir: 'Bahrain International Circuit',
      Jeddah: 'Jeddah Corniche Circuit', Miami: 'Miami International Autodrome',
      Montreal: 'Circuit Gilles Villeneuve', 'Monte Carlo': 'Circuit de Monaco',
      Catalunya: 'Circuit de Barcelona-Catalunya', Spielberg: 'Red Bull Ring',
      Silverstone: 'Silverstone Circuit', 'Spa-Francorchamps': 'Circuit de Spa-Francorchamps',
      Hungaroring: 'Hungaroring', Zandvoort: 'Circuit Zandvoort',
      Monza: 'Autodromo Nazionale di Monza', Madrid: 'Madring Circuit',
      Baku: 'Baku City Circuit', 'Marina Bay': 'Marina Bay Street Circuit',
      Austin: 'Circuit of the Americas', 'Mexico City': 'Autodromo Hermanos Rodriguez',
      'São Paulo': 'Autodromo Jose Carlos Pace', 'Las Vegas': 'Las Vegas Strip Circuit',
      Lusail: 'Lusail International Circuit', 'Yas Island': 'Yas Marina Circuit',
    }

    async function fetchOpenF1Extras(year) {
      try {
        const meetingsRes = await fetch(`${OF1}/meetings?year=${year}`)
        const meetings = await meetingsRes.json()
        const gp = meetings.find(m => !m.meeting_name.includes('Testing'))
        if (!gp) return { circuitImages: {} }
        const sessionsRes = await fetch(`${OF1}/sessions?meeting_key=${gp.meeting_key}&session_type=Race`)
        const sessions = await sessionsRes.json()
        if (!sessions.length) return { circuitImages: {} }
        const driversRes = await fetch(`${OF1}/drivers?session_key=${sessions[0].session_key}`)
        const drivers = await driversRes.json()
        const circuitImages = {}
        for (const m of meetings) {
          const short = m.circuit_short_name
          const name = circuitNameMap[short]
          if (name && m.circuit_image) circuitImages[name] = m.circuit_image
        }
        return { circuitImages }
      } catch {
        return { circuitImages: {} }
      }
    }

    async function fetchData(year) {
      console.log(`Fetching ${year} F1 data from APIs...`)

      try {
        const [driversRes, constructorsRes, calendarRes] = await Promise.allSettled([
          fetchJolpica(`/${year}/driverStandings.json`),
          fetchJolpica(`/${year}/constructorStandings.json`),
          fetchJolpica(`/${year}.json`),
        ])

        let resultsTable = null
        try {
          const perPage = 100
          const firstRes = await fetchJolpica(`/${year}/results.json?limit=${perPage}&offset=0`)
          const total = parseInt(firstRes.MRData.total)
          const allRacesRaw = [...(firstRes.MRData.RaceTable?.Races || [])]
          const pages = Math.ceil(total / perPage)
          const extra = []
          for (let p = 1; p < pages; p++) {
            extra.push(
              fetchJolpica(`/${year}/results.json?limit=${perPage}&offset=${p * perPage}`)
                .then(d => d.MRData.RaceTable?.Races || [])
            )
          }
          const extras = await Promise.all(extra)
          for (const races of extras) allRacesRaw.push(...races)
          resultsTable = { Races: allRacesRaw }
        } catch (e) {
          console.error('Results fetch failed:', e)
        }

        const dsList = driversRes.status === 'fulfilled'
          ? driversRes.value.MRData.StandingsTable.StandingsLists[0]?.DriverStandings
          : null
        const csList = constructorsRes.status === 'fulfilled'
          ? constructorsRes.value.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings
          : null
        const raceTable = calendarRes.status === 'fulfilled'
          ? calendarRes.value.MRData.RaceTable
          : null

        const resultsByRound = {}
        if (resultsTable?.Races) {
          for (const r of resultsTable.Races) {
            resultsByRound[parseInt(r.round)] = r.Results || []
          }
        }

        const podiumCount = {}
        const flCount = {}
        const poleCount = {}
        const pointsProgression = {}
        for (const r of Object.values(resultsByRound)) {
          for (const res of r) {
            const n = parseInt(res.Driver?.permanentNumber) || 0
            if (!n) continue
            if (parseInt(res.position) <= 3) podiumCount[n] = (podiumCount[n] || 0) + 1
            if (res.FastestLap?.rank === '1') flCount[n] = (flCount[n] || 0) + 1
            if (parseInt(res.grid) === 1) poleCount[n] = (poleCount[n] || 0) + 1
          }
        }
        for (const [round, results] of Object.entries(resultsByRound)) {
          for (const res of results) {
            const n = parseInt(res.Driver?.permanentNumber) || 0
            if (!n) continue
            if (!pointsProgression[n]) pointsProgression[n] = []
            const last = pointsProgression[n][pointsProgression[n].length - 1]
            pointsProgression[n].push({
              round: parseInt(round),
              points: (last?.points || 0) + (parseInt(res.points) || 0),
            })
          }
        }

        const allRaces = raceTable?.Races || []
        const raceNamesByRound = {}
        for (const r of allRaces) raceNamesByRound[parseInt(r.round)] = r.raceName
        const driverHistory = {}
        for (const [round, results] of Object.entries(resultsByRound)) {
          for (const res of results) {
            const n = parseInt(res.Driver?.permanentNumber) || 0
            if (!n) continue
            if (!driverHistory[n]) driverHistory[n] = []
            driverHistory[n].push({
              round: parseInt(round),
              raceName: raceNamesByRound[parseInt(round)] || `Round ${round}`,
              position: parseInt(res.position),
              points: parseInt(res.points) || 0,
              team: res.Constructor?.name || '',
            })
          }
        }
        for (const h of Object.values(driverHistory)) {
          h.sort((a, b) => a.round - b.round)
        }
        const now = new Date()

        const calendar = allRaces.map(r => {
          const raceDateStr = r.time ? `${r.date}T${r.time}` : r.date
          const raceDate = new Date(raceDateStr)
          const completed = raceDate < now
          const results = resultsByRound[parseInt(r.round)]
          let winner = null
          if (completed && results?.length) {
            const top = results[0]
            winner = top.Driver?.code || top.Driver?.driverId?.substring(0, 3).toUpperCase() || ''
          }
          const sessions = {}
          const sessionKeys = ['FirstPractice', 'SecondPractice', 'ThirdPractice', 'Qualifying', 'Sprint', 'SprintQualifying', 'SprintShootout']
          for (const key of sessionKeys) {
            if (r[key]?.time) sessions[key] = r[key].time.replace('Z', '')
          }
          return {
            round: parseInt(r.round),
            grandPrixName: r.raceName,
            officialName: `${r.raceName} ${year}`,
            circuit: r.Circuit?.circuitName || '',
            city: r.Circuit?.Location?.locality || '',
            country: r.Circuit?.Location?.country || '',
            continent: continentOf(r.Circuit?.Location?.country || ''),
            date: raceDateStr,
            status: completed ? 'completed' : 'upcoming',
            winner,
            sessions,
          }
        })

        let nextFound = false
        for (const race of calendar) {
          if (race.status === 'upcoming' && !nextFound) {
            race.status = 'next'
            nextFound = true
          }
        }

        const completedRaces = allRaces.filter(r => new Date(r.date) < now)
        const lastRaceRound = completedRaces.length
        const lastRaceResults = resultsByRound[lastRaceRound] || []
        const lastRaceRaw = completedRaces[completedRaces.length - 1]

        const { circuitImages } = await fetchOpenF1Extras(year)

        const drivers = (dsList || []).map(d => {
          const dn = d.Driver
          const num = parseInt(dn.permanentNumber) || 0
          return {
            driverId: dn.driverId,
            fullName: `${dn.givenName} ${dn.familyName}`,
            shortName: dn.code || dn.driverId?.substring(0, 3).toUpperCase() || '',
            number: num,
            team: d.Constructors?.[0]?.name || '',
            teamColor: teamColor(d.Constructors?.[0]?.name || ''),
            nationality: dn.nationality || '',
            points: parseInt(d.points) || 0,
            wins: parseInt(d.wins) || 0,
            podiums: podiumCount[num] || 0,
            poles: poleCount[num] || 0,
            fastestLaps: flCount[num] || 0,
            championshipPosition: parseInt(d.position) || 0,
            funFact: '',
            history: driverHistory[num] || [],
            pointsProgression: pointsProgression[num] || [],
            career: null,
          }
        })

        const teamDrivers = {}
        for (const d of drivers) {
          if (!teamDrivers[d.team]) teamDrivers[d.team] = []
          teamDrivers[d.team].push(d)
        }

        const constructors = (csList || []).map(c => ({
          name: c.Constructor?.name || '',
          shortName: c.Constructor?.name?.replace(/ F1 Team$/, '').replace(/ Formula One Team$/, '').replace(/^Oracle /, '').replace(/^BWT /, '').replace(/^Atlassian /, '') || '',
          points: parseInt(c.points) || 0,
          wins: parseInt(c.wins) || 0,
          position: parseInt(c.position) || 0,
          powerUnit: '',
          base: '',
          color: '#E8002D',
        }))

        for (const c of constructors) {
          c.color = TEAM_COLORS[c.shortName] || TEAM_COLORS[c.name] || '#E8002D'
          c.drivers = (teamDrivers[c.name] || []).map(d => ({
            fullName: d.fullName,
            shortName: d.shortName,
            points: d.points,
            number: d.number,
          }))
          c.pointsProgression = []
          const cRounds = {}
          if (resultsTable?.Races) {
            for (const race of resultsTable.Races) {
              for (const res of (race.Results || [])) {
                if (res.Constructor?.name === c.name) {
                  const r = parseInt(race.round)
                  if (!cRounds[r]) cRounds[r] = 0
                  cRounds[r] += parseInt(res.points) || 0
                }
              }
            }
          }
          const sortedRounds = Object.keys(cRounds).sort((a, b) => a - b)
          let cumulative = 0
          for (const r of sortedRounds) {
            cumulative += cRounds[r]
            c.pointsProgression.push({ round: parseInt(r), points: cumulative })
          }
        }

        const completed = calendar.filter(r => r.status === 'completed').length
        const remaining = calendar.filter(r => r.status !== 'completed').length
        const leader = drivers[0]

        const latestPodium = []
        if (lastRaceResults.length) {
          for (const res of lastRaceResults.slice(0, 3)) {
            const dn = res.Driver
            latestPodium.push({
              position: parseInt(res.position),
              driver: `${dn.givenName} ${dn.familyName}`,
              team: res.Constructor?.name || '',
            })
          }
        }

        const seasonStats = {
          totalRaces: calendar.length,
          racesCompleted: completed,
          racesRemaining: remaining,
          currentLeaderDriver: leader?.fullName || '',
          currentLeaderTeam: leader?.team || '',
          currentLeaderPoints: leader?.points || 0,
          closestTitleBattle: drivers[1] ? `${drivers[1].fullName} is ${(leader?.points || 0) - (drivers[1]?.points || 0)} points behind ${leader?.fullName} in the standings.` : '',
          mostWinsDriver: [...drivers].sort((a, b) => b.wins - a.wins)[0]?.fullName || '',
        }

        const flDriver = lastRaceResults[0]?.FastestLap?.Driver
        const latestRaceResult = {
          raceName: lastRaceRaw?.raceName || '',
          date: lastRaceRaw?.date || '',
          winner: latestPodium[0]?.driver || '',
          team: latestPodium[0]?.team || '',
          fastestLap: lastRaceResults[0]?.FastestLap?.Time?.time || '',
          fastestLapHolder: flDriver ? `${flDriver.givenName} ${flDriver.familyName}` : '',
          podium: latestPodium,
        }

        setF1Data({
          season: year,
          drivers,
          constructors,
          calendar,
          circuitDetails: FALLBACK.circuitDetails.map(c => ({ ...c, image: circuitImages[c.name] || '' })),
          seasonStats,
          latestRaceResult,
          headlineNews: FALLBACK.headlineNews,
          resultsByRound,
          allRaces,
        })
      } catch (err) {
        console.error(`Fetch failed for ${year}, using fallback:`, err)
        setF1Data({ ...FALLBACK, season: year, resultsByRound: {} })
      }
    }

    fetchData(season)
  }, [season])

  if (error) return <ErrorFallback />

  const nextRace = f1Data?.calendar?.find(r => r.status === 'next' || (r.status === 'upcoming' && new Date(r.date) > new Date()))

  const pageVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
  }

  return (
    <>
      <Preloader loaded={f1Data !== null} year={season} />
      {f1Data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GrainOverlay />
          <AnimatedOrbs />
          <CustomCursor />
          <ScrollProgress />
          <Navbar show={true} season={season} onSeasonChange={v => { setF1Data(null); setSeason(v) }} view={view} onViewChange={setView} nextRace={nextRace} />
          <AnimatePresence mode="wait">
            {view === 'overview' && (
              <motion.div key="overview" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <HeroSection seasonStats={f1Data.seasonStats} latestRaceResult={f1Data.latestRaceResult} />
                <MarqueeTicker drivers={f1Data.drivers} />
                <SeasonNarrative seasonStats={f1Data.seasonStats} />
                <SeasonProgress calendar={f1Data.calendar} />
                <PointsProgressionChart drivers={f1Data.drivers} season={season} />
                <ChampionshipGapChart drivers={f1Data.drivers} season={season} />
                <ConstructorChart constructors={f1Data.constructors} />
                <ConstructorSpotlight constructors={f1Data.constructors} season={season} />
                <ConstructorHeadToHead constructors={f1Data.constructors} season={season} />
                <LatestRaceResult latestRaceResult={f1Data.latestRaceResult} />
                <RaceResultsList calendar={f1Data.calendar} resultsByRound={f1Data.resultsByRound} />
                <CircuitSpotlight circuitDetails={f1Data.circuitDetails} />
                <QuoteSection />
                <RaceCalendar calendar={f1Data.calendar} />
                <NewsStrip headlineNews={f1Data.headlineNews} />
              </motion.div>
            )}
            {view === 'standings' && (
              <motion.div key="standings" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <NavSpacer />
                <StandingsTable drivers={f1Data.drivers} season={season} />
              </motion.div>
            )}
            {view === 'drivers' && (
              <motion.div key="drivers" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <NavSpacer />
                <DriverHeadToHead drivers={f1Data.drivers} season={season} />
                <DriversGrid drivers={f1Data.drivers} season={season} />
              </motion.div>
            )}
          </AnimatePresence>
          <Footer />
        </motion.div>
      )}
    </>
  )
}

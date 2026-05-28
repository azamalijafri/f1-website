import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Flag, Timer, Trophy, Zap, MapPin, ChevronRight } from 'lucide-react'

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

const FALLBACK = {
  season: '2026',
  drivers: [
    { fullName: 'Kimi Antonelli', shortName: 'ANT', number: 12, team: 'Mercedes', nationality: 'Italy', points: 131, wins: 4, podiums: 4, poles: 0, fastestLaps: 2, championshipPosition: 1, funFact: 'At 19, Antonelli is the youngest championship leader in F1 history.' },
    { fullName: 'George Russell', shortName: 'RUS', number: 63, team: 'Mercedes', nationality: 'Great Britain', points: 88, wins: 1, podiums: 2, poles: 3, fastestLaps: 1, championshipPosition: 2, funFact: 'Won the season opener in Australia after a late-race pass on Antonelli.' },
    { fullName: 'Charles Leclerc', shortName: 'LEC', number: 16, team: 'Ferrari', nationality: 'Monaco', points: 75, wins: 0, podiums: 3, poles: 1, fastestLaps: 1, championshipPosition: 3, funFact: 'Leclerc has qualified inside the top four at every round of 2026 so far.' },
    { fullName: 'Lewis Hamilton', shortName: 'HAM', number: 44, team: 'Ferrari', nationality: 'Great Britain', points: 72, wins: 0, podiums: 2, poles: 0, fastestLaps: 0, championshipPosition: 4, funFact: 'Hamilton scored back-to-back podiums in Miami and Canada for Ferrari.' },
    { fullName: 'Lando Norris', shortName: 'NOR', number: 4, team: 'McLaren', nationality: 'Great Britain', points: 58, wins: 0, podiums: 1, poles: 1, fastestLaps: 1, championshipPosition: 5, funFact: 'Norris grabbed second place in Miami after a stunning final lap.' },
    { fullName: 'Oscar Piastri', shortName: 'PIA', number: 81, team: 'McLaren', nationality: 'Australia', points: 48, wins: 0, podiums: 2, poles: 0, fastestLaps: 0, championshipPosition: 6, funFact: 'Piastri finished second in Japan and third in Miami for McLaren.' },
    { fullName: 'Max Verstappen', shortName: 'VER', number: 1, team: 'Red Bull Racing', nationality: 'Netherlands', points: 43, wins: 0, podiums: 1, poles: 0, fastestLaps: 0, championshipPosition: 7, funFact: 'Verstappens third place in Canada was his first podium of the 2026 season.' },
    { fullName: 'Pierre Gasly', shortName: 'GAS', number: 10, team: 'Alpine', nationality: 'France', points: 20, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 8, funFact: 'Gasly has been Alpines top scorer in every race of 2026 so far.' },
    { fullName: 'Oliver Bearman', shortName: 'BEA', number: 87, team: 'Haas', nationality: 'Great Britain', points: 18, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 9, funFact: 'Bearman scored points in three of the first five rounds for Haas.' },
    { fullName: 'Liam Lawson', shortName: 'LAW', number: 30, team: 'Racing Bulls', nationality: 'New Zealand', points: 16, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 10, funFact: 'Lawson outqualified his more experienced teammate at every race so far.' },
    { fullName: 'Franco Colapinto', shortName: 'COL', number: 43, team: 'Alpine', nationality: 'Argentina', points: 15, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 11, funFact: 'Colapinto scored his first F1 points for Alpine in Canada with P6.' },
    { fullName: 'Isack Hadjar', shortName: 'HAD', number: 22, team: 'Red Bull Racing', nationality: 'France', points: 14, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 12, funFact: 'Hadjar replaced Perez at Red Bull and scored points in Canada.' },
    { fullName: 'Carlos Sainz', shortName: 'SAI', number: 55, team: 'Williams', nationality: 'Spain', points: 6, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 13, funFact: 'Sainz moved to Williams after Ferrari opted for Hamilton.' },
    { fullName: 'Arvid Lindblad', shortName: 'LIN', number: 37, team: 'Racing Bulls', nationality: 'Great Britain', points: 5, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 14, funFact: 'Lindblad scored on debut in Australia finishing eighth at 18 years old.' },
    { fullName: 'Gabriel Bortoleto', shortName: 'BOR', number: 5, team: 'Audi', nationality: 'Brazil', points: 2, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 15, funFact: 'Bortoleto scored Audis first-ever F1 point in Australia.' },
    { fullName: 'Esteban Ocon', shortName: 'OCO', number: 31, team: 'Haas', nationality: 'France', points: 1, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 16, funFact: 'Ocon moved to Haas for 2026 alongside fellow Frenchman Bearman.' },
    { fullName: 'Alexander Albon', shortName: 'ALB', number: 23, team: 'Williams', nationality: 'Thailand', points: 1, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 17, funFact: 'Albon scored a point in Japan with a gritty drive to P10.' },
    { fullName: 'Nico Hulkenberg', shortName: 'HUL', number: 27, team: 'Audi', nationality: 'Germany', points: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 18, funFact: 'Hulkenberg joined Audi for their F1 entry in 2026.' },
    { fullName: 'Valtteri Bottas', shortName: 'BOT', number: 77, team: 'Cadillac', nationality: 'Finland', points: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 19, funFact: 'Bottas leads Cadillacs debut F1 campaign alongside Perez.' },
    { fullName: 'Sergio Perez', shortName: 'PER', number: 11, team: 'Cadillac', nationality: 'Mexico', points: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 20, funFact: 'Perez joined Cadillac after leaving Red Bull at the end of 2025.' },
    { fullName: 'Lance Stroll', shortName: 'STR', number: 18, team: 'Aston Martin', nationality: 'Canada', points: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 21, funFact: 'Stroll has finished every race of 2026 but has yet to score a point.' },
    { fullName: 'Fernando Alonso', shortName: 'ALO', number: 14, team: 'Aston Martin', nationality: 'Spain', points: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, championshipPosition: 22, funFact: 'At 44, Alonso is chasing his 33rd F1 win in what may be his final season.' },
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

function Navbar({ show }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handle() { setScrolled(window.scrollY > 80) }
    window.addEventListener('scroll', handle)
    return () => window.removeEventListener('scroll', handle)
  }, [])

  const links = [
    { label: 'Drivers', href: '#drivers' },
    { label: 'Circuits', href: '#circuits' },
    { label: 'Calendar', href: '#calendar' },
    { label: 'Results', href: '#results' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-[1000] px-4 sm:px-8 lg:px-16 xl:px-24 transition-all duration-300 ${scrolled ? 'bg-[#080808]/85 backdrop-blur-md' : 'bg-transparent'}`}
      style={scrolled ? { backdropFilter: 'blur(12px)' } : {}}
    >
      <div className="flex items-center justify-between h-16 md:h-20 max-w-7xl mx-auto">
        <span className="font-bebas text-3xl md:text-4xl tracking-wider" style={{ color: C.red }}>F1</span>
        <div className="flex items-center gap-6 md:gap-10">
          {links.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="relative font-barlow text-sm md:text-base uppercase tracking-widest overflow-hidden group"
              style={{ color: C.text }}
              onClick={e => { e.preventDefault(); document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              {link.label}
              <motion.span
                className="absolute bottom-0 left-0 h-[2px] w-0"
                style={{ backgroundColor: C.red }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}

function Preloader({ loaded }) {
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
          <p className="font-barlow text-sm tracking-widest mt-8 uppercase" style={{ color: C.muted }}>Fetching 2026 season data...</p>
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

function DriversGrid({ drivers }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  if (!drivers?.length) return null

  return (
    <Section id="drivers">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          className="font-bebas mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.text }}
        >
          The 2026 Grid
        </motion.h2>
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
          {drivers.map(driver => (
            <motion.div
              key={driver.shortName}
              variants={cardVariant}
              whileHover={{ y: -6, boxShadow: `0 10px 40px ${C.redGlow}` }}
              className="relative overflow-hidden rounded p-5 border-t-[3px] transition-colors"
              style={{ backgroundColor: C.card, borderTopColor: C.red }}
            >
              <span className="font-bebas absolute -top-1 -right-1 leading-none select-none" style={{ fontSize: 'clamp(4rem, 8vw, 6rem)', color: C.red, opacity: 0.08 }}>{driver.number}</span>
              <h3 className="font-bebas text-xl md:text-2xl relative z-10" style={{ color: C.text }}>{driver.fullName}</h3>
              <p className="font-barlow text-sm tracking-wider uppercase relative z-10" style={{ color: C.red }}>{driver.team}</p>
              <div className="flex items-center gap-2 mt-2 relative z-10">
                <span className="font-barlow text-xs px-2 py-0.5 rounded" style={{ backgroundColor: C.redDim, color: C.red }}>P{driver.championshipPosition}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 relative z-10">
                <Pill label="PTS" value={driver.points} />
                <Pill label="WINS" value={driver.wins} />
                <Pill label="PODIUMS" value={driver.podiums} />
                <Pill label="POLES" value={driver.poles} />
              </div>
              <p className="font-playfair italic text-xs mt-3 leading-relaxed relative z-10" style={{ color: C.muted }}>{driver.funFact}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}

function Pill({ label, value }) {
  return (
    <span className="font-barlow text-[10px] tracking-wider uppercase px-2.5 py-1 rounded" style={{ backgroundColor: C.surface, color: C.muted }}>
      {label} <span className="ml-1" style={{ color: C.text }}>{value}</span>
    </span>
  )
}

function ConstructorChart({ constructors }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const height = (constructors?.length || 0) * 60 + 40

  if (!constructors?.length) return null

  return (
    <Section id="constructors">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="font-bebas mb-12" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.text }}>
          Constructors&apos; Battle
        </h2>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={constructors} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <XAxis type="number" tick={{ fill: C.muted, fontSize: 12, fontFamily: 'Barlow Condensed' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="shortName" tick={{ fill: C.text, fontSize: 13, fontFamily: 'Barlow Condensed' }} axisLine={false} tickLine={false} width={90} />
            <Tooltip
              contentStyle={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: '4px', boxShadow: 'none' }}
              itemStyle={{ color: C.text, fontFamily: 'Barlow Condensed', fontSize: 14 }}
              labelStyle={{ color: C.muted, fontFamily: 'Barlow Condensed', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}
              formatter={(value, name, props) => [`${value} pts`, props.payload.name]}
            />
            <Bar dataKey="points" radius={[0, 4, 4, 0]} animationDuration={1200}>
              {constructors.map((entry, idx) => (
                <Cell key={idx} fill={entry.color || C.red} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
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
              className="relative overflow-hidden rounded-lg p-6 min-h-[380px] flex flex-col justify-end bg-gradient-to-br"
              style={{ backgroundImage: `linear-gradient(135deg, ${C.surface}, ${C.card})` }}
            >
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

  if (!calendar?.length) return null

  const continentColors = {
    Europe: '#22c55e',
    'Middle East': '#d97706',
    'North America': '#3b82f6',
    'South America': '#14b8a6',
    Asia: '#8b5cf6',
    Oceania: '#06b6d4',
  }

  return (
    <Section id="calendar">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          className="font-bebas mb-12" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.text }}
        >
          2026 Race Calendar
        </motion.h2>
        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {calendar.map(race => (
            <motion.div
              key={race.round}
              variants={cardVariant}
              className={`flex-shrink-0 w-[200px] h-[240px] rounded-lg p-4 flex flex-col justify-between relative ${
                race.status === 'next' ? 'border-2' : 'border'
              }`}
              style={{
                backgroundColor: C.card,
                borderColor: race.status === 'next' ? C.red : C.border,
                opacity: race.status === 'completed' ? 0.4 : 1,
              }}
            >
              <div>
                <p className="font-barlow text-[10px] tracking-widest uppercase" style={{ color: C.muted }}>Round {race.round}</p>
                <h3 className="font-bebas text-lg mt-1 leading-tight" style={{ color: C.text }}>{race.grandPrixName}</h3>
                <p className="font-barlow text-xs tracking-wider mt-1" style={{ color: C.muted }}>{race.circuit}</p>
              </div>
              <div>
                <p
                  className="font-barlow text-sm tracking-wider uppercase"
                  style={{
                    color: C.red,
                    textDecoration: race.status === 'completed' ? 'line-through' : 'none',
                  }}
                >
                  {race.date}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: continentColors[race.continent] || C.muted }} />
                  {race.status === 'next' && (
                    <span className="font-barlow text-[10px] tracking-widest uppercase px-2 py-0.5 rounded" style={{ backgroundColor: C.red, color: '#fff' }}>Next Race</span>
                  )}
                  {race.status === 'completed' && race.winner && (
                    <span className="font-barlow text-[10px] tracking-widest uppercase px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>{race.winner}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
            <span className="font-barlow text-[10px] tracking-widest uppercase px-2 py-1 rounded flex-shrink-0" style={{ backgroundColor: C.redDim, color: C.red }}>Latest</span>
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
      <p className="font-barlow text-[10px] tracking-wider text-center mt-8" style={{ color: C.muted }}>
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

export default function App() {
  const [f1Data, setF1Data] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

    async function fetchData() {
      if (!apiKey) {
        console.log('No VITE_ANTHROPIC_API_KEY found. Using fallback data — set this env var for live data.')
        setF1Data(FALLBACK)
        return
      }

      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4000,
            system: 'Return only a valid JSON object with no markdown, no backticks, no preamble, and no explanation — purely parseable JSON.',
            tools: [{ type: 'web_search_preview' }],
            messages: [
              {
                role: 'user',
                content: 'Search the web and return the complete and current 2026 Formula One season data structured as JSON. Include: drivers array (fullName, shortName, number, team, nationality, points, wins, podiums, poles, fastestLaps, championshipPosition, funFact), constructors array (name, shortName, points, wins, position, powerUnit, base, color hex), calendar array (round, grandPrixName, officialName, circuit, city, country, continent, date, status with winner if completed), circuitDetails array (name, country, city, firstGrandPrix, lapRecord, lapRecordHolder, lapRecordYear, trackLength, numberOfCorners, numberOfDRSZones, atmosphericDescription), seasonStats object (totalRaces, racesCompleted, racesRemaining, currentLeaderDriver, currentLeaderTeam, currentLeaderPoints, closestTitleBattle, mostWinsDriver), latestRaceResult object (raceName, date, winner, team, fastestLap, fastestLapHolder, podium array with position/driver/team), headlineNews array of 3 strings. Use 2026 data for all fields.',
              },
            ],
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        let text = ''

        for (const block of data.content) {
          if (block.type === 'text') {
            text += block.text
          } else if (block.type === 'tool_use' || block.type === 'tool_result') {
            if (block.content) {
              if (typeof block.content === 'string') {
                text += block.content
              } else if (Array.isArray(block.content)) {
                for (const sub of block.content) {
                  if (sub.type === 'text') text += sub.text
                }
              }
            }
          }
        }

        const cleaned = text.replace(/```json\s*|```\s*/g, '').trim()
        const parsed = JSON.parse(cleaned)
        setF1Data(parsed)
      } catch (err) {
        console.error('Fetch failed, using fallback:', err)
        setF1Data(FALLBACK)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600&family=Bebas+Neue&family=Playfair+Display:ital@0;1&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])

  if (error) return <ErrorFallback />

  return (
    <>
      <Preloader loaded={f1Data !== null} />
      {f1Data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GrainOverlay />
          <CustomCursor />
          <ScrollProgress />
          <Navbar show={true} />
          <HeroSection seasonStats={f1Data.seasonStats} latestRaceResult={f1Data.latestRaceResult} />
          <MarqueeTicker drivers={f1Data.drivers} />
          <SeasonNarrative seasonStats={f1Data.seasonStats} />
          <DriversGrid drivers={f1Data.drivers} />
          <ConstructorChart constructors={f1Data.constructors} />
          <LatestRaceResult latestRaceResult={f1Data.latestRaceResult} />
          <CircuitSpotlight circuitDetails={f1Data.circuitDetails} />
          <QuoteSection />
          <RaceCalendar calendar={f1Data.calendar} />
          <NewsStrip headlineNews={f1Data.headlineNews} />
          <Footer />
        </motion.div>
      )}
    </>
  )
}

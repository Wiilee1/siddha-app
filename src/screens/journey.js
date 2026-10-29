import { DB, xpInCurrentLevel } from '../services/db.js';
import { Synth } from '../services/synth.js';
import { HapticService } from '../services/haptics.js';
import { tr } from '../services/i18n.js';

// All meditation paths
const PATHS = {
    anapana: {
        id: 'anapana',
        label: 'Anapana',
        shortLabel: 'Anapana',
        unlockLevel: 1,
        difficulty: tr('Low', 'Niski'),
        bgImage: './src/assets/anapana_bg.jpg',
        accentColor: '#705E39',
        nodeAccent: 'rgba(112,94,57,0.15)',
        icon: 'air',
        description: tr('Mindfulness of breathing to build concentration', 'Uważność oddechu budująca głęboką koncentrację'),
        nodes: [
            {
                id: 1, label: tr('Natural Respiration', 'Naturalny Oddech'), subtitle: tr('Breath', 'Oddech'), icon: 'air',
                description: tr('Observe the flow of the breath just as it is, without trying to control it.', 'Obserwuj przepływ oddechu takim, jaki jest, bez próby kontrolowania go.'),
                xPct: 45, yPct: 8,
                missions: [
                    { text: tr('Sit and observe the touch of the breath at the nostrils.', 'Usiądź i obserwuj dotyk oddechu przy nozdrzach.'), duration: 10 },
                    { text: tr('Notice if the breath is long or short.', 'Zauważ, czy oddech jest długi, czy krótki.'), duration: 12 },
                    { text: tr('Complete a 15-minute natural breath sit.', 'Ukończ 15-minutową sesję z naturalnym oddechem.'), duration: 15 }
                ]
            },
            {
                id: 2, label: tr('The Touchpoint', 'Punkt Dotyku'), subtitle: tr('Sensation', 'Doznanie'), icon: 'pin_drop',
                description: tr('Narrow your focus to the exact area where the breath touches: the upper lip or nostrils.', 'Zawęź swoją uwagę do dokładnego miejsca, w którym dotyka oddech: górnej wargi lub nozdrzy.'),
                xPct: 60, yPct: 26,
                missions: [
                    { text: tr('Locate the exact spot of touch inside the nostrils.', 'Zlokalizuj dokładny punkt dotyku wewnątrz nozdrzy.'), duration: 15 },
                    { text: tr('Detect the difference in touch between inhale and exhale.', 'Wyczuj różnicę w dotyku pomiędzy wdechem a wydechem.'), duration: 15 },
                    { text: tr('Sit for 20 minutes maintaining focus on the touchpoint.', 'Medytuj przez 20 minut, utrzymując skupienie na punkcie dotyku.'), duration: 20 }
                ]
            },
            {
                id: 3, label: tr('Cool & Warm', 'Chłód i Ciepło'), subtitle: tr('Temperature', 'Temperatura'), icon: 'thermostat',
                description: tr('Note the changing temperature of the air as it enters and leaves your body.', 'Zauważaj zmienną temperaturę powietrza, gdy wpływa do ciała i je opuszcza.'),
                xPct: 40, yPct: 44,
                missions: [
                    { text: tr('Notice the cool air entering the nostrils on inhale.', 'Zauważ chłodne powietrze wpływające przez nozdrza podczas wdechu.'), duration: 15 },
                    { text: tr('Notice the warm air exiting on the exhale.', 'Zauważ ciepłe powietrze wypływające podczas wydechu.'), duration: 15 },
                    { text: tr('Maintain thermal awareness for a full 25-minute sit.', 'Utrzymaj świadomość temperatury przez pełną 25-minutową sesję.'), duration: 25 }
                ]
            },
            {
                id: 4, label: tr('Subtle Breath', 'Subtelny Oddech'), subtitle: tr('Calm', 'Wyciszenie'), icon: 'waves',
                description: tr('As your mind settles, the breath becomes extremely soft, shallow, and quiet. Follow it closely.', 'Gdy umysł się wycisza, oddech staje się niezwykle delikatny, płytki i cichy. Podążaj za nim uważnie.'),
                xPct: 58, yPct: 62,
                missions: [
                    { text: tr('Notice the breath becoming very shallow or faint.', 'Zauważ, jak oddech staje się bardzo płytki i subtelny.'), duration: 20 },
                    { text: tr('Observe the brief gap between the in-breath and out-breath.', 'Obserwuj krótką przerwę pomiędzy wdechem a wydechem.'), duration: 20 },
                    { text: tr('Keep single-pointed attention on the faint breath for 30 minutes.', 'Utrzymaj jednopunktową uwagę na subtelnym oddechu przez 30 minut.'), duration: 30 }
                ]
            },
            {
                id: 5, label: tr('Absorption', 'Absorpcja'), subtitle: 'Ekaggata', icon: 'brightness_5',
                description: tr('Mind and breath merge. Focus is effortless and steady, preparing you for deeper insight.', 'Umysł i oddech łączą się w jedno. Skupienie jest bezwysiłkowe i stabilne, przygotowując Cię na głębszy wgląd.'),
                xPct: 46, yPct: 80,
                missions: [
                    { text: tr('Sit for 20 minutes with zero wandering of attention.', 'Medytuj przez 20 minut bez rozpraszania uwagi.'), duration: 20 },
                    { text: tr('Let go of the effort to concentrate; rest in the focus.', 'Puść wysiłek wkładany w koncentrację; spocznij w samym skupieniu.'), duration: 25 },
                    { text: tr('Complete a 30-minute silent concentration session.', 'Ukończ 30-minutową sesję cichej koncentracji.'), duration: 30 }
                ]
            }
        ]
    },
    metta: {
        id: 'metta',
        label: 'Metta',
        shortLabel: 'Metta',
        unlockLevel: 2,
        difficulty: tr('Low', 'Niski'),
        bgImage: './src/assets/metta_bg.jpg',
        accentColor: '#7C4559',
        nodeAccent: 'rgba(124,69,89,0.15)',
        icon: 'favorite',
        description: tr('Loving-kindness to build compassion and dissolve aversion', 'Miłująca dobroć budująca współczucie i rozpuszczająca niechęć'),
        nodes: [
            {
                id: 1, label: tr('Self-Compassion', 'Współczucie dla Siebie'), subtitle: tr('Self', 'Ja'), icon: 'person',
                description: tr('Direct wishes of safety, happiness, and peace toward yourself.', 'Skieruj życzenia bezpieczeństwa, szczęścia i pokoju w stronę samego siebie.'),
                xPct: 46, yPct: 8,
                missions: [
                    { text: tr('Silently repeat: "May I be happy, may I be peaceful."', 'Powtarzaj w myślach: „Obym był szczęśliwy, obym był spokojny”.'), duration: 10 },
                    { text: tr('Notice any internal resistance or self-criticism and release it.', 'Zauważ wszelki wewnętrzny opór lub samokrytykę i pozwól im odejść.'), duration: 15 },
                    { text: tr('Cultivate a feeling of warmth in your chest area.', 'Rozwijaj uczucie ciepła w okolicy klatki piersiowej.'), duration: 15 },
                    { text: tr('Sit for 20 minutes sending metta to yourself.', 'Medytuj przez 20 minut, wysyłając mettę samemu sobie.'), duration: 20 }
                ]
            },
            {
                id: 2, label: tr('The Guide', 'Przewodnik'), subtitle: tr('Gratitude', 'Wdzięczność'), icon: 'school',
                description: tr('Direct loving-kindness to someone who has guided, helped, or inspired you.', 'Skieruj miłującą dobroć ku osobie, która Cię prowadziła, pomogła Ci lub Cię zainspirowała.'),
                xPct: 59, yPct: 26,
                missions: [
                    { text: tr('Bring to mind a mentor or teacher and smile internally.', 'Przywołaj w myślach mentora lub nauczyciela i uśmiechnij się wewnętrznie.'), duration: 15 },
                    { text: tr('Wish them: "May you be free from suffering, may you be peaceful."', 'Życz tej osobie: „Obyś był wolny od cierpienia, obyś zaznał spokoju”.'), duration: 15 },
                    { text: tr('Observe the feeling of gratitude arising in your heart.', 'Obserwuj uczucie wdzięczności rodzące się w Twoim sercu.'), duration: 20 },
                    { text: tr('Dedicate a 20-minute sit to your benefactor.', 'Zadedykuj 20-minutową sesję swojemu dobroczyńcy.'), duration: 20 }
                ]
            },
            {
                id: 3, label: tr('The Stranger', 'Nieznajomy'), subtitle: tr('Friendliness', 'Życzliwość'), icon: 'people',
                description: tr('Direct loving-kindness to someone you see regularly but do not know personally.', 'Skieruj miłującą dobroć ku komuś, kogo widujesz regularnie, ale nie znasz osobiście.'),
                xPct: 42, yPct: 44,
                missions: [
                    { text: tr('Recall the face of a cashier, neighbor, or driver.', 'Przypomnij sobie twarz sprzedawcy, sąsiada lub kierowcy.'), duration: 15 },
                    { text: tr('Acknowledge: "Just like me, they wish to be happy."', 'Uznaj w myślach: „Tak samo jak ja, ta osoba pragnie być szczęśliwa”.'), duration: 15 },
                    { text: tr('Wish them: "May you be safe, may you live with ease."', 'Życz jej: „Obyś był bezpieczny, obyś żył w spokoju i lekkości”.'), duration: 20 },
                    { text: tr('Maintain focus on the neutral person for a 25-minute sit.', 'Utrzymaj skupienie na osobie neutralnej przez 25-minutową sesję.'), duration: 25 }
                ]
            },
            {
                id: 4, label: tr('The Difficult Person', 'Trudna Osoba'), subtitle: tr('Pardon', 'Przebaczenie'), icon: 'healing',
                description: tr('Gently direct loving-kindness to someone with whom you have minor friction or conflict.', 'Łagodnie skieruj miłującą dobroć ku osobie, z którą masz drobne napięcia lub nieporozumienia.'),
                xPct: 61, yPct: 62,
                missions: [
                    { text: tr('Bring to mind a person with mild friction (avoid major trauma at first).', 'Przywołaj osobę, z którą masz drobny konflikt (na początku unikaj głębokich traum).'), duration: 15 },
                    { text: tr('Observe physical tightness in your body and breathe into it.', 'Zaobserwuj fizyczne napięcie w ciele i skieruj w nie oddech.'), duration: 20 },
                    { text: tr('Wish them peace: "May you be happy, may we be free from conflict."', 'Życz jej pokoju: „Obyś był szczęśliwy, obyśmy byli wolni od konfliktu”.'), duration: 20 },
                    { text: tr('Sit for 30 minutes holding the difficult person in kindness.', 'Medytuj przez 30 minut, otaczając trudną osobę życzliwością.'), duration: 30 }
                ]
            },
            {
                id: 5, label: tr('Universal Goodwill', 'Powszechna Życzliwość'), subtitle: tr('Boundless', 'Bezgraniczność'), icon: 'public',
                description: tr('Extend your heart outward to all directions, covering all living beings everywhere.', 'Otwórz serce we wszystkich kierunkach, obejmując wszystkie żywe istoty wszędzie.'),
                xPct: 48, yPct: 80,
                missions: [
                    { text: tr('Radiate metta to your room, your building, and your city.', 'Promieniuj mettą na swój pokój, budynek i całe miasto.'), duration: 20 },
                    { text: tr('Extend the field of love to the entire country and continent.', 'Rozszerz pole życzliwości na cały kraj i kontynent.'), duration: 25 },
                    { text: tr('Radiate boundless goodwill to all creatures, seen and unseen.', 'Promieniuj bezgraniczną życzliwością ku wszystkim istotom, widzialnym i niewidzialnym.'), duration: 25 },
                    { text: tr('Abide in the ocean of universal loving-kindness for 40 minutes.', 'Spoczywaj w oceanie powszechnej miłującej dobroci przez 40 minut.'), duration: 40 }
                ]
            }
        ]
    },
    vipassana: {
        id: 'vipassana',
        label: 'Vipassana',
        shortLabel: 'Vipassana',
        unlockLevel: 3,
        difficulty: tr('High', 'Wysoki'),
        bgImage: './src/assets/vipassana_bg.jpg',
        accentColor: '#1A4A5A',
        nodeAccent: 'rgba(26,74,90,0.15)',
        icon: 'water_drop',
        description: tr('Ancient insight practice through body scanning', 'Starożytna praktyka wglądu poprzez skanowanie ciała'),
        nodes: [
            {
                id: 1, label: tr('Body Scan', 'Skanowanie Ciała'), subtitle: tr('Foundation', 'Fundament'), icon: 'accessibility_new',
                description: tr('Learn to feel sensation as pure energy, not concept.', 'Naucz się odczuwać doznania jako czystą energię, a nie pojęcia.'),
                xPct: 48, yPct: 8,
                missions: [
                    { text: tr('Scan slowly from crown of head to feet without reacting.', 'Skanuj powoli od czubka głowy do stóp bez reagowania.'), duration: 15 },
                    { text: tr('Note gross sensations: heat, tingling, pressure.', 'Zauważaj wyraźne doznania: ciepło, mrowienie, ucisk.'), duration: 15 },
                    { text: tr('Scan in both directions, top-to-bottom and bottom-to-top.', 'Skanuj w obu kierunkach: od góry do dołu i od dołu do góry.'), duration: 20 },
                    { text: tr('Sit for 30 minutes with continuous scanning.', 'Medytuj przez 30 minut, nieprzerwanie skanując ciało.'), duration: 30 }
                ]
            },
            {
                id: 2, label: tr('Impermanence', 'Nietrwałość'), subtitle: 'Anicca', icon: 'change_circle',
                description: tr('Observe that every sensation arises and passes away.', 'Zaobserwuj, że każde doznanie powstaje i przemija.'),
                xPct: 58, yPct: 26,
                missions: [
                    { text: tr('Label each sensation: "arising" or "passing".', 'Oznaczaj w myślach każde doznanie: „powstawanie” lub „przemijanie”.'), duration: 20 },
                    { text: tr('Notice a pleasant sensation dissolve without craving.', 'Zauważ, jak przyjemne doznanie rozpuszcza się bez pragnienia zatrzymania go.'), duration: 20 },
                    { text: tr('Notice an unpleasant sensation dissolve without aversion.', 'Zauważ, jak nieprzyjemne doznanie rozpuszcza się bez niechęci.'), duration: 25 },
                    { text: tr('Rest in the space between sensations.', 'Spocznij w przestrzeni pomiędzy doznaniami.'), duration: 25 }
                ]
            },
            {
                id: 3, label: tr('Subtle Body', 'Ciało Subtelne'), subtitle: tr('Deeper Scan', 'Głębszy Skan'), icon: 'vibration',
                description: tr('Move beyond gross sensations to subtle vibrations.', 'Wyjdź poza wyraźne doznania w stronę subtelnych wibracji.'),
                xPct: 40, yPct: 44,
                missions: [
                    { text: tr('Scan an area of the body that feels "blank" or numb.', 'Skanuj obszar ciała, który wydaje się „pusty” lub zdrętwiały.'), duration: 20 },
                    { text: tr('Notice the subtle vibration of aliveness beneath stillness.', 'Zauważ subtelną wibrację żywotności pod warstwą bezruchu.'), duration: 25 },
                    { text: tr('Scan the entire body as a field of vibration.', 'Skanuj całe ciało jako jednolite pole wibracji.'), duration: 25 },
                    { text: tr('Maintain equanimity for an entire 30-minute scan.', 'Utrzymaj równowagę umysłu przez cały 30-minutowy skan.'), duration: 30 }
                ]
            },
            {
                id: 4, label: tr('Equanimity', 'Równowaga'), subtitle: tr('Non-Reaction', 'Brak Reakcji'), icon: 'balance',
                description: tr('Neither craving nor aversion — pure observation.', 'Ani pragnienie, ani niechęć — czysta obserwacja.'),
                xPct: 58, yPct: 62,
                missions: [
                    { text: tr('Sit with discomfort for 5 minutes without shifting.', 'Pozostań z dyskomfortem przez 5 minut bez zmiany pozycji.'), duration: 15 },
                    { text: tr('Smile internally at both pleasant and painful sensations.', 'Uśmiechnij się wewnętrznie zarówno do przyjemnych, jak i bolesnych doznań.'), duration: 20 },
                    { text: tr('Observe an intense sensation with complete stillness.', 'Obserwuj intensywne doznanie w całkowitym bezruchu.'), duration: 25 },
                    { text: tr('Dedicate a full sit to metta — loving kindness.', 'Zadedykuj pełną sesję praktyce metty — miłującej dobroci.'), duration: 30 }
                ]
            },
            {
                id: 5, label: tr('Insight', 'Wgląd'), subtitle: 'Vipassana', icon: 'remove_red_eye',
                description: tr('Direct insight into the three characteristics of experience.', 'Bezpośredni wgląd w trzy cechy istnienia.'),
                xPct: 48, yPct: 80,
                missions: [
                    { text: tr('Notice anicca (impermanence) in every breath cycle.', 'Zauważaj anicca (nietrwałość) w każdym cyklu oddechu.'), duration: 25 },
                    { text: tr('Notice dukkha (unsatisfactoriness) — nothing fully satisfies.', 'Zauważaj dukkha (niezadowolenie) — nic nie daje trwałego nasycenia.'), duration: 25 },
                    { text: tr('Notice anatta (no-self) — who is observing the observer?', 'Zauważaj anatta (brak trwałego „ja”) — kto obserwuje obserwatora?'), duration: 30 },
                    { text: tr('Sit for 45 minutes with continuous insight observation.', 'Medytuj przez 45 minut w nieprzerwanej obserwacji wglądu.'), duration: 45 }
                ]
            }
        ]
    },
    tmi: {
        id: 'tmi',
        label: tr('The Mind Illuminated', 'Oświecony Umysł (TMI)'),
        shortLabel: 'TMI',
        unlockLevel: 4,
        difficulty: tr('Medium', 'Średni'),
        bgImage: './src/assets/journey_bg.jpg',
        accentColor: '#3F5247',
        nodeAccent: 'rgba(63,82,71,0.15)',
        icon: 'local_florist',
        description: tr('Systematic 10-stage framework for deep concentration', 'Systematyczny 10-etapowy trening głębokiej koncentracji'),
        nodes: [
            {
                id: 1, label: tr('Establishing a Practice', 'Ustanowienie Praktyki'), subtitle: tr('Practice', 'Praktyka'), icon: 'event_seat',
                description: tr('Before mastering the mind, you must master your schedule.', 'Zanim opanujesz umysł, musisz opanować swój codzienny rytm.'),
                xPct: 44, yPct: 8,
                missions: [
                    { text: tr('Set a non-negotiable time & space for your practice.', 'Wyznacz stały czas i miejsce na swoją codzienną praktykę.'), duration: 10 },
                    { text: tr('Sit for a realistic baseline of 15–20 minutes.', 'Usiądź na realistyczny czas bazowy 15–20 minut.'), duration: 15 },
                    { text: tr('Overcome the initial wave of procrastination.', 'Przełam pierwszą falę odkładania medytacji na później.'), duration: 15 },
                    { text: tr('Establish a streak of 3 consecutive daily sits.', 'Zbuduj passę 3 kolejnych dni codziennej medytacji.'), duration: 20 }
                ]
            },
            {
                id: 2, label: tr('Interrupted Attention & Mind-Wandering', 'Przerywana Uwaga i Błądzenie Umysłu'), subtitle: tr('Attention', 'Uwaga'), icon: 'psychology',
                description: tr('Transition consciously into the practice to stabilize focus.', 'Przechodź świadomie w stan medytacji, aby ustabilizować skupienie.'),
                xPct: 62, yPct: 26,
                missions: [
                    { text: tr('Review your motivations before each sit.', 'Przypomnij sobie swoją motywację przed każdą sesją.'), duration: 15 },
                    { text: tr('Set a specific, bite-sized goal for this session.', 'Wyznacz konkretny, osiągalny cel na tę sesję.'), duration: 15 },
                    { text: tr('Perform a mental inventory of current worries.', 'Wykonaj mentalny przegląd obecnych zmartwień i odłóż je na bok.'), duration: 20 },
                    { text: tr('Adjust posture and alignment for comfort.', 'Dostosuj postawę i ułożenie ciała dla stabilnego komfortu.'), duration: 20 }
                ]
            },
            {
                id: 3, label: tr('Extended Continuity & Forgetting', 'Wydłużona Ciągłość i Zapominanie'), subtitle: tr('Continuity', 'Ciągłość'), icon: 'anchor',
                description: tr('Anchor yourself in the space around you.', 'Zakotwicz się w przestrzeni wokół siebie.'),
                xPct: 38, yPct: 44,
                missions: [
                    { text: tr('Maintain broad awareness of the present moment.', 'Utrzymuj szeroką świadomość chwili obecnej.'), duration: 15 },
                    { text: tr('Focus solely on raw physical sensations.', 'Skup się wyłącznie na czystych doznaniach fizycznych.'), duration: 20 },
                    { text: tr('Restrict attention to bodily sensations.', 'Zawęź uwagę do doznań płynących z ciała.'), duration: 20 },
                    { text: tr('Develop grounding in physical support and gravity.', 'Rozwiń uziemienie w fizycznym podparciu i sile grawitacji.'), duration: 20 }
                ]
            },
            {
                id: 4, label: tr('Continuous Attention & Gross Distraction', 'Ciągła Uwaga i Silne Rozproszenie'), subtitle: tr('Focus', 'Skupienie'), icon: 'center_focus_strong',
                description: tr('Move focus from broad body sensations to the breath.', 'Przenieś skupienie z ogólnych doznań ciała na sam oddech.'),
                xPct: 60, yPct: 62,
                missions: [
                    { text: tr('Observe the somatic rises and falls of breathing.', 'Obserwuj cielesne unoszenie się i opadanie podczas oddychania.'), duration: 20 },
                    { text: tr('Find and appreciate a pleasant quality in the breath.', 'Odnajdź i doceń przyjemną jakość w oddechu.'), duration: 20 },
                    { text: tr('Narrow attention to the tip of the nose.', 'Zawęź uwagę do czubka nosa.'), duration: 25 },
                    { text: tr('Observe breath patterns passively without control.', 'Obserwuj wzorce oddechu biernie, bez ingerencji.'), duration: 25 }
                ]
            },
            {
                id: 5, label: tr('Overcoming Subtle Dullness', 'Przezwyciężanie Subtelnego Otępienia'), subtitle: tr('Dullness', 'Klarowność'), icon: 'visibility',
                description: tr('Use mental count markers to bridge focus when distracted.', 'Używaj liczenia oddechów jako pomostu wspierającego koncentrację.'),
                xPct: 44, yPct: 80,
                missions: [
                    { text: tr('Silently count "one" at the end of the out-breath.', 'Policz w myślach „jeden” na końcu wydechu.'), duration: 20 },
                    { text: tr('Maintain counting cycles up to ten.', 'Utrzymuj cykle liczenia oddechów aż do dziesięciu.'), duration: 20 },
                    { text: tr('Restart counting calmly from one if mind wanders.', 'Zacznij spokojnie liczyć od jednego, jeśli umysł odpłynie.'), duration: 25 },
                    { text: tr('Intentionally drop counting to sit in pure silence.', 'Świadomie porzuć liczenie, aby spocząć w czystej ciszy.'), duration: 30 }
                ]
            }
        ]
    },
    zen: {
        id: 'zen',
        label: 'Zen',
        shortLabel: 'Zen',
        unlockLevel: 5,
        difficulty: tr('High', 'Wysoki'),
        bgImage: './src/assets/zen_bg.jpg',
        accentColor: '#3A3228',
        nodeAccent: 'rgba(58,50,40,0.15)',
        icon: 'circle',
        description: tr("Just sitting — shikantaza and open awareness", "Tylko siedzenie — shikantaza i otwarta świadomość"),
        nodes: [
            {
                id: 1, label: tr("Beginner's Mind", 'Umysł Początkującego'), subtitle: 'Shoshin', icon: 'child_care',
                description: tr('Approach each sit as if for the very first time.', 'Podejdź do każdej sesji tak, jakby to był Twój pierwszy raz.'),
                xPct: 50, yPct: 8,
                missions: [
                    { text: tr('Sit without any goal or technique — just be present.', 'Usiądź bez żadnego celu czy techniki — po prostu bądź obecny.'), duration: 15 },
                    { text: tr('Notice and release every expectation that arises.', 'Zauważaj i puszczaj każde pojawiające się oczekiwanie.'), duration: 20 },
                    { text: tr('Observe the mind that wants to "do it right".', 'Obserwuj umysł, który chce „zrobić to dobrze”.'), duration: 20 },
                    { text: tr('Sit for 30 minutes with nothing to achieve.', 'Medytuj przez 30 minut bez niczego do osiągnięcia.'), duration: 30 }
                ]
            },
            {
                id: 2, label: tr('Just Sitting', 'Tylko Siedzenie'), subtitle: 'Shikantaza', icon: 'airline_seat_recline_normal',
                description: tr('Pure sitting — presence without object.', 'Czyste siedzenie — obecność bez obiektu skupienia.'),
                xPct: 55, yPct: 27,
                missions: [
                    { text: tr('Sit with eyes half-open, gaze soft on the floor.', 'Usiądź z półotwartymi oczami, kierując miękki wzrok na podłogę.'), duration: 20 },
                    { text: tr('Do not follow the breath — let it breathe itself.', 'Nie podążaj za oddechem — pozwól mu oddychać samemu.'), duration: 20 },
                    { text: tr('When a thought arises, do not grab it or push it away.', 'Gdy pojawi się myśl, nie chwytaj jej ani nie odpychaj.'), duration: 25 },
                    { text: tr('Maintain shikantaza for a full 40 minutes.', 'Utrzymaj stan shikantaza przez pełne 40 minut.'), duration: 40 }
                ]
            },
            {
                id: 3, label: tr('Breath Koan', 'Koan Oddechu'), subtitle: 'MU', icon: 'help_outline',
                description: tr('Use the question "What is this?" as your anchor.', 'Użyj pytania „Czym to jest?” jako swojej kotwicy.'),
                xPct: 44, yPct: 45,
                missions: [
                    { text: tr('Silently ask "What is this?" on each exhale.', 'Pytaj w myślach „Czym to jest?” przy każdym wydechu.'), duration: 20 },
                    { text: tr('Don\'t answer — let the question hang open.', 'Nie odpowiadaj — pozwól pytaniu pozostać otwartym.'), duration: 20 },
                    { text: tr('Notice the space before a thought forms.', 'Zauważ przestrzeń zanim uformuje się myśl.'), duration: 25 },
                    { text: tr('Sit for 35 minutes with the koan.', 'Medytuj przez 35 minut z koanem.'), duration: 35 }
                ]
            },
            {
                id: 4, label: tr('Open Awareness', 'Otwarta Świadomość'), subtitle: tr('Choiceless', 'Bez Wyboru'), icon: 'all_inclusive',
                description: tr('Rest in awareness itself, without narrowing attention.', 'Spocznij w samej świadomości, nie zawężając uwagi.'),
                xPct: 55, yPct: 63,
                missions: [
                    { text: tr('Include all sounds, sensations, and thoughts equally.', 'Obejmij jednakowo wszystkie dźwięki, doznania i myśli.'), duration: 20 },
                    { text: tr('Let awareness be the ocean, thoughts the waves.', 'Niech świadomość będzie oceanem, a myśli falami.'), duration: 25 },
                    { text: tr('Notice the awareness that is aware of awareness.', 'Zauważ świadomość, która jest świadoma samej świadomości.'), duration: 30 },
                    { text: tr('Sit for 45 minutes in pure choiceless awareness.', 'Medytuj przez 45 minut w czystej świadomości bez wyboru.'), duration: 45 }
                ]
            },
            {
                id: 5, label: tr('No-Self', 'Brak Jaźni'), subtitle: 'Anatta', icon: 'person_off',
                description: tr('Who is the one who is sitting?', 'Kim jest ten, który siedzi?'),
                xPct: 50, yPct: 82,
                missions: [
                    { text: tr('Ask: "Who is aware?" — sit with the question.', 'Zapytaj: „Kto jest świadomy?” — pozostań z tym pytaniem.'), duration: 25 },
                    { text: tr('Notice: is there a "you" behind your thoughts?', 'Zauważ: czy za Twoimi myślami istnieje oddzielne „ty”?'), duration: 30 },
                    { text: tr('Rest in the not-knowing — what is here without a self?', 'Spocznij w niewiedzy — co jest tutaj bez poczucia „ja”?'), duration: 35 },
                    { text: tr('Sit for 60 minutes: the final recognition.', 'Medytuj przez 60 minut: ostateczne rozpoznanie.'), duration: 60 }
                ]
            }
        ]
    }
};

export function renderJourney() {
    const container = document.createElement('div');
    container.className = 'screen journey-screen';

    container.innerHTML = `
        <!-- Fixed header -->
        <div class="jh-header">
            <div style="flex: 1; min-width: 0;">
                <h1 class="jh-title">${tr('Your Journey', 'Twoja Ścieżka')}</h1>
                <p class="jh-subtitle" style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin: 0;">
                    <span id="j-path-subtitle">${tr('Loading...', 'Ładowanie...')}</span>
                    <span id="j-path-learn-more" style="color: var(--color-accent-dark); font-weight: 700; cursor: pointer; text-decoration: underline; font-size: 11px; display: inline-flex; align-items: center; gap: 2px;">${tr('Learn More', 'Dowiedz się więcej')} <span class="material-symbols-rounded" style="font-size:12px; font-variation-settings: 'FILL' 1;">info</span></span>
                </p>
            </div>
            <!-- Level bar -->
            <div class="jh-level-pill" id="j-level-pill">
                <span class="material-symbols-rounded" style="font-size:14px; color:var(--color-accent-dark);">local_florist</span>
                <span id="j-level-text" style="font-size:12px; font-weight:600;">${tr('Lv.', 'Poz.')}1</span>
            </div>
        </div>

        <!-- XP bar -->
        <div class="jh-xp-row">
            <div class="jh-xp-track">
                <div class="jh-xp-fill" id="j-xp-bar"></div>
            </div>
            <span class="jh-xp-label" id="j-xp-label">0 / 500 XP</span>
        </div>

        <!-- Path selector tabs -->
        <div class="jh-path-tabs" id="path-tab-bar">
            <!-- Injected by JS -->
        </div>

        <!-- Scrollable map — only this scrolls -->
        <div class="jh-map-scroll" id="journey-map-scroll">
            <div class="jh-map-inner" id="journey-map-inner">
                <!-- Nodes injected here -->
            </div>
        </div>

        <!-- Daily quest (hidden as requested) -->
        <div class="jh-quest-bar" id="journey-quest-bar" style="display: none !important;">
        </div>

        <!-- Mission modal -->
        <div id="mission-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-top-row">
                    <div style="flex:1;">
                        <h2 id="modal-title" class="modal-title"></h2>
                        <p id="modal-subtitle" class="modal-sub"></p>
                        <p id="modal-desc" class="modal-desc"></p>
                    </div>
                    <button id="modal-close" class="modal-close-btn">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>
                <div id="modal-missions-list" class="modal-mission-list"></div>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        /* ---- Journey screen ---- */
        .journey-screen {
            overflow: hidden;
            padding: calc(14px + env(safe-area-inset-top, 0px)) 16px 48px;
            background-size: cover;
            background-position: center top;
            background-repeat: no-repeat;
            transition: background-image 0.4s ease-in-out;
        }

        /* Add a gradient overlay to the whole screen for readability */
        .journey-screen::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(244,243,237,0.85) 0%, rgba(244,243,237,0.3) 150px, rgba(244,243,237,0.1) 100%);
            z-index: 0;
            pointer-events: none;
        }

        .jh-header, .jh-xp-row, .jh-path-tabs, .jh-map-scroll, .jh-quest-bar {
            position: relative;
            z-index: 1;
        }

        /* Header */
        .jh-header {
            flex-shrink: 0;
            display: flex; justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 6px;
        }
        .jh-title { font-size: 20px; font-weight: 700; margin: 0 0 2px; font-family: var(--font-heading); }
        .jh-subtitle { font-size: 11px; color: var(--color-text-muted); margin: 0; }
        .jh-level-pill {
            display: flex; align-items: center; gap: 4px;
            background: var(--color-accent-light); border-radius: 20px;
            padding: 4px 10px; flex-shrink: 0;
        }

        /* XP row */
        .jh-xp-row {
            flex-shrink: 0;
            display: flex; align-items: center; gap: 8px;
            margin-bottom: 10px;
        }
        .jh-xp-track {
            flex: 1; height: 5px;
            background: var(--color-bg-secondary); border-radius: 3px; overflow: hidden;
        }
        .jh-xp-fill {
            height: 100%; width: 0%;
            background: var(--color-accent-dark); border-radius: 3px;
            transition: width 0.4s;
        }
        .jh-xp-label { font-size: 10px; color: var(--color-text-muted); white-space: nowrap; flex-shrink: 0; }

        /* Path tabs */
        .jh-path-tabs {
            flex-shrink: 0;
            display: flex; gap: 6px;
            margin-bottom: 10px;
            overflow-x: auto;
            scrollbar-width: none;
        }
        .jh-path-tabs::-webkit-scrollbar { display: none; }
        .jh-tab {
            display: flex; align-items: center; gap: 5px;
            padding: 6px 12px; border-radius: 20px;
            border: 1.5px solid var(--color-bg-secondary);
            background: var(--color-bg-card);
            cursor: pointer; white-space: nowrap;
            transition: all 0.2s; flex-shrink: 0;
            font-size: 12px; font-weight: 500;
            color: var(--color-text-muted);
        }
        .jh-tab.active {
            border-color: var(--color-accent-dark);
            color: var(--color-accent-dark);
            background: var(--color-accent-light);
        }
        .jh-tab.locked {
            opacity: 0.55; cursor: default;
        }
        .jh-tab .material-symbols-rounded { font-size: 14px; }

        /* ---- MAP AREA: only this scrolls ---- */
        .jh-map-scroll {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .jh-map-inner {
            width: 100%;
            min-height: 600px;
            position: relative;
            overflow: hidden;
        }

        /* Locked overlay */
        .jh-map-locked-overlay {
            position: absolute; inset: 0;
            z-index: 10;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 10px;
            background: rgba(240,236,230,0.82);
            backdrop-filter: blur(3px);
            border-radius: 14px;
        }
        .jh-map-locked-overlay .material-symbols-rounded { font-size: 40px; color: #9A8F83; }
        .jh-map-locked-overlay p { font-size: 14px; font-weight: 600; color: #6B6059; margin: 0; }
        .jh-map-locked-overlay span.lk-sub { font-size: 11px; color: #9A8F83; }

        /* Nodes */
        .path-node {
            position: absolute;
            display: flex; flex-direction: column; align-items: center; gap: 5px;
            transform: translate(-50%, -50%);
            cursor: pointer; z-index: 2;
            transition: transform 0.2s;
        }
        .path-node:active { transform: translate(-50%, -50%) scale(0.9); }
        .path-node.locked { cursor: default; }

        .node-circle {
            width: 48px; height: 48px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            background: rgba(255,255,255,0.4);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 2px solid rgba(255,255,255,0.7);
            transition: all 0.3s;
        }
        .path-node.locked .node-circle {
            background: rgba(230,225,218,0.3);
            box-shadow: none; border-color: rgba(230,225,218,0.5);
        }
        .path-node.completed .node-circle {
            background: rgba(83, 163, 98, 0.85);
            border-color: rgba(83, 163, 98, 1);
        }
        .path-node.completed .node-circle .material-symbols-rounded { color: white; }
        .path-node.current .node-circle {
            width: 56px; height: 56px;
            background: rgba(255,255,255,0.9);
            border: 3px solid var(--color-accent-dark);
            box-shadow: 0 0 0 7px rgba(63,82,71,0.18), 0 4px 16px rgba(0,0,0,0.22);
        }
        .node-circle .material-symbols-rounded { font-size: 22px; color: var(--color-accent-dark); }
        .path-node.current .node-circle .material-symbols-rounded { font-size: 28px; }

        .node-label {
            font-size: 10px; font-weight: 700;
            color: var(--color-text-primary);
            background: rgba(255,255,255,0.9);
            padding: 2px 8px; border-radius: 6px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
            white-space: nowrap;
            backdrop-filter: blur(2px);
        }

        .node-pulse {
            position: absolute;
            width: 74px; height: 74px; border-radius: 50%;
            background: rgba(63,82,71,0.14);
            top: 50%; left: 50%; transform: translate(-50%, -50%);
            z-index: -1; animation: node-pulse 2.5s infinite;
        }
        @keyframes node-pulse {
            0%   { transform: translate(-50%, -50%); opacity: 0.8; }
            50%  { transform: translate(-50%, -50%); opacity: 0; }
            100% { transform: translate(-50%, -50%); opacity: 0.8; }
        }

        /* Quest bar */
        .jh-quest-bar {
            flex-shrink: 0;
            display: flex; justify-content: space-between; align-items: center;
            padding: 9px 14px;
            background: var(--color-bg-card);
            border-radius: 14px;
            margin-top: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .jh-quest-title { font-size: 12px; font-weight: 600; margin: 0 0 2px; color: var(--color-text-primary); }
        .jh-quest-sub   { font-size: 11px; color: var(--color-text-muted); margin: 0; }
        .jh-xp-badge {
            background: var(--color-accent-light); color: var(--color-accent-dark);
            padding: 3px 10px; border-radius: 12px; font-size: 10px; font-weight: 700;
        }
        @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 4px rgba(226, 184, 87, 0.4); }
            50%      { box-shadow: 0 0 12px rgba(226, 184, 87, 0.8); }
        }

        /* Modal */
        .modal-overlay {
            position: fixed; inset: 0;
            background: rgba(20,28,23,0.45);
            backdrop-filter: blur(6px);
            z-index: 300;
            display: flex; align-items: flex-end;
            opacity: 0; visibility: hidden;
            transition: opacity 0.25s, visibility 0.25s;
        }
        .modal-overlay.active { opacity: 1; visibility: visible; }
        .modal-content {
            background: var(--color-bg-card);
            width: 100%; max-width: 480px;
            margin: 0 auto;
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
            padding: 22px 20px 40px;
            transform: translateY(100%);
            transition: transform 0.35s cubic-bezier(0.15,0.85,0.35,1);
            box-shadow: 0 -6px 30px rgba(0,0,0,0.12);
            max-height: 80vh;
            overflow-y: auto;
        }
        .modal-overlay.active .modal-content { transform: translateY(0); }
        .modal-top-row {
            display: flex; justify-content: space-between;
            align-items: flex-start; margin-bottom: 16px;
        }
        .modal-title { font-size: 18px; font-weight: 700; margin: 0 0 3px; }
        .modal-sub { font-size: 11px; color: var(--color-text-muted); margin: 0 0 6px; }
        .modal-desc { font-size: 13px; color: var(--color-text-secondary); margin: 0; line-height: 1.45; }
        .modal-close-btn {
            background: var(--color-bg-secondary); border: none; cursor: pointer;
            border-radius: 50%; width: 32px; height: 32px;
            display: flex; align-items: center; justify-content: center;
            color: var(--color-text-muted); flex-shrink: 0; margin-left: 10px;
        }
        .modal-mission-list { display: flex; flex-direction: column; gap: 8px; }

        /* Mission items */
        .mission-item {
            display: flex; align-items: flex-start; gap: 10px;
            padding: 12px 14px;
            background: var(--color-bg-secondary);
            border-radius: 12px;
            cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
        }
        .mission-item:active { transform: scale(0.98); }
        .mission-item.completed { opacity: 0.6; cursor: default; }
        .mission-item.completed:active { transform: none; }
        .m-check {
            width: 22px; height: 22px; border-radius: 6px;
            border: 2px solid var(--color-text-muted);
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0; margin-top: 1px;
        }
        .m-check .material-symbols-rounded { font-size: 14px; color: transparent; }
        .mission-item.completed .m-check {
            background: var(--color-accent-dark);
            border-color: var(--color-accent-dark);
        }
        .mission-item.completed .m-check .material-symbols-rounded { color: white; }
        .m-body { flex: 1; }
        .m-text { font-size: 13px; line-height: 1.4; color: var(--color-text-primary); margin: 0; }
        .mission-item.completed .m-text { text-decoration: line-through; color: var(--color-text-muted); }
        .m-meta { font-size: 10px; color: var(--color-text-muted); margin: 3px 0 0; }
        .m-badge {
            font-size: 10px; font-weight: 700;
            color: var(--color-accent-dark);
            background: rgba(134,155,143,0.15);
            padding: 3px 8px; border-radius: 10px; flex-shrink: 0; align-self: center;
        }
    `;
    container.appendChild(style);

    // State
    let activePathId = DB.getActivePath();

    // Modal
    const modal = container.querySelector('#mission-modal');
    container.querySelector('#modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
        container.updateData();
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { modal.classList.remove('active'); container.updateData(); }
    });

    container.querySelector('#j-path-learn-more').addEventListener('click', () => {
        const path = PATHS[activePathId];
        openPathInfoModal(path);
    });

    function openPathInfoModal(path) {
        const title = container.querySelector('#modal-title');
        const subtitle = container.querySelector('#modal-subtitle');
        const desc = container.querySelector('#modal-desc');
        const list = container.querySelector('#modal-missions-list');

        title.innerHTML = `${path.label} <span style="font-size:12px; font-weight:bold; padding: 3px 8px; border-radius:10px; margin-left: 8px; background:${path.accentColor}20; color:${path.accentColor}; border: 1px solid ${path.accentColor}40;">${tr('Difficulty:', 'Trudność:')} ${path.difficulty}</span>`;
        subtitle.textContent = tr("Lineage & Practical Insights", "Tradycja i Wskazówki Praktyczne");
        
        let detailsHtml = '';
        if (path.id === 'anapana') {
            detailsHtml = `
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>${tr('Overview:', 'Przegląd:')}</strong> ${tr('Anapana is the classic Buddhist practice of mindfulness of breathing. It is the foundation for almost all meditation traditions.', 'Anapana to klasyczna buddyjska praktyka uważności oddechu. Stanowi fundament niemal wszystkich tradycji medytacyjnych.')}</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>${tr('Technique:', 'Technika:')}</strong> ${tr('Rest your focus entirely on the physical touch of air at the rims of your nostrils or upper lip. Notice temperature, friction, and movement without following the breath into the body.', 'Skup całą uwagę na fizycznym dotyku powietrza przy krawędziach nozdrzy lub nad górną wargą. Zauważaj temperaturę, tarcie i ruch bez podążania za oddechem w głąb ciała.')}</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>${tr('Why practice:', 'Dlaczego warto:')}</strong> ${tr('Builds sharp sensory clarity, calms the central nervous system, and prepares the mind for deep analytical body scanning.', 'Buduje wyostrzoną klarowność zmysłową, wycisza układ nerwowy i przygotowuje umysł do głębokiego skanowania ciała.')}</p>
            `;
        } else if (path.id === 'vipassana') {
            detailsHtml = `
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>${tr('Overview:', 'Przegląd:')}</strong> ${tr('Vipassana translates to "insight" — seeing things as they truly are. It is the heart of Theravada mindfulness lineages.', 'Vipassana oznacza „wgląd” — widzenie rzeczy takimi, jakie naprawdę są. Jest sercem tradycji uważności Theravady.')}</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>${tr('Technique:', 'Technika:')}</strong> ${tr('Systematically scan physical body sensations from head to toe, observing them with total equanimity. You will observe impermanence (anicca) and non-reaction.', 'Systematycznie skanuj fizyczne doznania w ciele od czubka głowy po stopy, obserwując je z całkowitą równowagą umysłu. Doświadczysz bezpośrednio nietrwałości (anicca) i braku reaktywności.')}</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>${tr('Why practice:', 'Dlaczego warto:')}</strong> ${tr('Reprograms the brain to stop reacting with craving or aversion to physical triggers, freeing you from deep-seated habit patterns.', 'Przeprogramowuje umysł, aby przestał reagować pożądaniem lub awersją na bodźce fizyczne, uwalniając Cię od głęboko zakorzenionych nawyków.')}</p>
            `;
        } else if (path.id === 'tmi') {
            detailsHtml = `
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>${tr('Overview:', 'Przegląd:')}</strong> ${tr('The Mind Illuminated (TMI) is a modern, highly systematic master guide that integrates classical teachings with cognitive science.', 'Oświecony Umysł (The Mind Illuminated — TMI) to nowoczesny, wysoce usystematyzowany przewodnik łączący klasyczne nauki z neuronauką i kognitywistyką.')}</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>${tr('Technique:', 'Technika:')}</strong> ${tr('A 10-stage progressive path focused on balancing attention (selecting specific details) with peripheral awareness (keeping track of the background environment).', '10-etapowa ścieżka skoncentrowana na równoważeniu uwagi (wybieraniu konkretnych szczegółów) ze świadomością peryferyjną (utrzymywaniem otwartości na tło doświadczenia).')}</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>${tr('Why practice:', 'Dlaczego warto:')}</strong> ${tr('Eliminates dullness, stops mind-wandering, and establishes stable, effortless attention through structured metrics.', 'Eliminuje ospałość, zatrzymuje błądzenie myśli i ustanawia stabilną, bezwysiłkową uwagę dzięki precyzyjnym wskazówkom.')}</p>
            `;
        } else if (path.id === 'metta') {
            detailsHtml = `
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>${tr('Overview:', 'Przegląd:')}</strong> ${tr('Metta is loving-kindness or goodwill. It is a heart-centered concentration technique rather than analytical scanning.', 'Metta to miłująca dobroć i życzliwość. Jest techniką koncentracji skupioną wokół serca, a nie analitycznego skanowania.')}</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>${tr('Technique:', 'Technika:')}</strong> ${tr('Silently repeat phrases of protection, happiness, and peace toward yourself, then expand the circle to a mentor, a dear friend, a neutral stranger, a difficult person, and eventually all living beings.', 'Powtarzaj w myślach życzenia bezpieczeństwa, szczęścia i spokoju wobec siebie, a następnie rozszerzaj krąg na mentora, przyjaciela, neutralnego nieznajomego, trudną osobę i wreszcie wszystkie żywe istoty.')}</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>${tr('Why practice:', 'Dlaczego warto:')}</strong> ${tr('Actively dissolves anger, builds empathy, increases emotional resilience, and softens self-criticism.', 'Aktywnie rozpuszcza gniew, buduje empatię, zwiększa odporność emocjonalną i łagodzi wewnętrznego krytyka.')}</p>
            `;
        } else if (path.id === 'zen') {
            detailsHtml = `
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>${tr('Overview:', 'Przegląd:')}</strong> ${tr('Zen (Zazen) meditation comes from East Asian Mahayana traditions. It is the ultimate practice of non-doing and radical presence.', 'Medytacja Zen (Zazen) wywodzi się ze wschodnioazjatyckich tradycji Mahajany. To najwyższa praktyka niedziałania i radykalnej obecności.')}</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>${tr('Technique:', 'Technika:')}</strong> ${tr('Direct your eyes downwards, sit with open awareness (Shikantaza — "just sitting"), and allow thoughts to arise and pass without any effort to hold or reject them.', 'Skieruj wzrok łagodnie w dół, usiądź w otwartej świadomości (Shikantaza — „tylko siedzenie”) i pozwól myślom pojawiać się oraz przemijać bez prób ich zatrzymywania czy odpychania.')}</p>
                <p style="margin-bottom:12px; line-height:1.5; font-size:13px; color:var(--color-text-secondary);"><strong>${tr('Why practice:', 'Dlaczego warto:')}</strong> ${tr('Directly reveals the spacious, non-dual nature of consciousness itself, dissolving the illusion of a separate self.', 'Bezpośrednio odsłania przestrzenną, niedualną naturę samej świadomości, rozpuszczając iluzję oddzielnego „ja”.')}</p>
            `;
        }

        desc.innerHTML = detailsHtml;
        list.innerHTML = ''; // No missions list in the info modal
        modal.classList.add('active');
    }



    function triggerQuestSplash() {
        const bar = container.querySelector('#journey-quest-bar');
        const rect = bar.getBoundingClientRect();
        const parent = container;
        const parentRect = parent.getBoundingClientRect();

        const x = rect.left + rect.width / 2 - parentRect.left;
        const y = rect.top + rect.height / 2 - parentRect.top;

        for (let i = 0; i < 15; i++) {
            const p = document.createElement('span');
            p.className = 'material-symbols-rounded';
            p.textContent = 'eco';
            p.style.position = 'absolute';
            p.style.left = `${x}px`;
            p.style.top = `${y}px`;
            p.style.fontSize = '20px';
            p.style.color = '#e2b857';
            p.style.pointerEvents = 'none';
            p.style.zIndex = '300';
            p.style.transition = 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)';

            const angle = Math.random() * Math.PI * 2;
            const dist = 50 + Math.random() * 120;
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist - 80;

            parent.appendChild(p);
            setTimeout(() => {
                p.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)`;
                p.style.opacity = '0';
            }, 10);
            setTimeout(() => p.remove(), 1200);
        }
    }

    function openModal(node, path) {
        container.querySelector('#modal-title').textContent = node.label;
        container.querySelector('#modal-subtitle').textContent = `${path.label} · ${node.subtitle}`;
        container.querySelector('#modal-desc').textContent = node.description;

        const list = container.querySelector('#modal-missions-list');
        list.innerHTML = '';
        node.missions.forEach((mission, idx) => {
            const done = DB.isMissionComplete(node.id, idx, path.id);
            const item = document.createElement('div');
            item.className = 'mission-item' + (done ? ' completed' : '');
            if (!done) {
                item.setAttribute('role', 'button');
                item.setAttribute('tabindex', '0');
            }
            item.innerHTML = `
                <div class="m-check"><span class="material-symbols-rounded">check</span></div>
                <div class="m-body">
                    <p class="m-text">${mission.text}</p>
                    <p class="m-meta">${mission.duration} ${tr('minute sit · +20 XP on completion', 'min medytacji · +20 XP za ukończenie')}</p>
                </div>
                <div class="m-badge">${mission.duration}m</div>
            `;
            if (!done) {
                item.addEventListener('click', () => {
                    modal.classList.remove('active');
                    const breathe = document.querySelector('.breathe-screen');
                    if (breathe) {
                        breathe.activeMission = {
                            nodeId: node.id,
                            missionIndex: idx,
                            pathId: path.id,
                            label: `${node.subtitle}: ${tr('Mission', 'Misja')} ${idx + 1}`,
                            description: mission.text,
                            minDuration: mission.duration
                        };
                        breathe.setTimerDuration(mission.duration);
                    }
                    window.dispatchEvent(new CustomEvent('siddha-navigate', { detail: { target: 'breathe' } }));
                });
            }
            list.appendChild(item);
        });

        modal.classList.add('active');
    }

    function buildMap(path) {
        const mapInner = container.querySelector('#journey-map-inner');
        const scrollArea = container.querySelector('#journey-map-scroll');

        // Dynamic height: enough for all nodes with 130px per node + padding
        const mapHeight = Math.max(600, path.nodes.length * 130 + 60);
        mapInner.style.height = `${mapHeight}px`;
        container.style.backgroundImage = `url('${path.bgImage}')`;
        mapInner.innerHTML = '';

        const progress = DB.getMissionProgress(path.id);
        const stats = DB.getStats();
        let foundCurrent = false;

        path.nodes.forEach(node => {
            const doneCount = progress[node.id] ? progress[node.id].length : 0;
            const allDone = doneCount === node.missions.length;
            let isUnlocked = node.id === 1;
            if (node.id > 1) {
                const prevDone = progress[node.id - 1]?.length || 0;
                isUnlocked = prevDone === path.nodes[node.id - 2].missions.length;
            }

            let cls = 'locked', icon = 'lock';
            if (isUnlocked) {
                icon = node.icon || 'self_improvement';
                if (allDone) { cls = 'completed'; }
                else if (!foundCurrent) { cls = 'current'; foundCurrent = true; }
                else { cls = 'available'; }
            }

            const el = document.createElement('div');
            el.className = `path-node ${cls}`;
            el.setAttribute('role', 'button');
            el.setAttribute('tabindex', '0');
            el.style.left = `${node.xPct}%`;
            el.style.top = `${node.yPct}%`;

            el.innerHTML = `
                ${cls === 'current' ? '<div class="node-pulse"></div>' : ''}
                <div class="node-circle">
                    <span class="material-symbols-rounded">${icon}</span>
                </div>
                <span class="node-label">${node.subtitle}</span>
            `;

            if (isUnlocked) {
                el.addEventListener('click', () => openModal(node, path));
            }
            mapInner.appendChild(el);
        });

        // Show locked overlay if path not unlocked yet
        const pathUnlocked = stats.level >= path.unlockLevel || DB.isPathUnlocked(path.id);
        if (!pathUnlocked) {
            const overlay = document.createElement('div');
            overlay.className = 'jh-map-locked-overlay';
            overlay.innerHTML = `
                <span class="material-symbols-rounded">lock</span>
                <p>${path.label}</p>
                <span class="lk-sub">${tr(`Unlocks at Level ${path.unlockLevel}`, `Odblokowuje się na Poziomie ${path.unlockLevel}`)}</span>
            `;
            mapInner.appendChild(overlay);
        }

        // Reset scroll position when switching paths
        scrollArea.scrollTop = 0;
    }

    function buildTabs() {
        const tabBar = container.querySelector('#path-tab-bar');
        tabBar.innerHTML = '';
        const stats = DB.getStats();

        Object.values(PATHS).forEach(path => {
            const isUnlocked = stats.level >= path.unlockLevel || DB.isPathUnlocked(path.id);
            const tab = document.createElement('button');
            tab.className = 'jh-tab' + (path.id === activePathId ? ' active' : '') + (!isUnlocked ? ' locked' : '');
            tab.innerHTML = `
                <span class="material-symbols-rounded">${isUnlocked ? path.icon : 'lock'}</span>
                ${path.shortLabel}
                ${!isUnlocked ? `<span style="font-size:9px;opacity:0.75;">${tr('Lv.', 'Poz.')}${path.unlockLevel}</span>` : ''}
            `;
            if (isUnlocked) {
                tab.addEventListener('click', () => {
                    if (activePathId === path.id) return;
                    activePathId = path.id;
                    DB.setActivePath(path.id);
                    buildTabs();
                    buildMap(PATHS[activePathId]);
                    updateHeader();
                });
            }
            tabBar.appendChild(tab);
        });
    }

    function updateHeader() {
        const path = PATHS[activePathId];
        container.querySelector('#j-path-subtitle').textContent = path.description;
    }

    container.updateData = () => {
        const stats = DB.getStats();
        container.querySelector('#j-level-text').textContent = `${tr('Lv.', 'Poz.')}${stats.level}`;
        // XP bar using scaled level thresholds
        const xpProgress = xpInCurrentLevel(stats.xp);
        const xpPct = Math.min(100, (xpProgress.earned / xpProgress.needed) * 100);
        container.querySelector('#j-xp-bar').style.width = `${xpPct}%`;
        container.querySelector('#j-xp-label').textContent = `${xpProgress.earned} / ${xpProgress.needed} XP`;
        activePathId = DB.getActivePath();
        updateHeader();
        buildTabs();
        buildMap(PATHS[activePathId]);

        // Update Daily Quest UI
        const q = DB.getDailyQuest();
        const questSub = container.querySelector('#journey-quest-sub');
        const questBadge = container.querySelector('#journey-quest-badge');
        const questBar = container.querySelector('#journey-quest-bar');

        if (q && questSub && questBadge && questBar) {
            questSub.textContent = `${q.emoji || '🎯'} ${q.label}`;

            if (q.claimed) {
                questBadge.textContent = tr('Claimed ✔', 'Odebrano ✔');
                questBadge.style.background = 'rgba(255,255,255,0.2)';
                questBadge.style.color = 'rgba(255,255,255,0.6)';
                questBadge.style.animation = 'none';
                questBar.style.opacity = '0.7';
                questBar.style.cursor = 'default';
                questBar.onclick = null;
            } else if (q.completed) {
                questBadge.textContent = tr('Claim +25 XP', 'Odbierz +25 XP');
                questBadge.style.background = '#e2b857';
                questBadge.style.color = '#1b2e26';
                questBadge.style.animation = 'pulseGlow 1.5s infinite';
                questBar.style.opacity = '1';
                questBar.style.cursor = 'pointer';
                questBar.onclick = () => {
                    const success = DB.claimDailyQuest(q.type);
                    if (success) {
                        Synth.playQuestClaimSound();
                        HapticService.vibrate('medium');
                        triggerQuestSplash();
                        container.updateData();
                    }
                };
            } else {
                questBadge.textContent = '+25 XP';
                questBadge.style.background = 'rgba(255,255,255,0.15)';
                questBadge.style.color = 'white';
                questBadge.style.animation = 'none';
                questBar.style.opacity = '1';
                questBar.style.cursor = 'pointer';
                questBar.onclick = () => {
                    const targetTab = (q && q.target) ? q.target : (q && q.type === 'wisdom' ? 'wisdom' : q && q.type === 'reflect' ? 'reflect' : q && q.type === 'journey' ? 'journey' : 'breathe');
                    window.dispatchEvent(new CustomEvent('siddha-navigate', { detail: { target: targetTab } }));
                };
            }
        }
    };

    return container;
}

import { DB } from '../services/db.js';

const ARTICLES = [
    // ─── FOUNDATIONS OF MINDFULNESS ───────────────────────────────────────────
    {
        id: "intro_breath",
        unlockLevel: 1,
        category: "Foundations of Mindfulness",
        emoji: "🌬️",
        title: "The Anchor of Breath: Settling the Mind",
        readTime: "4 min",
        summary: "Discover the foundational mechanics of breath observation, correct posture, and the art of returning when the mind wanders.",
        content: `
            <p>Every journey into meditation begins with a single breath. The breath is not merely a biological function — it is a portable anchor that binds the scattered mind to the immediate present. By resting attention on the physical sensations of breathing, we establish a quiet harbor away from the turbulence of conceptual thoughts.</p>

            <h3>The Posture of Presence</h3>
            <p>Before observing the breath, find a posture that expresses both alertness and ease. Sit with your spine naturally upright — neither stiffly rigid nor slouched. Relax your shoulders, soften your jaw, and let your hands rest gently on your lap. This physical alignment reflects the mental state we are cultivating: stable, open, and relaxed.</p>

            <h3>Finding Your Anchor Point</h3>
            <p>Direct your attention to where you feel the breath most vividly. For many, this is the cool sensation of air entering the nostrils and the warm sensation exiting. Others find greater clarity in the subtle rising and falling of the chest or abdomen. Choose one location and keep your attention anchored there. Observe the raw physical sensations — the expansion, the slight friction, the brief pause between inhale and exhale.</p>

            <h3>The Art of Returning</h3>
            <p>Within moments, your mind will wander. You may find yourself planning, daydreaming, or reliving a conversation. Do not view this as failure. The very moment you notice your mind has wandered <em>is</em> the moment of awakening — a small flash of metacognitive clarity. Smile inwardly, release the distraction without judgment, and gently guide your attention back to the breath.</p>

            <h3>Why This Simple Practice Is So Profound</h3>
            <p>Modern neuroscience confirms what meditators have known for millennia: the practice of repeatedly returning attention trains the prefrontal cortex, the brain's seat of executive function. Each return is a mental "rep," strengthening your capacity for focused attention and emotional regulation over time. Start with five minutes. The breath will always be waiting.</p>
        `
    },
    {
        id: "five_hindrances",
        unlockLevel: 1,
        category: "Foundations of Mindfulness",
        emoji: "🌫️",
        title: "The Five Hindrances: Knowing Your Inner Weather",
        readTime: "5 min",
        summary: "Identify the five classic mental obstacles that cloud meditation — desire, aversion, dullness, restlessness, and doubt — and how to work skillfully with each.",
        content: `
            <p>In the original Buddhist teachings, the Buddha identified five mental qualities that interrupt meditation and obscure clarity. These are called the <em>Pañca Nīvaraṇa</em> — the Five Hindrances. Understanding them transforms frustrating meditation sessions into rich opportunities for self-knowledge.</p>

            <h3>1. Sensual Desire (Kāmacchanda)</h3>
            <p>This is the pull toward pleasant experiences — craving a better seat, wishing the meditation were over so you could eat, or fantasizing about someone. The antidote is to recognize the mental image or object of craving without chasing it, observing how desire itself feels as a physical sensation in the body: the tightening in the chest, the restless energy in the hands.</p>

            <h3>2. Ill-Will (Vyāpāda)</h3>
            <p>This encompasses irritation, aversion, frustration, or resentment — toward a sound, a memory, a person. Rather than suppressing it, observe it with curiosity: Where does anger live in the body right now? Notice the heat, the clenching. Name it silently: "there is aversion." This naming activates the prefrontal cortex and reduces the emotional charge.</p>

            <h3>3. Dullness & Drowsiness (Thīna-Middha)</h3>
            <p>A fog descends on the mind, making attention slippery and the body heavy. Antidotes include: opening the eyes slightly, breathing deeper, straightening the spine, or visualizing a brilliant white light at the center of the forehead.</p>

            <h3>4. Restlessness & Worry (Uddhacca-Kukkucca)</h3>
            <p>The mind races, jumps between thoughts, plans future conversations, or rehashes the past. This is the opposite of dullness — the mind has too much energy with nowhere to go. Grounding antidotes help: feel the weight of your body, the pressure of feet against the floor, and take several deep, slow exhalations.</p>

            <h3>5. Doubt (Vicikicchā)</h3>
            <p>This is the most insidious hindrance — the questioning voice that says, "Is this even working? Maybe this tradition isn't right for me." Skillfully examine doubt: ask yourself, "What would it feel like to practice without doubt for just the next five minutes?" Then, simply return to the breath. Doubt dissolves through direct experience, not through arguments.</p>

            <h3>The Bigger Picture</h3>
            <p>The hindrances are not enemies — they are teachers. Each one is a mirror showing you a conditioned pattern of the mind. When you stop fighting them and start studying them, your mediation shifts from a battle into a laboratory.</p>
        `
    },
    {
        id: "body_scan_basics",
        unlockLevel: 2,
        category: "Foundations of Mindfulness",
        emoji: "🧠",
        title: "The Body Scan: Rediscovering Your Physical Home",
        readTime: "5 min",
        summary: "A systematic guide to the body scan — one of the most effective tools for developing embodied awareness, reducing stress, and releasing unconscious tension.",
        content: `
            <p>Most of us live from the neck up. Our attention is absorbed in thoughts, plans, and worries, while the body — our primary home in this world — is almost entirely ignored. The body scan is a meditation technique that systematically re-inhabits every corner of our physical being, dissolving tension and rebuilding the mind-body connection.</p>

            <h3>Why the Body Holds So Much</h3>
            <p>The somatic therapist Peter Levine observed that trauma and stress are stored not just in memory but in patterns of chronic muscular holding. Even without trauma, daily emotional suppression — the frustration you didn't express, the anxiety you pushed down — accumulates in the body as micropatterns of tension. The body scan allows these to surface safely and release.</p>

            <h3>The Basic Practice</h3>
            <p>Lie flat or sit comfortably. Begin by placing attention at the crown of your head. Scan slowly, region by region, moving downward through the face, jaw, neck, shoulders, upper arms, forearms, hands, chest, upper back, belly, lower back, hips, thighs, calves, feet, and finally the toes.</p>
            <p>At each region, pause and <em>feel</em> — not think. Notice: Is there warmth or coolness? Tingling or numbness? Tension or ease? You are not trying to change anything. You are simply observing what is already there.</p>

            <h3>Working with Difficult Areas</h3>
            <p>If you arrive at a region that holds pain, tightness, or strong emotion, slow down. Breathe into that area — imagine the inhalation flowing directly into the tension. On the exhalation, let the area soften slightly. Do not force relaxation; simply invite it. After several breaths, continue moving through the body.</p>

            <h3>Physiological Benefits</h3>
            <p>Studies at the MBSR (Mindfulness-Based Stress Reduction) program at the University of Massachusetts show that regular body scan practice reduces cortisol levels, improves sleep quality, reduces chronic pain perception, and increases interoceptive awareness — the ability to accurately sense one's own internal bodily states, which is closely linked to emotional intelligence.</p>
        `
    },
    {
        id: "overcome_dullness",
        unlockLevel: 2,
        category: "Foundations of Mindfulness",
        emoji: "☀️",
        title: "Navigating Mental Dullness: Restoring Alert Clarity",
        readTime: "4 min",
        summary: "Learn to identify the spectrum of dullness in meditation and apply targeted antidotes to restore sharp, luminous awareness.",
        content: `
            <p>As your meditation practice stabilizes, you will encounter a subtle but persistent obstacle: dullness. When the mind stops wandering outward, it often collapses inward into a sleepy fog. You enter a warm, pleasant, but murky state. This is dullness, and if left unchecked, it stalls progress by replacing alert clarity with mental haze.</p>

            <h3>Recognizing the Spectrum</h3>
            <p>Dullness exists on a gradient. In its <strong>subtle form</strong>, awareness is continuous but lacks sharpness — the breath feels distant, details lose definition. In its <strong>strong form</strong>, thoughts become disjointed, concentration slips, and you may not notice the breath for extended periods. In <strong>gross dullness</strong>, you effectively fall asleep with eyes open.</p>
            <p>Mindfulness requires two qualities: <em>stability</em> (remaining on the object) and <em>vividness</em> (crystal-clear awareness). Dullness destroys vividness while leaving a shallow semblance of stability.</p>

            <h3>Active Antidotes</h3>
            <p>When dullness sinks in, apply these progressive correctives:</p>
            <ul>
                <li><strong>Intention sharpening:</strong> Internally commit to observing the <em>finest</em> sensations of the breath — the exact moment inhalation ends, the microscopic sensations at the very tip of the nostrils.</li>
                <li><strong>Open-eyed posture:</strong> Lift your gaze slightly, open your eyes to a 20% squint, and let more light in.</li>
                <li><strong>Deep breathing:</strong> Take three forceful inhalations and complete exhalations to oxygenate the brain.</li>
                <li><strong>Body tensing:</strong> On an inhale, tense every muscle fully for 5 seconds, then release completely on the exhale.</li>
                <li><strong>Counting:</strong> Pair each breath with a mental count from 1–10 to add a mild cognitive load that keeps the mind engaged.</li>
            </ul>

            <h3>Prevention: Practice Timing</h3>
            <p>Dullness is more prevalent after meals, in warm rooms, and in the early afternoon. If possible, schedule demanding meditation sessions in the morning on an empty stomach, when the nervous system is naturally alert. Short, frequent sessions also combat dullness more effectively than long, irregular ones.</p>
        `
    },

    // ─── INSIGHT PRACTICE ─────────────────────────────────────────────────────
    {
        id: "anicca_flow",
        unlockLevel: 3,
        category: "Insight Practice",
        emoji: "🌊",
        title: "Anicca: Experiencing the River of Change",
        readTime: "5 min",
        summary: "Deepen body scanning by recognizing that all sensations are fleeting currents of energy, dissolving the illusion of a fixed, solid self.",
        content: `
            <p>In the Vipassana tradition, we move beyond anchoring attention to directly investigating the nature of reality itself. The primary insight we are invited to encounter is <em>Anicca</em> — impermanence. Nothing in our physical or mental landscape is static; everything is a flowing stream of arising and passing phenomena.</p>

            <h3>The Microscope of Awareness</h3>
            <p>Begin by scanning your body as usual. But now, rather than accepting your habitual labels ("knee pain," "stiff shoulder"), zoom in closer. When you arrive at a sensation, ask: what exactly is here? Not the concept of pain — but its actual texture. Is it heat? Pressure? A high-frequency vibration? Notice that what you thought was a solid block of sensation actually dissolves, on closer inspection, into a pulsing cloud of smaller events.</p>

            <h3>The Dissolution of the Solid Body</h3>
            <p>As concentration deepens over weeks and months, meditators report that the body begins to feel less like a solid object and more like a field of electrical tingling, or a column of warm light. This is not imagination — it is the direct experience of what physicists describe as mostly empty space organized by electromagnetic forces. The solidity we experience is a mental construction, not an objective feature of reality.</p>

            <h3>Arising and Passing</h3>
            <p>Sit for twenty minutes observing one prominent sensation. Notice how it is <em>never exactly the same</em> from moment to moment. It has waves of intensity. It shifts location slightly. It has a mood or quality that changes. Eventually, it will fade entirely. This is impermanence operating in real time, in your own body.</p>

            <h3>Freedom Through Impermanence</h3>
            <p>This insight might seem abstract, but its practical consequence is radical: if all sensations are impermanent, there is nothing to cling to and nothing to run from. Even the most intense anxiety or physical pain, observed without resistance, is revealed to be a passing river — not a permanent state. This recognition is the first major doorway to liberation in the Theravāda tradition.</p>
        `
    },
    {
        id: "equanimity_discomfort",
        unlockLevel: 5,
        category: "Insight Practice",
        emoji: "⚖️",
        title: "Equanimity: The Quiet Harbor of Non-Reaction",
        readTime: "5 min",
        summary: "Develop deep psychological stability by decoupling raw sensations from mental resistance — the heart of suffering-free awareness.",
        content: `
            <p>Equanimity is often misunderstood as indifference or detachment. In meditation, it refers to something far richer: the capacity to remain mentally balanced and undisturbed in the presence of whatever arises — whether pleasant, painful, or neutral.</p>

            <h3>The Suffering Equation</h3>
            <p>In meditation, we encounter a liberating equation: <strong>Suffering = Pain × Resistance</strong>. Physical pain is one component — the sensation itself. But <em>suffering</em> is produced by the mental reaction: the frustration that the pain is there, the worry it will worsen, the craving for it to stop. While we cannot always avoid pain, we can eliminate resistance through equanimity — reducing suffering to near zero.</p>

            <h3>Welcoming the Storm</h3>
            <p>When intense discomfort arises during a sit, try this: instead of escaping it, make it your primary meditation object. Relax the muscles around the uncomfortable area. Soften your breath. Imagine your awareness is a boundless sky, and the discomfort is simply a passing weather formation. Ask: does this sensation have a center? Does it have borders? Does it pulse, heat, vibrate?</p>

            <h3>Pleasantness Without Grasping</h3>
            <p>Equanimity also means not clinging to pleasant states. When meditation brings bliss, calm, or joy — notice the natural tendency to grasp it, to make it last. The skilled practitioner witnesses even these positive states with the same balance: "This too is pleasant, and this too will pass."</p>

            <h3>Equanimity in Daily Life</h3>
            <p>As this quality matures on the cushion, it permeates daily experience. When plans fall through, someone speaks harshly, or the unexpected occurs, you will notice the initial wave of reactivity — and then a spaciousness that was not there before. From that spacious harbor, you begin to choose responses instead of simply executing reactions.</p>
        `
    },
    {
        id: "anatta_self",
        unlockLevel: 5,
        category: "Insight Practice",
        emoji: "🔍",
        title: "Anattā: The Mystery of No-Self",
        readTime: "6 min",
        summary: "Investigate the most radical insight of the Buddhist path — that what we call 'I' is a process rather than a fixed entity.",
        content: `
            <p>Of the three marks of existence in Buddhist philosophy — impermanence, suffering, and no-self — <em>anattā</em> (no-self) is the most counterintuitive and transformative. It does not mean that you don't exist; it means that what you call "self" is a dynamic process, not a fixed, independent entity.</p>

            <h3>The Chariot Analogy</h3>
            <p>The Buddhist monk Nāgasena explained anattā beautifully to King Milinda: "Is this chariot the wheel? No. Is it the axle? No. Is it the frame? No. Then where is the chariot?" The chariot is a conventional label applied to a particular arrangement of parts. It has no independent, permanent existence beyond those parts. In the same way, "self" is a conventional label applied to a particular arrangement of body, feelings, perceptions, mental formations, and consciousness.</p>

            <h3>The Self as Process</h3>
            <p>In meditation, as you watch thoughts arise, you may notice: you did not choose that thought. It appeared. You are more like the space in which mental events occur than the author of those events. The thought-stream, the emotional waves, the sensory impressions — they all arise due to conditions, not due to a central controller.</p>

            <h3>Investigating "Who Is Aware?"</h3>
            <p>When you notice a thought, there is awareness of that thought. Now look for the one who is aware. Investigate directly: is there a "looker" behind awareness? Many meditators report that when this question is investigated honestly, the sense of a fixed self dissolves into a vast, open field of cognition — what the Tibetan tradition calls "rigpa" (intrinsic awareness).</p>

            <h3>Liberation, Not Nihilism</h3>
            <p>Anattā is frequently misunderstood as nihilism. But the historical Buddha explicitly rejected both the extreme of an eternal self and the extreme of absolute non-existence. What he pointed to was a middle way: there is this body, these thoughts, these feelings — arising and passing as part of an ongoing river. The burden of defending, maintaining, and glorifying a fixed self lifts, and with it, a profound lightness emerges.</p>
        `
    },
    {
        id: "dependent_origination",
        unlockLevel: 7,
        category: "Insight Practice",
        emoji: "🔗",
        title: "Dependent Origination: The Web of Becoming",
        readTime: "6 min",
        summary: "Explore the Buddha's map of how suffering arises and ceases through twelve interdependent links — a profound diagnostic of the human condition.",
        content: `
            <p>Dependent Origination — <em>Paticca-samuppāda</em> — is considered by many scholars to be the Buddha's most distinctive and sophisticated philosophical contribution. It maps, in precise causal chains, how suffering arises and how it ceases. Understanding this map transforms meditation from a relaxation technique into a systematic path of liberation.</p>

            <h3>The Twelve Links</h3>
            <p>The chain begins with <strong>ignorance</strong> (not knowing the true nature of reality), which conditions <strong>volitional formations</strong> (karmic impulses), which condition <strong>consciousness</strong>, then <strong>mind-and-body</strong>, the six sense bases, <strong>contact</strong>, <strong>feeling-tone</strong> (pleasant/unpleasant/neutral), <strong>craving</strong>, <strong>clinging</strong>, <strong>becoming</strong>, <strong>birth</strong>, and finally <strong>suffering</strong> (aging, death, grief).</p>

            <h3>The Crucial Pivot: Feeling-Tone</h3>
            <p>Practitioners find the most actionable insight in the link between <em>vedanā</em> (feeling-tone) and <em>craving</em>. Every single moment of experience carries a tonal quality: pleasant, unpleasant, or neutral. Normally, we automatically react — grasping toward pleasant, pushing away unpleasant. This reflexive reaction is the engine of suffering. Meditation trains us to insert a moment of awareness at this pivot point: to <em>feel</em> a pleasant tone without automatically grasping for more; to feel an unpleasant tone without automatically pushing it away.</p>

            <h3>Breaking the Chain</h3>
            <p>When awareness interrupts the automatic movement from vedanā to craving, the entire downstream cascade — clinging, becoming, suffering — has no fuel. This is not intellectual understanding; it is a shift in the actual mechanics of how the mind processes experience, available to be felt directly in meditation.</p>

            <h3>The Chain Running Backward: Cessation</h3>
            <p>The Buddha also taught the chain of cessation: when ignorance ceases, formations cease; when formations cease, consciousness of a grasping kind ceases — all the way down the chain to the cessation of suffering. This is Nibbāna — not a heavenly realm, but the extinguishing of the fires of craving and aversion.</p>
        `
    },

    // ─── ZEN TRADITION ────────────────────────────────────────────────────────
    {
        id: "shikantaza_zen",
        unlockLevel: 3,
        category: "Zen Tradition",
        emoji: "🏔️",
        title: "Shikantaza: Resting in the Ocean of Awareness",
        readTime: "5 min",
        summary: "Explore the Zen practice of 'just sitting' — releasing all focus, techniques, and goals to rest in pure, choiceless awareness.",
        content: `
            <p>In the Sōtō school of Zen, there is a practice called <em>Shikantaza</em> — literally, "just sitting." Unlike technique-based approaches that instruct you to focus on the breath or scan the body, Shikantaza involves dropping all techniques, objects, and agendas. You sit not to become calm, not to gain insight, and not to achieve enlightenment — you simply sit.</p>

            <h3>Choiceless Awareness</h3>
            <p>Let your awareness open like the sky. Do not narrow it onto any single object. If a bird chirps outside, let the sound arise in awareness and pass. If a memory surfaces, let it float by like a cloud reflected in still water. If the breath deepens, let it deepen. You are not trying to change or control anything — you are simply the spacious, luminous mirror that reflects whatever is present.</p>

            <h3>Dropping the Meditator</h3>
            <p>The great challenge of "just sitting" is our deeply conditioned habit of wanting to <em>do</em> something. We want to meditate "well." In Shikantaza, the Japanese Zen master Dōgen instructed us to drop even the identity of the meditator. There is no one sitting — there is only sitting itself. Thoughts arise in awareness and pass, but they belong to no one.</p>

            <h3>Sitting as the Mountain</h3>
            <p>Sit like a majestic mountain. Clouds gather and disperse around the peak, winds blow, and seasons shift across the landscape, but the mountain remains unmoved — simply present, witnessing the play of phenomena. In the same way, rest in your natural state of open, luminous presence, realizing that you are already complete, exactly as you are.</p>

            <h3>The Paradox of Effort</h3>
            <p>Shikantaza requires a refined effort: the effort not to effortfully meditate. Master Kōdō Sawaki called it "the most difficult thing in the world, and also the simplest." If you find yourself trying hard to let go, you are not in Shikantaza — you are in the trying. Gently notice this, and relax the effort. Rest in what is already here.</p>
        `
    },
    {
        id: "koans_gateway",
        unlockLevel: 5,
        category: "Zen Tradition",
        emoji: "❓",
        title: "Koans: Questions That Cannot Be Answered by Thinking",
        readTime: "5 min",
        summary: "Understand the purpose and mechanics of koan practice — how paradoxical riddles are used to exhaust conceptual thought and reveal direct knowing.",
        content: `
            <p>Among the most misunderstood innovations of the Rinzai Zen tradition are <em>koans</em> — enigmatic riddles or exchanges that seem to defy rational analysis. "What is the sound of one hand clapping?" "What was your original face before your parents were born?" These are not trick questions with clever answers. They are tools designed to drive the conceptual mind to its absolute limit, and beyond.</p>

            <h3>The Purpose of Paradox</h3>
            <p>The rational, analytical mind is extraordinarily powerful — but it operates by categorizing, dividing, and labeling. It cannot grasp what is prior to categories. A koan is an invitation to leap beyond the thinking mind entirely, into direct, non-conceptual knowing. The great 13th-century Zen master Wumen said: "The koan is the gateless barrier of Zen."</p>

            <h3>Working a Koan</h3>
            <p>The classical method is to hold the koan continuously in awareness during formal sitting and while going about daily activities. Rather than thinking <em>about</em> the koan, you allow it to become a living question that saturates consciousness. The inquiry "What is Mu?" — from the famous case of Zhaozhou's dog — is worked like a bellows: the question builds internal pressure until ordinary thinking collapses and a different quality of knowing opens.</p>

            <h3>The Breakthrough (Kenshō)</h3>
            <p>When the koan "breaks open," the result is called <em>kenshō</em> — seeing one's nature. It is not an intellectual answer, and it cannot be adequately described. Experienced Zen teachers test kenshō not by asking for a verbal explanation but by presenting the student with further probing challenges. The breakthrough is validated through spontaneous, appropriately absurd, or embodied responses that demonstrate experiential understanding.</p>

            <h3>Koans in Daily Practice</h3>
            <p>You need not enter formal koan training to benefit from this spirit. You can hold simple questions in daily awareness: "Who is walking?" "Who is eating?" These questions, held lightly, can thin the membrane between conceptual and direct experience in ordinary moments.</p>
        `
    },
    {
        id: "beginner_mind",
        unlockLevel: 1,
        category: "Zen Tradition",
        emoji: "🌱",
        title: "Beginner's Mind: The Fullness of Not-Knowing",
        readTime: "3 min",
        summary: "Shunryū Suzuki's foundational teaching that the most fruitful posture toward life and practice is radical openness to every moment as if for the first time.",
        content: `
            <p>"In the beginner's mind there are many possibilities, but in the expert's mind there are few." — Shunryū Suzuki, <em>Zen Mind, Beginner's Mind</em></p>

            <h3>The Expert's Trap</h3>
            <p>As we develop any skill — including meditation — we accumulate frameworks, preferences, and conclusions. "I know how this kind of session goes." "This is what this sensation means." These accumulated judgments, while sometimes useful, are also the very mechanisms that prevent us from seeing what is freshly, actually here. The expert mind perceives through a filter of prior knowledge. The beginner's mind sees directly.</p>

            <h3>Beginner's Mind is Not Ignorance</h3>
            <p>Suzuki Roshi was not praising incompetence. He was pointing to a quality of <em>openness and curiosity</em> that transcends both expertise and ignorance. The experienced meditator with beginner's mind brings years of technical knowledge to the seat, while approaching each breath as if for the first time. This combination — competence without rigidity — is the mark of genuine maturity.</p>

            <h3>Practicing Freshness</h3>
            <p>At the beginning of each sit, take a moment to consciously set aside your conclusions about what this session will be like. Meet the first breath as if you have never breathed before. When an experience feels familiar, look for what is actually new about it right now. What texture does this particular moment of breath have that no other moment has ever had?</p>

            <h3>The Rewards of Not-Knowing</h3>
            <p>Practitioners who cultivate beginner's mind report that their meditations feel genuinely fresh even after years of daily practice. Boredom — which is always the mind's commentary about a moment rather than the moment itself — rarely arises. Every sit becomes an adventure into undiscovered territory.</p>
        `
    },

    // ─── LOVING-KINDNESS & COMPASSION ─────────────────────────────────────────
    {
        id: "metta_intro",
        unlockLevel: 2,
        category: "Loving-Kindness & Compassion",
        emoji: "💚",
        title: "Mettā: The Radical Practice of Unlimited Goodwill",
        readTime: "5 min",
        summary: "Learn the ancient practice of Loving-Kindness meditation — generating heartfelt goodwill systematically toward yourself and all beings.",
        content: `
            <p><em>Mettā</em> — the Pāli word for loving-kindness or goodwill — is one of the four Brahmaviharas (Divine Abodes), a set of contemplative practices designed to cultivate vast, unconditional positive states of mind. Where insight practices like Vipassana investigate the nature of experience, Mettā actively cultivates the quality of the heart.</p>

            <h3>The Basic Method</h3>
            <p>Begin by settling into meditation posture and becoming aware of the body and breath. Then, bring to mind a genuine wish for your own wellbeing — not as something you feel obligated to say, but as a real aspiration. Silently or mentally repeat phrases such as:</p>
            <ul>
                <li>May I be safe.</li>
                <li>May I be healthy.</li>
                <li>May I be happy.</li>
                <li>May I live with ease.</li>
            </ul>
            <p>Allow these words to be felt rather than merely thought. If you notice resistance — "I don't deserve this" — observe that reaction with curiosity, and gently return to the phrases.</p>

            <h3>Expanding the Circle</h3>
            <p>After five to ten minutes with yourself, gradually expand the circle of goodwill. Move to someone you love easily (a close friend, a pet), then a neutral person (a neighbor you don't know well), then a difficult person, and finally to all beings everywhere — in all directions, in all states of existence.</p>

            <h3>Neuroscience of Loving-Kindness</h3>
            <p>Research led by Dr. Richard Davidson at the University of Wisconsin found that long-term Mettā practitioners showed significantly greater activity in the brain's left prefrontal cortex — a region associated with positive affect and resilience — compared to controls. Even eight weeks of brief daily Mettā practice produced measurable changes in grey matter in compassion-related brain regions.</p>

            <h3>Mettā and Insight</h3>
            <p>The Buddha taught that Mettā is not merely a feel-good practice — it is a direct path to liberation. When the heart is fully open with goodwill for all beings without exception, the mechanisms of self-contraction and othering that generate suffering lose their grip. The boundless heart is, itself, a form of freedom.</p>
        `
    },
    {
        id: "compassion_karuna",
        unlockLevel: 3,
        category: "Loving-Kindness & Compassion",
        emoji: "🤍",
        title: "Karuṇā: The Trembling of the Heart Before Suffering",
        readTime: "4 min",
        summary: "Understand compassion as an active, intelligent response to suffering — neither sentimental nor overwhelmed, but grounded and open.",
        content: `
            <p>Compassion — <em>karuṇā</em> in Pāli — is often mistaken for pity or sadness. In the contemplative tradition, it is something far more powerful: the capacity to be fully present with suffering — your own and others' — without being swept away by it, and with the genuine wish that suffering be relieved.</p>

            <h3>The Difference Between Empathy and Compassion</h3>
            <p>Research by neuroscientist Tania Singer distinguishes between <em>empathic distress</em> (feeling another's pain as your own, leading to burnout) and <em>compassion</em> (a warm, outward-oriented concern for the other). The difference is physiological: empathic distress activates the brain's pain matrix; compassion activates reward and affiliation circuits. Crucially, compassion is more sustainable — it strengthens rather than depletes the caregiver.</p>

            <h3>The Karuṇā Practice</h3>
            <p>Bring to mind someone who is suffering — perhaps a person you know who is going through difficulty. Feel their situation in your body. Notice if your heart "trembles" — this responsive quality is the seed of karuṇā. Then, silently offer:</p>
            <ul>
                <li>May you be free from suffering.</li>
                <li>May you be free from inner pain.</li>
                <li>May you find peace.</li>
            </ul>
            <p>If what arises feels overwhelming, you can first apply these phrases to yourself, ensuring your own ground is stable before extending to others.</p>

            <h3>Equanimity as the Ground</h3>
            <p>True compassion requires the stability of equanimity beneath it. Without equanimity, compassion collapses into overwhelm. With equanimity, you can face the most intense suffering — your own or another's — and remain a clear, stable, effective presence. This is the combination that defines the Bodhisattva ideal in Mahāyāna Buddhism: boundless compassion, grounded in unshakeable clarity.</p>
        `
    },
    {
        id: "tonglen_practice",
        unlockLevel: 7,
        category: "Loving-Kindness & Compassion",
        emoji: "🌀",
        title: "Tonglen: Breathing In Darkness, Breathing Out Light",
        readTime: "5 min",
        summary: "Discover the Tibetan Buddhist practice of giving and receiving — a radical reversal of self-protective instinct that turns suffering into compassionate action.",
        content: `
            <p>Tonglen — "sending and receiving" in Tibetan — is among the most counterintuitive and powerful practices in the entire contemplative canon. Where every instinct tells us to push suffering away and pull pleasantness in, Tonglen deliberately reverses this: on the inhalation, we breathe in suffering, pain, and darkness; on the exhalation, we breathe out relief, spaciousness, and light.</p>

            <h3>Why Reverse the Instinct?</h3>
            <p>Pema Chödrön, who brought this practice to the West, explains that the constant project of avoiding pain and securing pleasure is itself the root of our suffering. By willingly breathing in what we most fear — difficulty, pain, uncertainty — we break the habitual contraction of self-protection and discover the spaciousness that was always available beneath it.</p>

            <h3>The Four Stages of Practice</h3>
            <p><strong>Stage 1 — Resting in openness:</strong> Begin by briefly resting in a flash of open, spacious awareness. Just open, before concepts.</p>
            <p><strong>Stage 2 — Working with texture:</strong> Breathe in a sense of heaviness, darkness, and heat. Breathe out coolness, lightness, and space. Get the feeling of this in your body.</p>
            <p><strong>Stage 3 — A specific person:</strong> Call to mind someone who is suffering. On the inhalation, draw their pain into your heart. On the exhalation, send them relief, ease, love.</p>
            <p><strong>Stage 4 — All beings:</strong> Expand to all beings in a similar situation — all those experiencing this kind of suffering. Breathe in their pain collectively; breathe out wellbeing to all of them.</p>

            <h3>The Paradox of Transformation</h3>
            <p>Practitioners report that contrary to expectation, Tonglen does not produce depression or heaviness. Because the suffering is not held or suppressed but breathed through, it transforms — like fuel being consumed in a furnace. The heart grows larger, not heavier. Suffering becomes the very vehicle of compassion's development.</p>
        `
    },

    // ─── MIND & NEUROSCIENCE ──────────────────────────────────────────────────
    {
        id: "default_mode_network",
        unlockLevel: 3,
        category: "Mind & Neuroscience",
        emoji: "🔬",
        title: "The Wandering Mind: Default Mode Network & Self-Referential Thought",
        readTime: "5 min",
        summary: "Discover the neuroscience behind mind-wandering, why the brain has a 'default mode,' and how meditation systematically reshapes these circuits.",
        content: `
            <p>In 2001, neurologist Marcus Raichle and his colleagues made a striking discovery: large swaths of the brain become <em>more</em> active when people are at rest and not engaged in a task. They named this the Default Mode Network (DMN). What is the brain doing when it is "at rest"? It is thinking about itself — planning the future, ruminating on the past, and evaluating the social world. It is, in a word, daydreaming.</p>

            <h3>The Cost of Mind-Wandering</h3>
            <p>Harvard psychologists Matthew Killingsworth and Daniel Gilbert conducted a landmark study by texting participants at random moments and asking what they were doing, what they were thinking, and how they were feeling. Result: people spent nearly 47% of waking hours thinking about something other than what they were actually doing. And — crucially — a wandering mind was a reliably unhappy mind, regardless of the activity being interrupted.</p>

            <h3>Meditation's Effect on the DMN</h3>
            <p>Neuroimaging studies comparing experienced meditators with novices show a striking pattern: meditators have significantly reduced activity in the DMN during both meditation and rest. More importantly, when the DMN does activate in meditators — when their mind does wander — the brain regions responsible for noticing this (the dorsal attention network and anterior insula) engage more rapidly, enabling a faster "snap back" to present awareness.</p>

            <h3>The Practical Implication</h3>
            <p>Meditation is, in a very literal sense, training the brain to spend less time in self-referential narrative and more time in direct present-moment experience. This shift is associated with reduced rumination (linked to depression), improved emotional regulation, and greater subjective wellbeing. The sitting practice is the training ground; life is the arena where the training is applied.</p>
        `
    },
    {
        id: "neuroplasticity_meditation",
        unlockLevel: 5,
        category: "Mind & Neuroscience",
        emoji: "🧬",
        title: "Neuroplasticity: How Meditation Literally Reshapes the Brain",
        readTime: "5 min",
        summary: "Explore the scientific evidence that meditation produces measurable structural and functional changes in the brain — and what this means for your practice.",
        content: `
            <p>For most of the 20th century, neuroscience held that the brain's architecture was essentially fixed by early adulthood. Santiago Ramón y Cajal, the father of modern neuroscience, wrote in 1913 that adult neurons are "fixed, immutable; nothing may be regenerated." We now know this is profoundly wrong. The brain is plastic throughout life — and meditation is one of the most potent reshaping forces available.</p>

            <h3>The Harvard Studies</h3>
            <p>Neuroscientist Sara Lazar at Harvard Medical School found that meditators had significantly greater cortical thickness in regions including the prefrontal cortex and the right anterior insula — areas involved in attention, interoception, and sensory processing. The effect was most pronounced in older participants, suggesting meditation may slow age-related cortical thinning.</p>

            <h3>Eight Weeks to a Changed Brain</h3>
            <p>A landmark study by Britta Hölzel and colleagues (published in Psychiatry Research: Neuroimaging, 2011) found that just eight weeks of MBSR practice produced measurable increases in grey matter density in the hippocampus (learning and memory), the posterior cingulate cortex (self-relevance), the cerebellum (coordination), and the temporoparietal junction (compassion and perspective-taking). The amygdala — the brain's threat-detection center — showed decreased grey matter density, correlating with reduced stress.</p>

            <h3>Long-Term Transformations</h3>
            <p>In experienced meditators with tens of thousands of hours of practice, changes are even more dramatic. Richard Davidson's studies of expert meditators — including Tibetan monks — found gamma-wave synchrony of extraordinary amplitude and duration during compassion meditation. Davidson concluded these individuals had fundamentally restructured the affective circuitry of their brains.</p>

            <h3>What This Means for You</h3>
            <p>Every time you sit and return your attention to the present moment, you are not just having a nice experience — you are participating in the literal, physical restructuring of your nervous system. The brain changes you are making today will compound over months and years into a genuinely different quality of mind.</p>
        `
    },
    {
        id: "stress_response",
        unlockLevel: 2,
        category: "Mind & Neuroscience",
        emoji: "💡",
        title: "The Stress Response: Biology, Suffering & the Relaxation Antidote",
        readTime: "4 min",
        summary: "Understand how the body's stress response system works, why it causes so much modern suffering, and how meditation directly interrupts it.",
        content: `
            <p>The stress response was designed for a world of brief, physical dangers: a predator, a fight, a fall. Cortisol and adrenaline flood the body, heart rate spikes, muscles tense, blood flow prioritizes large muscles over digestive organs, and the prefrontal cortex (reasoning) partially cedes control to the amygdala (threat detection). This "fight-or-flight" response is extraordinarily effective for short-term survival.</p>

            <h3>The Modern Mismatch</h3>
            <p>The problem is that our nervous system cannot distinguish between a tiger and an angry email. It responds to both with the same physiological cascade. And while a tiger threat resolves in minutes, an email thread can keep the stress response activated for days. Chronic activation of the stress system leads to elevated inflammatory markers, impaired immune function, cardiovascular damage, impaired memory formation, and heightened anxiety and depression.</p>

            <h3>The Relaxation Response</h3>
            <p>Harvard cardiologist Herbert Benson coined the term "relaxation response" in 1975 to describe the physiological state induced by meditation and related practices — the functional opposite of the stress response. Characteristic features include: decreased heart rate and blood pressure, reduced cortisol and adrenaline, increased activity in the parasympathetic nervous system, and reduced oxygen consumption.</p>

            <h3>Meditation as a Physiological Reset</h3>
            <p>Each meditation session — as short as ten minutes — provides a measurable relaxation response. Over time, regular practice appears to lower the "set point" of the stress system, making individuals less reactive to stressors and quicker to recover when stress does occur. This is measurable in reduced baseline cortisol, lower resting heart rate variability, and improved immune markers.</p>
        `
    },

    // ─── CONTEMPLATIVE PHILOSOPHY ─────────────────────────────────────────────
    {
        id: "stoic_mindfulness",
        unlockLevel: 4,
        category: "Contemplative Philosophy",
        emoji: "🏛️",
        title: "Stoic Mindfulness: The Discipline of Attention in Ancient Rome",
        readTime: "5 min",
        summary: "Discover how Stoic philosophers like Marcus Aurelius and Epictetus cultivated present-moment awareness centuries before the word 'mindfulness' existed.",
        content: `
            <p>The Stoic philosophical tradition, flourishing from Athens to Rome between 300 BCE and 200 CE, developed a sophisticated practice of mental training that bears striking resemblance to modern mindfulness. Though separated by culture and language, the Stoics arrived at many of the same insights as the Buddhist contemplative tradition.</p>

            <h3>The Dichotomy of Control</h3>
            <p>Epictetus opened his <em>Enchiridion</em> with the foundational Stoic principle: "Some things are in our control and others not." In our control are our judgments, desires, and responses. Not in our control are circumstances, other people's actions, and the body's condition. This division — and the discipline of attending only to what is in our control — is functionally equivalent to the meditation practice of distinguishing between raw sensations (what is here) and our mental stories about them (what we add).</p>

            <h3>Marcus Aurelius: The Meditating Emperor</h3>
            <p>The emperor Marcus Aurelius wrote his famous <em>Meditations</em> as a private journal — a daily practice of Stoic self-examination. He consistently returned to the same themes: the impermanence of all things, the value of present attention, the folly of distraction, and the importance of equanimity. "You have power over your mind, not outside events. Realize this, and you will find strength."</p>

            <h3>The Practice of Negative Visualization (Premeditatio Malorum)</h3>
            <p>The Stoics practiced deliberate contemplation of potential adversity — not to induce anxiety, but to cultivate non-attachment and gratitude. By vividly imagining the loss of what you love, you deepen appreciation for its current presence. This practice — <em>premeditatio malorum</em> — has modern parallels in meditations on impermanence and death-awareness traditions in both Buddhism and Tibetan practice.</p>

            <h3>Living According to Nature</h3>
            <p>Stoics held that the highest good was living "according to nature" — meaning in accordance with one's rational nature and the rational order of the cosmos. This produces what they called <em>eudaimonia</em> — flourishing, or deep wellbeing — which is neither pleasure nor the absence of pain, but the expression of one's highest virtues in full engagement with life.</p>
        `
    },
    {
        id: "taoist_flow",
        unlockLevel: 4,
        category: "Contemplative Philosophy",
        emoji: "☯️",
        title: "Tao & Wu Wei: The Art of Effortless Action",
        readTime: "4 min",
        summary: "Understand the Taoist concepts of the Tao (the Way) and wu wei (effortless action) — and how they offer a profound orientation to both meditation and daily life.",
        content: `
            <p>The Tao Te Ching, attributed to Laozi (6th century BCE), opens: "The Tao that can be spoken is not the eternal Tao." This radical opening acknowledges what the entire text explores: reality, at its deepest level, cannot be captured by concepts. It can only be participated in. This is the Tao — the Way, the ground of all being.</p>

            <h3>Wu Wei: Non-Forcing</h3>
            <p><em>Wu wei</em> is often translated as "non-action," but more accurately means "non-forcing" or "action that is aligned with the natural flow of things." Water is the Taoist symbol par excellence: it does not force its way around obstacles — it flows naturally around them, finding the path of least resistance, and yet over time it carves canyons through stone. Wu wei is this quality of effortless, intelligent, non-coercive responsiveness.</p>

            <h3>Wu Wei in Meditation</h3>
            <p>The quality of wu wei is exactly what skilled meditators learn to cultivate on the cushion. The frustrated effort to "make the mind quiet" is the opposite of wu wei — it is the very grasping that produces turbulence. When we allow the mind to be as it is — including its movement — and simply witness without coercion, a natural settling often occurs that forcing never achieves.</p>

            <h3>Te: Virtue as Natural Expression</h3>
            <p>The second great concept of Taoism is <em>Te</em> (virtue, power, or expression). While the Tao is the universal ground, Te is the unique expression of that ground through each individual being. A tree expresses its Te by growing fully and uniquely as the particular tree it is. In the same way, a human being's highest aspiration is to live in such alignment with the Tao that their actions flow naturally from their deepest nature — neither self-conscious nor mechanical, but spontaneously appropriate.</p>
        `
    },
    {
        id: "advaita_nonduality",
        unlockLevel: 7,
        category: "Contemplative Philosophy",
        emoji: "✨",
        title: "Advaita Vedānta: The Nondual Recognition of Being",
        readTime: "6 min",
        summary: "Explore the ancient Indian philosophy of nonduality — the recognition that awareness itself is the ground of all experience, and is never born or dies.",
        content: `
            <p>Advaita Vedānta — meaning "the teaching that reality is not-two" — is one of the most radical and influential philosophical systems in human history. Systematized by the 8th-century philosopher Ādi Shankarāchārya, it holds that the deepest truth of human existence is identical to the deepest truth of ultimate reality.</p>

            <h3>The Core Teaching: Tat Tvam Asi</h3>
            <p>The Chandogya Upanishad contains the famous teaching of Uddālaka to his son Shvetaketu: <em>Tat Tvam Asi</em> — "That thou art." The "That" refers to Brahman — the infinite, eternal ground of all existence. The "Thou" refers to Ātman — the individual's innermost nature. The teaching is that these are not two different things. What you most fundamentally are is the infinite awareness that pervades all things.</p>

            <h3>The Problem of Ignorance (Avidyā)</h3>
            <p>If we are already the infinite, why don't we experience this? Advaita's answer is <em>avidyā</em> — ignorance. Not ignorance in the sense of lacking information, but a fundamental misidentification: we take ourselves to be a limited body-mind entity rather than the awareness in which that entity appears. This misidentification is the root of all suffering.</p>

            <h3>Self-Inquiry: The Practice of Ramana Maharshi</h3>
            <p>The 20th-century sage Ramana Maharshi taught a direct method of investigation: holding the question "Who am I?" — not as intellectual inquiry, but as a pointing of awareness back toward its own source. "Whatever arises, ask 'To whom does this arise?' and the answer will always be 'To me.' Then ask, 'Who is this me?'" This recursive inquiry dissolves into the recognition that the seeker and the sought are the same.</p>

            <h3>Integration with Contemplative Practice</h3>
            <p>Whether one follows Buddhist, Taoist, Stoic, or any other contemplative path, the Advaita inquiry offers a powerful complement: rather than purifying or calming the mind to eventually achieve some future awakening, it points to what is already and always present as the very ground of this moment's awareness. The pathless path — already home.</p>
        `
    },

    // ─── ADVANCED STATES ──────────────────────────────────────────────────────
    {
        id: "jhana_introduction",
        unlockLevel: 7,
        category: "Advanced States",
        emoji: "🌸",
        title: "Jhāna: The Four Absorptions of Deep Concentration",
        readTime: "7 min",
        summary: "Understand the classical map of meditative absorption — four progressive states of refined concentration described in the Pāli Canon.",
        content: `
            <p>The Buddha described four sequential states of meditative absorption, called <em>jhāna</em> (Sanskrit: <em>dhyāna</em> — the source of the word "Zen"). These are not mere relaxation; they are profoundly altered states of consciousness arising from prolonged, sustained attention, characterized by extraordinary clarity, stability, and in the earlier jhānas, intense bliss.</p>

            <h3>First Jhāna: Applied and Sustained Thought with Joy</h3>
            <p>When sustained attention finally overwhelms distraction, the meditator enters the first jhāna. It is characterized by <em>vitakka</em> (applied attention — the mind "touching" the meditation object) and <em>vicāra</em> (sustained attention — the mind "examining" it). Alongside these cognitive factors arise <em>pīti</em> (rapture or energetic joy — often felt as waves, tingling, or light-headedness) and <em>sukha</em> (contentment or happiness). The mind is fully collected; sensory distraction has largely ceased.</p>

            <h3>Second Jhāna: Confidence, Inner Stillness</h3>
            <p>As the jhāna deepens, the deliberate directing of attention to the object (vitakka and vicāra) drops away, leaving a more unified, effortless absorption. The rapture and happiness remain, now born of the stillness itself rather than the effort of collecting. There is an inner confidence and certainty — a quality the Pāli calls <em>sampasādana</em>.</p>

            <h3>Third Jhāna: Equanimity and Equanimous Happiness</h3>
            <p>Even the rapture (pīti) fades, leaving behind a refined happiness (sukha) together with deep equanimity. The meditator is described as "one of equanimous mind who remains mindful and clearly comprehending and experiences happiness in the body." The stillness is extraordinary; the happiness is not excited but deeply peaceful.</p>

            <h3>Fourth Jhāna: Pure Equanimity and Mindfulness</h3>
            <p>Even the refined happiness ceases, leaving pure equanimity and mindfulness — neither pleasure nor pain, but crystalline, mirror-like awareness. The breath may become so subtle as to be imperceptible. It is from this fourth jhāna that the Buddha is said to have attained enlightenment — using it as a launching platform for the deep insight investigations that followed.</p>

            <h3>Context and Caution</h3>
            <p>Jhāna states are genuine experiences available to dedicated practitioners, but they require sustained daily practice over months or years to access. They are also somewhat controversial — different teachers describe their phenomenology differently, and some Buddhist schools deprioritize them in favor of insight practice. Approach these teachings with curiosity and without grasping, as another useful map — not the territory itself.</p>
        `
    },
    {
        id: "cessation_nirodha",
        unlockLevel: 10,
        category: "Advanced States",
        emoji: "🌌",
        title: "Nirodha-Samāpatti: The Cessation of Perception and Feeling",
        readTime: "6 min",
        summary: "An advanced exploration of the highest meditative attainment in the Theravāda tradition — total cessation of consciousness, and what this reveals about the nature of mind.",
        content: `
            <p>Beyond the four material jhānas lie four formless absorptions — attainments of infinite space, infinite consciousness, nothingness, and neither-perception-nor-non-perception. And beyond all of these lies a state described in the Pāli Canon as <em>nirodha-samāpatti</em> — the cessation of perception and feeling. In this state, the meditator's mental activity ceases completely. They are alive, breathing (minimally), but for all intents and purposes, consciousness has stopped.</p>

            <h3>The Philosophical Significance</h3>
            <p>Nirodha-samāpatti raises profound questions for any philosophy of mind. If consciousness can cease and then resume — and the meditator reports it as "better than any other attainment," having encountered no experiences during the cessation — what does this reveal about the relationship between consciousness and the brain? The Pāli tradition's answer is that nirodha demonstrates that consciousness is not the unchanging witness behind all experience; it is itself a conditioned process that can, under the right conditions, cease entirely.</p>

            <h3>What Happens During Cessation?</h3>
            <p>According to textual descriptions and practitioner reports: the meditator enters the higher jhānas progressively, continues through the formless absorptions, briefly touches neither-perception-nor-non-perception, and then — cessation. It is not sleep, not unconsciousness in the ordinary sense. It is, simply, a gap. Afterward, the meditator re-emerges through the formless absorptions and jhānas in reverse. The entire attainment may last anywhere from minutes to days in a monastic context.</p>

            <h3>Fruition States (Phala)</h3>
            <p>Western practitioners who have followed intensive insight paths (such as in the Mahasi tradition) report states called <em>phala</em> — "fruition moments" — which share features with cessation in being brief interruptions of ordinary consciousness followed by a sense of profound relief, clarity, and stillness. These are generally held to be stages along the path of liberation.</p>

            <h3>The Limits of the Map</h3>
            <p>States like nirodha are significant markers on the contemplative map, but the tradition consistently warns against making attainments an end in themselves. Enlightenment, in the fullest sense, is not a state that comes and goes — it is a permanent shift in the basic orientation of the mind, where grasping at any state, including the most sublime, has ceased.</p>
        `
    },
    {
        id: "rigpa_dzogchen",
        unlockLevel: 10,
        category: "Advanced States",
        emoji: "💎",
        title: "Rigpa: Naked Awareness in Dzogchen",
        readTime: "6 min",
        summary: "Explore the Tibetan Great Perfection teaching that the nature of mind is primordially pure, luminous awareness — and how this is directly introduced by a teacher.",
        content: `
            <p>Dzogchen — "the Great Perfection" — is the pinnacle teaching of the Nyingma school of Tibetan Buddhism. It is said to be the most direct and unelaborated expression of the path to liberation. Unlike gradual practices that purify the mind through progressive steps, Dzogchen points directly to what is already the case: the mind's natural state is primordially pure, self-knowing awareness, untouched by any defilement.</p>

            <h3>Rigpa: The Nature of Mind</h3>
            <p><em>Rigpa</em> — often translated as "intrinsic awareness" or "naked awareness" — is the central term of Dzogchen. It refers to the natural state of mind when it is not contracted by the movements of thought, emotion, or the sense of self. It is described as:</p>
            <ul>
                <li><strong>Empty</strong> — without inherent substance or location</li>
                <li><strong>Luminous</strong> — self-knowing, radiantly clear</li>
                <li><strong>Unobstructed</strong> — appearing without effort as compassion, creativity, and awareness</li>
            </ul>

            <h3>Marigpa: The Mistaken State</h3>
            <p>The opposite of rigpa is <em>marigpa</em> — non-recognition of one's own nature. This is not a moral failure but a simple case of mistaken identity, like failing to recognize your own reflection in a mirror. All of samsara — all the cycles of suffering — arise not from some fundamental corruption but from this basic failure of self-recognition.</p>

            <h3>The Introduction to Nature of Mind</h3>
            <p>Traditionally, rigpa cannot be arrived at through effort alone — it is directly introduced (<em>ngedon</em>) by a qualified teacher in a ceremony or moment called the "pointing-out instruction." The teacher uses various means — questions, gestures, demonstrations — to direct the student's attention to the very awareness that is aware. When the student recognizes this directly, even briefly, that recognition is the beginning of Dzogchen practice.</p>

            <h3>Practice After Recognition</h3>
            <p>Once introduced to rigpa, the practice is described as "resting in recognition" — not creating or modifying anything, but sustaining the naked clarity of awareness as the ground of all activity. Thoughts and emotions still arise, but they are recognized as the spontaneous display of rigpa itself, like reflections in a mirror that do not tarnish the mirror. Over time, this recognition becomes continuous and unshakeable — the state known as full enlightenment in the Dzogchen tradition.</p>
        `
    },

    // ─── PRACTICAL GUIDANCE ───────────────────────────────────────────────────
    {
        id: "building_habit",
        unlockLevel: 1,
        category: "Practical Guidance",
        emoji: "📅",
        title: "The Architecture of a Daily Practice",
        readTime: "4 min",
        summary: "Evidence-based guidance for building a sustainable, consistent meditation habit — including time of day, environment, duration, and dealing with resistance.",
        content: `
            <p>The single most important factor in meditation is not technique, tradition, or teacher — it is consistency. A five-minute daily practice, maintained steadily for years, will produce more transformation than a powerful weekend retreat that is never followed up. Building a sustainable habit architecture is therefore the most practical wisdom a new meditator can receive.</p>

            <h3>Habit Stacking: Anchoring to Existing Routines</h3>
            <p>BJ Fogg's Tiny Habits research demonstrates that new behaviors attach most easily when anchored to existing ones. The morning coffee is a classic anchor: "After I pour my coffee, I sit for ten minutes before touching my phone." The anchor behavior triggers the new behavior without requiring fresh willpower. Common anchors: waking up, morning hygiene, after lunch, evening tea, before sleep.</p>

            <h3>The Seat: Designating a Sacred Space</h3>
            <p>Designate a consistent location and orientation for practice. Over time, the visual cue of your cushion or chair will trigger a settling response in your nervous system. Keep it minimally furnished — a cushion or firm chair, perhaps a candle or plant, whatever helps signal "this is different time." The environment becomes a conditioned cue for the meditative state.</p>

            <h3>Duration: The Minimum Effective Dose</h3>
            <p>Research suggests that even 10–15 minutes of daily practice produces measurable benefits. However, longer sessions — 30 minutes to one hour — allow the mind to settle through its initial busy phase and enter deeper states. The recommendation: begin with whatever is genuinely achievable consistently, then gradually extend by five minutes every few weeks. Never make the minimum so high that you will skip on difficult days.</p>

            <h3>Working with Resistance</h3>
            <p>Resistance to sitting is almost universal and is no indication that meditation isn't working. In fact, the days when you most want to skip are often the days when practice is most valuable. A useful commitment: on days of strong resistance, commit only to sitting down and completing three breaths. Very often, once begun, the practice takes over. And on days when it truly doesn't — the habit of showing up is maintained.</p>
        `
    },
    {
        id: "integration_daily_life",
        unlockLevel: 3,
        category: "Practical Guidance",
        emoji: "🌿",
        title: "Informal Practice: Carrying Mindfulness Into Daily Life",
        readTime: "4 min",
        summary: "Extend the benefits of formal meditation into everyday activities — from washing dishes to walking to difficult conversations — through informal mindfulness practices.",
        content: `
            <p>Formal meditation — sitting on a cushion for a defined period — is essential for building the capacity for mindfulness. But the ultimate aim is a quality of awareness that permeates the entire day. Informal practice bridges the cushion and the rest of life.</p>

            <h3>Single-Tasking as Mindfulness</h3>
            <p>Modern productivity culture celebrates multitasking, but neuroscience consistently shows that what we call "multitasking" is actually rapid task-switching — and it is costly in both accuracy and cognitive resources. Try this experiment: for one week, commit to doing only one thing at a time. When eating, only eat. When walking, only walk. When in conversation, only be in conversation. Notice the qualitative richness that appears when attention is undivided.</p>

            <h3>The Three Breath Pause</h3>
            <p>Thich Nhat Hanh taught the practice of the telephone bell as a mindfulness cue — every time the phone rings, take three breaths before answering. You can adapt this to any recurring life event: before a meeting, before opening email, when a child calls your name, when you reach for your phone. Three breaths is enough to interrupt automatic pilot and reestablish conscious presence.</p>

            <h3>STOP Practice</h3>
            <p>The STOP acronym is a powerful micro-practice: <strong>S</strong>top whatever you're doing. <strong>T</strong>ake a breath. <strong>O</strong>bserve what's happening in your body, thoughts, and emotions right now. <strong>P</strong>roceed with awareness. Set a random phone reminder once or twice daily as a cue to STOP. Many practitioners report that these brief interruptions gradually alter their relationship to reactivity throughout the entire day.</p>

            <h3>Difficult Conversations as Practice</h3>
            <p>Challenging interpersonal moments are among the richest opportunities for practice. When a conversation becomes heated, practice: feel your feet on the ground. Take one slow breath. Notice the physical sensations of your emotional state without immediately acting on them. Listen more than you speak. These micro-practices bring formal training into the crucible of real life — where it matters most.</p>
        `
    },
    {
        id: "working_emotions",
        unlockLevel: 4,
        category: "Practical Guidance",
        emoji: "🌊",
        title: "Riding the Waves: Working with Strong Emotions in Meditation",
        readTime: "5 min",
        summary: "Practical guidance for meeting intense emotions — grief, anger, fear, shame — in meditation without suppressing them or being swept away.",
        content: `
            <p>Many people begin meditation expecting it to produce peace and calm, and are surprised when strong emotions arise — sometimes emotions that have been carefully avoided for years. This is not a malfunction. The quieting of mental noise allows previously suppressed feelings to surface. The question is how to work with them skillfully.</p>

            <h3>The RAIN Technique</h3>
            <p>Tara Brach popularized the RAIN practice for working with difficult emotional states:</p>
            <ul>
                <li><strong>R — Recognize:</strong> Acknowledge what is happening. "There is fear here." "Grief is arising."</li>
                <li><strong>A — Allow:</strong> Resist the impulse to fix, suppress, or analyze. Let it be as it is, for now.</li>
                <li><strong>I — Investigate:</strong> With gentle curiosity, explore the physical expression of the emotion. Where in the body? What texture, weight, temperature?</li>
                <li><strong>N — Nurture:</strong> Offer the emotion the same compassion you would offer a friend in distress. Place a hand on your heart. Breathe kindness toward the feeling.</li>
            </ul>

            <h3>Emotion as Sensation Plus Story</h3>
            <p>Emotions have two distinct components: the physical sensation in the body (tightness in the chest, heaviness, heat) and the narrative or story layer (what the mind says about who is to blame, what it means, what should happen). In meditation, we can practice separating these: feel the pure physical sensation, and notice the story as a separate mental layer. Often, the pure sensation is tolerable; it is the story that is unbearable.</p>

            <h3>The Window of Tolerance</h3>
            <p>Trauma therapist Dan Siegel describes a "window of tolerance" — a zone of activation where emotional experience can be processed. Below the window is numbness (hypoarousal); above it is overwhelm (hyperarousal). Skilled meditation involves remaining within the window: making contact with difficult emotions without either suppressing them or being overwhelmed. If you become overwhelmed, return attention to the soles of your feet or another grounding sensation.</p>

            <h3>When to Seek Support</h3>
            <p>Meditation is not a substitute for psychotherapy or trauma treatment. If meditation consistently surfaces very intense emotional material — especially relating to trauma — working with a skilled therapist or trauma-informed meditation teacher is advisable alongside or before intensive practice. The two modalities can be powerful complements when properly calibrated.</p>
        `
    },
    {
        id: "sleep_meditation",
        unlockLevel: 2,
        category: "Practical Guidance",
        emoji: "🌙",
        title: "Yoga Nidrā: The Art of Conscious Sleep",
        readTime: "4 min",
        summary: "Explore Yoga Nidrā — the 'yoga of sleep' — a systematic body-mind relaxation practice used for deep restoration, stress relief, and enhanced insight.",
        content: `
            <p>Yoga Nidrā — "sleep of the yogis" — is an ancient technique codified in the 20th century by Swami Satyananda Saraswati. It is typically practiced lying down, guided by a teacher's voice through a systematic relaxation of body, breath, and mind, while maintaining the thin thread of consciousness. Practitioners report that 30 minutes of Yoga Nidrā feels equivalent to two to four hours of ordinary sleep in terms of restoration.</p>

            <h3>The Hypnagogic State</h3>
            <p>Yoga Nidrā deliberately cultivates the hypnagogic state — the transitional zone between waking and sleep consciousness. In this state, the critical, filtering faculty of the prefrontal cortex relaxes, and the mind becomes extraordinarily receptive to suggestion, visualization, and symbolic experience. It is the state in which many artists and scientists have reported flashes of insight — including Thomas Edison, who famously napped in a chair holding ball bearings that would clatter when he fell asleep, jolting him back to the hypnagogic threshold.</p>

            <h3>Sankalpa: The Seed Intention</h3>
            <p>A core element of classical Yoga Nidrā is the <em>sankalpa</em> — a short, positive intention or resolve. It is planted at the beginning and end of the session, when the mind is most relaxed and receptive. Unlike ordinary affirmations, the sankalpa in Yoga Nidrā is held with effortless certainty — as if already true — rather than willfully willed. Examples: "I am at peace," "I live with courage and clarity," "Creativity flows through me naturally."</p>

            <h3>Structural Elements of a Session</h3>
            <p>A full Yoga Nidrā session typically includes: physical settling and sankalpa; rotation of consciousness through the body (a rapid systematic naming of body parts that produces sensory withdrawal); pairs of opposites (heaviness/lightness, warmth/coolness — amplifying the capacity to hold contradictory states); visualization; and return to ordinary awareness. The entire process systematically relaxes both the somatic nervous system and the mind.</p>
        `
    }
];




export function renderWisdom() {
    const container = document.createElement('div');
    container.className = 'screen scrollable wisdom-screen';

    container.innerHTML = `
        <!-- Header -->
        <div class="wd-header">
            <button class="wd-back-btn" id="wd-back-btn" aria-label="Back">
                <span class="material-symbols-rounded">arrow_back</span>
            </button>
            <div style="text-align:center; flex:1;">
                <h1 class="wd-title">Wisdom Library</h1>
                <p class="wd-subtitle">Nourish your mind</p>
            </div>
            <div style="width:40px;"></div>
        </div>

        <!-- Categories List -->
        <div class="wd-content" id="wd-article-list">
            <!-- Articles will be injected here by JS -->
        </div>

        <!-- Article Reader Modal Overlay (Slides up) -->
        <div id="wd-reader-modal" class="wd-reader-overlay">
            <div class="wd-reader-header" style="position: relative;">
                <div class="wd-progress-container" style="position: absolute; bottom: 0; top: auto; left: 0; height: 3px;">
                    <div class="wd-progress-bar" id="wd-reader-progress"></div>
                </div>
                <button class="wd-reader-close" id="wd-reader-close" aria-label="Close reader">
                    <span class="material-symbols-rounded">arrow_back</span>
                </button>
                <div class="wd-reader-meta">
                    <span id="wd-meta-category">Category</span> · <span id="wd-meta-time">5 min read</span>
                </div>
                <div style="width:36px;"></div>
            </div>

            <div class="wd-reader-body" id="wd-reader-body">
                <h1 class="wd-reader-title" id="wd-reader-title">Article Title</h1>
                <div class="wd-reader-text" id="wd-reader-text">
                    <!-- Text content injected here -->
                </div>

                <div class="wd-completion-zone">
                    <button class="btn btn-primary wd-complete-btn" id="wd-complete-btn">
                        Complete Reading & Claim +15 XP
                    </button>
                </div>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .wisdom-screen {
            background-color: var(--color-bg-primary);
            padding: 14px 20px var(--spacing-xl);
            display: flex;
            flex-direction: column;
        }

        /* Header */
        .wd-header {
            display: flex;
            align-items: center;
            margin-bottom: var(--spacing-lg);
            flex-shrink: 0;
        }
        .wd-back-btn {
            background: var(--color-bg-secondary);
            border: none;
            color: var(--color-text-primary);
            border-radius: 10px;
            width: 40px; height: 40px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            transition: background var(--transition-fast);
        }
        .wd-back-btn:active { background: var(--color-accent-light); }
        .wd-back-btn .material-symbols-rounded { font-size: 20px; }
        .wd-title { font-size: 20px; font-weight: 700; }
        .wd-subtitle { font-size: 11px; color: var(--color-text-muted); margin: 2px 0 0; }

        /* Article List Layout */
        .wd-category-section {
            margin-bottom: var(--spacing-lg);
        }
        .wd-category-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--color-text-muted);
            margin-bottom: var(--spacing-sm);
            border-bottom: 1px solid var(--color-bg-secondary);
            padding-bottom: 4px;
        }

        /* Article Cards */
        .wd-card {
            background: var(--color-bg-card);
            border-radius: var(--radius-md);
            padding: var(--spacing-md);
            margin-bottom: var(--spacing-sm);
            box-shadow: var(--shadow-sm);
            cursor: pointer;
            display: flex;
            flex-direction: column;
            gap: 6px;
            border: 1px solid transparent;
            transition: all var(--transition-normal);
            position: relative;
            overflow: hidden;
        }
        .wd-card:active {
            transform: scale(0.98);
        }
        .wd-card-title {
            font-size: 15px;
            font-weight: 600;
            color: var(--color-text-primary);
            line-height: 1.4;
        }
        .wd-card-desc {
            font-size: 12px;
            color: var(--color-text-secondary);
            line-height: 1.5;
        }
        .wd-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 4px;
            font-size: 10px;
            color: var(--color-text-muted);
            font-weight: 600;
        }

        /* Locked Card Styling */
        .wd-card.locked {
            background: rgba(239, 236, 230, 0.5);
            border: 1px dashed rgba(134, 155, 143, 0.25);
            cursor: default;
        }
        .wd-card.locked .wd-card-title,
        .wd-card.locked .wd-card-desc {
            opacity: 0.5;
            filter: blur(1.5px);
            user-select: none;
        }
        .wd-lock-badge {
            background: rgba(134, 155, 143, 0.15);
            color: var(--color-text-secondary);
            padding: 3px 8px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 9px;
            font-weight: 700;
        }
        .wd-lock-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            pointer-events: none;
        }
        .wd-lock-icon-btn {
            background: white;
            width: 38px; height: 38px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: var(--shadow-sm);
            color: var(--color-text-muted);
            border: 1.5px solid var(--color-bg-secondary);
        }

        /* Shake animation for locked items */
        .wd-card.shake {
            animation: card-shake 0.4s ease;
        }
        @keyframes card-shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-6px); }
            40%, 80% { transform: translateX(6px); }
        }

        /* Read Indicator Badge */
        .wd-read-badge {
            color: #53a362;
            font-size: 10px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 2px;
        }

        /* Reader Overlay sliding pane */
        .wd-reader-overlay {
            position: fixed;
            inset: 0;
            z-index: 500;
            background: var(--color-bg-primary);
            display: flex;
            flex-direction: column;
            transform: translateY(100%);
            transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .wd-reader-overlay.active {
            transform: translateY(0);
        }

        /* Scrollable Reader Body */
        .wd-reader-body {
            flex: 1;
            overflow-y: auto;
            padding: var(--spacing-md) var(--spacing-lg) var(--spacing-xxl);
            box-sizing: border-box;
        }

        /* Reading progress bar */
        .wd-progress-container {
            width: 100%;
            height: 4px;
            background: var(--color-bg-secondary);
            position: absolute;
            top: 0; left: 0;
            z-index: 10;
        }
        .wd-progress-bar {
            width: 0%;
            height: 100%;
            background: var(--color-accent-dark);
            transition: width 0.1s ease-out;
        }

        /* Reader Header bar */
        .wd-reader-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: calc(12px + env(safe-area-inset-top, 0px)) var(--spacing-lg) 12px;
            border-bottom: 1px solid var(--color-bg-secondary);
            background: var(--color-bg-primary);
            z-index: 5;
        }
        .wd-reader-close {
            background: none; border: none;
            color: var(--color-text-secondary);
            cursor: pointer; display: flex; align-items: center;
            padding: 4px;
        }
        .wd-reader-close .material-symbols-rounded { font-size: 22px; }
        .wd-reader-meta {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--color-text-muted);
        }

        /* Typography Lora style */
        .wd-reader-title {
            font-family: var(--font-heading), serif;
            font-size: 24px;
            line-height: 1.35;
            color: var(--color-text-primary);
            margin: var(--spacing-lg) 0 var(--spacing-md);
            font-weight: 500;
        }
        .wd-reader-text {
            font-family: var(--font-heading), serif;
            font-size: 15px;
            line-height: 1.7;
            color: var(--color-text-primary);
        }
        .wd-reader-text p {
            margin-bottom: var(--spacing-md);
            color: var(--color-text-primary);
        }
        .wd-reader-text h3 {
            font-family: var(--font-heading), serif;
            font-size: 18px;
            font-weight: 600;
            margin: var(--spacing-lg) 0 var(--spacing-sm);
        }
        .wd-reader-text ul {
            margin: 0 0 var(--spacing-md) var(--spacing-md);
            padding: 0;
        }
        .wd-reader-text li {
            margin-bottom: var(--spacing-sm);
            line-height: 1.6;
        }

        /* Completion Zone */
        .wd-completion-zone {
            margin-top: var(--spacing-xxl);
            display: flex;
            justify-content: center;
        }
        .wd-complete-btn {
            width: 100%;
            max-width: 320px;
            padding: var(--spacing-md);
        }
        .wd-complete-btn.claimed {
            background-color: #e2ede4;
            color: #277038;
            cursor: default;
            border: 1px solid rgba(83, 163, 98, 0.2);
            pointer-events: none;
        }
    `;
    container.appendChild(style);

    let activeArticleId = null;

    // Handle back button on Library Screen -> Home Screen
    container.querySelector('#wd-back-btn').addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('siddha-navigate', { detail: { target: 'home' } }));
    });

    // Handle back button on Reader Modal -> Library Screen
    const readerModal = container.querySelector('#wd-reader-modal');
    container.querySelector('#wd-reader-close').addEventListener('click', () => {
        readerModal.classList.remove('active');
        activeArticleId = null;
        container.updateData();
    });

    // Update function to redraw articles list when shown
    container.updateData = () => {
        const stats = DB.getStats();
        const userLevel = stats.level;
        const listContainer = container.querySelector('#wd-article-list');
        listContainer.innerHTML = '';

        // Group articles by Category
        const grouped = {};
        ARTICLES.forEach(art => {
            if (!grouped[art.category]) grouped[art.category] = [];
            grouped[art.category].push(art);
        });

        Object.entries(grouped).forEach(([catName, list]) => {
            const section = document.createElement('div');
            section.className = 'wd-category-section';

            const title = document.createElement('h2');
            title.className = 'wd-category-title';
            title.textContent = catName;
            section.appendChild(title);

            const PATH_BY_CATEGORY = {
                "Foundations of Mindfulness": "anapana",
                "Insight Practice": "vipassana",
                "Zen Tradition": "zen",
                "Loving-Kindness & Compassion": "metta"
            };

            list.forEach(art => {
                const pathId = PATH_BY_CATEGORY[art.category];
                const isPathUnlocked = !pathId || DB.isPathUnlocked(pathId);
                const isUnlocked = isPathUnlocked && (userLevel >= art.unlockLevel);
                const isRead = DB.isArticleRead(art.id);

                const card = document.createElement('div');
                card.className = `wd-card ${isUnlocked ? 'unlocked' : 'locked'}`;

                if (isUnlocked) {
                    card.setAttribute('role', 'button');
                    card.setAttribute('tabindex', '0');
                    card.innerHTML = `
                        <div style="display:flex; align-items:flex-start; gap:10px;">
                            <div style="font-size:22px; line-height:1; flex-shrink:0; margin-top:1px;">${art.emoji || '📖'}</div>
                            <div style="flex:1; min-width:0;">
                                <div class="wd-card-title">${art.title}</div>
                                <div class="wd-card-desc">${art.summary}</div>
                                <div class="wd-card-footer">
                                    <span>${art.readTime}</span>
                                    ${isRead ? `
                                        <span class="wd-read-badge">
                                            <span class="material-symbols-rounded" style="font-size:12px; font-variation-settings: 'FILL' 1;">check_circle</span>
                                            Completed
                                        </span>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `;

                    card.addEventListener('click', () => openArticle(art));
                } else {
                    let lockText = `Lv.${art.unlockLevel} Required`;
                    if (!isPathUnlocked) {
                        lockText = "Path Locked";
                    }

                    card.innerHTML = `
                        <div class="wd-lock-overlay">
                            <div class="wd-lock-icon-btn">
                                <span class="material-symbols-rounded">lock</span>
                            </div>
                        </div>
                        <div style="display:flex; align-items:flex-start; gap:10px;">
                            <div style="font-size:22px; line-height:1; flex-shrink:0; margin-top:1px; opacity:0.35;">${art.emoji || '📖'}</div>
                            <div style="flex:1; min-width:0;">
                                <div class="wd-card-title">${art.title}</div>
                                <div class="wd-card-desc">${art.summary}</div>
                                <div class="wd-card-footer">
                                    <span>${art.readTime}</span>
                                    <span class="wd-lock-badge">
                                        <span class="material-symbols-rounded" style="font-size:10px;">lock</span>
                                        ${lockText}
                                    </span>
                                </div>
                            </div>
                        </div>
                    `;

                    // Tap on locked plays shake animation
                    card.addEventListener('click', () => {
                        card.classList.add('shake');
                        setTimeout(() => card.classList.remove('shake'), 400);
                    });
                }

                section.appendChild(card);
            });

            listContainer.appendChild(section);
        });
    };

    // Open article inside details panel
    function openArticle(art) {
        activeArticleId = art.id;
        
        container.querySelector('#wd-meta-category').textContent = art.category;
        container.querySelector('#wd-meta-time').textContent = art.readTime;
        container.querySelector('#wd-reader-title').textContent = art.title;
        container.querySelector('#wd-reader-text').innerHTML = art.content;

        const completeBtn = container.querySelector('#wd-complete-btn');
        const isRead = DB.isArticleRead(art.id);

        if (isRead) {
            completeBtn.className = 'btn wd-complete-btn claimed';
            completeBtn.innerHTML = `
                <span class="material-symbols-rounded" style="font-size:16px; margin-right:4px;">check_circle</span>
                Read Completed (+15 XP Claimed)
            `;
        } else {
            completeBtn.className = 'btn btn-primary wd-complete-btn';
            completeBtn.innerHTML = 'Complete Reading & Claim +15 XP';
        }

        // Reset scroll position and progress bar
        const readerBody = container.querySelector('#wd-reader-body');
        readerBody.scrollTop = 0;
        container.querySelector('#wd-reader-progress').style.width = '0%';

        // Track reading progress
        readerBody.onscroll = () => {
            const total = readerBody.scrollHeight - readerBody.clientHeight;
            const progress = total > 0 ? (readerBody.scrollTop / total) * 100 : 0;
            container.querySelector('#wd-reader-progress').style.width = `${progress}%`;
        };

        // Open panel
        readerModal.classList.add('active');
    }

    // Complete button click
    container.querySelector('#wd-complete-btn').addEventListener('click', () => {
        if (!activeArticleId) return;

        const didRead = DB.markArticleAsRead(activeArticleId);
        if (didRead) {
            const completeBtn = container.querySelector('#wd-complete-btn');
            completeBtn.className = 'btn wd-complete-btn claimed';
            completeBtn.innerHTML = `
                <span class="material-symbols-rounded" style="font-size:16px; margin-right:4px;">check_circle</span>
                Read Completed (+15 XP Claimed)
            `;
            
            DB.checkAndTriggerAchievements(false);
            
            // Re-trigger the active screen updates (in case reader updates or home page does)
            container.updateData();
        }
    });

    return container;
}

import { DB } from '../services/db.js';
import { tr, getLang, setLang } from '../services/i18n.js';

export function renderLogin(onLoginSuccess) {
    const container = document.createElement('div');
    container.className = 'screen login-screen active'; // Start active
    
    // Onboarding State
    let currentStep = 0;
    const totalSteps = 6; // Step 0 (Welcome) to Step 5 (Summary)
    const onboardingData = {
        name: '',
        experience: 'beginner',
        goal: 'stress',
        commitment: 10
    };
    const activeLang = getLang();

    container.innerHTML = `
        <div class="onboarding-container">
            <!-- Progress Bar -->
            <div class="onboarding-progress-bar" id="progress-bar-container" style="display: none;">
                <div class="onboarding-progress-fill" id="progress-fill"></div>
            </div>

            <!-- Slides Container -->
            <div class="slides-wrapper">
                
                <!-- Slide 0: Welcome -->
                <div class="onboarding-slide active" data-step="0">
                    <div class="lang-toggle-bar" style="display: inline-flex; gap: 6px; background: var(--color-bg-secondary); padding: 4px; border-radius: 999px; margin-bottom: 18px; border: 1px solid rgba(134,155,143,0.2);">
                        <button type="button" class="lang-switch-btn" data-lang="pl" style="border:none; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; cursor: pointer; background: ${activeLang === 'pl' ? 'var(--color-accent-dark)' : 'transparent'}; color: ${activeLang === 'pl' ? '#fff' : 'var(--color-text-secondary)'};">🇵🇱 Polski</button>
                        <button type="button" class="lang-switch-btn" data-lang="en" style="border:none; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; cursor: pointer; background: ${activeLang === 'en' ? 'var(--color-accent-dark)' : 'transparent'}; color: ${activeLang === 'en' ? '#fff' : 'var(--color-text-secondary)'};">🇬🇧 English</button>
                    </div>
                    <div class="welcome-halo-container">
                        <div class="halo-ring ring-1"></div>
                        <div class="halo-ring ring-2"></div>
                        <div class="halo-ring ring-3"></div>
                        <div class="halo-core">
                            <span class="material-symbols-rounded halo-icon">self_improvement</span>
                        </div>
                    </div>
                    <h1 class="welcome-title">Siddha</h1>
                    <p class="welcome-subtitle">${tr('Gamified meditation for deep concentration', 'Uważna medytacja i trening głębokiego skupienia')}</p>
                    <p class="welcome-text">
                        ${tr(
                            'Welcome to your personal sanctuary. Let’s take a few moments to tailor your journey towards presence and focus.',
                            'Witaj w swoim osobistym sanktuarium. Poświęćmy chwilę, aby dopasować Twoją ścieżkę do obecności i wewnętrznego spokoju.'
                        )}
                    </p>
                    <button class="btn btn-primary btn-next-welcome" style="margin-top: 32px; padding: 16px 40px; font-size: 16px;">
                        ${tr('Begin Onboarding', 'Rozpocznij wprowadzenie')}
                    </button>
                </div>

                <!-- Slide 1: Name Input -->
                <div class="onboarding-slide" data-step="1">
                    <span class="material-symbols-rounded slide-header-icon">badge</span>
                    <h2 class="slide-title">${tr('What should we call you?', 'Jak mamy się do Ciebie zwracać?')}</h2>
                    <p class="slide-description">${tr('Your name will be used to personalize your daily mindfulness greeting.', 'Twoje imię posłuży do spersonalizowania codziennych powitań.')}</p>
                    
                    <div class="input-group">
                        <input type="text" id="user-name-input" placeholder="${tr('Enter your name', 'Wpisz swoje imię')}" autocomplete="off" maxlength="20">
                        <span class="input-focus-line"></span>
                    </div>

                    <p id="name-validation-error" class="validation-error">${tr('Please enter your name to proceed.', 'Wpisz swoje imię, aby kontynuować.')}</p>
                </div>

                <!-- Slide 2: Experience Level -->
                <div class="onboarding-slide" data-step="2">
                    <span class="material-symbols-rounded slide-header-icon">insights</span>
                    <h2 class="slide-title">${tr('Your meditation experience?', 'Twoje doświadczenie z medytacją?')}</h2>
                    <p class="slide-description">${tr('We will adjust the starting session times and guides accordingly.', 'Dopasujemy czas początkowych sesji oraz wskazówki do Twojego poziomu.')}</p>
                    
                    <div class="options-grid">
                        <div class="option-card active" data-value="beginner" data-field="experience">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">spa</span></div>
                            <div class="option-content">
                                <h4 class="option-label">${tr('Beginner', 'Początkujący')}</h4>
                                <p class="option-desc">${tr("New to meditation or sitting occasionally. Let's start with basics.", 'Dopiero zaczynasz lub medytujesz okazjonalnie. Zacznijmy od podstaw.')}</p>
                            </div>
                        </div>
                        <div class="option-card" data-value="intermediate" data-field="experience">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">psychology_alt</span></div>
                            <div class="option-content">
                                <h4 class="option-label">${tr('Intermediate', 'Średniozaawansowany')}</h4>
                                <p class="option-desc">${tr('Have a semi-regular practice. Familiar with focus and distraction.', 'Praktykujesz w miarę regularnie. Znasz podstawy pracy z uwagą i rozproszeniem.')}</p>
                            </div>
                        </div>
                        <div class="option-card" data-value="advanced" data-field="experience">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">wb_sunny</span></div>
                            <div class="option-content">
                                <h4 class="option-label">${tr('Advanced', 'Zaawansowany')}</h4>
                                <p class="option-desc">${tr('Consistent daily sits. Seeking deep concentration or Jhana states.', 'Codzienna, stała praktyka. Szukasz głębokiego skupienia lub stanów Dżhany.')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Slide 3: Primary Goal -->
                <div class="onboarding-slide" data-step="3">
                    <span class="material-symbols-rounded slide-header-icon">target</span>
                    <h2 class="slide-title">${tr('What is your main goal?', 'Jaki jest Twój główny cel?')}</h2>
                    <p class="slide-description">${tr('Choose the focus that matters most to you right now.', 'Wybierz kierunek, który jest dla Ciebie teraz najważniejszy.')}</p>
                    
                    <div class="options-grid">
                        <div class="option-card active" data-value="stress" data-field="goal">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">grass</span></div>
                            <div class="option-content">
                                <h4 class="option-label">${tr('Reduce Stress', 'Redukcja stresu')}</h4>
                                <p class="option-desc">${tr('Calm your nervous system and find peace in everyday moments.', 'Uspokój układ nerwowy i odnajdź równowagę w codziennych chwilach.')}</p>
                            </div>
                        </div>
                        <div class="option-card" data-value="focus" data-field="goal">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">center_focus_strong</span></div>
                            <div class="option-content">
                                <h4 class="option-label">${tr('Deepen Concentration', 'Pogłębienie koncentracji')}</h4>
                                <p class="option-desc">${tr('Sharpen stable attention, clarity, and cognitive control.', 'Wyostrz stabilną uwagę, klarowność umysłu i kontrolę poznawczą.')}</p>
                            </div>
                        </div>
                        <div class="option-card" data-value="habit" data-field="goal">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">calendar_today</span></div>
                            <div class="option-content">
                                <h4 class="option-label">${tr('Build a Daily Habit', 'Zbudowanie codziennego nawyku')}</h4>
                                <p class="option-desc">${tr('Establish consistency and discipline in sitting daily.', 'Wypracuj systematyczność i dyscyplinę w codziennej praktyce.')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Slide 4: Daily Commitment -->
                <div class="onboarding-slide" data-step="4">
                    <span class="material-symbols-rounded slide-header-icon">schedule</span>
                    <h2 class="slide-title">${tr('Daily time commitment?', 'Ile czasu dziennie chcesz poświęcić?')}</h2>
                    <p class="slide-description">${tr('Setting a small, realistic daily window helps cement the habit.', 'Wyznaczenie małego, realistycznego celu każdego dnia pomaga utrwalić nawyk.')}</p>
                    
                    <div class="options-grid">
                        <div class="option-card" data-value="5" data-field="commitment">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">alarm</span></div>
                            <div class="option-content">
                                <h4 class="option-label">${tr('5 Minutes', '5 minut')}</h4>
                                <p class="option-desc">${tr('A gentle, bite-sized daily pause.', 'Łagodna, krótka chwila zatrzymania w ciągu dnia.')}</p>
                            </div>
                        </div>
                        <div class="option-card active" data-value="10" data-field="commitment">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">potted_plant</span></div>
                            <div class="option-content" style="position: relative;">
                                <span class="badge-recommended">${tr('RECOMMENDED', 'POLECANE')}</span>
                                <h4 class="option-label">${tr('10 Minutes', '10 minut')}</h4>
                                <p class="option-desc">${tr('Perfect balance of depth and consistency.', 'Idealna równowaga między głębią a regularnością.')}</p>
                            </div>
                        </div>
                        <div class="option-card" data-value="15" data-field="commitment">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">hourglass_empty</span></div>
                            <div class="option-content">
                                <h4 class="option-label">${tr('15 Minutes', '15 minut')}</h4>
                                <p class="option-desc">${tr('A slightly deeper, traditional practice time.', 'Nieco głębszy, tradycyjny wymiar codziennej sesji.')}</p>
                            </div>
                        </div>
                        <div class="option-card" data-value="20" data-field="commitment">
                            <div class="option-icon-wrapper"><span class="material-symbols-rounded">self_improvement</span></div>
                            <div class="option-content">
                                <h4 class="option-label">${tr('20+ Minutes', '20+ minut')}</h4>
                                <p class="option-desc">${tr('A serious daily commitment to mental training.', 'Poważne codzienne zaangażowanie w trening umysłu.')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Slide 5: Summary & Enter Sanctuary -->
                <div class="onboarding-slide" data-step="5">
                    <div class="summary-card glass">
                        <span class="material-symbols-rounded summary-success-icon">verified</span>
                        <h2 class="summary-greeting" id="summary-user-greeting">${tr('Welcome, Practitioner!', 'Witaj, Praktyku!')}</h2>
                        
                        <div class="summary-details">
                            <div class="summary-row">
                                <span class="material-symbols-rounded summary-row-icon">insights</span>
                                <div class="summary-row-text">
                                    <strong>${tr('Experience Level:', 'Poziom doświadczenia:')}</strong>
                                    <span id="summary-experience-val">${tr('Beginner', 'Początkujący')}</span>
                                </div>
                            </div>
                            <div class="summary-row">
                                <span class="material-symbols-rounded summary-row-icon">target</span>
                                <div class="summary-row-text">
                                    <strong>${tr('Main Intent:', 'Główna intencja:')}</strong>
                                    <span id="summary-goal-val">${tr('Reduce Stress', 'Redukcja stresu')}</span>
                                </div>
                            </div>
                            <div class="summary-row">
                                <span class="material-symbols-rounded summary-row-icon">schedule</span>
                                <div class="summary-row-text">
                                    <strong>${tr('Daily Commitment:', 'Dzienny cel:')}</strong>
                                    <span id="summary-commitment-val">${tr('10 minutes', '10 minut')}</span>
                                </div>
                            </div>
                        </div>

                        <p class="summary-footer">
                            ${tr(
                                'Your personalized Mind Illuminated (TMI) training path is ready. Let’s enter your sanctuary.',
                                'Twoja spersonalizowana ścieżka medytacji jest gotowa. Wejdźmy do Twojego sanktuarium.'
                            )}
                        </p>
                    </div>

                    <button id="btn-enter-sanctuary" class="btn btn-primary" style="margin-top: 24px; padding: 16px 40px; font-size: 16px; width: 100%;">
                        ${tr('Enter Sanctuary', 'Wejdź do Sanktuarium')}
                    </button>
                </div>

            </div>

            <!-- Bottom Navigation for Onboarding -->
            <div class="onboarding-nav" id="onboarding-nav-container" style="display: none;">
                <button class="btn btn-secondary" id="btn-prev" style="visibility: hidden;">
                    <span class="material-symbols-rounded">arrow_back</span> ${tr('Back', 'Wstecz')}
                </button>
                <button class="btn btn-primary" id="btn-next">
                    ${tr('Next', 'Dalej')} <span class="material-symbols-rounded">arrow_forward</span>
                </button>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .login-screen {
            background-color: var(--color-bg-primary);
            z-index: 200; /* Above everything */
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 0 !important;
            overflow-y: auto;
            position: absolute;
            left: 0; top: 0; width: 100%; height: 100%;
        }

        .login-screen.active {
            display: flex;
        }

        .onboarding-container {
            width: 100%;
            max-width: 400px;
            padding: calc(24px + env(safe-area-inset-top, 0px)) 24px calc(24px + env(safe-area-inset-bottom, 0px)) 24px;
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: space-between;
        }

        /* Progress Bar */
        .onboarding-progress-bar {
            width: 100%;
            height: 6px;
            background-color: var(--color-bg-secondary);
            border-radius: var(--radius-full);
            overflow: hidden;
            margin-bottom: 24px;
        }

        .onboarding-progress-fill {
            height: 100%;
            width: 20%;
            background-color: var(--color-accent-dark);
            border-radius: var(--radius-full);
            transition: width var(--transition-normal);
        }

        /* Slides */
        .slides-wrapper {
            position: relative;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .onboarding-slide {
            position: absolute;
            width: 100%;
            opacity: 0;
            visibility: hidden;
            transform: translateX(30px);
            transition: opacity var(--transition-normal), transform var(--transition-normal), visibility var(--transition-normal);
            display: none;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .onboarding-slide.active {
            position: relative;
            opacity: 1;
            visibility: visible;
            transform: translateX(0);
            display: flex;
        }

        .onboarding-slide.slide-out-left {
            opacity: 0;
            visibility: hidden;
            transform: translateX(-30px);
        }

        /* Welcome Screen Styling */
        .welcome-halo-container {
            position: relative;
            width: 160px;
            height: 160px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 32px;
        }

        .halo-ring {
            position: absolute;
            border-radius: 50%;
            background-color: var(--color-accent-light);
            opacity: 0.15;
        }

        .ring-1 {
            width: 160px; height: 160px;
            animation: pulse-ring 4s infinite ease-in-out;
        }

        .ring-2 {
            width: 120px; height: 120px;
            animation: pulse-ring 4s infinite ease-in-out 1.3s;
        }

        .ring-3 {
            width: 80px; height: 80px;
            animation: pulse-ring 4s infinite ease-in-out 2.6s;
        }

        .halo-core {
            position: absolute;
            width: 60px;
            height: 60px;
            background-color: var(--color-accent-dark);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-bg-primary);
            box-shadow: var(--shadow-md);
            animation: core-hover 3s infinite ease-in-out;
        }

        .halo-icon {
            font-size: 32px;
        }

        @keyframes pulse-ring {
            0% { transform: scale(0.9); opacity: 0.05; }
            50% { transform: scale(1.15); opacity: 0.25; }
            100% { transform: scale(0.9); opacity: 0.05; }
        }

        @keyframes core-hover {
            0% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
            100% { transform: translateY(0); }
        }

        .welcome-title {
            font-size: 36px;
            color: var(--color-text-primary);
            margin-bottom: 8px;
            font-family: var(--font-heading);
            font-weight: 600;
        }

        .welcome-subtitle {
            font-size: 14px;
            color: var(--color-text-secondary);
            margin-bottom: 24px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 500;
        }

        .welcome-text {
            color: var(--color-text-muted);
            font-size: 15px;
            line-height: 1.6;
            margin: 0 16px;
        }

        /* Slide Titles and Helpers */
        .slide-header-icon {
            font-size: 40px;
            color: var(--color-accent-dark);
            margin-bottom: 16px;
        }

        .slide-title {
            font-size: 24px;
            color: var(--color-text-primary);
            margin-bottom: 8px;
            font-family: var(--font-heading);
            font-weight: 600;
        }

        .slide-description {
            font-size: 14px;
            color: var(--color-text-secondary);
            margin-bottom: 24px;
            line-height: 1.5;
        }

        /* Elegant Name Input */
        .input-group {
            position: relative;
            width: 100%;
            margin-top: 32px;
        }

        #user-name-input {
            width: 100%;
            padding: 12px 4px;
            background: transparent;
            border: none;
            border-bottom: 2px solid var(--color-bg-secondary);
            font-size: 20px;
            color: var(--color-text-primary);
            font-family: var(--font-body);
            text-align: center;
            outline: none;
            transition: border-color var(--transition-fast);
        }

        #user-name-input::placeholder {
            color: var(--color-text-muted);
            opacity: 0.5;
        }

        .input-focus-line {
            position: absolute;
            left: 50%;
            bottom: 0;
            width: 0;
            height: 2px;
            background-color: var(--color-accent-dark);
            transition: width var(--transition-normal) ease, left var(--transition-normal) ease;
        }

        #user-name-input:focus ~ .input-focus-line {
            width: 100%;
            left: 0;
        }

        .validation-error {
            color: #d32f2f;
            font-size: 12px;
            margin-top: 12px;
            opacity: 0;
            transition: opacity var(--transition-fast);
        }

        .validation-error.visible {
            opacity: 1;
        }

        /* Option Grid Cards */
        .options-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 100%;
        }

        .option-card {
            background-color: var(--color-bg-card);
            border: 2px solid transparent;
            border-radius: var(--radius-md);
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 16px;
            text-align: left;
            cursor: pointer;
            box-shadow: var(--shadow-sm);
            transition: all var(--transition-fast);
        }

        .option-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }

        .option-card.active {
            border-color: var(--color-accent-dark);
            background-color: rgba(134, 155, 143, 0.08);
        }

        .option-card:active {
            transform: scale(0.98);
        }

        .option-icon-wrapper {
            width: 44px;
            height: 44px;
            border-radius: var(--radius-sm);
            background-color: var(--color-bg-secondary);
            color: var(--color-text-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all var(--transition-fast);
        }

        .option-card.active .option-icon-wrapper {
            background-color: var(--color-accent-dark);
            color: var(--color-bg-primary);
        }

        .option-icon-wrapper .material-symbols-rounded {
            font-size: 24px;
        }

        .option-content {
            flex: 1;
        }

        .option-label {
            font-size: 15px;
            font-weight: 600;
            margin: 0 0 2px 0;
            color: var(--color-text-primary);
        }

        .option-desc {
            font-size: 12px;
            color: var(--color-text-secondary);
            margin: 0;
            line-height: 1.4;
        }

        .badge-recommended {
            position: absolute;
            top: -24px;
            right: 0px;
            background-color: var(--color-accent-dark);
            color: var(--color-bg-primary);
            font-size: 9px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 4px;
            letter-spacing: 0.5px;
        }

        /* Onboarding Nav */
        .onboarding-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid var(--color-bg-secondary);
        }

        .btn-secondary {
            background-color: transparent;
            color: var(--color-text-secondary);
            border: 1px solid var(--color-bg-secondary);
        }

        .btn-secondary:active {
            background-color: var(--color-bg-secondary);
        }

        /* Summary Card */
        .summary-card {
            width: 100%;
            padding: 24px;
            border-radius: var(--radius-lg);
            border: 1px solid rgba(255, 255, 255, 0.4);
            text-align: center;
            box-shadow: var(--shadow-md);
        }

        .summary-success-icon {
            font-size: 48px;
            color: var(--color-accent-dark);
            margin-bottom: 12px;
        }

        .summary-greeting {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 20px;
            font-family: var(--font-heading);
        }

        .summary-details {
            display: flex;
            flex-direction: column;
            gap: 16px;
            text-align: left;
            margin-bottom: 24px;
        }

        .summary-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .summary-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }

        .summary-row-icon {
            font-size: 20px;
            color: var(--color-accent-dark);
        }

        .summary-row-text {
            font-size: 14px;
            display: flex;
            flex-direction: column;
            color: var(--color-text-primary);
        }

        .summary-row-text strong {
            font-size: 11px;
            color: var(--color-text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
        }

        .summary-footer {
            font-size: 13px;
            color: var(--color-text-secondary);
            line-height: 1.5;
            margin: 0;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
            padding-top: 16px;
        }
    `;
    container.appendChild(style);

    // Navigation and logical event handling
    setTimeout(() => {
        const slides = container.querySelectorAll('.onboarding-slide');
        const progressBarContainer = container.querySelector('#progress-bar-container');
        const progressFill = container.querySelector('#progress-fill');
        const onboardingNavContainer = container.querySelector('#onboarding-nav-container');
        const btnPrev = container.querySelector('#btn-prev');
        const btnNext = container.querySelector('#btn-next');
        const userNameInput = container.querySelector('#user-name-input');
        const nameValError = container.querySelector('#name-validation-error');
        const btnWelcome = container.querySelector('.btn-next-welcome');
        const btnEnterSanctuary = container.querySelector('#btn-enter-sanctuary');

        // Initial setup for cards
        const optionCards = container.querySelectorAll('.option-card');
        optionCards.forEach(card => {
            card.addEventListener('click', () => {
                const field = card.dataset.field;
                const value = card.dataset.value;

                // Toggle active state in sibling group
                container.querySelectorAll(`.option-card[data-field="${field}"]`).forEach(sibling => {
                    sibling.classList.remove('active');
                });
                card.classList.add('active');

                // Save selected option
                onboardingData[field] = field === 'commitment' ? parseInt(value) : value;
            });
        });

        // Language switch buttons on welcome screen
        container.querySelectorAll('.lang-switch-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const chosen = btn.dataset.lang;
                if (chosen && chosen !== getLang()) {
                    setLang(chosen, true);
                }
            });
        });

        // Welcome screen advance
        btnWelcome.addEventListener('click', () => {
            goToStep(1);
        });

        // Previous button
        btnPrev.addEventListener('click', () => {
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            }
        });

        // Next button
        btnNext.addEventListener('click', () => {
            if (currentStep === 1) {
                const name = userNameInput.value.trim();
                if (!name) {
                    nameValError.classList.add('visible');
                    userNameInput.focus();
                    return;
                } else {
                    nameValError.classList.remove('visible');
                    onboardingData.name = name;
                }
            }
            goToStep(currentStep + 1);
        });

        // Enter Sanctuary button (finish onboarding)
        btnEnterSanctuary.addEventListener('click', async () => {
            // Save state to DB locally
            await DB.login({
                name: onboardingData.name,
                email: 'practitioner@siddha.med',
                experience: onboardingData.experience,
                goal: onboardingData.goal,
                dailyCommitment: onboardingData.commitment
            });

            if (onLoginSuccess) {
                onLoginSuccess();
            }
        });

        // Trigger input enter key
        userNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                btnNext.click();
            }
        });

        function goToStep(stepIndex) {
            if (stepIndex < 0 || stepIndex >= totalSteps) return;

            // Slide classes for animation
            const activeSlide = container.querySelector('.onboarding-slide.active');
            
            if (activeSlide) {
                activeSlide.classList.add('slide-out-left');
                setTimeout(() => {
                    activeSlide.classList.remove('active', 'slide-out-left');
                }, 300);
            }

            currentStep = stepIndex;

            setTimeout(() => {
                slides.forEach(slide => {
                    const stepNum = parseInt(slide.dataset.step);
                    if (stepNum === currentStep) {
                        slide.classList.add('active');
                    } else {
                        slide.classList.remove('active', 'slide-out-left');
                    }
                });

                // Update UI elements
                updateNavUI();
            }, activeSlide ? 150 : 0);
        }

        function updateNavUI() {
            // Show/hide progress bar and nav controls
            if (currentStep === 0) {
                progressBarContainer.style.display = 'none';
                onboardingNavContainer.style.display = 'none';
            } else {
                progressBarContainer.style.display = 'block';
                // Adjust progress percentage (steps 1 to 5 maps to 20% to 100%)
                const percentage = (currentStep / (totalSteps - 1)) * 100;
                progressFill.style.width = `${percentage}%`;

                // Show/hide next/back buttons (Step 5 uses a dedicated sanctuary button)
                if (currentStep === totalSteps - 1) {
                    onboardingNavContainer.style.display = 'none';
                    populateSummary();
                } else {
                    onboardingNavContainer.style.display = 'flex';
                    btnPrev.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
                }
            }

            // Auto-focus input on step 1
            if (currentStep === 1) {
                setTimeout(() => userNameInput.focus(), 200);
            }
        }

        function populateSummary() {
            const displayGreeting = container.querySelector('#summary-user-greeting');
            const displayExp = container.querySelector('#summary-experience-val');
            const displayGoal = container.querySelector('#summary-goal-val');
            const displayCommitment = container.querySelector('#summary-commitment-val');

            const firstName = onboardingData.name.split(' ')[0];
            displayGreeting.textContent = tr(`Welcome, ${firstName}!`, `Witaj, ${firstName}!`);

            // Format experience label
            const experiences = {
                beginner: tr('Beginner', 'Początkujący'),
                intermediate: tr('Intermediate', 'Średniozaawansowany'),
                advanced: tr('Advanced', 'Zaawansowany')
            };
            displayExp.textContent = experiences[onboardingData.experience] || tr('Beginner', 'Początkujący');

            // Format goal label
            const goals = { 
                stress: tr('Reduce Stress & Anxiety', 'Redukcja stresu i napięcia'), 
                focus: tr('Deepen Concentration', 'Pogłębienie koncentracji'), 
                habit: tr('Build a Daily Habit', 'Zbudowanie codziennego nawyku')
            };
            displayGoal.textContent = goals[onboardingData.goal] || tr('Tailored Path', 'Dopasowana ścieżka');

            // Format commitment minutes
            displayCommitment.textContent = tr(`${onboardingData.commitment} minutes`, `${onboardingData.commitment} minut`);
        }

    }, 0);

    return container;
}

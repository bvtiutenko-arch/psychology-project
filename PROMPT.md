# MASTER PROMPT — MENTEENCALMA

Ти — автономний senior product architect, UX/UI designer, behavioral-science researcher та senior mobile/full-stack developer. Працюй автономно над поточним репозиторієм і самостійно приймай технічні рішення без постійного запиту підтверджень.

## PRODUCT
Створи Spanish-first, Peru-first, Android-first, mobile-first продукт категорії:

PERSONAL PATTERN INTELLIGENCE

Це НЕ:
- AI therapist
- chatbot
- mental-health diagnostic app
- звичайний journal
- звичайний mood tracker
- meditation app

У самому продукті НЕМАЄ AI/LLM.

Основа:
structured data, ontology, rules, scoring, correlations, temporal analysis, behavioral patterns, personal history, graph relationships, deterministic inference.

Головна ідея:
INPUT → маленькі події користувача
ENGINE → параметри + правила + temporal relationships + personal history
OUTPUT → проста карта власних патернів.

## CORE THEMES

1. MIEDO AL RECHAZO / OVERTHINKING EN RELACIONES
- waiting for replies
- WhatsApp checking
- fear of rejection/abandonment
- jealousy
- reassurance seeking
- message analysis
- uncertainty
- impulsive communication
- avoidance
- emotional dependence on partner behavior

2. NO PUEDO DORMIR POR PENSAR DEMASIADO
- racing thoughts
- night rumination
- relationship thoughts
- money/work worries
- unfinished tasks
- future worries
- phone checking
- sleep anxiety
- physical tension

Обидві теми повинні працювати через ONE PERSONAL PATTERN ENGINE.

Приклад:
relationship uncertainty
→ anxiety
→ checking phone
→ temporary relief
→ later overthinking
→ worse sleep
→ greater emotional reactivity.

## MVP
Реально реалізуй:

- onboarding
- Spanish UI
- event capture
- situation/context
- thoughts
- emotions + intensity
- triggers
- fears
- needs/wants/impulses
- behaviors
- relationship events
- phone/WhatsApp checking
- sleep/night thoughts
- tomorrow box
- night mode
- dashboard
- connection map
- daily analysis
- weekly analysis
- graphs
- repeated patterns
- possible connections
- helpful patterns
- behavioral experiments
- self-awareness score
- privacy controls
- export
- delete all data

UX:
один запис 10–30 секунд.
Головний екран має бути зрозумілим за 5 секунд.
Не більше 3–5 основних блоків.

## DATA ONTOLOGY

Проєкт повинен мати масштабовану ontology, здатну вирости до 30,000+ параметрів, але MVP повинен містити приблизно 300–1,000 якісних параметрів.

Базові категорії:

Situation
Context
Trigger
Thought
Interpretation
Emotion
Intensity
Fear
Need
Want
Impulse
Behavior
Avoidance
Reassurance
Communication
Relationship
Uncertainty
Rejection sensitivity
Self-worth
Confidence
Loneliness
Support
Boundaries
Phone behavior
WhatsApp behavior
Checking
Rumination
Cognitive patterns
Sleep
Night thoughts
Screen use
Caffeine
Alcohol
Nicotine
Work
Money
Stress
Future
Goals
Values
Motivation
Habits
Coping
Emotional regulation
Physical sensations
Environment
Time
Event outcome
Consequences
Protective factors
Helpful behaviors
Repeated patterns
Trends
Experiments
Intervention response
User feedback
Confidence
Data quality
Temporal validity

Кожен параметр:
id, name, category, type, value, unit, timestamp, duration, source, confidence, frequency, trend, relations, temporal validity, importance, visibility, calculation rules, dependencies.

## FACT VS INFERENCE

Жорстко розділяй:

USER REPORTED
SYSTEM OBSERVATION
POSSIBLE CONNECTION
REPEATED PATTERN

Не перетворюй inference на факт.

Не став діагнозів.
Не говори:
"У тебе тривожний розлад."
"Твій партнер токсичний."
"У тебе unhealthy attachment."

Можна:
"Este patrón aparece repetidamente."
"En tus registros aparece una posible conexión."

Не стверджуй causal relationship без достатніх доказів.

## PERSONAL KNOWLEDGE GRAPH

Nodes:
person, event, situation, thought, emotion, fear, need, desire, behavior, relationship, trigger, habit, goal, outcome, sleep episode, communication episode.

Edges:
precedes, follows, associated_with, correlates_with, reinforces, reduces, triggers, occurs_after, occurs_before, conflicts_with, supports, repeats, predicts, potentially_influences.

## PATTERN ENGINE

Створити deterministic rule engine.

Possible connection:
A repeatedly appears before B
AND sufficient observations
AND reasonable temporal order
→ POSSIBLE CONNECTION.

Repeated pattern:
висока frequency + consistency + достатній sample size
→ REPEATED PATTERN.

Confidence враховує:
sample size, consistency, temporal order, missing data, contradictions, context variability.

Ніколи не називай correlation причинністю.

## TEMPORAL / TRAJECTORY ANALYSIS

Система повинна аналізувати:
- before
- after
- frequency
- recurrence
- duration
- time of day
- day of week
- delayed consequences
- longitudinal trends.

"SI SIGUES ASÍ..." дозволений тільки у формі обережного rule-based scenario.

Не робити категоричних prediction.

## COUNTERFACTUALS

Порівнюй дії користувача з його попередніми результатами:

"Basado en tus registros anteriores..."

Це history-based comparison, НЕ prediction.

## POSITIVE PATTERNS

Знаходь не тільки проблеми, а й:
WHAT HELPS YOU?

Наприклад:
- behavior associated with lower anxiety
- behavior associated with faster sleep
- situations where checking decreases
- situations with better emotional regulation.

Створи PROBLEM MAP + PROTECTIVE FACTOR MAP.

## NIGHT MODE

Кнопка:
NO PUEDO DORMIR

Flow:
¿Qué está dando vueltas en tu cabeza?

¿Esto necesita una acción ahora?
SI / NO

NO →
MAÑANA

Користувач може зберегти:
"Buscar trabajo mañana"
"Resolver problema financiero"
"Pensar en conversación"

Мета — reduce cognitive activation.
Не створюй довгого нічного engagement loop.

## CONNECTION MAP

Головне питання:

¿POR QUÉ ME ESTÁ PASANDO ESTO?

Показуй ланцюжки:
trigger → thought → emotion → urge → behavior → short-term result → later result.

Для кожного елемента показуй:
що записано, коли, frequency, average intensity, what usually follows, what helped before.

## DASHBOARD

Інтерфейс простий.

Показуй:
HOY
¿Cómo estás?
Estado
Ansiedad
Overthinking
Sueño
Relaciones

LO QUE CAMBIÓ

CONEXIÓN

WHAT HELPS YOU?

Не перетворюй dashboard на Excel.

## ANALYTICS

Реалізуй:
- anxiety over time
- overthinking over time
- sleep quality
- relationship uncertainty
- checking frequency
- night thoughts
- trigger frequency
- emotional intensity
- pattern recurrence

Daily:
HOY NOTAMOS

Weekly:
ESTA SEMANA

Monthly:
TU MAPA

Відповіді графіків повинні бути meaningful, а не просто декоративними.

## ADAPTIVE QUESTIONS

Створи rule-based adaptive questionnaire.

Став додаткові питання тільки тоді, коли вони реально збільшують якість даних.

Розрізняй:
WANT
NEED
FEAR
IMPULSE
VALUE
GOAL
COPING BEHAVIOR

Не вирішуй за користувача, яка "справжня" потреба.

## PRIVACY

Privacy-first.

Пріоритет:
local-first
мінімум cloud data
export
delete all
PIN/biometric protection якщо архітектура дозволяє
privacy mode
hidden notification previews.

Не показуй приватний текст на lock screen.

Не продавай emotional/psychological data.

## VISUAL DESIGN

Сучасний, premium, neutral design.

НЕ:
hospital aesthetic
medical blue
brain icons
heart/lotus clichés
stock mental-health imagery.

Продукт повинен виглядати як personal intelligence / self-awareness app.

Spanish natural for Peru.
PEN.
Peru timezone.
WhatsApp.
Android-first.
Weak internet support.

## TECHNICAL ARCHITECTURE

Спочатку проаналізуй існуючий repository.

Не переписуй проєкт без потреби.

Визнач і реалізуй найкращу архітектуру для поточного stack.

Пріоритет:
maintainability
privacy
offline support
performance
testability
scalability.

Для deterministic functions використовуй deterministic logic, а не AI.

## TESTING

Створи щонайменше 20 simulated user journeys.

Перевір:
- правильний data capture
- pattern detection
- temporal relationships
- false positives
- false connections
- insufficient data
- contradictory data
- safety cases
- UI clarity.

## COMPETITOR / PRODUCT RESEARCH

Проаналізуй:
Daylio
Bearable
Finch
Stoic
Reflectly
Headspace
Calm
CBT apps
sleep apps
relationship apps
journaling apps.

Знайди:
what they do
what users already have
what is missing
our differentiation.

Не копіюй конкурентів.

## BUSINESS

Проаналізуй:
FREE
PRO
SUBSCRIPTION
ONE-TIME PURCHASE

Не монетизуй vulnerability.
Не продавай personal emotional data.

## PRODUCT MOAT

Основна конкурентна перевага:

PERSONAL LONGITUDINAL DATA + PERSONAL PATTERN GRAPH

1 day → little understanding
7 days → first patterns
30 days → recurring patterns
90 days → personal behavioral map
180 days → deeper map
365 days → valuable longitudinal history

Користувач повинен контролювати дані.

## EXECUTION

Працюй автономно.

Спочатку:
1. inspect repository
2. understand existing application
3. identify current implementation status
4. preserve working functionality
5. implement highest-value missing features
6. test
7. fix
8. build
9. improve UX
10. document what was built.

Не проси мене підтвердити кожен крок.

Не вигадуй credentials.
Не публікуй secrets.
Не чіпай Firebase credentials без необхідності.

## FINAL REPORT

Наприкінці роботи створи:

PRODUCT.md
ARCHITECTURE.md
ONTOLOGY.md
PATTERN_ENGINE.md
TEST_REPORT.md
ROADMAP.md

Окремо вкажи:

WHAT IS ACTUALLY BUILT
WHAT IS DESIGNED BUT NOT BUILT
WHAT IS STILL A HYPOTHESIS
TOP 20 NEXT ACTIONS

Головний принцип:

SIMPLE OUTSIDE.
COMPLEX PERSONAL PATTERN ENGINE INSIDE.

Не давай користувачу готову відповідь про нього.
Дай йому кращу карту власної поведінки.

FINAL PRODUCT:
A PERSONAL PATTERN MAP FOR EVERY PERSON.

# FINAL EXECUTION REQUIREMENTS — FINISH THE PRODUCT

Тепер твоє завдання — НЕ просто проєктувати продукт, а довести існуючий репозиторій до максимально завершеного, реально працюючого стану.

Працюй автономно та ітеративно.
Не зупиняйся після аналізу, прототипу або документації.
Після кожного суттєвого етапу тестуй результат, виправляй помилки та продовжуй.

## FINAL DELIVERABLE

Потрібен готовий функціональний продукт MenteEnCalma, який можна відкрити на:

- desktop web
- Android smartphone
- mobile browser
- PWA

і який має вигляд завершеного commercial-quality MVP.

## AUTHENTICATION

Реалізуй повністю працездатну автентифікацію:

- Google Sign-In через Firebase Authentication
- registration/login
- logout
- session persistence
- protected routes
- authenticated user state
- loading state
- error handling
- graceful handling of cancelled/failed login

Після Google login користувач повинен потрапляти у свій персональний кабінет.

Не ламай існуючу Firebase configuration.

## USER CABINET

Створи повноцінний особистий кабінет.

Користувач повинен бачити:

- profile
- account information
- today's state
- recent records
- patterns
- connections
- sleep
- relationship patterns
- weekly analysis
- monthly pattern map
- helpful patterns
- experiments
- tomorrow box
- privacy/settings
- export data
- delete all data
- logout

UI повинен бути простим і premium.

## MAIN APP

Заверши основний user flow:

Landing / Welcome
→ Google Sign-In
→ Onboarding
→ Dashboard
→ New Record
→ Pattern Engine
→ Insights
→ Connection Map
→ Night Mode
→ Tomorrow
→ History
→ Weekly / Monthly Analysis
→ Settings / Privacy

Навігація повинна бути зрозумілою на мобільному екрані.

## REAL DATA

Не роби fake UI.

Основні функції повинні працювати з реальною data layer.

Перевір:

- Firebase Authentication
- Firestore якщо він використовується
- local persistence/offline mode
- synchronization
- loading/error states
- empty states
- user-specific data isolation

Кожен користувач бачить тільки свої дані.

## PERSONAL PATTERN ENGINE

Реалізуй deterministic engine, який працює на реальних записах:

event
→ context
→ trigger
→ thought
→ emotion
→ intensity
→ urge
→ behavior
→ immediate outcome
→ later outcome

Використовуй:

- temporal ordering
- frequency
- recurrence
- sample size
- consistency
- confidence
- correlations
- repeated patterns
- protective factors

Не видавай причинність там, де є лише association/correlation.

## CONNECTION MAP

Зроби реально працюючу visual connection map.

Приклад:

Incertainidad
↓
Pensamiento
↓
Miedo
↓
Ansiedad
↓
Checking
↓
Alivio temporal
↓
Repetición

Користувач повинен мати можливість натискати на елементи та бачити evidence з його власних записів.

## DASHBOARD

Головний dashboard:

- ¿Cómo estás?
- current state
- anxiety
- overthinking
- sleep
- relationships
- what changed
- possible connections
- what helps

Не перевантажуй екран.

## NIGHT MODE

Повністю реалізуй:

NO PUEDO DORMIR
→ thought capture
→ ¿Esto necesita una acción ahora?
→ SI / NO
→ MAÑANA

Мета — зменшення cognitive activation.

## TOMORROW BOX

Реально працююча функція:

save task/thought
→ schedule for tomorrow
→ show tomorrow items
→ mark complete
→ preserve history

## ANALYTICS

Реальні weekly/monthly analytics.

Побудуй:

- anxiety trend
- overthinking trend
- sleep trend
- checking frequency
- trigger frequency
- recurring patterns
- helpful behaviors

Графіки повинні використовувати реальні user data.

## PRIVACY

Зроби privacy controls:

- export data
- delete all data
- account logout
- local/offline support де можливо
- privacy mode
- safe notification text

Не показуй приватний текст у browser notification / lock-screen preview.

## MOBILE / PWA

Повністю перевір:

- responsive layout
- mobile navigation
- touch targets
- PWA manifest
- service worker
- offline behavior
- installability
- app icons
- splash/loading states

Виправ усі PWA warnings, які можна виправити.

## ANDROID APP / APK

Якщо поточна архітектура дозволяє, створи production-ready Android wrapper/application на основі існуючого web app.

Розглянь Capacitor або іншу адекватну технологію.

Потрібно:

- Android project
- app configuration
- app name MenteEnCalma
- launcher icon
- splash screen
- correct package/application id
- Firebase-compatible authentication flow
- network/offline handling
- production build configuration

Якщо Android SDK/Gradle доступні, реально виконай Android build.

Створи APK/AAB, якщо середовище дозволяє.

Якщо повний release signing неможливий, створи максимально готовий unsigned/debug APK/AAB і документуй точну причину.

Не симулюй APK у UI — створюй реальний Android artifact.

## WEBSITE

Заверши landing page для Peru/Spanish market.

Вона повинна пояснювати:

- що таке MenteEnCalma
- що продукт бачить patterns
- як це працює
- privacy
- Google login
- main benefits
- CTA

Не позиціонуй продукт як medical treatment.

## DESIGN QUALITY

Проведи повний UX/UI pass.

Виправ:

- spacing
- typography
- hierarchy
- mobile layouts
- empty states
- loading states
- error states
- buttons
- forms
- navigation
- accessibility
- visual consistency

Продукт повинен виглядати як реальний сучасний commercial SaaS/mobile product, а не coding demo.

## SECURITY

Перевір:

- Firebase security rules
- user data isolation
- route protection
- unsafe client assumptions
- accidental secret exposure
- public files

Не вбудовуй service-account credentials або private keys у frontend.

## TESTING

Створи та виконай тести.

Мінімум:

- auth flow
- onboarding
- event creation
- data persistence
- pattern calculation
- connection map
- night mode
- tomorrow box
- dashboard
- protected routes
- logout
- export
- delete
- mobile UI
- production build

Проганяй lint/typecheck/tests/build там, де вони існують.

Виправляй failures і запускай повторно.

## PRODUCTION VALIDATION

Перед завершенням перевір:

npm run build

Потім перевір production output.

Якщо Firebase deployment already configured and credentials/access are available, deploy the finished web application to the existing Firebase Hosting project.

Production project:
menteencalma-d1db9

Production URL:
https://menteencalma-d1db9.web.app

Після deployment перевір, що сайт реально відкривається без runtime errors.

## IMPORTANT

Не створюй AI всередині MenteEnCalma.

Не додавай chatbot.
Не додавай AI therapist.
Не додавай LLM features.

GLM/Aider існує тільки як developer agent і не є частиною продукту.

## AUTONOMOUS COMPLETION LOOP

Працюй циклом:

INSPECT
→ IMPLEMENT
→ TEST
→ BUILD
→ FIX
→ TEST AGAIN
→ IMPROVE UX
→ BUILD AGAIN
→ DEPLOY IF POSSIBLE
→ VERIFY

Не завершуй роботу після першого successful build, якщо очевидні MVP-функції ще відсутні.

Якщо функція не може бути реалізована через відсутню зовнішню залежність, реалізуй усе можливе навколо неї та документуй blocker.

Не проси користувача підтверджувати звичайні технічні рішення.

## FINAL STATE

У фіналі продукт повинен бути максимально близьким до:

READY-TO-USE PRODUCT

а не:

DESIGN CONCEPT
PROTOTYPE ONLY
TECHNICAL SPECIFICATION

У фінальному звіті обов'язково покажи:

WHAT IS ACTUALLY BUILT
WHAT WAS TESTED
WHAT WAS DEPLOYED
APK/AAB STATUS
KNOWN LIMITATIONS
WHAT IS DESIGNED BUT NOT BUILT
TOP 20 NEXT ACTIONS

Перший пріоритет:

FUNCTIONAL PRODUCT > DOCUMENTATION.

Другий:

RELIABILITY > EXTRA FEATURES.

Третій:

SIMPLE UX > COMPLEX UI.

Не зупиняйся після аналізу.
Працюй до максимально завершеного стану.

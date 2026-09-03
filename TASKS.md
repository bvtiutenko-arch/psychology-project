cd ~/psychology-project

# 1. Зупиняємо поточний процес агента
pkill -f run_agent.sh

# 2. Записуємо повний текст MASTER PROMPT у файл PROMPT.md
cat << 'EOF' > PROMPT.md
MASTER PROMPT — PERSONAL PATTERN APP FOR PERU
ТВОЯ РОЛЬ
Ти — автономний senior product architect, UX/UI designer, behavioral-science researcher, mobile developer, database architect, data-model designer, product strategist та експерт із цифрових продуктів.
Тобі доручено самостійно спроєктувати та, якщо середовище дозволяє, створити функціональний прототип мобільного застосунку.
Працюй автономно протягом максимально доступного часу — до 8 годин.
ВАЖЛИВО:

У САМОМУ МОБІЛЬНОМУ ДОДАТКУ НЕМАЄ AI.
Не створюй chatbot.
Не створюй AI-психолога.
Не створюй AI therapist.
Не створюй генеративний AI всередині продукту.
Основою продукту повинні бути:

структуровані дані;
заздалегідь розроблена система параметрів;
логічні правила;
математичні залежності;
behavioral patterns;
scoring;
correlations;
temporal analysis;
rule-based inference;
персональна історія;
графи зв'язків;
статистика;
сценарії;
алгоритми.
Складність повинна знаходитися всередині системи, а інтерфейс для людини повинен залишатися дуже простим.
1. ОСНОВНА ІДЕЯ
Створи нову категорію мобільного продукту:

PERSONAL PATTERN INTELLIGENCE
Це не звичайний journal.
Це не mood tracker.
Це не habit tracker.
Це не meditation app.
Це не sleep tracker.
Це не AI therapist.
Це система, яка допомагає людині:

побачити зв'язки між своїми думками, емоціями, ситуаціями, поведінкою та наслідками.
Користувач вводить маленькі фрагменти інформації.
Система поступово будує його персональну карту.
Наприклад:
Ситуація:
"Вона прочитала повідомлення і не відповідає."
↓
Автоматична думка:
"Напевно, я їй більше не цікавий."
↓
Емоція:
тривога 8/10
↓
Страх:
відмови
↓
Поведінковий імпульс:
перевірити WhatsApp
↓
Дія:
перевірити 10 разів
↓
Тимчасовий результат:
тривога трохи зменшилась
↓
Довгостроковий патерн:
перевірка телефону закріплюється як спосіб зменшення невизначеності.
Через декілька тижнів система повинна мати можливість показати:

"У ваших записах цей сценарій повторювався 8 разів."
або:

"Затримка відповіді часто пов'язана у ваших записах зі збільшенням тривоги."
Не:
"Ваш партнер викликає у вас тривогу."
Не:
"У вас тривожний тип прив'язаності."
Не:
"Ви маєте психологічний розлад."
Тільки те, що реально випливає з даних.
2. ЦІЛЬОВИЙ РИНОК
Перший ринок:

PERU
Продукт повинен бути:

Spanish-first;
Peru-first;
Android-first;
mobile-first;
простим;
дешевим у використанні;
придатним для слабшого інтернету;
privacy-first.
Основна мова інтерфейсу:

Spanish
Використовуй природну сучасну іспанську, зрозумілу користувачам Перу.
Не використовуй надмірно медичну або академічну лексику.
3. ДВІ ОСНОВНІ ТЕМИ
НЕ розширюй MVP до 20 проблем.
Початкова версія має дві центральні теми.
THEME 1
MIEDO AL RECHAZO / OVERTHINKING EN RELACIONES
Проблеми:

страх відмови;
страх бути покинутим;
страх втратити партнера;
overthinking;
очікування відповіді;
перевірка WhatsApp;
аналіз повідомлень;
аналіз тону;
ревнощі;
невпевненість;
потреба в reassurance;
страх сказати щось неправильно;
страх конфлікту;
страх мовчання;
інтерпретація коротких відповідей;
залежність настрою від поведінки іншої людини;
повторне написання повідомлень;
імпульсивна комунікація;
уникнення;
надмірна адаптація до партнера.
THEME 2
NO PUEDO DORMIR POR PENSAR DEMASIADO
Проблеми:

нічний overthinking;
racing thoughts;
повторення подій дня;
думки про майбутнє;
фінансові переживання;
проблеми у стосунках;
робота;
незавершені справи;
страх;
планування;
regret;
"мені потрібно це вирішити зараз";
перевірка телефону;
sleep anxiety;
думка "я повинен заснути";
фізіологічне напруження.
4. ГОЛОВНИЙ ДИФЕРЕНЦІАТОР
Не роби дві незалежні функції.
Створи:

ONE PERSONAL PATTERN ENGINE
Наприклад:
Конфлікт у стосунках
↓
тривога
↓
нічний overthinking
↓
перевірка телефону
↓
пізніше засинання
↓
поганий сон
↓
наступного дня більша емоційна реактивність
↓
більша чутливість до поведінки партнера
↓
новий overthinking.
Система повинна знаходити такі зв'язки автоматично через правила та накопичені дані.
5. 30 000+ ПАРАМЕТРІВ
Мета системи:

створити ontology, здатну масштабуватися до 30 000+ параметрів.
ВАЖЛИВО:
Не створюй 30 000 безглуздих полів.
Створи ієрархічну систему.
Основні категорії:

Situation
Context
Trigger
Thought
Interpretation
Emotion
Emotional intensity
Fear
Need
Want
Impulse
Behavior
Avoidance
Reassurance seeking
Communication
Relationship
Partner interaction
Social interaction
Uncertainty
Rejection sensitivity
Self-esteem
Self-worth
Confidence
Loneliness
Social support
Boundaries
Attachment-related behaviors
Phone behavior
WhatsApp behavior
Checking behavior
Rumination
Cognitive patterns
Sleep
Sleep latency
Night thoughts
Sleep interruptions
Evening behavior
Screen usage
Caffeine
Alcohol
Nicotine
Work
Money
Financial stress
Future
Goals
Values
Motivation
Habits
Coping
Emotional regulation
Stress
Physical sensations
Environment
Time
Day of week
Relationship status
Event outcome
Consequences
Protective factors
Helpful behaviors
Harmful patterns
Repeated patterns
Long-term trends
Experiments
Intervention response
User feedback
Confidence
Data quality
Temporal validity.
Розширюй ці категорії систематично.
6. КОЖЕН ПАРАМЕТР
Кожен параметр повинен мати:

ID;
name;
category;
type;
value;
unit;
timestamp;
duration;
source;
confidence;
frequency;
trend;
related parameters;
temporal validity;
importance;
user-visible / hidden;
calculation rules;
dependencies.
7. НЕ ПЛУТАТИ ФАКТ І ВИСНОВОК
Це критично.
Система повинна розділяти:

USER REPORTED
"Вона не відповідала 3 години."
та

SYSTEM OBSERVATION
"У 7 із 10 подібних ситуацій рівень тривоги був >7/10."
та

POSSIBLE PATTERN
"Може існувати зв'язок між очікуванням відповіді та тривогою."
Ніколи не перетворюй припущення на факт.
8. PERSONAL KNOWLEDGE GRAPH
Створи граф.
Nodes:

person;
event;
situation;
thought;
emotion;
fear;
need;
desire;
behavior;
relationship;
trigger;
habit;
goal;
outcome;
sleep episode;
communication episode.
Edges:

precedes;
follows;
associated_with;
correlates_with;
reinforces;
reduces;
triggers;
occurs_after;
occurs_before;
conflicts_with;
supports;
repeats;
predicts;
potentially_influences.
Не стверджуй causal relationship, якщо його не можна підтвердити.
9. ВВЕДЕННЯ ДАНИХ
Користувач не повинен заповнювати довгі анкети.
Один запис повинен займати приблизно 10–30 секунд.
Наприклад:

"Що сталося?"
[Вона не відповіла]

"Що ти відчув?"
😌 😐 😟 😰 😣

"Що подумав?"
[Введення]

"Що захотілося зробити?"
написати ще раз
перевірити телефон
почекати
поговорити
нічого
інше
"Наскільки це тебе зачепило?"
0–10
Все.
10. SMART FOLLOW-UP QUESTIONS
Іноді потрібно поставити додаткове питання.
Не завжди.
Кожне питання повинно мати конкретну мету.
Наприклад:
Користувач:
"Вона не відповідає."
Система:
"Що тебе найбільше турбує?"

Що вона сердиться
Що я їй більше не подобаюсь
Що вона з кимось іншим
Що я зробив щось неправильно
Просто хочу отримати відповідь
Інше
Наступне питання залежить від відповіді.
Створи adaptive questionnaire engine на основі правил.
11. НЕОБХІДНОСТІ VS БАЖАННЯ
Система повинна розрізняти:
WANT
NEED
FEAR
IMPULSE
VALUE
GOAL
COPING BEHAVIOR
Наприклад:
"Мені потрібно, щоб вона відповіла."
Можливий аналіз:
Поверхнева потреба:
відповідь.
Можлива глибинна потреба:
certainty / connection / reassurance.
Але система не повинна вирішувати це за користувача.
Вона повинна ставити питання.
12. DASHBOARD
Головний екран повинен бути дуже простим.
Не показуй користувачу складну систему.
Приклад:

HOY
¿Cómo estás?
😊 😐 😟 😣
TU ESTADO
Ansiedad
██████░░░░ 6.2
Overthinking
███████░░░ 7.1
Sueño
████░░░░░░ 4.5
Relaciones
██████░░░░ 6.0
LO QUE CAMBIÓ
"Tu overthinking aumentó respecto a ayer."
CONEXIÓN
"Esta semana aparecen más pensamientos nocturnos
después de situaciones de incertidumbre en tus relaciones."
[Ver conexión]
13. CONNECTION MAP
Це одна з головних функцій.
Показуй:

¿POR QUÉ ME ESTÁ PASANDO ESTO?
Наприклад:
Esperar respuesta
↓
Incertidumbre
↓
"Ya no le importo"
↓
Miedo al rechazo
↓
Ansiedad
↓
Revisar WhatsApp
↓
Alivio temporal
↓
Volver a revisar.
Користувач може натиснути на будь-який елемент.
Показати:

що було записано;
коли;
скільки разів;
середню інтенсивність;
що зазвичай відбувається після;
що допомагало раніше.
14. "SI SIGUES ASÍ..."
Створи rule-based trajectory engine.
Приклад:

SI ESTE PATRÓN CONTINÚA...
"En tus últimos registros, esperar respuestas ha estado relacionado
con revisar el teléfono repetidamente."
"Si este comportamiento continúa, es posible que el hábito de revisar
el teléfono siga apareciendo cada vez que sientas incertidumbre."
Це НЕ повинно бути:
"Ти станеш залежним."
"Твої стосунки зруйнуються."
"У тебе буде безсоння."
Ніяких категоричних прогнозів.
15. COUNTERFACTUAL SCENARIOS
Користувач повинен мати можливість порівняти:

¿Qué pasa si...?
"Написати ще раз?"
"Почекати?"
"Не перевіряти телефон 30 хвилин?"
"Лягти спати?"
"Вирішити це завтра?"
Система використовує історичні дані користувача.
Наприклад:

Esperar 30 minutos
Previous results:
Anxiety:
7.4 → 5.9
Additional message:
не було потрібно у 6 із 8 випадків.
Це не prediction.
Це:

"Basado en tus registros anteriores."
16. NIGHT MODE
Нічний режим повинен бути максимально простим.
Кнопка:

NO PUEDO DORMIR
Далі:

¿Qué está dando vueltas en tu cabeza?
[запис]
Потім:

¿Esto necesita una acción ahora?
SI / NO
Якщо NO:

MAÑANA
Створити запис:
"Revisar trabajo."
або
"Pensar en conversación con Ana."
або
"Resolver problema financiero."
Потім:

"No necesitas resolver esto ahora."
Не стимулюй довгий діалог уночі.
Мета нічного режиму:

reduce cognitive activation.
17. TOMORROW BOX
Створи окрему ключову функцію:

MAÑANA
Усе, що не потрібно вирішувати зараз, можна відкласти.
Наприклад:
23:47
"Мені потрібно знайти нову роботу."
↓
MAÑANA 10:00
"Buscar trabajo."
↓
"Зараз це вже записано."
↓
"Тобі не потрібно вирішувати це в ліжку."
18. DAILY ANALYSIS
Наприкінці дня:

HOY NOTAMOS

"Tu ansiedad apareció principalmente después de incertidumbre."


"Revisaste el teléfono varias veces после esperar una respuesta."


"Los pensamientos nocturnos estuvieron relacionados con problemas
que no requerían acción inmediata."
19. WEEKLY ANALYSIS
Щотижня:

top triggers;
top thoughts;
top emotions;
top behaviors;
repeated patterns;
sleep correlations;
relationship correlations;
improvement;
deterioration;
unresolved patterns.
Приклад:

ESTA SEMANA
11 ситуацій uncertainty.
7 пов'язані з checking.
5 відбулися після 21:00.
4 були пов'язані з погіршенням сну.
20. MONTHLY PATTERN MAP
Раз на місяць:

TU MAPA
Показати:

головні тригери;
повторювані думки;
повторювані поведінкові цикли;
позитивні зміни;
негативні зміни;
найбільш сильні зв'язки;
зв'язки, які ще не підтверджені;
що покращилося;
що погіршилося.
21. GRAPHS
Створи зрозумілі графіки:

anxiety over time;
overthinking over time;
sleep quality;
relationship uncertainty;
checking frequency;
night thoughts;
trigger frequency;
emotional intensity;
pattern recurrence.
Але:
НЕ перетворюй dashboard на Excel.
Графіки повинні відповідати на питання.
Наприклад:

"Що найчастіше передує моєму overthinking?"
22. CORRELATION ENGINE
Створи алгоритм пошуку зв'язків.
Наприклад:
IF
A appears repeatedly before B
AND
frequency > threshold
AND
sample size >= minimum
THEN
mark as:
POSSIBLE CONNECTION
Після більшої кількості спостережень:
REPEATED PATTERN
Не називай це причинністю.
23. PATTERN CONFIDENCE
Кожен патерн має confidence score.
Наприклад:
10 observations
↓
confidence 0.41
25 observations
↓
confidence 0.67
50 observations
↓
confidence 0.84
Але confidence повинен залежати не тільки від кількості.
Враховуй:

sample size;
consistency;
temporal order;
missing data;
contradictory observations;
context variability.
24. POSITIVE PATTERNS
Не створюй продукт, який бачить тільки проблеми.
Система повинна знаходити:

WHAT HELPS YOU?
Наприклад:
"Після прогулянки твоя середня тривога зменшується."
"Коли ти не перевіряєш телефон перед сном, засинання відбувається швидше."
"Після розмови замість припущень рівень невизначеності зменшується."
Це дуже важливо.
Система повинна будувати не тільки:
PROBLEM MAP
але й:

PROTECTIVE FACTOR MAP
25. EXPERIMENTS
Додай маленькі behavioral experiments.
Наприклад:

EXPERIMENTO
"Коли хочеться перевірити WhatsApp через тривогу,
почекай 10 хвилин."
Записати:
до:
anxiety 7
urge:
8
після 10 хв:
anxiety 5
Перевірив:
NO
Результат:
Система запам'ятовує.
Це не терапія.
Це персональний behavioral experiment.
26. SELF-AWARENESS SCORE
Можна створити не "mental health score", а:

AUTOCONOCIMIENTO
Показник того, наскільки добре користувач розуміє власні патерни.
Враховуй:

регулярність записів;
визначення тригерів;
здатність розрізняти думку і факт;
визначення емоції;
знання своїх patterns;
відстеження результатів.
Не використовуй цей score для оцінювання "здоровий/нездоровий".
27. PRIVACY
Це надзвичайно важливо.
Дані можуть містити:

інтимні думки;
стосунки;
сексуальні теми;
страхи;
фінанси;
сон;
емоційний стан.
Тому:

encryption;
local-first;
мінімум серверних даних;
export;
delete all;
PIN / biometric lock;
приховані notification previews;
privacy mode.
На lock screen не повинно бути:
"Tu novia no te respondió."
Замість цього:
"Nuevo recordatorio."
28. SAFETY
Це НЕ медичний діагностичний продукт.
Не став діагнозів.
Не кажи:
"У вас тривожний розлад."
Не кажи:
"У вас unhealthy attachment."
Не кажи:
"Ваші стосунки токсичні."
Система може сказати:
"Este patrón aparece repetidamente."
або:
"Podría ser útil hablar con un profesional."
При потенційно небезпечних ситуаціях створити safety flow.
29. АНТИЗАЛЕЖНІСТЬ
Додаток не повинен створювати залежність від самого додатку.
Не:
"Відкрий додаток, коли тобі погано."
Не:
"Ми завжди з тобою."
Не:
"Тільки тут тебе зрозуміють."
Навпаки:

Мета продукту — щоб людина поступово краще розуміла себе БЕЗ продукту.
30. NOTIFICATIONS
Не використовуй страх для engagement.
НЕ:
"Your anxiety is getting worse!"
НЕ:
"You haven't checked in today!"
НЕ:
"We miss you!"
Краще:
"¿Quieres registrar cómo terminó la situación?"
або:
"Hay un pensamiento guardado para mañana."
31. MOBILE WIDGETS
Створи Android widgets.

Widget 1
¿QUÉ ESTÁ PASANDO?
Ansiedad 6.2
Overthinking 7.1
Widget 2
ПАТРІОН / PATRÓN
"Estás entrando en un patrón conocido."
Widget 3
NOCHE
"3 pensamientos guardados para mañana."
Widget 4
RELACIONES
"Última ситуация registrada hace 3h."
Не показувати приватні подробиці на заблокованому екрані.
32. UX
Принцип:

5 SECONDS TO UNDERSTAND
Користувач повинен відкрити додаток і одразу зрозуміти:
що відбувається;
що змінилося;
який патерн видно;
що можна зробити.
Не більше 3–5 основних елементів на головному екрані.
33. VISUAL IDENTITY
Не використовуй типову естетику:

лікарня;
психіатрія;
медичний blue;
мозок;
серце;
meditation lotus;
stock photos of smiling people.
Створи сучасний, нейтральний, premium, але доступний дизайн.
Він повинен виглядати як:

personal intelligence / self-awareness product
а не:

mental illness application.
34. PERU-SPECIFIC DESIGN
Адаптуй продукт під Перу.
Врахуй:

Spanish;
PEN;
Peru timezone;
WhatsApp;
місцеві сценарії стосунків;
роботу;
навчання;
фінансовий стрес;
соціальне життя;
мобільний internet;
Android.
Не роби американський продукт, просто перекладений іспанською.
35. MONETIZATION
Досліди можливі моделі:
FREE
PRO
SUBSCRIPTION
ONE-TIME PURCHASE
але не монетизуй вразливість.
Не продавай психологічні профілі.
Не продавай персональні emotional data.
36. MVP
Не намагайся одразу створити всі 30 000 параметрів.
Створи:

800–15 000 якісних параметрів
і систему, яка може масштабуватися.
MVP повинен містити:

onboarding;
два themes;
event capture;
emotions;
thoughts;
triggers;
behaviors;
sleep;
relationship events;
pattern engine;
connection map;
weekly report;
night mode;
tomorrow box;
widgets;
privacy;
export;
delete.
37. TECHNICAL ARCHITECTURE
Визнач:

mobile framework;
local database;
optional cloud synchronization;
database schema;
event model;
parameter model;
graph model;
rule engine;
scoring engine;
correlation engine;
temporal engine;
notification engine;
widget architecture;
privacy architecture.
Не додавай AI лише тому, що він модний.
Якщо функцію можна надійно виконати deterministic logic — використовуй deterministic logic.
38. TESTING
Створи щонайменше 20 simulated user journeys.
Приклади:

Людина чекає відповідь від партнера.
Людина боїться rejection.
Людина постійно перевіряє WhatsApp.
Людина після конфлікту не може заснути.
Людина переживає через гроші.
Людина думає про роботу вночі.
Людина боїться втратити партнера.
Людина постійно rereads messages.
Людина має good relationship, але overthinks.
Людина просто має проблеми зі сном.
Людина має фінансовий стрес.
Людина використовує телефон перед сном.
Людина реагує на rejection.
Людина уникає конфліктів.
Людина шукає reassurance.
Людина покращує свій стан.
Людина має повторюваний pattern.
Дані суперечать одне одному.
Даних недостатньо.
Небезпечна ситуація.
і так далі і так далі(тисячі параметрів)
Для кожного сценарію перевір:

що система записує;
які зв'язки знаходить;
які зв'язки НЕ повинна знаходити;
чи не робить необґрунтованих висновків;
чи зрозумілий UI.
39. КОНКУРЕНТИ
Проведи дослідження актуального ринку.
Досліди:

Daylio;
Bearable;
Finch;
Stoic;
Reflectly;
Headspace;
Calm;
CBT apps;
sleep apps;
relationship apps;
journaling apps;
mental-health apps.
Але не копіюй їх.
Знайди:
WHAT THEY DO
WHAT USERS ALREADY HAVE
WHAT IS MISSING
WHERE OUR PRODUCT CAN BE DIFFERENT.
40. ГОЛОВНИЙ PRODUCT MOAT
Шукай конкурентну перевагу не в красивому дизайні.
Шукай її в:

PERSONAL LONGITUDINAL DATA + PATTERN GRAPH
Чим довше людина користується продуктом:
1 day
→ little understanding
7 days
→ first patterns
30 days
→ recurring patterns
90 days
→ personal behavioral map
180 days
→ deep longitudinal map
365 days
→ extremely valuable personal history.
Але користувач повинен контролювати свої дані.
41. КЛЮЧОВИЙ USER EXPERIENCE
Користувач повинен поступово перейти від:
"Я не знаю, чому мені погано."
до:
"Я бачу, що це часто починається після невизначеності."
Потім:
"Я бачу, що я роблю."
Потім:
"Я бачу, що це дає короткостроково."
Потім:
"Я бачу довгостроковий наслідок."
І нарешті:
"Я знаю, що можу спробувати зробити інакше."
Це і є основна цінність продукту.
42. ОСНОВНА ФІЛОСОФІЯ
Не:

"We fix you."
Не:

"We know what's wrong with you."
Не:

"AI understands you."
А:

"Entiende tus patrones."
або:

"Mira lo que se repite."
або:

"Conoce cómo funciona tu mente."
Перевір ці варіанти з точки зору брендингу та знайди найсильніший.
43. 8-ГОДИННИЙ AUTONOMOUS WORKFLOW
Працюй самостійно.
Не проси мене підтвердити кожен крок.

HOUR 1
Market research.

HOUR 2
Product architecture.

HOUR 3
Parameter ontology.

HOUR 4
Pattern / graph / rule engine.

HOUR 5
UX/UI.

HOUR 6
Database + technical architecture.

HOUR 7
Prototype.

HOUR 8
Testing + refinement.
Якщо можеш створити реальний prototype — створюй.
Якщо не можеш — створи максимально детальну технічну специфікацію.
44. В КІНЦІ РОБОТИ НАДАЙ
PRODUCT
final concept;
product name options;
tagline;
positioning;
target user;
value proposition.
DATA
parameter ontology;
database schema;
graph schema;
event schema;
scoring system.
LOGIC
pattern engine;
correlation engine;
confidence engine;
temporal engine;
counterfactual engine;
experiment engine.
UX
every screen;
navigation;
onboarding;
dashboard;
connection map;
night mode;
widgets;
notifications.
BUSINESS
competitors;
differentiation;
monetization;
MVP;
roadmap.
TECH
recommended stack;
architecture;
local/cloud strategy;
security;
scalability.
TESTING
20 simulated users;
detected failures;
false positives;
false connections;
UX problems.
FINAL
Окремо напиши:

WHAT IS ACTUALLY BUILT
WHAT IS DESIGNED BUT NOT BUILT
WHAT IS STILL A HYPOTHESIS
TOP 20 NEXT ACTIONS
45. НАЙВАЖЛИВІША ВИМОГА
Не перетворюй цей продукт на складний застосунок.
Користувач повинен бачити:

SIMPLE APP
А всередині повинно працювати:

COMPLEX PERSONAL PATTERN ENGINE.
30 000+ параметрів — це не те, що потрібно показати користувачу.
Це внутрішня модель.
Користувач бачить лише:

"Ось що сталося."
"Ось що повторюється."
"Ось з чим це може бути пов'язано."
"Ось що відбувалося раніше."
"Ось що може статися, якщо pattern продовжиться."
"Ось що допомагало тобі раніше."
"Ось що ти можеш спробувати зараз."
І найважливіше:

НЕ ДАЙ КОРИСТУВАЧУ ГОТОВУ ВІДПОВІДЬ.
ДАЙ ЙОМУ КРАЩУ КАРТУ ВЛАСНОЇ ПОВЕДІНКИ.
Продукт повинен допомагати людині побачити те,
що вона не могла побачити, коли всі її думки існували
окремо.
FINAL PRODUCT PRINCIPLE
INPUT
Маленькі події.

ENGINE
Тисячі параметрів + правила + часові зв'язки + персональна історія.

OUTPUT
Проста, зрозуміла карта:

WHAT HAPPENED
WHAT I THOUGHT
WHAT Ifelt
WHAT I DID
WHAT HAPPENED NEXT
WHAT REPEATS
WHAT IS CONNECTED
WHAT HELPS
WHAT MAY HAPPEN IF NOTHING CHANGES
FINAL RULE
Будуй продукт не як "ще один mental health app".
Будуй:

A PERSONAL PATTERN MAP FOR EVERY PERSON.
Simple outside.
Extremely intelligent structure inside.
No AI inside the application.
Privacy-first.
Peru-first.
Spanish-first.
Android-first.
Evidence-informed.
Non-diagnostic.
Non-manipulative.
Designed to increase self-understanding and independence.
EOF

# 3. Перезапускаємо скрипт з оновленим промптом
./run_agent.sh

/* ==========================================================================
   مُنطلق (Prompt) — Shared Core + Visitor App
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     Data & configuration
     ------------------------------------------------------------------------ */
  const SEED_PROMPTS = [
  {
    "id": "p-001",
    "title": "مُحرر نصوص يكتب بصوتك",
    "category": "writing",
    "description": "حوّل أفكارك المتفرقة إلى مقال عربي مترابط بنبرة تشبهك، لا بنبرة آلية.",
    "prompt_text": "أنت محرر محتوى عربي محترف يكتب بذكاء وإيجاز. اكتب مقالًا من 600 كلمة حول [الموضوع] لجمهور [الجمهور]، بنبرة [ودّية / رسمية / جسورة].\n\nابدأ بمقدمة تلفت الانتباه، وقسّم المقال إلى عناوين فرعية واضحة، واستخدم أمثلة ملموسة من الحياة اليومية. اختم بخلاصة عملية من 3 خطوات.\n\nتجنب الحشو والعبارات المستهلكة مثل «في عصر التكنولوجيا». لا تكتب أبدًا بأسلوب روبوتي، واجعل الجمل قصيرة وقابلة للتنفس.",
    "explanation": "استبدل الأقواس المربعة بتفاصيلك الحقيقية. كلما كان وصف الجمهور والنبرة أدق، خرج النص أقرب إلى صوتك. جرّب إضافة 3 جمل من كتاباتك السابقة إلى نهاية المُنطلق ليقلّد إيقاعك الخاص.",
    "example_result": "العنوان المقترح: لماذا ننسى 90% مما نقرأ؟\n\nنحن لا نعاني من قلة المعلومات، بل من كثرة ما يمرّ علينا دون أن يتوقف عنده شيء. في كل يوم نقرأ عشرات العناوين، ونحفظ عشرات الصور، ثم نستيقظ بعد أسبوع وكأن شيئًا لم يكن.\n\nالمشكلة ليست في ذاكرتنا، بل في الطريقة التي نستهلك بها المحتوى.\n\n1. اقرأ أقل، وتعمّق أكثر\nاختر فكرة واحدة من كل مقال، واكتبها بأسلوبك في ثلاث جمل. ما تكتبه بيدك يبقى معك أطول مما تقرأه بعينك.\n\n2. اربط الجديد بما تعرفه\nالمعلومة وحدها تنسى، لكنها تعيش عندما تلمس تجربة سابقة. اسأل نفسك بعد كل فكرة: أين رأيت هذا في حياتي؟\n\n3. راجع بعد يوم، لا بعد دقيقة\nالمراجعة القصيرة بعد 24 ساعة تصنع فرقًا أكبر من إعادة القراءة عشر مرات. خصص خمس دقائق، واسأل نفسك: ما الفكرة التي أريد الاحتفاظ بها؟",
    "example_type": "نص",
    "model": "ChatGPT",
    "difficulty": "سهل",
    "tags": [
      "مقالات",
      "تحرير",
      "سوشيال ميديا"
    ],
    "likes": 248
  },
  {
    "id": "p-002",
    "title": "خطة SEO تنافسية من الصفر",
    "category": "marketing",
    "description": "مُنطلق إنجليزي يحوّل كلمة مفتاحية واحدة إلى خطة محتوى قابلة للتنفيذ خلال 90 يومًا.",
    "prompt_text": "Act as a senior SEO strategist with 10 years of experience in competitive niches.\n\nBuild a 90-day SEO plan for the keyword \"[KEYWORD]\" targeting [AUDIENCE] in [COUNTRY].\n\nDeliver:\n1. Search intent analysis and 3 content clusters.\n2. A prioritized table of 15 keywords with difficulty, volume, and funnel stage.\n3. Five article briefs with suggested titles and internal links.\n4. A realistic weekly publishing cadence.\n5. Three KPIs to track, and the biggest risk to avoid.\n\nAsk me no questions. State assumptions clearly, and avoid generic advice.",
    "explanation": "استخدمه عند إطلاق موقع جديد أو دخول سوق تنافسي. غيّر الكلمة المفتاحية والجمهور والبلد فقط، ثم اطلب من النموذج توسيع أي بند تراه ضعيفًا. راجع أرقام البحث يدويًا قبل الاعتماد على الخطة.",
    "example_result": "90-DAY SEO ROADMAP\nKeyword: \"AI note taking app\" | Market: UAE\n\nCore insight: The market is crowded with feature-led pages. The fastest opening is helping students and consultants choose the right workflow, not comparing specs.\n\nCluster 1 — Comparison intent (weeks 1–3)\n• \"Best AI note apps for students in 2026\" — KD 38, volume 2,400\n• \"Notion vs Otter for lecture notes\" — KD 24, volume 880\n• \"Free alternatives to paid transcription tools\" — KD 31, volume 1,300\n\nCluster 2 — Problem-first content (weeks 4–8)\n• \"How to take notes during a fast lecture\"\n• \"Why your meeting notes never get used\"\n• \"A 10-minute weekly review system for students\"\n\nWeekly cadence\nWeek 1–2: publish 2 comparison pages. Week 3–4: one pillar guide + one workflow post. Week 5 onward: 1 article + 1 short video summary per week.\n\nKPIs\n1. Non-brand clicks from comparison pages.\n2. Assisted sign-ups from organic blog traffic.\n3. Average engaged time on pillar content.\n\nBiggest risk: Publishing ten thin comparison pages before earning any topical authority. Build two deep guides first.",
    "example_type": "خطة",
    "model": "ChatGPT",
    "difficulty": "متوسط",
    "tags": [
      "SEO",
      "استراتيجية",
      "محتوى"
    ],
    "likes": 196
  },
  {
    "id": "p-003",
    "title": "Code review like a staff engineer",
    "category": "development",
    "description": "مراجعة كود صارمة ومنظمة تكشف الأخطاء الخفية قبل أن تصل إلى الإنتاج.",
    "prompt_text": "You are a staff software engineer reviewing production JavaScript.\n\nReview the code below and return:\n1. Critical bugs (with severity P0–P2).\n2. Performance and accessibility risks.\n3. A refactored version with comments explaining each change.\n4. Three test cases I should add.\n\nRules: be direct, do not praise, and never invent missing context.\n\n```js\nasync function getUsers(ids) {\n  const users = [];\n  for (const id of ids) {\n    const res = await fetch(`/api/users/${id}`);\n    users.push(await res.json());\n  }\n  return users;\n}\n```",
    "explanation": "أرفق دائمًا الكود كاملًا مع نسخة الإطار وإصدارات المكتبات. التعليمة «لا تخترع سياقًا» تمنع النموذج من افتراض حماية غير موجودة. بعد المراجعة، اطلب منه كتابة الاختبارات فعليًا بدل وصفها فقط.",
    "example_result": "P1 — Sequential network calls\nEach await blocks the next request. With 50 IDs, latency grows linearly and the UI may appear frozen.\n\nP2 — Silent partial data\nA failed response can return an HTML error page that passes through res.json() or throws without context.\n\nRefactor\n\nasync function getUsers(ids) {\n  if (!ids.length) return [];\n\n  const responses = await Promise.all(\n    ids.map((id) => fetch(`/api/users/${id}`))\n  );\n\n  if (responses.some((res) => !res.ok)) {\n    throw new Error(\"One or more user requests failed\");\n  }\n\n  return Promise.all(responses.map((res) => res.json()));\n}\n\nTests to add\n• Empty ids array returns [] without network calls.\n• A rejected request rejects predictably.\n• Partial failures do not return silent partial data.",
    "example_type": "كود",
    "model": "Claude",
    "difficulty": "متقدم",
    "tags": [
      "JavaScript",
      "مراجعة كود",
      "أداء"
    ],
    "likes": 312
  },
  {
    "id": "p-004",
    "title": "مُعلّم شخصي يشرح بأسلوبك",
    "category": "education",
    "description": "يحوّل أي مفهوم صعب إلى شرح متدرج مع تشبيه من الحياة وأسئلة تتحقق من الفهم.",
    "prompt_text": "أنت معلّم خصوصي صبور وخبير في تبسيط المفاهيم. اشرح لي مفهوم [المفهوم] كأنني طالب في [المرحلة الدراسية].\n\nاتبع هذا التسلسل:\n1. ابدأ بتشبيه من الحياة اليومية في جملتين.\n2. اشرح الفكرة الأساسية خطوة بخطوة دون مصطلحات غير ضرورية.\n3. أعطني مثالًا محلولًا، ثم مثالًا أختبر فيه فهمي.\n4. اختم بثلاثة أسئلة قصيرة متدرجة الصعوبة، ولا تعطني الإجابات.\n\nإذا استخدمت مصطلحًا جديدًا، عرّفه فورًا في سطر منفصل.",
    "explanation": "مثالي قبل الاختبارات أو عند تعلم مهارة جديدة. لا تطلب الشرح فقط، بل أجب عن الأسئلة الثلاثة في رسالة منفصلة ليصحح لك النموذج نقاط الضعف تحديدًا.",
    "example_result": "المفهوم: الاحتمال الشرطي\n\nتخيّل أنك تدخل غرفة مظلمة وتعرف أن فيها 10 كرات، 6 حمراء و4 زرقاء. إذا أخبرك صديق أن الكرة التي سحبها حمراء، فما احتمال أنها الكرة الكبيرة؟ هنا تتغير الاحتمالات لأننا حصلنا على معلومة جديدة.\n\nالخطوة الأساسية\nالاحتمال الشرطي يعني: احتمال حدوث شيء، بشرط أن شيئًا آخر وقع بالفعل. نكتبه P(A|B)، أي احتمال A مع العلم أن B حدث.\n\nمثال محلول\nفي فصل من 30 طالبًا، 12 يدرسون الرياضيات، و8 يدرسون الرياضيات والفيزياء. إذا اخترنا طالبًا يدرس الرياضيات، فما احتمال أنه يدرس الفيزياء أيضًا؟\nالجواب: 8 ÷ 12 = 2/3.\n\nاختبر فهمك\nفي نفس الفصل، 10 طلاب يدرسون الفيزياء. إذا اخترنا طالبًا يدرس الفيزياء، فما احتمال أنه يدرس الرياضيات؟\n\nأسئلة متدرجة\n1. ما الفرق بين P(A|B) وP(B|A) بمثال من يومك؟\n2. لماذا لا يمكن استخدام القانون إذا كان P(B) = 0؟\n3. كيف يغيّر تشخيص طبي نادر احتمال الإصابة الحقيقي؟",
    "example_type": "شرح",
    "model": "Gemini",
    "difficulty": "سهل",
    "tags": [
      "شرح",
      "تعليم",
      "تبسيط"
    ],
    "likes": 174
  },
  {
    "id": "p-005",
    "title": "محضر اجتماع يحوّل الكلام إلى قرارات",
    "category": "business",
    "description": "حوّل تفريغ اجتماع طويل إلى ملخص تنفيذي ومهام واضحة بمسؤولين ومواعيد.",
    "prompt_text": "أنت مساعد تنفيذي خبير في إدارة الاجتماعات. سأعطيك تفريغًا خامًا لاجتماع.\n\nاستخرج منه:\n• ملخصًا تنفيذيًا لا يتجاوز 5 أسطر.\n• جدول القرارات المتخذة.\n• المهام بصيغة: المهمة | المسؤول | الموعد النهائي | الأولوية.\n• الأسئلة المعلّقة التي تحتاج حسمًا.\n\nإذا لم يُذكر مسؤول أو موعد، اكتب «غير محدد» ولا تخترع معلومات. استخدم لغة عربية مهنية وواضحة.\n\nالتفريغ:\n[الصق التفريغ هنا]",
    "explanation": "استخدمه بعد كل اجتماع مباشرة وأنت تتذكر السياق. القاعدة الأهم هنا هي «لا تخترع معلومات»؛ فهي تمنع النموذج من ملء الفراغات بمسؤولين أو مواعيد وهمية. راجع الناتج وأرسله للفريق خلال دقائق.",
    "example_result": "الملخص التنفيذي\nاتفق الفريق على تأجيل إطلاق النسخة التجريبية أسبوعًا لمعالجة مشكلة في مسار التسجيل. تقرر التركيز على تجربة المستخدم الجديد فقط، وتأجيل ميزة التقارير للنسخة التالية. سارة ستجهّز صفحة التسجيل، وخالد سيتولى اختبار الدفع.\n\nالقرارات\n1. تأجيل الإطلاق إلى 18 نوفمبر.\n2. إخفاء ميزة التقارير من النسخة التجريبية.\n3. إجراء اختبار مغلق مع 20 مستخدمًا قبل الإطلاق.\n\nالمهام\nتجهيز صفحة التسجيل | سارة | 12 نوفمبر | عالية\nاختبار مسار الدفع | خالد | غير محدد | متوسطة\nدعوة 20 مستخدمًا للاختبار المغلق | منى | 14 نوفمبر | عالية\n\nأسئلة معلّقة\n• هل نحتاج إشعارًا بريديًا عند تأجيل الموعد؟\n• من المسؤول عن الرد على ملاحظات المستخدمين أثناء الاختبار؟",
    "example_type": "جدول",
    "model": "ChatGPT",
    "difficulty": "متوسط",
    "tags": [
      "اجتماعات",
      "إنتاجية",
      "إدارة"
    ],
    "likes": 145
  },
  {
    "id": "p-006",
    "title": "Brand identity from a single brief",
    "category": "design",
    "description": "مُنطلق Midjourney لبناء لوحة هوية بصرية متماسكة من وصف قصير.",
    "prompt_text": "Create a cohesive visual identity board for a modern Arabic specialty coffee brand called \"[BRAND]\".\n\nArt direction: warm minimalism, editorial photography, sand and deep olive palette, subtle geometric Arabic patterns, generous negative space.\n\nOutput a 3×3 grid containing:\n1. Primary logo mark on a clean background.\n2. Secondary monogram.\n3. Packaging mockup.\n4. Color palette swatches.\n5. Typography pairing sample.\n6. Storefront sign.\n7. Social media post template.\n8. Pattern texture.\n9. Brand tagline lockup.\n\nStyle: refined, tactile, premium, no gradients, no neon colors. --ar 4:5 --style raw",
    "explanation": "مُنطلق مصمم لتوليد لوحة واحدة متماسكة بدل صور متفرقة. استبدل اسم العلامة وحدد مصدر الإلهام البصري. ولّد 3 نسخ ثم اختر عناصر من كل نسخة، ولا تعتمد على الشعار المولّد كما هو دون إعادة رسم احترافية.",
    "example_result": "لوحة الهوية المقترحة — 3×3\n\nالشعار الأساسي: حرف «ن» مجرّد بخط كوفي معاصر داخل مربع مفتوح، بلون الزيتون العميق على خلفية رملية.\n\nالاختصار: مونوغرام دائري النون مع نقطة ذهبية، مناسب للأكواب والأختام.\n\nالتغليف: كيس ورقي رملي مع ملصق دائري زيتوني ونص عربي عمودي.\n\nالألوان: رملي #E8DCC8، زيتوني #3E4A35، ذهبي #C6A15B، فحمي #22201C.\n\nالخطوط: Tajawal للعناوين مع IBM Plex Sans Arabic للنصوص.\n\nاللافتة: واجهة خشبية داكنة، شعار مضاء بإضاءة دافئة ومساحة فارغة واسعة.\n\nقالب السوشيال: صورة مقهى من الأعلى مع شريط رملي أسفل للنص.\n\nالنمط: خطوط هندسية عربية متكررة بنسبة 8% شفافية.\n\nالشعار النصي: «قهوة تُشبه المكان» بخط كوفي معاصر.",
    "example_type": "صورة",
    "model": "Midjourney",
    "difficulty": "متوسط",
    "tags": [
      "هوية بصرية",
      "Midjourney",
      "تصميم"
    ],
    "likes": 287
  },
  {
    "id": "p-007",
    "title": "محلل بيانات يحكي القصة خلف الأرقام",
    "category": "data",
    "description": "حوّل جدولًا جافًا إلى رؤى ورسوم واضحة وتوصيات قابلة للتنفيذ.",
    "prompt_text": "أنت محلل بيانات أول بخبرة في تحليلات المنتجات. سأرفق لك جدول بيانات.\n\nحلّل البيانات وأجب:\n1. ما أهم 3 أنماط أو شذوذات؟ اذكر الأرقام الداعمة.\n2. ما الفروض التي يمكن استنتاجها؟ افصل بوضوح بين الحقيقة والافتراض.\n3. اقترح 4 مؤشرات يجب متابعتها.\n4. اكتب 3 توصيات عملية مرتبة حسب الأثر المتوقع.\n\nاعرض النتائج في جدول من عمودين: الرؤية | الدليل. لا تختلق أرقامًا غير موجودة، وإذا كانت البيانات غير كافية فاذكر ما ينقصك.\n\nالبيانات:\n[الصق البيانات هنا]",
    "explanation": "الأفضل استخدامه مع تصدير CSV صغير بدل لصق أرقام ناقصة. التعليمة تفصل الحقيقة عن الافتراض، وهي مهمة عندما تقدم النتائج لصاحب قرار. اطلب بعدها رسمًا بيانيًا بالنص أو بكود Python إذا احتجت.",
    "example_result": "الرؤية | الدليل\nارتفاع التسجيل لا يتحول إلى استخدام | 1,200 تسجيل جديد، لكن 18% فقط أكملوا أول مهمة، مقابل 34% في الشهر السابق.\nمستخدمون جدد يغادرون بعد شاشة الإعداد | 46% من الجلسات الجديدة تنتهي خلال أقل من 40 ثانية في خطوة الإعداد الثالثة.\nالمستخدمون القدامى هم محرك النمو | 72% من الإيرادات الجديدة جاءت من ترقيات داخل الحسابات التي مرّ عليها 30 يومًا أو أكثر.\n\nحقائق مقابل افتراضات\nحقيقة: معدل إكمال أول مهمة انخفض 16 نقطة.\nافتراض: تعقيد خطوة الإعداد هو السبب؛ يحتاج اختبارًا بجلسات تسجيل.\n\nمؤشرات مقترحة\n1. معدل إكمال أول مهمة خلال 24 ساعة.\n2. زمن الوصول إلى «قيمة أولى».\n3. التسرب لكل خطوة في الإعداد.\n4. الترقية خلال 30 يومًا.\n\nالتوصيات\n1. تبسيط خطوة الإعداد الثالثة واختبار نسخة من خطوتين.\n2. إضافة رسالة توجيه بعد التسجيل مباشرة.\n3. مراجعة مسار الترقية للمستخدمين بعد 30 يومًا.\n\nما ينقص البيانات: أبعاد الجهاز، ومصدر الزيارة، وسجل الأخطاء.",
    "example_type": "تقرير",
    "model": "Gemini",
    "difficulty": "متقدم",
    "tags": [
      "تحليل بيانات",
      "مؤشرات",
      "قرارات"
    ],
    "likes": 163
  },
  {
    "id": "p-008",
    "title": "مدرّب عادات لمدة 21 يومًا",
    "category": "life",
    "description": "خطة واقعية لبناء عادة واحدة، مع تتبع يومي وخطة تعافٍ عند التعثر.",
    "prompt_text": "أنت مدرّب عادات سلوكي متخصص في التغيير الصغير المستدام. أريد بناء عادة [العادة] خلال 21 يومًا.\n\nصمّم لي خطة واقعية تراعي أنني [وصف مختصر لوضعك ووقتك].\n\nاتبع هذه القواعد:\n• ابدأ بنسخة صغيرة جدًا لا تستغرق أكثر من دقيقتين.\n• اربط العادة بمحفّز يومي موجود أصلًا.\n• أعطني تتبعًا أسبوعيًا بسيطًا.\n• جهّز خطة تعافٍ من 3 خطوات إذا فاتني يوم.\n• اختم بسؤال واحد أراجعه كل مساء.\n\nلا تستخدم عبارات تحفيزية عامة، وكن محددًا وعمليًا.",
    "explanation": "السر هنا في «لا تستخدم عبارات تحفيزية عامة». النموذج سيعطيك نظامًا عمليًا بدل شعارات. ابدأ بالنسخة الصغيرة جدًا ولا تضاعفها قبل أن تصمد أسبوعًا كاملًا. خطة التعافٍ أهم من سلسلة الأيام.",
    "example_result": "خطة 21 يومًا: القراءة قبل النوم\n\nالمحفّز الثابت: وضع الكتاب على الوسادة بعد تنظيف الأسنان.\n\nالأسبوع الأول — التأسيس\nاليوم 1–3: اقرأ صفحة واحدة فقط. لا هدف أكبر.\nاليوم 4–5: اقرأ صفحتين، واكتب جملة واحدة عن الفكرة.\nاليوم 6–7: اقرأ 10 دقائق، وضع علامة عند الفكرة التي توقف عندها.\n\nالأسبوع الثاني — التثبيت\nاليوم 8–14: 12 دقيقة قراءة، مع جملة تلخيص واحدة بعدها. أبقِ الهاتف في غرفة أخرى.\n\nالأسبوع الثالث — الاستقلال\nاليوم 15–21: 15 دقيقة، واختَر يومًا واحدًا للقراءة في مقهى أو مكان مختلف لكسر الملل.\n\nخطة التعافٍ\n1. إذا فات يوم: لا تعوّضه. اقرأ صفحة واحدة فقط في اليوم التالي.\n2. إذا فات يومان: أعِد الهدف إلى صفحتين لمدة 3 أيام.\n3. إذا فات أسبوع: أعد تصميم المحفّز، وابدأ من اليوم الأول دون شعور بالذنب.\n\nسؤال المساء\nما الجملة التي أريد أن أتذكرها من قراءة اليوم؟",
    "example_type": "خطة",
    "model": "Claude",
    "difficulty": "سهل",
    "tags": [
      "عادات",
      "تطوير ذاتي",
      "روتين"
    ],
    "likes": 209
  },
  {
    "id": "p-009",
    "title": "7-day content calendar in one shot",
    "category": "writing",
    "description": "حوّل فكرة واحدة إلى أسبوع كامل من محتوى متنوع بلا تكرار.",
    "prompt_text": "You are a content strategist for a solo founder building an audience on LinkedIn.\n\nTurn the idea \"[IDEA]\" into a 7-day content calendar.\n\nFor each day provide:\n• A hook under 12 words.\n• Format (story, list, contrarian take, case study, carousel, poll, or lesson).\n• A 2-sentence outline.\n• A clear call to action.\n\nConstraints: one idea per post, zero engagement bait, no hashtags, and each post must stand alone. End with the single best posting time and why.",
    "explanation": "مناسب لصنّاع المحتوى على لينكدإن ومن يريد بناء حضور منتظم. الفكرة الواحدة تتحول إلى 7 زوايا مختلفة، لا 7 نسخ من نفس المقال. راجع كل منشور وأضف تجربة شخصية حقيقية قبل النشر.",
    "example_result": "7-DAY LINKEDIN CALENDAR\nIdea: Why most product demos fail\n\nDay 1 — Story\nHook: \"My best demo had 11 slides. And it failed.\"\nOutline: A demo where features impressed the room, but nobody understood the next step. End with the lesson that clarity beats coverage.\nCTA: What is the last demo you remember? Tell me why.\n\nDay 2 — List\nHook: \"5 questions that fix any product demo.\"\nOutline: Five questions to ask before building slides. Each maps to a decision the buyer must make.\nCTA: Save this before your next demo.\n\nDay 3 — Contrarian take\nHook: \"Stop demoing your product. Demo their future.\"\nOutline: Argue that a demo is a decision tool, not a feature tour. Show the difference with one before/after outline.\nCTA: Agree or disagree?\n\nDay 4 — Case study\nHook: \"We cut a 40-minute demo to 12 minutes. Close rate rose.\"\nOutline: Context, change, result. Mention the exact section that was removed.\nCTA: Want the 12-minute structure? Comment \"demo\".\n\nDay 5 — Carousel\nHook: \"The 4-act demo structure that keeps buyers awake.\"\nOutline: Problem, shift, proof, next step. One act per slide.\nCTA: Share this with the last person who demoed to you.\n\nDay 6 — Poll\nHook: \"What kills a demo fastest?\"\nOutline: Poll with four options: too many features, no clear problem, wrong audience, no next step. Then share the most common answer and what to do.\nCTA: Vote and explain your choice.\n\nDay 7 — Lesson\nHook: \"A demo is a conversation with slides nearby.\"\nOutline: Summarize the week into three rules. Invite readers to try one in their next call.\nCTA: Which rule will you test first?\n\nBest posting time: Tuesday, 8:15 AM local time. B2B founders check LinkedIn after the school drop-off and before their first meeting.",
    "example_type": "تقويم",
    "model": "DeepSeek",
    "difficulty": "متوسط",
    "tags": [
      "لينكدإن",
      "محتوى",
      "تقويم"
    ],
    "likes": 121
  },
  {
    "id": "p-010",
    "title": "صفحة هبوط تبيع دون مبالغة",
    "category": "marketing",
    "description": "اكتب نصًا تسويقيًا صادقًا يحوّل الزائر إلى عميل عبر الوضوح والثقة.",
    "prompt_text": "أنت كاتب إعلانات ومسوّق منتجات خبير. اكتب محتوى صفحة هبوط لـ [المنتج/الخدمة] الموجهة إلى [الجمهور].\n\nالمطلوب:\n• عنوان رئيسي لا يتجاوز 10 كلمات + عنوان فرعي يوضح النتيجة.\n• قسم «المشكلة» مكتوب بلغة العميل لا لغة الشركة.\n• 3 فوائد ملموسة بدل قائمة ميزات.\n• قسم إثبات اجتماعي واقعي بصيغة قالب يمكنني تعبئته.\n• 5 أسئلة شائعة تعالج الاعتراضات الحقيقية.\n• دعوة إجراء واحدة واضحة ومتكررة.\n\nممنوع: المبالغات، الوعود المطلقة، والكلمات مثل «الأفضل في العالم». اجعل كل جملة قابلة للإثبات.",
    "explanation": "هذا المُنطلق يفرض نبرة صادقة تمنع الوعود المطلقة التي تقلل الثقة. زوّده باعتراضات عملائك الحقيقية من محادثات المبيعات، وستحصل على صفحة أقرب إلى صوت السوق من أي قالب جاهز.",
    "example_result": "المنتج: أداة فوترة للمستقلين العرب\n\nالعنوان الرئيسي: أصدر فاتورة احترافية في أقل من دقيقة.\nالعنوان الفرعي: صمّم فاتورتك، أضف الضريبة تلقائيًا، وأرسلها بالعربية أو الإنجليزية.\n\nالمشكلة\nتصنع عملًا رائعًا، ثم تخسر ساعات في تجميع الفاتورة وتنسيقها ومتابعة الدفع. وتخشى أن يبدو مستندك أقل احترافية من قيمة عملك.\n\n3 فوائد ملموسة\n• فاتورة جاهزة من قالبك في 60 ثانية، دون فتح برنامج تصميم.\n• حساب ضريبة القيمة المضافة تلقائيًا حسب بلد العميل.\n• سجل يوضح من دفع ومن تأخر، حتى لا تتابع يدويًا.\n\nإثبات اجتماعي (قالب)\n«استخدمت [اسم الأداة] لأول مرة مع عميل [نوع العميل]. أنجزت الفاتورة في [عدد] دقائق بدل [عدد] ساعة، وأرسلت النسخة العربية مباشرة.» — [الاسم]، [المهنة]\n\nالأسئلة الشائعة\n1. هل تدعم الفواتير بالعربية؟ نعم، مع واجهة RTL كاملة.\n2. هل أحتاج بطاقة بنكية للتجربة؟ لا، التجربة مجانية 14 يومًا دون بطاقة.\n3. هل يمكن تصدير الفواتير CSV؟ نعم، من صفحة التقارير.\n4. ماذا يحدث بعد انتهاء التجربة؟ تبقى بياناتك وفواتيرك، ويمكنك التصدير في أي وقت.\n5. هل تدعم أكثر من عملة؟ نعم، ويمكنك حفظ عملة افتراضية لكل عميل.\n\nالدعوة\nابدأ فاتورتك الأولى مجانًا — دون بطاقة بنكية.",
    "example_type": "صفحة",
    "model": "Perplexity",
    "difficulty": "متوسط",
    "tags": [
      "صفحات هبوط",
      "إعلانات",
      "تحويل"
    ],
    "likes": 188
  },
  {
    "id": "p-011",
    "title": "مراجع أمان قبل النشر",
    "category": "development",
    "description": "فحص أمني منظم لآخر تغييراتك البرمجية قبل رفعها إلى الإنتاج.",
    "prompt_text": "أنت مهندس أمن تطبيقات. راجع الكود أو قائمة التغييرات التالية قبل النشر.\n\nافحص:\n1. تسريب الأسرار والمفاتيح.\n2. التحقق من المدخلات و XSS و SQL Injection.\n3. الصلاحيات والمصادقة.\n4. معالجة الأخطاء وكشف المعلومات الحساسة.\n5. الاعتماديات الخطرة إن وجدت.\n\nأعد النتائج في جدول: المشكلة | الخطورة | الدليل | الإصلاح. ثم اكتب قائمة تحقق نهائية من 6 بنود قبل الدمج.\n\nلا تفترض وجود حماية غير ظاهرة في الكود، واذكر حدود المراجعة.\n\n[الصق الكود أو وصف التغييرات]",
    "explanation": "استخدمه كطبقة أولى قبل مراجعة بشرية، لا كبديل عنها. التعليمة «لا تفترض حماية غير ظاهرة» ضرورية لأن النماذج تميل أحيانًا إلى افتراض أن المصادقة موجودة خارج الملف. اجعله يذكر حدود المراجعة دائمًا.",
    "example_result": "المشكلة | الخطورة | الدليل | الإصلاح\nعرض رسالة خطأ تحتوي نص الاستعلام | متوسطة | catch يعيد error.message مباشرة إلى العميل | إعادة رسالة عامة وتسجيل التفاصيل داخليًا\nرابط مباشر لملف المستخدم دون تحقق من الملكية | عالية | /files/:id يقرأ الملف دون فحص user_id | التحقق من ملكية الملف قبل الإرجاع\nمفتاح API داخل ملف العميل | حرجة | NEXT_PUBLIC_MAP_KEY مستخدم في كود الواجهة | تدوير المفتاح ونقله إلى الخادم\nجلسة لا تنتهي | متوسطة | الكوكي بدون maxAge | جلسة 30 دقيقة مع تجديد آمن\n\nحدود المراجعة\nلم تتوفر إعدادات الخادم أو سياسات قاعدة البيانات؛ يلزم فحصهما منفصلًا.\n\nقائمة التحقق قبل الدمج\n1. لا أسرار داخل المستودع أو الحزمة.\n2. كل مسار يتحقق من الصلاحيات.\n3. كل مدخل يمر عبر تحقق مركزي.\n4. الأخطاء لا تكشف تفاصيل داخلية.\n5. الاعتماديات مفحوصة ومن دون ثغرات حرجة.\n6. السجلات لا تحتوي بيانات شخصية أو رموزًا.",
    "example_type": "قائمة تحقق",
    "model": "DeepSeek",
    "difficulty": "متقدم",
    "tags": [
      "أمان",
      "مراجعة",
      "نشر"
    ],
    "likes": 156
  },
  {
    "id": "p-012",
    "title": "Socratic tutor that never gives the answer",
    "category": "education",
    "description": "مُعلّم سقراطي يقودك إلى الفهم بالأسئلة بدل تقديم الحل الجاهز.",
    "prompt_text": "You are a Socratic tutor. Your goal is to help me understand \"[TOPIC]\" without giving me the final answer.\n\nRules:\n• Ask exactly one question at a time.\n• Start easier than you think I need.\n• When I answer, diagnose the misconception, then ask a sharper follow-up.\n• Use a concrete everyday analogy every third question.\n• If I say \"I don't know\", give a hint, not the answer.\n• Track my progress and announce mastery only when I can explain the idea in my own words.\n\nBegin by asking me one diagnostic question about my current understanding.",
    "explanation": "مثالي للمفاهيم التي تظن أنك فهمتها ثم تكتشف فجوة عند الشرح. أجب بصدق ولا تطلب الإجابة. إذا توقفت، قل «أعطني تلميحًا» بدل «ما الإجابة؟». بعد الجلسة، اطلب ملخصًا من سطرين لما تعلمته.",
    "example_result": "Tutor: تخيّل أنك تحزم حقيبة سفر ويمكنك أخذ خمسة أشياء فقط. كيف تختار ما تأخذه؟\n\nأنت: آخذ الأشياء الأكبر أولًا.\n\nTutor: قرار منطقي. الآن، كيف قد يرتبط هذا بما يفعله الحاسوب عندما يخزن بيانات كثيرة في ذاكرة محدودة؟\n\nأنت: يبدأ بالأشياء الكبيرة؟\n\nTutor: ليس تمامًا. فكّر في الحقيبة: هل الأكبر هو الأهم دائمًا؟ ما المعيار الآخر الذي قد يستخدمه الحاسوب ليقرر ما يبقى؟\n\nأنت: ربما الشيء الأكثر استخدامًا.\n\nTutor: اقتربت. إذا كان الحاسوب يعرف ما سيُستخدم لاحقًا، كيف يمكن أن يقرر إخراج صفحة من الذاكرة الآن؟ اذكر مثالًا من هاتفك.\n\nأنت: التطبيقات التي لم أفتحها منذ فترة تغلق.\n\nTutor: ممتاز. هذه هي الفكرة الأساسية لخوارزمية إحلال الصفحات. الآن اشرحها لي بجملة واحدة بأسلوبك، دون استخدام كلمة «خوارزمية».",
    "example_type": "حوار",
    "model": "Gemini",
    "difficulty": "متوسط",
    "tags": [
      "سقراطي",
      "تعلّم",
      "أسئلة"
    ],
    "likes": 132
  }
];

  const CATEGORIES = [
    {
      id: 'writing',
      label: 'كتابة ومحتوى',
      short: 'كتابة',
      icon: 'pen',
      color: '#c45d3b',
      tint: '#faeae3',
      description: 'مقالات، سوشيال ميديا، تحرير وصياغة'
    },
    {
      id: 'marketing',
      label: 'تسويق ومبيعات',
      short: 'تسويق',
      icon: 'megaphone',
      color: '#0f766e',
      tint: '#dcf2ed',
      description: 'استراتيجيات، إعلانات، SEO وصفحات هبوط'
    },
    {
      id: 'development',
      label: 'برمجة وتطوير',
      short: 'برمجة',
      icon: 'code',
      color: '#2b5f9e',
      tint: '#e7effa',
      description: 'مراجعة كود، أمان، توثيق وحل مشكلات'
    },
    {
      id: 'education',
      label: 'تعليم وتعلّم',
      short: 'تعليم',
      icon: 'graduation',
      color: '#7448bf',
      tint: '#f0eafa',
      description: 'شرح، تلخيص، أسئلة وخطط تعلّم'
    },
    {
      id: 'business',
      label: 'أعمال وإنتاجية',
      short: 'أعمال',
      icon: 'briefcase',
      color: '#996508',
      tint: '#fbf0d8',
      description: 'اجتماعات، عروض، تنظيم مهام وقرارات'
    },
    {
      id: 'design',
      label: 'تصميم وإبداع',
      short: 'تصميم',
      icon: 'palette',
      color: '#b54b74',
      tint: '#fae8ef',
      description: 'هوية بصرية، صور، أفكار واتجاهات فنية'
    },
    {
      id: 'data',
      label: 'تحليل وبيانات',
      short: 'بيانات',
      icon: 'chart',
      color: '#0c718c',
      tint: '#e1f3f8',
      description: 'رؤى، مؤشرات، تقارير وقرارات مبنية على الأرقام'
    },
    {
      id: 'life',
      label: 'حياة وتطوير ذاتي',
      short: 'حياة',
      icon: 'sprout',
      color: '#4d7629',
      tint: '#ecf5e2',
      description: 'عادات، روتين، أهداف وتخطيط شخصي'
    }
  ];

  const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((category) => [category.id, category]));

  const KEYS = {
    prompts: 'montalaq_prompts_v1',
    favorites: 'montalaq_favorites_v1',
    liked: 'montalaq_liked_v1',
    suggestions: 'montalaq_suggestions_v1'
  };

  const MODELS = ['ChatGPT', 'Claude', 'Gemini', 'DeepSeek', 'Perplexity', 'Midjourney'];
  const DIFFICULTIES = ['سهل', 'متوسط', 'متقدم'];

  /* ------------------------------------------------------------------------
     Icons
     ------------------------------------------------------------------------ */
  const ICON_PATHS = {
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    megaphone: '<path d="m3 11 18-5v12L3 13v-2Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    code: '<path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 4l-4 16"/>',
    graduation: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5M22 10v6"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
    palette: '<path d="M12 3a9 9 0 0 0 0 18h1.6a1.7 1.7 0 0 0 1.1-3 1.7 1.7 0 0 1 1.1-3H18a3 3 0 0 0 3-3 9 9 0 0 0-9-9Z"/><circle cx="7.5" cy="11.5" r=".8"/><circle cx="10" cy="7.5" r=".8"/><circle cx="14.5" cy="7.5" r=".8"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 15 4-5 3 3 5-7"/>',
    sprout: '<path d="M7 20h10M12 20v-7"/><path d="M12 13C12 8 8 6 4 6c0 5 3 7 8 7ZM12 10c0-4 3-6 8-6 0 4-3 6-8 6Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
    bookmark: '<path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    arrow: '<path d="M19 12H5m6-6-6 6 6 6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    spark: '<path d="M12 2.8c.55 5.2 2.9 7.6 8.1 8.2-5.2.6-7.55 3-8.1 8.2-.55-5.2-2.9-7.6-8.1-8.2 5.2-.6 7.55-3 8.1-8.2Z"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 21h16"/>',
    upload: '<path d="M12 15V3m-5 5 5-5 5 5M4 21h16"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    filter: '<path d="M3 6h18M7 12h10M10 18h4"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z"/>',
    message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>'
  };

  function icon(name, size = 18, strokeWidth = 1.7) {
    const paths = ICON_PATHS[name] || ICON_PATHS.spark;
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  }

  /* ------------------------------------------------------------------------
     Small utilities
     ------------------------------------------------------------------------ */
  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function uid(prefix = 'p') {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function formatNumber(value) {
    const number = Number(value) || 0;
    return number.toLocaleString('en-US');
  }

  function normalizeSearch(value) {
    return String(value == null ? '' : value)
      .toLowerCase()
      .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
      .replace(/[أإآٱ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function debounce(fn, wait = 180) {
    let timer;
    return function debounced(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function readJSON(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function formatDate(value) {
    if (!value) return 'غير محدد';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'غير محدد';
    try {
      return new Intl.DateTimeFormat('ar-EG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      return date.toLocaleDateString();
    }
  }

  /* ------------------------------------------------------------------------
     Auto direction — the core feature
     ------------------------------------------------------------------------ */
  function detectDirection(text) {
    if (!text) return 'rtl';
    const arabicCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const englishCount = (text.match(/[A-Za-z]/g) || []).length;
    if (text.match(/[{}\[\]<>;=]{3,}/)) return 'ltr';
    return arabicCount > englishCount ? 'rtl' : 'ltr';
  }

  function applyAutoDirection(element, text) {
    if (!element) return 'rtl';
    const value = typeof text === 'string' ? text : (element.textContent || '');
    const dir = detectDirection(value);
    element.dir = dir;
    element.style.unicodeBidi = 'plaintext';
    element.style.textAlign = dir === 'rtl' ? 'right' : 'left';
    return dir;
  }

  function syncTextareaDirection(textarea) {
    if (!textarea) return;
    const dir = detectDirection(textarea.value);
    textarea.dir = dir;
    textarea.style.unicodeBidi = 'plaintext';
    textarea.style.textAlign = dir === 'rtl' ? 'right' : 'left';

    const wrapper = textarea.closest('[data-dir-wrap]');
    const badge = wrapper ? wrapper.querySelector('[data-dir-badge]') : null;
    if (badge) {
      badge.dataset.state = dir;
      badge.textContent = dir === 'rtl' ? 'RTL · تلقائي' : 'LTR · تلقائي';
    }
  }

  function setupAutoDirInputs(root = document) {
    root.querySelectorAll('textarea[data-auto-dir]').forEach((textarea) => {
      syncTextareaDirection(textarea);
      if (textarea.dataset.autoDirReady === '1') return;
      textarea.dataset.autoDirReady = '1';
      textarea.addEventListener('input', (event) => {
        syncTextareaDirection(event.target);
      });
    });
  }

  /* ------------------------------------------------------------------------
     Prompt storage
     ------------------------------------------------------------------------ */
  function normalizeTags(tags) {
    if (Array.isArray(tags)) {
      return tags.map((tag) => String(tag).trim()).filter(Boolean);
    }
    return String(tags || '')
      .split(/[,،]/)
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  function normalizePrompt(prompt, index = 0) {
    const source = prompt && typeof prompt === 'object' ? prompt : {};
    const category = CATEGORY_MAP[source.category] ? source.category : 'writing';
    const difficulty = DIFFICULTIES.includes(source.difficulty) ? source.difficulty : 'متوسط';
    return {
      id: String(source.id || `p-seed-${index + 1}`),
      title: String(source.title || 'مُنطلق بدون عنوان'),
      category,
      description: String(source.description || ''),
      prompt_text: String(source.prompt_text || ''),
      explanation: String(source.explanation || ''),
      example_result: String(source.example_result || ''),
      example_type: String(source.example_type || 'نص'),
      model: String(source.model || 'ChatGPT'),
      difficulty,
      tags: normalizeTags(source.tags),
      likes: Math.max(0, Number(source.likes) || 0)
    };
  }

  function savePrompts(prompts) {
    return writeJSON(KEYS.prompts, Array.isArray(prompts) ? prompts : []);
  }

  async function fetchDefaultPrompts() {
    /* Opening the site directly from disk cannot fetch local JSON in Chrome.
       The embedded copy keeps the static experience fully functional offline. */
    if (window.location.protocol === 'file:') {
      return clone(SEED_PROMPTS).map(normalizePrompt);
    }

    try {
      const response = await fetch('data/prompts.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid prompt data');
      return data.map(normalizePrompt);
    } catch (error) {
      return clone(SEED_PROMPTS).map(normalizePrompt);
    }
  }

  async function loadPrompts(options = {}) {
    if (!options.force) {
      const cached = readJSON(KEYS.prompts, null);
      if (Array.isArray(cached)) return cached;
    }

    const prompts = await fetchDefaultPrompts();
    writeJSON(KEYS.prompts, prompts);
    return prompts;
  }

  async function resetPrompts() {
    try {
      window.localStorage.removeItem(KEYS.prompts);
    } catch (error) {
      /* ignore storage failures */
    }
    return loadPrompts({ force: true });
  }

  function getSuggestions() {
    const suggestions = readJSON(KEYS.suggestions, []);
    return Array.isArray(suggestions) ? suggestions : [];
  }

  function saveSuggestions(suggestions) {
    return writeJSON(KEYS.suggestions, Array.isArray(suggestions) ? suggestions : []);
  }

  /* ------------------------------------------------------------------------
     Clipboard + toast
     ------------------------------------------------------------------------ */
  async function copyText(text) {
    const value = String(text == null ? '' : text);
    if (!value) return false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch (error) {
        /* fall back below */
      }
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '-1000px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const succeeded = document.execCommand('copy');
      textarea.remove();
      return succeeded;
    } catch (error) {
      return false;
    }
  }

  const copyTimers = new WeakMap();

  function animateCopyButton(button) {
    if (!button) return;
    button.classList.remove('copied');
    /* restart the CSS animation */
    void button.offsetWidth;
    button.classList.add('copied');
    button.setAttribute('data-copied', 'true');

    const oldTimer = copyTimers.get(button);
    if (oldTimer) clearTimeout(oldTimer);
    const timer = setTimeout(() => {
      button.classList.remove('copied');
      button.removeAttribute('data-copied');
      copyTimers.delete(button);
    }, 1900);
    copyTimers.set(button, timer);
  }

  function toast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const element = document.createElement('div');
    element.className = 'toast';
    element.setAttribute('role', 'status');

    const iconName = type === 'error' ? 'alert' : (type === 'info' ? 'info' : 'checkCircle');
    const iconElement = document.createElement('span');
    iconElement.className = 'toast-icon';
    iconElement.innerHTML = icon(iconName, 14, 2);

    const text = document.createElement('span');
    text.textContent = message;

    element.appendChild(iconElement);
    element.appendChild(text);
    container.appendChild(element);

    setTimeout(() => {
      element.classList.add('is-out');
      setTimeout(() => element.remove(), 280);
    }, 2800);
  }

  /* ------------------------------------------------------------------------
     Expose shared core for admin.html
     ------------------------------------------------------------------------ */
  window.MontalaqCore = {
    CATEGORIES,
    CATEGORY_MAP,
    MODELS,
    DIFFICULTIES,
    KEYS,
    SEED_PROMPTS,
    icon,
    escapeHTML,
    uid,
    formatNumber,
    formatDate,
    normalizeSearch,
    debounce,
    readJSON,
    writeJSON,
    clone,
    detectDirection,
    applyAutoDirection,
    setupAutoDirInputs,
    syncTextareaDirection,
    normalizePrompt,
    normalizeTags,
    loadPrompts,
    savePrompts,
    resetPrompts,
    fetchDefaultPrompts,
    getSuggestions,
    saveSuggestions,
    copyText,
    animateCopyButton,
    toast
  };

  /* Visitor application is only initialised on index.html. */
  if (document.body && document.body.dataset.page === 'home') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initHome, { once: true });
    } else {
      initHome();
    }
  }

  /* ========================================================================
     Visitor app
     ======================================================================== */
  async function initHome() {
    const app = {
      prompts: [],
      query: '',
      category: 'all',
      difficulty: 'all',
      model: 'all',
      sort: 'default',
      favoritesOnly: false,
      visible: 9,
      favorites: new Set(),
      liked: new Set(),
      currentId: null
    };

    const elements = {
      categoriesGrid: document.getElementById('categoriesGrid'),
      categoryPills: document.getElementById('categoryPills'),
      promptGrid: document.getElementById('promptGrid'),
      emptyState: document.getElementById('emptyState'),
      loadMoreBtn: document.getElementById('loadMoreBtn'),
      clearFilters: document.getElementById('clearFilters'),
      emptyClearBtn: document.getElementById('emptyClearBtn'),
      activeFilters: document.getElementById('activeFilters'),
      resultsCount: document.getElementById('resultsCount'),
      librarySearch: document.getElementById('librarySearch'),
      heroSearch: document.getElementById('heroSearch'),
      heroSearchForm: document.getElementById('heroSearchForm'),
      difficultyFilter: document.getElementById('difficultyFilter'),
      modelFilter: document.getElementById('modelFilter'),
      sortFilter: document.getElementById('sortFilter'),
      favoritesToggle: document.getElementById('favoritesToggle'),
      headerFavoritesBtn: document.getElementById('headerFavoritesBtn'),
      favoritesCount: document.getElementById('favoritesCount'),
      promptDialog: document.getElementById('promptDialog'),
      toastContainer: document.getElementById('toastContainer'),
      suggestionForm: document.getElementById('suggestionForm'),
      suggestionCategory: document.getElementById('suggestCategory'),
      suggestionSuccess: document.getElementById('suggestionSuccess'),
      mobileMenu: document.getElementById('mobileMenu'),
      mobileMenuBtn: document.getElementById('mobileMenuBtn'),
      siteHeader: document.getElementById('siteHeader'),
      backToTop: document.getElementById('backToTop'),
      readingProgress: document.getElementById('readingProgress')
    };

    document.body.classList.add('js-ready');

    /* Favourites and likes */
    const storedFavorites = readJSON(KEYS.favorites, []);
    app.favorites = new Set(Array.isArray(storedFavorites) ? storedFavorites.map(String) : []);
    const storedLiked = readJSON(KEYS.liked, []);
    app.liked = new Set(Array.isArray(storedLiked) ? storedLiked.map(String) : []);

    setupStaticHero();
    setupShellInteractions();
    setupSuggestionCategories();
    setupAutoDirInputs(document);

    try {
      app.prompts = (await loadPrompts()).map(normalizePrompt);
    } catch (error) {
      app.prompts = clone(SEED_PROMPTS).map(normalizePrompt);
      toast('تعذّر تحميل بيانات المكتبة، وتم استخدام النسخة المدمجة.', 'info');
    }

    renderCategoryCards();
    renderCategoryPills();
    populateModels();
    updateGlobalNumbers();
    updateFavoritesCount();
    bindLibraryEvents();
    bindDialogEvents();
    bindSuggestionForm();
    refreshResults({ resetVisible: true });
    setupReveal();
    updateFooterYear();

    /* ----------------------------------------------------------------------
       Static hero
       ---------------------------------------------------------------------- */
    function setupStaticHero() {
      const arabic = document.getElementById('heroArabicText');
      const english = document.getElementById('heroEnglishText');
      if (arabic) {
        const dir = applyAutoDirection(arabic);
        setDirChip(document.getElementById('heroArChip'), dir);
      }
      if (english) {
        const dir = applyAutoDirection(english);
        setDirChip(document.getElementById('heroEnChip'), dir);
      }

      const heroCopy = document.getElementById('heroDemoCopy');
      if (heroCopy) {
        heroCopy.addEventListener('click', async () => {
          const text = arabic ? arabic.textContent.trim() : '';
          const succeeded = await copyText(text);
          if (succeeded) {
            animateCopyButton(heroCopy);
            heroCopy.innerHTML = `${icon('check', 11, 2.2)} تم النسخ`;
            setTimeout(() => {
              heroCopy.innerHTML = `${icon('copy', 11, 1.8)} انسخ وجرّب`;
            }, 1900);
            toast('تم نسخ المُنطلق. الصقه في نموذجك المفضل.');
          } else {
            toast('تعذّر النسخ التلقائي. حدّد النص وانسخه يدويًا.', 'error');
          }
        });
      }
    }

    function setDirChip(element, dir) {
      if (!element) return;
      element.dataset.dir = dir;
      element.textContent = dir === 'rtl' ? 'RTL' : 'LTR';
    }

    /* ----------------------------------------------------------------------
       Shell interactions
       ---------------------------------------------------------------------- */
    function setupShellInteractions() {
      const onScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        if (elements.siteHeader) elements.siteHeader.classList.toggle('scrolled', scrollTop > 12);
        if (elements.backToTop) elements.backToTop.classList.toggle('is-visible', scrollTop > 620);
        if (elements.readingProgress) {
          const percentage = height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0;
          elements.readingProgress.style.width = `${percentage}%`;
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      elements.backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      elements.headerFavoritesBtn?.addEventListener('click', () => {
        app.favoritesOnly = true;
        if (elements.favoritesToggle) {
          elements.favoritesToggle.classList.add('is-active');
          elements.favoritesToggle.setAttribute('aria-pressed', 'true');
        }
        refreshResults({ resetVisible: true });
        document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toast(app.favorites.size ? 'نعرض الآن مُنطلقاتك المحفوظة.' : 'لم تحفظ أي مُنطلق بعد. اضغط أيقونة الحفظ على أي بطاقة.', 'info');
      });

      if (elements.mobileMenuBtn && elements.mobileMenu) {
        elements.mobileMenuBtn.addEventListener('click', () => {
          const isOpen = !elements.mobileMenu.classList.contains('hidden');
          elements.mobileMenu.classList.toggle('hidden', isOpen);
          elements.mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
          elements.mobileMenuBtn.setAttribute('aria-label', !isOpen ? 'إغلاق القائمة' : 'فتح القائمة');
        });
        elements.mobileMenu.querySelectorAll('a').forEach((link) => {
          link.addEventListener('click', () => {
            elements.mobileMenu.classList.add('hidden');
            elements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
          });
        });
      }

      document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
          event.preventDefault();
          document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => elements.librarySearch?.focus(), 280);
        }
      });
    }

    /* ----------------------------------------------------------------------
       Categories
       ---------------------------------------------------------------------- */
    function categoryCount(categoryId) {
      return app.prompts.filter((prompt) => prompt.category === categoryId).length;
    }

    function renderCategoryCards() {
      if (!elements.categoriesGrid) return;
      elements.categoriesGrid.innerHTML = CATEGORIES.map((category, index) => {
        const count = categoryCount(category.id);
        return `
          <button class="category-card reveal reveal-delay-${Math.min(index % 3, 2)}" data-category="${category.id}" type="button"
            style="--cat-color:${category.color};--cat-tint:${category.tint}">
            <span class="count">${formatNumber(count)}</span>
            <span class="category-icon">${icon(category.icon, 19)}</span>
            <strong class="text-[13.5px] font-black relative z-[1]">${escapeHTML(category.label)}</strong>
            <span class="text-[10px] text-[var(--ink-faint)] leading-[1.7] mt-1 relative z-[1]">${escapeHTML(category.description)}</span>
            <span class="mt-3 text-[10px] font-bold text-[var(--cat-color)] flex items-center gap-1 relative z-[1]">
              استكشف
              ${icon('arrow', 11, 2)}
            </span>
          </button>
        `;
      }).join('');
      syncCategoryVisualState();
    }

    function renderCategoryPills() {
      if (!elements.categoryPills) return;
      elements.categoryPills.innerHTML = `
        <button class="pill" type="button" data-category="all">الكل</button>
        ${CATEGORIES.map((category) => `<button class="pill" type="button" data-category="${category.id}">${escapeHTML(category.short)}</button>`).join('')}
      `;
      syncCategoryVisualState();
    }

    function syncCategoryVisualState() {
      document.querySelectorAll('[data-category]').forEach((element) => {
        const isActive = element.dataset.category === app.category;
        if (element.classList.contains('category-card')) {
          element.classList.toggle('is-active', isActive);
          element.setAttribute('aria-pressed', String(isActive));
        } else if (element.classList.contains('pill')) {
          element.classList.toggle('is-active', isActive);
          element.setAttribute('aria-pressed', String(isActive));
        }
      });
    }

    function setCategory(categoryId, options = {}) {
      if (categoryId !== 'all' && !CATEGORY_MAP[categoryId]) return;
      app.category = categoryId;
      app.visible = 9;
      syncCategoryVisualState();
      refreshResults({ resetVisible: true });
      if (options.scroll) {
        document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    /* ----------------------------------------------------------------------
       Filters and rendering
       ---------------------------------------------------------------------- */
    function populateModels() {
      if (!elements.modelFilter) return;
      const currentValue = elements.modelFilter.value || 'all';
      const models = Array.from(new Set(app.prompts.map((prompt) => prompt.model).filter(Boolean)))
        .sort((a, b) => a.localeCompare(b, 'en'));
      elements.modelFilter.innerHTML = `
        <option value="all">كل النماذج</option>
        ${models.map((model) => `<option value="${escapeHTML(model)}">${escapeHTML(model)}</option>`).join('')}
      `;
      elements.modelFilter.value = models.includes(currentValue) ? currentValue : 'all';
      if (elements.modelFilter.value !== currentValue) app.model = 'all';
    }

    function getFilteredPrompts() {
      const query = normalizeSearch(app.query);
      let results = app.prompts.slice();

      if (app.category !== 'all') {
        results = results.filter((prompt) => prompt.category === app.category);
      }
      if (app.difficulty !== 'all') {
        results = results.filter((prompt) => prompt.difficulty === app.difficulty);
      }
      if (app.model !== 'all') {
        results = results.filter((prompt) => prompt.model === app.model);
      }
      if (app.favoritesOnly) {
        results = results.filter((prompt) => app.favorites.has(String(prompt.id)));
      }
      if (query) {
        results = results.filter((prompt) => {
          const haystack = normalizeSearch([
            prompt.title,
            prompt.description,
            prompt.category,
            CATEGORY_MAP[prompt.category]?.label || '',
            prompt.prompt_text,
            prompt.explanation,
            prompt.example_result,
            prompt.example_type,
            prompt.model,
            prompt.difficulty,
            prompt.tags.join(' ')
          ].join(' '));
          return query.split(' ').every((word) => haystack.includes(word));
        });
      }

      if (app.sort === 'likes-desc') {
        results.sort((a, b) => Number(b.likes) - Number(a.likes));
      } else if (app.sort === 'likes-asc') {
        results.sort((a, b) => Number(a.likes) - Number(b.likes));
      } else if (app.sort === 'title') {
        results.sort((a, b) => String(a.title).localeCompare(String(b.title), 'ar'));
      }

      return results;
    }

    function refreshResults(options = {}) {
      if (options.resetVisible) app.visible = 9;
      const results = getFilteredPrompts();
      renderCards(results);
      renderActiveFilters();
      if (elements.resultsCount) elements.resultsCount.textContent = formatNumber(results.length);

      if (elements.emptyState) {
        elements.emptyState.classList.toggle('hidden', results.length !== 0);
      }
      if (elements.promptGrid) {
        elements.promptGrid.classList.toggle('hidden', results.length === 0);
      }
      if (elements.loadMoreBtn) {
        elements.loadMoreBtn.classList.toggle('hidden', results.length <= app.visible);
      }
    }

    function categoryStyle(categoryId) {
      const category = CATEGORY_MAP[categoryId] || CATEGORIES[0];
      return { category, style: `--cat-color:${category.color};--cat-tint:${category.tint}` };
    }

    function renderCards(results) {
      if (!elements.promptGrid) return;
      const visiblePrompts = results.slice(0, app.visible);

      if (!visiblePrompts.length) {
        elements.promptGrid.innerHTML = '';
        return;
      }

      elements.promptGrid.innerHTML = visiblePrompts.map((prompt) => {
        const { category, style } = categoryStyle(prompt.category);
        const isFavorite = app.favorites.has(String(prompt.id));
        const isLiked = app.liked.has(String(prompt.id));
        const tags = prompt.tags.slice(0, 3).map((tag) => `<span class="tag">${escapeHTML(tag)}</span>`).join('');
        const moreTags = prompt.tags.length > 3
          ? `<span class="tag">+${prompt.tags.length - 3}</span>`
          : '';

        return `
          <article class="prompt-card" data-id="${escapeHTML(prompt.id)}" aria-labelledby="card-title-${escapeHTML(prompt.id)}">
            <div class="flex items-start justify-between gap-3">
              <span class="cat-badge" style="${style}">
                ${icon(category.icon, 11, 1.8)}
                ${escapeHTML(category.label)}
              </span>
              <button class="fav-btn ${isFavorite ? 'is-active' : ''}" type="button" data-action="favorite"
                aria-label="${isFavorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}" aria-pressed="${isFavorite}">
                ${icon('bookmark', 14, 1.8)}
              </button>
            </div>
            <h3 class="card-title" id="card-title-${escapeHTML(prompt.id)}">${escapeHTML(prompt.title)}</h3>
            <p class="card-desc">${escapeHTML(prompt.description)}</p>
            <div class="prompt-preview prompt-content clamp" dir="auto" style="unicode-bidi:plaintext;text-align:start;" data-preview-text>${escapeHTML(prompt.prompt_text)}</div>
            <div class="flex flex-wrap items-center gap-1.5 mt-3">
              ${tags}${moreTags}
            </div>
            <div class="card-actions">
              <div class="flex items-center gap-2.5 flex-wrap">
                <span class="meta-chip">${icon('spark', 10, 1.8)} ${escapeHTML(prompt.model)}</span>
                <span class="w-1 h-1 rounded-full bg-[#d4cabb]"></span>
                <span class="meta-chip">${escapeHTML(prompt.difficulty)}</span>
              </div>
              <div class="flex items-center gap-0.5">
                <button class="like-btn ${isLiked ? 'is-active' : ''}" type="button" data-action="like"
                  aria-label="إعجاب" aria-pressed="${isLiked}">
                  ${icon('heart', 13, 1.8)}
                  <span data-like-count>${formatNumber(prompt.likes)}</span>
                </button>
                <button class="copy-btn" type="button" data-action="copy" aria-label="نسخ نص المُنطلق">
                  ${icon('copy', 13, 1.8)}
                  <span class="copy-label">نسخ</span>
                </button>
                <button class="details-btn" type="button" data-action="open" aria-label="عرض تفاصيل المُنطلق">
                  ${icon('eye', 13, 1.8)}
                </button>
              </div>
            </div>
          </article>
        `;
      }).join('');

      /* Apply auto direction after insertion */
      elements.promptGrid.querySelectorAll('[data-preview-text]').forEach((preview) => {
        applyAutoDirection(preview, preview.textContent);
      });
    }

    function renderActiveFilters() {
      if (!elements.activeFilters) return;
      const chips = [];
      if (app.query) {
        chips.push(`<span class="active-chip">بحث: ${escapeHTML(app.query)} <button type="button" data-remove-filter="query" aria-label="إزالة فلتر البحث">${icon('close', 10, 2)}</button></span>`);
      }
      if (app.category !== 'all') {
        chips.push(`<span class="active-chip">${escapeHTML(CATEGORY_MAP[app.category]?.label || app.category)} <button type="button" data-remove-filter="category" aria-label="إزالة فلتر التصنيف">${icon('close', 10, 2)}</button></span>`);
      }
      if (app.difficulty !== 'all') {
        chips.push(`<span class="active-chip">المستوى: ${escapeHTML(app.difficulty)} <button type="button" data-remove-filter="difficulty" aria-label="إزالة فلتر الصعوبة">${icon('close', 10, 2)}</button></span>`);
      }
      if (app.model !== 'all') {
        chips.push(`<span class="active-chip">${escapeHTML(app.model)} <button type="button" data-remove-filter="model" aria-label="إزالة فلتر النموذج">${icon('close', 10, 2)}</button></span>`);
      }
      if (app.favoritesOnly) {
        chips.push(`<span class="active-chip">المفضلة <button type="button" data-remove-filter="favorites" aria-label="إزالة فلتر المفضلة">${icon('close', 10, 2)}</button></span>`);
      }
      elements.activeFilters.innerHTML = chips.join('');

      if (app.favoritesToggle) {
        app.favoritesToggle.classList.toggle('is-active', app.favoritesOnly);
        app.favoritesToggle.setAttribute('aria-pressed', String(app.favoritesOnly));
      }
    }

    function clearAllFilters() {
      app.query = '';
      app.category = 'all';
      app.difficulty = 'all';
      app.model = 'all';
      app.sort = 'default';
      app.favoritesOnly = false;
      app.visible = 9;
      if (elements.librarySearch) elements.librarySearch.value = '';
      if (elements.heroSearch) elements.heroSearch.value = '';
      if (elements.difficultyFilter) elements.difficultyFilter.value = 'all';
      if (elements.modelFilter) elements.modelFilter.value = 'all';
      if (elements.sortFilter) elements.sortFilter.value = 'default';
      syncCategoryVisualState();
      refreshResults({ resetVisible: true });
    }

    function updateGlobalNumbers() {
      const total = app.prompts.length;
      const likes = app.prompts.reduce((sum, prompt) => sum + (Number(prompt.likes) || 0), 0);
      const statTotal = document.getElementById('statTotal');
      const statLikes = document.getElementById('statLikes');
      if (statTotal) statTotal.textContent = formatNumber(total);
      if (statLikes) statLikes.textContent = formatNumber(likes);
      if (elements.resultsCount) elements.resultsCount.textContent = formatNumber(total);
      const categoryCounts = document.querySelectorAll('#categoriesGrid .count');
      categoryCounts.forEach((countElement, index) => {
        const category = CATEGORIES[index];
        if (category) countElement.textContent = formatNumber(categoryCount(category.id));
      });
    }

    function updateFavoritesCount() {
      if (elements.favoritesCount) elements.favoritesCount.textContent = formatNumber(app.favorites.size);
    }

    function persistFavorites() {
      writeJSON(KEYS.favorites, Array.from(app.favorites));
      updateFavoritesCount();
    }

    function persistLikes() {
      writeJSON(KEYS.liked, Array.from(app.liked));
      savePrompts(app.prompts);
    }

    function findPrompt(id) {
      return app.prompts.find((prompt) => String(prompt.id) === String(id));
    }

    function toggleFavorite(id, options = {}) {
      const prompt = findPrompt(id);
      if (!prompt) return;
      if (app.favorites.has(String(id))) {
        app.favorites.delete(String(id));
        if (!options.silent) toast('أُزيل المُنطلق من المفضلة.', 'info');
      } else {
        app.favorites.add(String(id));
        if (!options.silent) toast('حُفظ المُنطلق في المفضلة.');
      }
      persistFavorites();
      refreshResults();
      if (app.currentId && String(app.currentId) === String(id)) updateDetailFavoriteState();
    }

    function toggleLike(id) {
      const prompt = findPrompt(id);
      if (!prompt) return;
      if (app.liked.has(String(id))) {
        app.liked.delete(String(id));
        prompt.likes = Math.max(0, (Number(prompt.likes) || 0) - 1);
        toast('أُزيل إعجابك.', 'info');
      } else {
        app.liked.add(String(id));
        prompt.likes = (Number(prompt.likes) || 0) + 1;
        toast('شكرًا لك، أضفت إعجابك.');
      }
      persistLikes();
      updateGlobalNumbers();
      refreshResults();
      if (app.currentId && String(app.currentId) === String(id)) updateDetailLikeState();
    }

    async function copyPrompt(prompt, button) {
      if (!prompt) return;
      const succeeded = await copyText(prompt.prompt_text);
      if (succeeded) {
        animateCopyButton(button);
        toast('تم نسخ المُنطلق. جاهز للصق في نموذجك.');
      } else {
        toast('تعذّر النسخ التلقائي. افتح التفاصيل وحدّد النص يدويًا.', 'error');
      }
    }

    /* ----------------------------------------------------------------------
       Library event binding
       ---------------------------------------------------------------------- */
    function bindLibraryEvents() {
      /* Category cards: filter + scroll */
      elements.categoriesGrid?.addEventListener('click', (event) => {
        const card = event.target.closest('[data-category]');
        if (!card) return;
        setCategory(card.dataset.category, { scroll: true });
      });

      /* Pills: filter only */
      elements.categoryPills?.addEventListener('click', (event) => {
        const pill = event.target.closest('[data-category]');
        if (!pill) return;
        setCategory(pill.dataset.category);
      });

      /* Search */
      const runDebouncedSearch = debounce(() => {
        app.query = elements.librarySearch?.value.trim() || '';
        app.visible = 9;
        refreshResults({ resetVisible: true });
      }, 180);

      elements.librarySearch?.addEventListener('input', () => {
        if (elements.heroSearch) elements.heroSearch.value = elements.librarySearch.value;
        runDebouncedSearch();
      });

      elements.heroSearch?.addEventListener('input', () => {
        if (elements.librarySearch) elements.librarySearch.value = elements.heroSearch.value;
        app.query = elements.heroSearch.value.trim();
        refreshResults({ resetVisible: true });
      });

      elements.heroSearchForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        app.query = elements.heroSearch?.value.trim() || '';
        app.category = 'all';
        if (elements.librarySearch) elements.librarySearch.value = app.query;
        syncCategoryVisualState();
        refreshResults({ resetVisible: true });
        document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      document.querySelectorAll('[data-quick-search]').forEach((button) => {
        button.addEventListener('click', () => {
          app.query = button.dataset.quickSearch || '';
          app.category = 'all';
          if (elements.heroSearch) elements.heroSearch.value = app.query;
          if (elements.librarySearch) elements.librarySearch.value = app.query;
          syncCategoryVisualState();
          refreshResults({ resetVisible: true });
          document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });

      /* Selects */
      elements.difficultyFilter?.addEventListener('change', () => {
        app.difficulty = elements.difficultyFilter.value;
        refreshResults({ resetVisible: true });
      });
      elements.modelFilter?.addEventListener('change', () => {
        app.model = elements.modelFilter.value;
        refreshResults({ resetVisible: true });
      });
      elements.sortFilter?.addEventListener('change', () => {
        app.sort = elements.sortFilter.value;
        refreshResults();
      });

      elements.favoritesToggle?.addEventListener('click', () => {
        app.favoritesOnly = !app.favoritesOnly;
        refreshResults({ resetVisible: true });
      });

      elements.clearFilters?.addEventListener('click', clearAllFilters);
      elements.emptyClearBtn?.addEventListener('click', clearAllFilters);

      elements.loadMoreBtn?.addEventListener('click', () => {
        app.visible += 6;
        refreshResults();
      });

      /* Active filter removal */
      elements.activeFilters?.addEventListener('click', (event) => {
        const removeButton = event.target.closest('[data-remove-filter]');
        if (!removeButton) return;
        const filter = removeButton.dataset.removeFilter;
        if (filter === 'query') {
          app.query = '';
          if (elements.librarySearch) elements.librarySearch.value = '';
          if (elements.heroSearch) elements.heroSearch.value = '';
        } else if (filter === 'category') {
          app.category = 'all';
          syncCategoryVisualState();
        } else if (filter === 'difficulty') {
          app.difficulty = 'all';
          if (elements.difficultyFilter) elements.difficultyFilter.value = 'all';
        } else if (filter === 'model') {
          app.model = 'all';
          if (elements.modelFilter) elements.modelFilter.value = 'all';
        } else if (filter === 'favorites') {
          app.favoritesOnly = false;
        }
        refreshResults({ resetVisible: true });
      });

      /* Cards */
      elements.promptGrid?.addEventListener('click', (event) => {
        const card = event.target.closest('[data-id]');
        if (!card) return;
        const id = card.dataset.id;
        const actionButton = event.target.closest('[data-action]');

        if (!actionButton) {
          openPrompt(id);
          return;
        }

        const action = actionButton.dataset.action;
        if (action === 'favorite') {
          toggleFavorite(id);
        } else if (action === 'like') {
          toggleLike(id);
        } else if (action === 'copy') {
          copyPrompt(findPrompt(id), actionButton);
        } else if (action === 'open') {
          openPrompt(id);
        }
      });

      /* Whole card keyboard opening when the card itself has focus */
      elements.promptGrid?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.target.classList.contains('prompt-card')) {
          openPrompt(event.target.dataset.id);
        }
      });
    }

    /* ----------------------------------------------------------------------
       Detail dialog
       ---------------------------------------------------------------------- */
    function openPrompt(id) {
      const prompt = findPrompt(id);
      if (!prompt || !elements.promptDialog) return;
      app.currentId = String(prompt.id);

      const categoryData = categoryStyle(prompt.category);
      const category = categoryData.category;

      const chip = document.getElementById('detailCategoryChip');
      if (chip) {
        chip.innerHTML = `<span class="cat-badge" style="${categoryData.style};padding:6px 10px;font-size:10px;">${icon(category.icon, 12, 1.8)} ${escapeHTML(category.label)}</span>`;
      }

      const iconElement = document.getElementById('detailIcon');
      if (iconElement) {
        iconElement.style.color = category.color;
        iconElement.style.background = category.tint;
        iconElement.innerHTML = icon(category.icon, 21);
      }

      setText('detailTitle', prompt.title);
      setText('detailDescription', prompt.description);
      setText('detailExampleType', prompt.example_type || 'نص');

      const meta = document.getElementById('detailMeta');
      if (meta) {
        meta.innerHTML = `
          <span class="meta-chip" style="background:#f4f1e8;border:1px solid #ebe4d7;border-radius:7px;padding:4px 8px;">${icon('spark', 11, 1.8)} ${escapeHTML(prompt.model)}</span>
          <span class="meta-chip" style="background:#f4f1e8;border:1px solid #ebe4d7;border-radius:7px;padding:4px 8px;">${icon('chart', 11, 1.8)} ${escapeHTML(prompt.difficulty)}</span>
          <span class="meta-chip" style="background:#f4f1e8;border:1px solid #ebe4d7;border-radius:7px;padding:4px 8px;">${icon('layers', 11, 1.8)} ${escapeHTML(prompt.category ? category.label : '')}</span>
        `;
      }

      const promptElement = document.getElementById('detailPrompt');
      if (promptElement) {
        promptElement.textContent = prompt.prompt_text;
        promptElement.classList.remove('code-content');
        const dir = applyAutoDirection(promptElement, prompt.prompt_text);
        setDirChip(document.getElementById('detailPromptDir'), dir);
      }

      const explanationElement = document.getElementById('detailExplanation');
      if (explanationElement) {
        explanationElement.textContent = prompt.explanation || 'لا يوجد شرح مضاف لهذا المُنطلق بعد.';
        const dir = applyAutoDirection(explanationElement, prompt.explanation || '');
        setDirChip(document.getElementById('detailExplanationDir'), dir);
      }

      const exampleElement = document.getElementById('detailExample');
      if (exampleElement) {
        exampleElement.textContent = prompt.example_result || 'لم يُضف مثال على النتيجة بعد.';
        exampleElement.classList.toggle('code-content', prompt.example_type === 'كود');
        const dir = applyAutoDirection(exampleElement, prompt.example_result || '');
        setDirChip(document.getElementById('detailExampleDir'), dir);
      }

      const tagsElement = document.getElementById('detailTags');
      if (tagsElement) {
        tagsElement.innerHTML = prompt.tags.map((tag) => `<span class="detail-tag">${escapeHTML(tag)}</span>`).join('');
      }

      updateDetailLikeState();
      updateDetailFavoriteState();

      const dialogBody = elements.promptDialog.querySelector('.dialog-body');
      if (dialogBody) dialogBody.scrollTop = 0;

      if (typeof elements.promptDialog.showModal === 'function') {
        if (!elements.promptDialog.open) elements.promptDialog.showModal();
      } else {
        elements.promptDialog.setAttribute('open', '');
      }
      document.body.style.overflow = 'hidden';
    }

    function setText(id, value) {
      const element = document.getElementById(id);
      if (element) element.textContent = value == null ? '' : value;
    }

    function updateDetailLikeState() {
      const prompt = findPrompt(app.currentId);
      if (!prompt) return;
      const button = document.getElementById('detailLikeBtn');
      const count = document.getElementById('detailLikeCount');
      const isLiked = app.liked.has(String(prompt.id));
      if (button) {
        button.classList.toggle('is-active', isLiked);
        button.setAttribute('aria-pressed', String(isLiked));
      }
      if (count) count.textContent = formatNumber(prompt.likes);
    }

    function updateDetailFavoriteState() {
      const prompt = findPrompt(app.currentId);
      if (!prompt) return;
      const button = document.getElementById('detailFavBtn');
      const isFavorite = app.favorites.has(String(prompt.id));
      if (button) {
        button.classList.toggle('is-active', isFavorite);
        button.setAttribute('aria-pressed', String(isFavorite));
        const label = button.querySelector('span:last-child');
        if (label) label.textContent = isFavorite ? 'محفوظ' : 'حفظ';
      }
    }

    function closePromptDialog() {
      if (!elements.promptDialog) return;
      if (typeof elements.promptDialog.close === 'function') {
        if (elements.promptDialog.open) elements.promptDialog.close();
      } else {
        elements.promptDialog.removeAttribute('open');
      }
      document.body.style.overflow = '';
      app.currentId = null;
    }

    function bindDialogEvents() {
      if (!elements.promptDialog) return;

      elements.promptDialog.querySelectorAll('[data-close-dialog]').forEach((button) => {
        button.addEventListener('click', closePromptDialog);
      });

      elements.promptDialog.addEventListener('click', (event) => {
        if (event.target === elements.promptDialog) closePromptDialog();
      });

      elements.promptDialog.addEventListener('close', () => {
        document.body.style.overflow = '';
        app.currentId = null;
      });

      document.getElementById('detailLikeBtn')?.addEventListener('click', () => {
        if (app.currentId) toggleLike(app.currentId);
      });

      document.getElementById('detailFavBtn')?.addEventListener('click', () => {
        if (app.currentId) toggleFavorite(app.currentId);
      });

      document.querySelectorAll('[data-copy-detail]').forEach((button) => {
        button.addEventListener('click', () => {
          const prompt = findPrompt(app.currentId);
          if (prompt) copyPrompt(prompt, button);
        });
      });
    }

    /* ----------------------------------------------------------------------
       Suggestion form
       ---------------------------------------------------------------------- */
    function setupSuggestionCategories() {
      if (!elements.suggestionCategory) return;
      elements.suggestionCategory.innerHTML = CATEGORIES
        .map((category) => `<option value="${category.id}">${escapeHTML(category.label)}</option>`)
        .join('');
    }

    function bindSuggestionForm() {
      if (!elements.suggestionForm) return;

      elements.suggestionForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('suggestTitle')?.value.trim() || '';
        const category = elements.suggestionCategory?.value || 'writing';
        const author = document.getElementById('suggestAuthor')?.value.trim() || '';
        const model = document.getElementById('suggestModel')?.value || 'ChatGPT';
        const promptText = document.getElementById('suggestPrompt')?.value.trim() || '';
        const explanation = document.getElementById('suggestExplanation')?.value.trim() || '';
        const exampleResult = document.getElementById('suggestExample')?.value.trim() || '';

        if (!title || !promptText) {
          toast('أضف اسم المُنطلق ونصه قبل الإرسال.', 'error');
          if (!title) document.getElementById('suggestTitle')?.focus();
          else document.getElementById('suggestPrompt')?.focus();
          return;
        }

        const suggestions = getSuggestions();
        const suggestion = {
          id: uid('s'),
          title,
          category: CATEGORY_MAP[category] ? category : 'writing',
          author,
          model,
          prompt_text: promptText,
          explanation,
          example_result: exampleResult,
          status: 'pending',
          created_at: new Date().toISOString()
        };

        suggestions.unshift(suggestion);
        if (!saveSuggestions(suggestions)) {
          toast('تعذّر حفظ الاقتراح. تحقّق من مساحة التخزين في المتصفح.', 'error');
          return;
        }

        elements.suggestionForm.reset();
        document.querySelectorAll('#suggestionForm textarea[data-auto-dir]').forEach(syncTextareaDirection);
        if (elements.suggestionSuccess) {
          elements.suggestionSuccess.classList.remove('hidden');
          elements.suggestionSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => elements.suggestionSuccess?.classList.add('hidden'), 11000);
        }
        toast('شكرًا لك! حُفظ اقتراحك وسيظهر في لوحة التحكم.');
      });
    }

    /* ----------------------------------------------------------------------
       Reveal animations
       ---------------------------------------------------------------------- */
    function setupReveal() {
      const revealElements = document.querySelectorAll('.reveal');
      if (!('IntersectionObserver' in window)) {
        revealElements.forEach((element) => element.classList.add('is-visible'));
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      revealElements.forEach((element) => observer.observe(element));
    }

    function updateFooterYear() {
      const year = document.getElementById('footerYear');
      if (year) year.textContent = String(new Date().getFullYear());
    }

    /* Keep visitor data fresh when admin changes it in another tab */
    window.addEventListener('storage', (event) => {
      if (event.key === KEYS.prompts && event.newValue) {
        try {
          const nextPrompts = JSON.parse(event.newValue);
          if (Array.isArray(nextPrompts)) {
            app.prompts = nextPrompts.map(normalizePrompt);
            renderCategoryCards();
            populateModels();
            updateGlobalNumbers();
            refreshResults();
            if (app.currentId) {
              const current = findPrompt(app.currentId);
              if (current) openPrompt(current.id);
            }
          }
        } catch (error) {
          /* ignore malformed cross-tab data */
        }
      }
      if (event.key === KEYS.favorites && event.newValue) {
        try {
          const favorites = JSON.parse(event.newValue);
          app.favorites = new Set(Array.isArray(favorites) ? favorites.map(String) : []);
          updateFavoritesCount();
          refreshResults();
        } catch (error) {
          /* ignore */
        }
      }
    });
  }
})();

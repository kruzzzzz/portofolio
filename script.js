(function () {
  // Mobile navigation toggle
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#navMenu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when clicking a link (mobile UX)
    menu.querySelectorAll("a[href^='#']").forEach((a) => {
      a.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const clickedInside = menu.contains(target) || toggle.contains(target);
      if (!clickedInside && menu.classList.contains("open")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Active nav item on scroll
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-menu a[href^='#']"));

  function setActiveNav(id) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${id}`) link.classList.add("is-active");
      else link.classList.remove("is-active");
    });
  }

  if (sections.length && navLinks.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActiveNav(visible.target.id);
      },
      {
        root: null,
        threshold: [0.15, 0.25, 0.5],
        rootMargin: "-20% 0px -70% 0px",
      }
    );

    sections.forEach((s) => obs.observe(s));
  }

// ---------------------------------------------
// Hero Carousel
// ---------------------------------------------
(function () {
  const root = document.querySelector('[data-carousel="hero"]');
  if (!root) return;

  const track = root.querySelector(".carousel-track");
  const slides = Array.from(root.querySelectorAll(".carousel-slide"));
  const btnPrev = root.querySelector("[data-carousel-prev]");
  const btnNext = root.querySelector("[data-carousel-next]");
  const dotsWrap = root.querySelector("[data-carousel-dots]");
  const viewport = root.querySelector(".carousel-viewport");

  if (!track || slides.length === 0) return;

  let index = 0;
  let timer = null;

  // Build dots
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "carousel-dot";
    b.setAttribute("aria-label", `Go to slide ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    dotsWrap?.appendChild(b);
    return b;
  });

  function setActiveDot() {
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    setActiveDot();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  btnNext?.addEventListener("click", next);
  btnPrev?.addEventListener("click", prev);

  // Keyboard support when focused
  viewport?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Autoplay (optional)
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function startAuto() {
    if (prefersReduced) return;
    stopAuto();
    timer = window.setInterval(next, 4500);
  }
  function stopAuto() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  // Pause on hover/focus
  root.addEventListener("mouseenter", stopAuto);
  root.addEventListener("mouseleave", startAuto);
  root.addEventListener("focusin", stopAuto);
  root.addEventListener("focusout", startAuto);

  // Swipe support (mobile)
  let startX = 0;
  let isDown = false;

  viewport?.addEventListener("pointerdown", (e) => {
    isDown = true;
    startX = e.clientX;
    viewport.setPointerCapture?.(e.pointerId);
  });

  viewport?.addEventListener("pointerup", (e) => {
    if (!isDown) return;
    isDown = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
  });

  viewport?.addEventListener("pointercancel", () => {
    isDown = false;
  });

  // Init
  goTo(0);
  startAuto();
})();

  // Demo contact form (no backend)
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const payload = {
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        message: String(data.get("message") || "").trim(),
      };

      const formatted = `Name: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}\n`;

      const copied = await copyToClipboard(formatted);

      if (note) {
        note.textContent = copied
          ? "Copied to clipboard. Paste it into your email/DM."
          : "Copy failed. Please manually copy the text from your inputs.";
      }

      // simple reset after submission
      form.reset();
      setTimeout(() => {
        if (note) note.textContent = "This is a demo form (no backend). It will copy your message to clipboard.";
      }, 4000);
    });
  }
})();

// ---------------------------------------------
// Projects Modal
// ---------------------------------------------
const projectData = {
  "dl-classification": {
    title: "Classification of Online Gambling and Toxic from YouTube Comments",
    category: "Data Modelling",
    description:
      "Developing a deep learning-based text classification model to detect and categorize toxic and gambling-related comments on YouTube. The initiative starts from the increasing spread of online gambling promotions and toxic remarks on social media, which disrupt healthy online interactions. Focusing on the Indonesian digital landscape, where YouTube holds the largest share of social media users. Using a labeled dataset of user comments, the model was designed to classify inputs into three categories: toxic, gambling-related, and neutral. ",
    tech: ["Python", "Deep Learning", "Text Classification", "Model Tuning", "Deployment", "Microsoft Excel"],
    features: [
      "Processed and analyzed 20.000+ rows of comment data.",
      "Conducted data preparation and manual labeling of comment datasets to ensure reliable classification results.",
      "Built and fine-tuned deep learning model using IndoBERT and LSTM, achieving 95% accuracy.",
    ],
    links: [
      { label: "Website", url: "https://online-gambling-detection.streamlit.app/" },
      { label: "Source Code", url: "https://colab.research.google.com/drive/1apcOoP328sBTWncYFrZ6EBNVzKMz-Y2g?usp=sharing" }
    ],
    images: [
      { src: "assets/dl-classification/dl-1.png", alt: "Comments Distribution", caption: "Comments Distribution" },
      { src: "assets/dl-classification/dl-2.png", alt: "Comments Sample", caption: "Comments Sample" },
      { src: "assets/dl-classification/dl-3.png", alt: "Data Distribution", caption: "Data Distribution" },
      { src: "assets/dl-classification/dl-4.png", alt: "Test Classification Report Result", caption: "Test Classification Report Result" },
      { src: "assets/dl-classification/dl-5.png", alt: "Confusion Matrix", caption: "Confusion Matrix" }
    ]
  },

  "gizmo": {
    title: "GizmoGo - Electronic Rental Application Design",
    category: "Prototyping",
    description:
      "GizmoGo is a mobile application designed to provide a sustainable solution to impulsive buying, hoarding, and the growing e-waste problem in Indonesia. The platform connects two types of users: owners, who can earn extra income by renting out unused electronic devices; and renters, who can access quality electronics at affordable prices. Key features such as ratings and reviews, optional insurance, digital rental agreements, delivery service, and an AI chatbot enhance user trust and convenience. Developed using the Systems Development Life Cycle (SDLC), the project involved user requirements analysis, UI/UX design, and system testing. Market analysis using Business Model Canvas and SWOT frameworks demonstrated GizmoGo’s strong competitiveness and growth potential in the B2C market, emphasizing the value of digitalized rental systems as a sustainable business model.",
    tech: ["UI/UX Design", "Prototyping", "Figma",],
    features: [
      "Conducted feature research and analyzed 7 user needs to ensure relevance to modern digital behavior.",
      "Performed competitor analysis to identify key differentiators and strategic advantages.",
      "Designed 5 key interfaces, including item detail and order pages, order history, chat system, and order confirmation screens.",
    ],
    links: [
      { label: "Prototype", url: "https://www.figma.com/file/TVUbROyc849AdNUINqp9tX/GizmoGo" },
      { label: "Video", url: "https://www.youtube.com/watch?v=N-GtDz9iRWI" }
    ],
    images: [
      { src: "assets/gizmo/gizmo-1.png", alt: "Home", caption: "Home" },
      { src: "assets/gizmo/gizmo-2.png", alt: "Product Detail", caption: "Product Detail" },
      { src: "assets/gizmo/gizmo-3.png", alt: "Product Rating & Review", caption: "Product Rating & Review" },
      { src: "assets/gizmo/gizmo-4.png", alt: "Order Confirmation", caption: "Order Confirmation" },
      { src: "assets/gizmo/gizmo-5.png", alt: "Chatbot", caption: "Chatbot" },
      { src: "assets/gizmo/gizmo-6.png", alt: "Chatbot", caption: "Letter of Aggrement" },
    ]
  },

  "socio-dashboard": {
    title: "Indonesia Socio-Economic Dashboards",
    category: "Data Visualization",
    description:
      "Developed interactive dashboards from multiple data sources to represent socio-economic well-being across key indicators such as food security, quality of life, and healthcare equity.",
    tech: ["ETL", "Data Visualization", "Business Intelligence", "Dashboard Building", "Tableau", "Microsoft Excel"],
    features: [
      "Collected and validated datasets from 3 trusted national and international sources to support visualization development.",
      "Created and analyzed insights for the Food Security and Nutritional Consumption dashboard.",
    ],
    links: [
      { label: "Video", url: "https://www.youtube.com/watch?v=f5u4z10Z7Vg" },
      { label: "Food Security and Nutritional Consumption Dashboard", url: "https://public.tableau.com/app/profile/cristiano.ronaldo8148/viz/FoodSecurityandNutritionalConsumption/DashboardKetahananPangandanKonsumsiGizi" },
      { label: "Economic and Social Welfare Dashboard", url: "https://public.tableau.com/app/profile/cristiano.ronaldo8148/viz/EconomicandSocialWelfare/DashboardEkonomidanKesejahteraanSosial" },
      { label: "Health Equity Dashboard", url: "https://public.tableau.com/app/profile/cristiano.ronaldo8148/viz/HealthEquity_17621819364650/DashboardKesehatan" }
    ],
    images: [
      { src: "assets/dashboard/dashboard-1.png", alt: "Economic and Social Welfare", caption: "Economic and Social Welfare" },
      { src: "assets/dashboard/dashboard-2.png", alt: "Food Security and Nutritional Consumption", caption: "Food Security and Nutritional Consumption" },
      { src: "assets/dashboard/dashboard-3.png", alt: "Health Equity", caption: "Health Equity" },
    ]
  },

  "llm-response": {
    title: "LLM Response Optimization Through Fine-Tuning of Preference Classification Model Based on ChatBot Arena Data",
    category: "Data Modelling",
    description:
      "This project focuses on evaluating and optimizing user preferences for responses generated by LLM using data from the ChatBot Arena. Conducted as part of the Kaggle-hosted LLM Classification Finetuning competition, the goal was to predict which of two AI-generated responses users preferred or whether both were equally favored. The research followed the CRISP-DM methodology, covering data exploration, preparation, modeling, and evaluation. Textual data were vectorized using TF-IDF, and various classification models from traditional machine learning to deep learning approaches were tested. Among them, CatBoost initially produced the best performance. Further improvement was achieved by developing a VotingClassifier ensemble that combined CatBoost, XGBoost, LightGBM, and Random Forest, resulting in the highest accuracy and lowest log loss, ranking the team in the top 35% of all participants.",
    tech: ["Python", "Machine Learning", "Deep Learning", "Text Classification", "Model Tuning"],
    features: [
      "Conducted data preprocessing, cleaning, and feature engineering for model training.",
      "Built and fine-tuned multiple machine learning models, including Random Forest, CatBoost, XGBoost, AdaBoost, and LightGBM."
    ],
    links: [
      { label: "Source Code", url: "https://colab.research.google.com/drive/1p9gKwy2ng1kFjt1QP4FqHZh2LEb0QsXb?usp=sharing" }
    ],
    images: [
      { src: "assets/llm-response/llm-1.png", alt: "Contest Ranking", caption: "Contest Ranking" },
      { src: "assets/llm-response/llm-2.png", alt: "Best Model Evaluation", caption: "Best Model Evaluation" },
      { src: "assets/llm-response/llm-3.png", alt: "Feature Engineering", caption: "Feature Engineering" },
      { src: "assets/llm-response/llm-4.png", alt: "Winner Category Distribution", caption: "Winner Category Distribution" },
      { src: "assets/llm-response/llm-5.png", alt: "Top 10 LLM Model", caption: "Top 10 LLM Model" }
    ]
  },

  "boarding-house": {
    title: "MyKosHub - Boarding House Management Desktop App",
    category: "Desktop Application",
    description:
      "It was known that manual boarding house management often results in disorganized workflows, communication barriers, and inconvenience for tenants. To address these challenges, our team developed MyKosHub, a desktop application designed to help boarding house owners manage their properties more efficiently while improving tenant experience. The system includes features such as room and service management, financial reporting, complaint submission, payment integration, and an admin dashboard, allowing both owners and tenants to access services and information anytime, anywhere.",
    tech: ["C#", "SQL", "Data Visualization", "Crystal Report", "OOP", "Visual Studio"],
    features: [
      "Planned and structured the system’s core features and workflow to ensure smooth interactions between tenants and owners.",
      "Developed user registration and login pages, as well as admin and tenant dashboards for managing services and information.",
      "Implemented problem reporting and service management modules to support tenant requests."
    ],
    links: [
      { label: "Source Code", url: "https://github.com/kruzzzzz/MyKosHub" },
      { label: "Video", url: "https://drive.google.com/file/d/11K3BAi6Hkq8fEi6Z6f25zcCdGZF3PhtT/view?usp=sharing" }
    ],
    images: [
      { src: "assets/mykoshub/mykoshub-1.png", alt: "Owner Homepage", caption: "Owner Homepage" },
      { src: "assets/mykoshub/mykoshub-2.png", alt: "Payment Management", caption: "Payment Management" },
      { src: "assets/mykoshub/mykoshub-3.png", alt: "Tenant Homepage", caption: "Tenant Homepage" },
      { src: "assets/mykoshub/mykoshub-4.png", alt: "Admin Homepage", caption: "Admin Homepage" },
    ]
  },

  "reservego": {
    title: "ReserveGo - Restaurant Reservation Platform",
    category: "Web Development",
    description:
      "ReserveGo is a web-based reservation system designed to replace traditional manual booking methods in restaurants, aiming to enhance service efficiency and improve customer satisfaction. Developed using Oracle APEX, this platform serves as a bridge between customers and restaurants, allowing users to make table reservations, manage profiles, view order history, and provide feedback through ratings and reviews. By digitalizing the reservation process, ReserveGo minimizes waiting times and reduces order recording errors, offering a seamless dining experience.",
    tech: ["SQL", "Oracle APEX", "Oracle Database", "Business Intelligence"],
    features: [
      "Designed the system’s core features and workflows through use case diagrams, site maps, and flowcharts.",
      "Developed the database structure to support efficient data management and user interactions.",
      "Built and implemented key modules, including user registration and login, profile management, order history tracking, and feedback submission (ratings & reviews)."
    ],
    links: [
      { label: "Website", url: "https://oracleapex.com/ords/r/crisdb/reservego/login" },
      { label: "Video", url: "https://www.youtube.com/watch?v=edyhoGDoMTs" }
    ],
    images: [
      { src: "assets/reservego/reservego-1.png", alt: "Edit Profile", caption: "Edit Profile" },
      { src: "assets/reservego/reservego-2.png", alt: "History", caption: "History" },
      { src: "assets/reservego/reservego-3.png", alt: "Reservation History Detail", caption: "Reservation History Detail" },
      { src: "assets/reservego/reservego-4.png", alt: "Admin Homepage", caption: "Admin Homepage" },
    ]
  },

  "democracy": {
    title: "Democracy Prediction Throught Implementation of Classification and Time-Series Algorithm",
    category: "Data Modelling",
    description:
      "This research aimed to predict electoral democracy outcomes in Southeast Asian countries using a combination of classification and time-series algorithms. We focused on electoral democracy as the target variable, using data sourced from the Varieties of Democracy (V-Dem) dataset. Independent variables included indicators such as the number of executive elections, party freedom, the number of voters, freedom of expression, and fairness of selection. For classification, we evaluated machine learning models including k-Nearest Neighbors, Decision Tree, Support Vector Machine (SVM), and Random Forest. Then, trend and forecasting analysis, using time-series methods such as ARIMA, Simple Exponential Smoothing, and Holt’s Exponential Smoothing. ",
    tech: ["Python", "Machine Learning", "Time Series", "Text Classification", "Model Tuning"],    
    features: [
      "Performed the process of data preparation; filtering, handling missing values, outlier removal, feature selection, and binning/encoding for modeling.",
      "Produced performance reports for each classification model, including metrics comparison and analysis to determine the best-performing model."
    ],
    links: [
      { label: "Source Code", url: "https://colab.research.google.com/drive/1ZzeN4LAWVrq8b-TTn9ODB2ksDtD3qHrz?usp=sharing" }
    ],
    images: [
      { src: "assets/democracy/democracy-1.png", alt: "KNN Classification Report", caption: "KNN Classification Report" },
      { src: "assets/democracy/democracy-2.png", alt: "KNN Confusion Matrix", caption: "KNN Confusion Matrix" },
      { src: "assets/democracy/democracy-3.png", alt: "Holt's Exponential Evaluation", caption: "Holt's Exponential Evaluation" },
      { src: "assets/democracy/democracy-4.png", alt: "Democracy Prediction Results", caption: "Democracy Prediction Results" },
    ]
  },

  "dw-etl": {
    title: "Furyel - Data Warehouse Design for Performance Optimization and Business Strategy",
    category: "Data Warehouse & ETL",
    description:
      "This project focused on designing a data warehouse to optimize performance analysis and business strategy for Furyel (Find Your Style), a fictional retail e-commerce company selling a wide range of clothing products. Furyel was chosen as a case study to represent the rapid growth of the e-commerce industry in recent years, which has led to an exponential increase in data volume. This growth demands an effective approach to data utilization, enabling businesses to analyze purchasing behavior, manage inventory efficiently, and stay competitive in the market. The project demonstrated how implementing a data warehouse can help meet these needs through integrated analysis and visualization, such as predicting stock requirements and identifying emerging trends.",
    tech: ["SQL", "ETL", "Data Visualization", "Business Intelligence", "Data Warehousing", "Star Schema", "Pentaho", "Power BI", "Microsoft Excel"],
    features: [
      "Managed the Extract, Transform, & Load (ETL) process; starting with extracting relevant tables, transforming data by merging sources and adding calculated metrics, and loading the final dataset into a star schema data warehouse.",
      "Developed visualizations to generate insights that addressed the company’s analytical needs."
    ],
    links: [
      {  }
    ],
    images: [
      { src: "assets/furyel/furyel-1.png", alt: "Produck Restock's ETL", caption: "Produck Restock's ETL" },
      { src: "assets/furyel/furyel-2.png", alt: "Low Stock Product", caption: "Low Stock Product" },
      { src: "assets/furyel/furyel-3.png", alt: "Available Stock Product", caption: "Available Stock Product" },
      { src: "assets/furyel/furyel-4.png", alt: "Overstock Product", caption: "Overstock Product" },
      { src: "assets/furyel/furyel-5.png", alt: "Category Performance's ETL", caption: "Category Performance's ETL" },
      { src: "assets/furyel/furyel-6.png", alt: "Category Performance by Total Sold Product", caption: "Category Performance by Total Sold Product" },
      { src: "assets/furyel/furyel-7.png", alt: "Category Performance by Total Sales Product", caption: "Category Performance by Total Sales Product" },
      { src: "assets/furyel/furyel-8.png", alt: "City Performance's ETL", caption: "City Performance's ETL" },
      { src: "assets/furyel/furyel-9.png", alt: "City Performance by Total Sold Product", caption: "City Performance by Total Sold Product" },
      { src: "assets/furyel/furyel-10.png", alt: "City Performance by Total Sales Product", caption: "City Performance by Total Sales Product" },
      { src: "assets/furyel/furyel-11.png", alt: "Star Schema Result", caption: "Star Schema Result" },
    ]
  },

  "lastbites": {
    title: "LastBites - Food Waste E-Commerce Platform",
    category: "Web Development",
    description:
      "LastBites is a web platform designed to reduce food waste by enabling the resale of leftover yet consumable food at affordable prices. The platform supports three types of users: sellers or store owners who can open and manage their shops, customers who can browse and purchase products, and administrators responsible for validating seller registrations. Developed using the Sprint development method and Laravel framework, this project aligns with Sustainable Development Goal 12: Responsible Consumption and Production by promoting sustainable food practices and reducing waste through LastBites.",
    tech: ["HTML", "CSS", "JavaScript", "Bootstrap", "MySQL", "Laravel",],
    features: [
      "Designed questionnaires to identify user requirements and conducted user testing to validate website usability.",
      "Developed core website features, including user authentication (login & registration), admin verification dashboard, homepage with product recommendations, seller management dashboard, search page, store display page, and chat system."
    ],
    links: [
      { label: "Source Code", url: "https://github.com/kruzzzzz/LastBites" },
    ],
    images: [
      { src: "assets/lastbites/lastbites-1.png", alt: "About Us Page", caption: "About Us Page" },
      { src: "assets/lastbites/lastbites-2.png", alt: "Homepage", caption: "Homepage" },
      { src: "assets/lastbites/lastbites-3.png", alt: "Store", caption: "Store" },
      { src: "assets/lastbites/lastbites-4.png", alt: "Chat System", caption: "Chat System" },
      { src: "assets/lastbites/lastbites-5.png", alt: "Seller Management Dashboard", caption: "Seller Management Dashboard" },
    ]
  },

  "lovender": {
    title: "Lovender - Anti Sexual Violence Application Design",
    category: "Prototyping",
    description:
      "Lovender is a mobile application design project aimed at addressing the growing issue of sexual violence in Indonesia, particularly within school environments. The project seeks to promote awareness, prevention, and reporting of sexual violence cases by providing a safe and accessible digital platform for victims and witnesses. Guided by the User-Centered Design methodology, the team developed the app’s structure and features based on user needs gathered through interviews with school representatives in Bogor. This initiative also supports Sustainable Development Goal 16: Peace, Justice, and Strong Institutions, by empowering users with knowledge and tools to report and respond to incidents more confidently.",
    tech: ["UI/UX Design", "Prototyping", "Figma",],
    features: [
      "Designed and distributed questionnaires to identify user needs and evaluate prototype usability.",
      "Contributed to defining the app’s core features and user flow based on insights from user feedback.",
      "Created the overall user interface design for the app.",
    ],
    links: [
      { label: "Prototype", url: "https://www.figma.com/file/x2HoVgsSzQOM6wO6REwKna/Lovender" }
    ],
    images: [
      { src: "assets/lovender/lovender-1.png", alt: "Homepage", caption: "Homepage" },
      { src: "assets/lovender/lovender-2.png", alt: "Educational Video", caption: "Educational Video" },
      { src: "assets/lovender/lovender-3.png", alt: "Lovender Services", caption: "Lovender Services" },
      { src: "assets/lovender/lovender-4.png", alt: "Consultant Services", caption: "Consultant Services" },
      { src: "assets/lovender/lovender-5.png", alt: "Consultant Chat", caption: "Consultant Chat" },
      { src: "assets/lovender/lovender-6.png", alt: "Discussion Forum", caption: "Discussion Forum" },
      { src: "assets/lovender/lovender-7.png", alt: "Discussion Chat", caption: "Discussion Chat" },
      { src: "assets/lovender/lovender-8.png", alt: "Report History", caption: "Report History" },
    ]
  },

  "sandang": {
    title: "Sandang - Clothing Donation Application Design",
    category: "Prototyping",
    description:
      "Sandang is a mobile application concept designed to improve the effectiveness of secondhand clothing donations as a contribution toward achieving Sustainable Development Goal 12: Responsible Consumption and Production. The application aims to replace conventional offline donation methods by providing an accessible platform that connects donors with recipients in need, while also raising consumer awareness of the environmental impact of their purchasing decisions by promoting a new “sustainable fashion trend.” In addition to the user interface design, the team also developed a database structure to support the app’s future implementation. The database design process followed normalization principles up to the Third Normal Form (3NF) to ensure data consistency and efficiency.",
    tech: ["UI/UX Design", "Prototyping", "Figma",],
    features: [
      "Collected and analyzed system requirements to define core features and user needs.",
      "Assisted in designing the mobile app design, focusing on the user login and registration page, as well as chat page.",
      "Designed the database structure through normalization up to 3NF and developed the Entity Relationship Diagram.",
    ],
    links: [
      { label: "Prototype", url: "https://www.figma.com/file/C8inWa60EurQnPKEC96yeS/Sandang" },
      { label: "Video", url: "https://www.youtube.com/watch?v=v-GKeFyjzjc" }
    ],
    images: [
      { src: "assets/sandang/sandang-1.png", alt: "Donors Homepage", caption: "Donors Homepage" },
      { src: "assets/sandang/sandang-2.png", alt: "Chat", caption: "Chat" },
      { src: "assets/sandang/sandang-3.png", alt: "Recipients Homepage", caption: "Recipients Homepage" },
      { src: "assets/sandang/sandang-4.png", alt: "Order Confirmation", caption: "Order Confirmation" },
    ]
  },

  "pkm": {
    title: "Realization of Anti-Sexual Violence Through the Application of the Concept of Gender Equality in the Dharma Putra High School Environment (PKM COMMUNITY SERVICE)",
    category: "Statistical Data Analysis",
    description:
      "As part of the Student Creativity Program – Community Service (PKM-PM), our team developed a project to prevent sexual violence and promote gender equality among high school students in Tangerang. We delivered interactive education sessions combining the values of Religion and Pancasila, supported by scenario-based sketches to increase students' awareness and understanding of this issue. To assess its impact, we used the Paired-Samples T-Test on pre-test and post-test data, which showed a significant improvement in students’ understanding of both issues. These results validated our project’s success in strengthening students’ comprehension of both concepts while supporting the achievement of Sustainable Development Goal 5: Gender Equality.",
    tech: ["R", "Quantitative Research", "Public Speaking",],
    features: [
      "Helped to develop educational content focusing on sexual violence prevention and gender equality.",
      "Delivered interactive education sessions to students.",
      "Designed project banners to show research findings and results.",
      "Represented the team in the PKM competition to present project outcomes."
    ],
    links: [
      { label: "Banner", url: "https://drive.google.com/file/d/1Oda9jEOUavged5cpv2INT4P7oWRXMvD2/view?usp=sharing" }
    ],
    images: [
      { src: "assets/pkm/pkm-1.png", alt: "Team Photo", caption: "Team Photo" },
      { src: "assets/pkm/pkm-2.png", alt: "Competition Presentation", caption: "Competition Presentation" },
      { src: "assets/pkm/pkm-3.png", alt: "Educational Session", caption: "Educational Session" },
      { src: "assets/pkm/pkm-4.png", alt: "Sketch", caption: "Sketch" },
    ]
  }
};

const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalSub = document.getElementById("modalSub");
const modalDesc = document.getElementById("modalDesc");
const modalTech = document.getElementById("modalTech");
const modalFeatures = document.getElementById("modalFeatures");
const modalLinks = document.getElementById("modalLinks");
const overlay = modal ? modal.querySelector(".modal-overlay") : null;

let lastFocusedEl = null;

// ---------------------------------------------
// Project Modal Carousel (pmc_*)
// ---------------------------------------------
const pmc_root = document.querySelector('#projectModal [data-carousel="modal"]');
const pmc_track = document.getElementById("modalCarouselTrack");
const pmc_wrap = document.getElementById("modalGalleryWrap");

let pmc_index = 0;

function pmc_getViewport() {
  return pmc_root ? pmc_root.querySelector(".carousel-viewport") : null;
}

function pmc_getSlides() {
  return pmc_track ? Array.from(pmc_track.children) : [];
}

function pmc_buildDots() {
  if (!pmc_root) return;
  const dotsWrap = pmc_root.querySelector("[data-carousel-dots]");
  if (!dotsWrap) return;

  const slides = pmc_getSlides();
  dotsWrap.innerHTML = "";

  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "carousel-dot";
    b.setAttribute("aria-label", `Go to image ${i + 1}`);
    b.addEventListener("click", () => pmc_goTo(i));
    dotsWrap.appendChild(b);
  });
}

function pmc_setActiveDot() {
  if (!pmc_root) return;
  const dotsWrap = pmc_root.querySelector("[data-carousel-dots]");
  if (!dotsWrap) return;

  const dots = Array.from(dotsWrap.querySelectorAll(".carousel-dot"));
  dots.forEach((d, i) => d.classList.toggle("is-active", i === pmc_index));
}

function pmc_updateButtons() {
  if (!pmc_root) return;

  const btnPrev = pmc_root.querySelector("[data-carousel-prev]");
  const btnNext = pmc_root.querySelector("[data-carousel-next]");

  const slides = pmc_getSlides();
  const multiple = slides.length > 1;

  // Keep controls enabled for looped navigation; disable only when there is a single slide.
  if (btnPrev) btnPrev.disabled = !multiple;
  if (btnNext) btnNext.disabled = !multiple;
}

function pmc_applyTransform() {
  const viewport = pmc_getViewport();
  if (!viewport || !pmc_track) return;

  const w = viewport.getBoundingClientRect().width;
  pmc_track.style.transform = `translateX(-${pmc_index * w}px)`;

  pmc_setActiveDot();
  pmc_updateButtons();
}

function pmc_goTo(i) {
  const slides = pmc_getSlides();
  if (!slides.length) return;

  const len = slides.length;
  pmc_index = ((i % len) + len) % len; // wrap forward/backward
  pmc_applyTransform();
}

function pmc_next() {
  pmc_goTo(pmc_index + 1);
}

function pmc_prev() {
  pmc_goTo(pmc_index - 1);
}

function pmc_bindControlsOnce() {
  if (!pmc_root) return;

  // Avoid double-binding
  if (pmc_root.dataset.pmcBound === "1") return;
  pmc_root.dataset.pmcBound = "1";

  const btnPrev = pmc_root.querySelector("[data-carousel-prev]");
  const btnNext = pmc_root.querySelector("[data-carousel-next]");
  const viewport = pmc_getViewport();

  btnPrev?.addEventListener("click", pmc_prev);
  btnNext?.addEventListener("click", pmc_next);

  viewport?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") pmc_next();
    if (e.key === "ArrowLeft") pmc_prev();
  });

  // Swipe (mobile)
  let startX = 0;
  let isDown = false;

  viewport?.addEventListener("pointerdown", (e) => {
    isDown = true;
    startX = e.clientX;
    viewport.setPointerCapture?.(e.pointerId);
  });

  viewport?.addEventListener("pointerup", (e) => {
    if (!isDown) return;
    isDown = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) pmc_next();
      else pmc_prev();
    }
  });

  viewport?.addEventListener("pointercancel", () => {
    isDown = false;
  });

  // Resize fix (modal width bisa berubah)
  const ro = new ResizeObserver(() => {
    // jangan update kalau modal sedang tidak open
    if (modal && modal.classList.contains("is-open")) pmc_applyTransform();
  });
  if (viewport) ro.observe(viewport);
}

function pmc_renderImages(images) {
  if (!pmc_wrap || !pmc_track || !pmc_root) return;

  const list = Array.isArray(images) ? images : [];
  if (!list.length) {
    pmc_wrap.style.display = "none";
    pmc_track.innerHTML = "";
    return;
  }

  pmc_wrap.style.display = "";
  pmc_track.innerHTML = "";

  list.forEach((img) => {
    const fig = document.createElement("figure");
    fig.className = "carousel-slide";

    const elImg = document.createElement("img");
    elImg.src = img.src;
    elImg.alt = img.alt || "Project image";
    elImg.loading = "lazy";

    fig.appendChild(elImg);

    if (img.caption) {
      const cap = document.createElement("figcaption");
      cap.className = "carousel-caption";
      cap.textContent = img.caption;
      fig.appendChild(cap);
    }

    pmc_track.appendChild(fig);
  });

  pmc_bindControlsOnce();
  pmc_buildDots();
  pmc_goTo(0); // reset to first image
}

function openModal(projectId) {
  if (!modal) return;

  const data = projectData[projectId];
  if (!data) return;

  lastFocusedEl = document.activeElement;

  // Populate content
  modalTitle.textContent = data.title;
  modalSub.textContent = data.category;
  modalDesc.textContent = data.description;

  // Tech tags
  modalTech.innerHTML = "";
  (data.tech || []).forEach((t) => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = t;
    modalTech.appendChild(span);
  });

  // Features
  modalFeatures.innerHTML = "";
  (data.features || []).forEach((f) => {
    const li = document.createElement("li");
    li.textContent = f;
    modalFeatures.appendChild(li);
  });

  // Links
  modalLinks.innerHTML = "";
  (data.links || []).forEach((l) => {
    const a = document.createElement("a");
    a.className = "modal-link";
    a.href = l.url;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.textContent = l.label;
    modalLinks.appendChild(a);
  });

  pmc_renderImages(data.images);

  // Show
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  // Lock scroll
  document.body.style.overflow = "hidden";

  // Focus close button
  const closeBtn = modal.querySelector("[data-modal-close]");
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  if (!modal) return;

  // play out animation
  modal.classList.add("out");

  // match with CSS transition duration (220ms)
  window.setTimeout(() => {
    modal.classList.remove("is-open");
    modal.classList.remove("out");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    pmc_index = 0;
    pmc_applyTransform();

    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  }, 220);
}

function handleProjectCardActivate(card) {
  const projectId = card.getAttribute("data-project");
  if (!projectId) return;
  openModal(projectId);
}

// Attach click handlers to project cards
document.querySelectorAll(".project.project-clickable").forEach((card) => {
  card.addEventListener("click", () => handleProjectCardActivate(card));

  // Keyboard support (Enter/Space)
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleProjectCardActivate(card);
    }
  });
});

// Close handlers (overlay and close button)
if (modal) {
  modal.querySelectorAll("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  // Esc to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

overlay?.addEventListener("click", closeModal);
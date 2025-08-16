# Folder Structure
/conveyor-belt-nodejs-JS
│
├── lib/                      # Core simulation logic
│   ├── conveyor.js           # Conveyor belt mechanics
│   ├── workers.js            # Worker behavior system
│   ├── gpio.js               # Raspberry Pi GPIO interface
│   └── db.js                 # SQLite persistence
│
├── public/                   # Frontend assets
│   ├── index.html            # Browser interface
│   ├── styles.css            # CSS styles
│   └── script.js             # Client-side JS
│
├── test/                     # Test suites
│   ├── unit/                 # Unit tests
│   │   ├── conveyor.test.js
│   │   ├── workers.test.js
│   │   └── gpio.mock.test.js
│   │
│   └── integration/          # Integration tests
│       ├── api.test.js
│       ├── db.test.js
│       └── simulation.test.js
│
├── config/                   # Configuration files
│   ├── prometheus.yml        # Metrics scraping config
│   └── grafana-dashboard.json # Dashboard template
│
├── docs/                     # Documentation
│   ├── architecture.md
│   └── api-reference.md
│
├── index.js                  # Main application entry
├── package.json              # Dependencies & scripts
├── README.md                 # Project documentation
└── .gitignore                # Version control excludes
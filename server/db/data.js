const courses =
  [
    {
      "name": "Introduction to Python Programming",
      "duration": "6 weeks",
      "teacherName": "Dr. Emily Carter",
      "numberOfLectures": 30,
      "content": [
        "Python basics and syntax",
        "Control structures and loops",
        "Functions and modules",
        "File handling",
        "Introduction to object-oriented programming"
      ],
      "profileImg": "https://img.freepik.com/free-photo/close-up-programming-code-laptop-screen_158595-616.jpg",
      "about": "Learn Python, the versatile and beginner-friendly programming language used for web development, data analysis, artificial intelligence, scientific computing, and more. This course covers everything from the basics to an introduction to object-oriented programming, ensuring a solid foundation.",
      "alias": "Introduction to Python Programming python python-programming intro-to-python learn-python Python basics and syntax Control structures and loops Functions and modules File handling Introduction to object-oriented programming",
      "price": "₹4,999",
      "detailedContent": [
        ["Introduction to Python", "Setting up the environment", "Running your first Python program"],
        ["Understanding if-else statements", "Loops: for and while", "Nested loops and loop control"],
        ["Creating and using functions", "Understanding Python modules", "Using built-in modules"],
        ["Reading and writing files", "File handling modes", "Working with directories"],
        ["Understanding classes and objects", "Defining methods", "Inheritance and polymorphism", "Encapsulation and abstraction"]
      ]
    },
    {
      "name": "Web Development Bootcamp",
      "duration": "12 weeks",
      "teacherName": "Mr. John Doe",
      "numberOfLectures": 60,
      "content": [
        "HTML and CSS fundamentals",
        "JavaScript programming",
        "Responsive design",
        "Front-end frameworks",
        "Backend development with Node.js"
      ],
      "profileImg": "https://img.freepik.com/free-photo/web-design-concept-with-drawings_1134-77.jpg",
      "about": "This comprehensive bootcamp takes you from zero to hero in web development. Learn to build responsive and interactive websites using the latest technologies and frameworks.",
      "alias": "Web Development Bootcamp web-development html css javascript nodejs responsive-design front-end back-end",
      "price": "₹9,999",
      "detailedContent": [
        ["Introduction to HTML", "Structuring web pages", "Semantic elements"],
        ["Styling with CSS", "Layouts and positioning", "Flexbox and Grid"],
        ["JavaScript basics", "DOM manipulation", "Event handling"],
        ["Bootstrap framework", "Building responsive layouts", "Component-based design"],
        ["Setting up Node.js", "Building RESTful APIs", "Database integration"]
      ]
    },
    {
      "name": "Data Science with Python",
      "duration": "10 weeks",
      "teacherName": "Dr. Jane Smith",
      "numberOfLectures": 50,
      "content": [
        "Data analysis with Pandas",
        "Data visualization",
        "Statistical analysis",
        "Machine learning algorithms",
        "Working with real-world datasets"
      ],
      "profileImg": "https://img.freepik.com/free-photo/data-scientist-working_1098-19858.jpg",
      "about": "Dive into data science using Python. This course covers data manipulation, visualization, and machine learning, equipping you with the skills to analyze and interpret complex data.",
      "alias": "Data Science with Python data-science python pandas machine-learning data-analysis data-visualization",
      "price": "₹8,499",
      "detailedContent": [
        ["Introduction to data science", "Setting up the environment", "Data exploration with Pandas"],
        ["Visualizing data with Matplotlib", "Creating interactive plots", "Data storytelling"],
        ["Descriptive statistics", "Probability distributions", "Hypothesis testing"],
        ["Supervised learning algorithms", "Unsupervised learning algorithms", "Model evaluation and tuning"],
        ["Handling missing data", "Data preprocessing techniques", "Case studies with real datasets"]
      ]
    },
    {
      "name": "Cybersecurity Essentials",
      "duration": "8 weeks",
      "teacherName": "Mr. Alan Turing",
      "numberOfLectures": 40,
      "content": [
        "Introduction to cybersecurity",
        "Network security fundamentals",
        "Threats and vulnerabilities",
        "Cryptography basics",
        "Security policies and procedures"
      ],
      "profileImg": "https://img.freepik.com/free-photo/hacker-working-dark_144627-42808.jpg",
      "about": "Understand the core concepts of cybersecurity, including protecting networks, identifying threats, and implementing security protocols to safeguard digital assets.",
      "alias": "Cybersecurity Essentials cybersecurity network-security cryptography threats vulnerabilities",
      "price": "₹7,499",
      "detailedContent": [
        ["Overview of cybersecurity", "Importance of security", "Cybersecurity frameworks"],
        ["Network protocols and models", "Firewalls and intrusion detection systems", "Securing wireless networks"],
        ["Types of cyber threats", "Vulnerability assessment", "Penetration testing basics"],
        ["Encryption and decryption", "Public key infrastructure", "Digital signatures"],
        ["Developing security policies", "Incident response planning", "Compliance and legal considerations"]
      ]
    },
    {
      "name": "Cloud Computing with AWS",
      "duration": "9 weeks",
      "teacherName": "Ms. Ada Lovelace",
      "numberOfLectures": 45,
      "content": [
        "Introduction to cloud computing",
        "AWS services overview",
        "Deploying applications on AWS",
        "Storage and databases in AWS",
        "Security and compliance in AWS"
      ],
      "profileImg": "https://img.freepik.com/free-photo/cloud-computing-concept_1100-655.jpg",
      "about": "Learn the fundamentals of cloud computing with a focus on Amazon Web Services (AWS). This course covers deploying, managing, and securing applications in the cloud.",
      "alias": "Cloud Computing with AWS cloud-computing aws amazon-web-services cloud-deployment cloud-security",
      "price": "₹8,999",
      "detailedContent": [
        ["Understanding cloud computing", "Benefits and models", "Cloud service providers"],
        ["Compute services (EC2)", "Storage services (S3)", "Database services (RDS)"],
        ["Setting up AWS environment", "Deploying applications", "Monitoring and scaling"],
        ["AWS storage options", "Database management", "Data migration strategies"],
        ["AWS security best practices", "Identity and access management", "Compliance standards"]
      ]
    },
    {
      "name": "Introduction to Artificial Intelligence",
      "duration": "8 weeks",
      "teacherName": "Dr. Alan Turing",
      "numberOfLectures": 40,
      "content": [
        "History of AI",
        "Search algorithms",
        "Machine learning basics",
        "Neural networks",
        "AI ethics"
      ],
      "profileImg": "https://www.publicdomainpictures.net/pictures/320000/nahled/artificial-intelligence-concept.jpg",
      "about": "Explore the foundations of artificial intelligence, including its history, fundamental algorithms, and ethical considerations. This course provides a comprehensive introduction to AI concepts and applications.",
      "alias": "Introduction to Artificial Intelligence AI machine-learning neural-networks AI-ethics",
      "price": "₹6,999",
      "detailedContent": [
        ["Overview of AI", "Turing Test", "AI in modern society"],
        ["Uninformed and informed search", "Heuristics", "Optimization problems"],
        ["Supervised vs unsupervised learning", "Regression and classification", "Overfitting and regularization"],
        ["Perceptrons", "Backpropagation", "Deep learning basics"],
        ["Moral implications of AI", "Bias in AI systems", "Future of AI ethics"]
      ]
    },
    {
      "name": "Mobile App Development",
      "duration": "10 weeks",
      "teacherName": "Ms. Ada Lovelace",
      "numberOfLectures": 50,
      "content": [
        "Introduction to mobile platforms",
        "UI/UX design principles",
        "Native vs hybrid apps",
        "Working with APIs",
        "App deployment"
      ],
      "profileImg": "https://www.publicdomainpictures.net/pictures/280000/nahled/mobile-app-development.jpg",
      "about": "Learn to design and develop mobile applications for both Android and iOS platforms. This course covers UI/UX design, working with APIs, and deploying apps to app stores.",
      "alias": "Mobile App Development Android iOS UI/UX APIs app-deployment",
      "price": "₹7,999",
      "detailedContent": [
        ["Overview of mobile OS", "Setting up development environment", "Hello World app"],
        ["Designing user interfaces", "User experience considerations", "Prototyping tools"],
        ["Pros and cons of native apps", "Hybrid app frameworks", "Performance considerations"],
        ["RESTful APIs", "JSON parsing", "Third-party libraries"],
        ["Preparing app for release", "App store guidelines", "Marketing strategies"]
      ]
    },
    {
      "name": "Data Structures and Algorithms",
      "duration": "9 weeks",
      "teacherName": "Prof. Donald Knuth",
      "numberOfLectures": 45,
      "content": [
        "Arrays and linked lists",
        "Stacks and queues",
        "Trees and graphs",
        "Sorting and searching algorithms",
        "Algorithm complexity"
      ],
      "profileImg": "https://www.publicdomainpictures.net/pictures/320000/nahled/data-structures.jpg",
      "about": "Gain a solid understanding of data structures and algorithms, which are essential for efficient programming and problem-solving. This course covers various data structures, their applications, and algorithmic techniques.",
      "alias": "Data Structures Algorithms programming problem-solving",
      "price": "₹6,499",
      "detailedContent": [
        ["Dynamic arrays", "Singly and doubly linked lists", "Use cases"],
        ["Stack operations", "Queue operations", "Applications in computing"],
        ["Binary trees", "Graph representations", "Traversal techniques"],
        ["Bubble sort", "Merge sort", "Binary search"],
        ["Big O notation", "Time and space complexity", "Optimization techniques"]
      ]
    },
    {
      "name": "Introduction to Cybersecurity",
      "duration": "7 weeks",
      "teacherName": "Mr. Kevin Mitnick",
      "numberOfLectures": 35,
      "content": [
        "Cybersecurity fundamentals",
        "Types of cyber threats",
        "Network security",
        "Cryptography basics",
        "Incident response"
      ],
      "profileImg": "https://www.publicdomainpictures.net/pictures/320000/nahled/cybersecurity-concept.jpg",
      "about": "Understand the principles of cybersecurity, including threat identification, network protection, and basic cryptography. This course prepares you to protect digital assets and respond to security incidents.",
      "alias": "Cybersecurity network-security cryptography incident-response",
      "price": "₹5,999",
      "detailedContent": [
        ["CIA triad", "Security policies", "Risk management"],
        ["Malware types", "Phishing attacks", "Social engineering"],
        ["Firewalls", "VPNs", "Wireless security"],
        ["Encryption methods", "Public key infrastructure", "Secure communications"],
        ["Incident detection", "Response strategies", "Post-incident analysis"]
      ]
    },
    {
      "name": "Cloud Computing Fundamentals",
      "duration": "8 weeks",
      "teacherName": "Dr. Grace Hopper",
      "numberOfLectures": 40,
      "content": [
        "Cloud computing models",
        "Virtualization",
        "Cloud storage",
        "Cloud security",
        "Introduction to AWS and Azure"
      ],
      "profileImg": "https://www.publicdomainpictures.net/pictures/320000/nahled/cloud-computing-concept.jpg",
      "about": "Learn the basics of cloud computing, including service models, virtualization techniques, and major cloud platforms like AWS and Azure. This course provides a foundation for understanding and utilizing cloud services.",
      "alias": "Cloud Computing AWS Azure virtualization cloud-security",
      "price": "₹6,999",
      "detailedContent": [
        ["IaaS, PaaS, SaaS", "Public vs private clouds", "Hybrid cloud strategies"],
        ["Hypervisors", "Virtual machines", "Containerization"],
        ["Object storage", "Block storage", "Content delivery networks"],
        ["Security challenges", "Compliance", "Identity management"],
        ["AWS services overview", "Azure services overview", "Getting started with cloud platforms"]
      ]
    }
  ]

  ;




module.exports = courses;
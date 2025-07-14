// TODO: This file uses mock data. Replace with real API integration.
// Mock GovernmentContract entity for now - replace with actual API calls
export class GovernmentContract {
  static async list(sortBy = '-posted_date', limit = 100) {
    // Mock data - replace with actual API call
    return [
      {
        id: 1,
        contract_title: "Cybersecurity Infrastructure Modernization",
        agency: "Department of Defense",
        description: "Comprehensive cybersecurity infrastructure upgrade for military bases including network security, threat detection systems, and data protection protocols. Seeking qualified contractors with Top Secret clearance capabilities.",
        contract_value: 25000000,
        posted_date: "2024-02-01",
        response_deadline: "2024-03-15",
        contract_type: "fixed_price",
        set_aside: "small_business",
        naics_code: "541519",
        office: "Defense Information Systems Agency",
        link: "https://sam.gov/opp/cyber-modernization-2024",
        relevant_sectors: ["technology", "consulting"],
        eligibility_requirements: [
          "Top Secret facility clearance",
          "Minimum 5 years cybersecurity experience",
          "CMMC Level 3 certification",
          "Previous DoD contract experience"
        ]
      },
      {
        id: 2,
        contract_title: "Healthcare Data Analytics Platform",
        agency: "Department of Veterans Affairs",
        description: "Development of advanced healthcare analytics platform to improve patient outcomes and operational efficiency. Platform must integrate with existing VA systems and provide real-time reporting capabilities.",
        contract_value: 8500000,
        posted_date: "2024-01-28",
        response_deadline: "2024-03-10",
        contract_type: "cost_plus",
        set_aside: "woman_owned",
        naics_code: "541511",
        office: "Veterans Health Administration",
        link: "https://sam.gov/opp/va-analytics-platform",
        relevant_sectors: ["technology", "healthcare"],
        eligibility_requirements: [
          "HIPAA compliance certification",
          "Healthcare IT experience",
          "Previous federal healthcare contracts",
          "ISO 27001 certification"
        ]
      },
      {
        id: 3,
        contract_title: "Educational Technology Training Program",
        agency: "Department of Education",
        description: "Comprehensive training program for K-12 educators on implementing digital learning tools and platforms. Program includes curriculum development, online training modules, and in-person workshops.",
        contract_value: 3200000,
        posted_date: "2024-01-25",
        response_deadline: "2024-03-05",
        contract_type: "fixed_price",
        set_aside: "hubzone",
        naics_code: "611710",
        office: "Office of Educational Technology",
        link: "https://sam.gov/opp/ed-tech-training",
        relevant_sectors: ["education", "technology"],
        eligibility_requirements: [
          "HUBZone certification",
          "Educational technology experience",
          "Previous education sector contracts",
          "Certified training professionals"
        ]
      },
      {
        id: 4,
        contract_title: "Transportation Infrastructure Assessment",
        agency: "Department of Transportation",
        description: "Comprehensive assessment of transportation infrastructure across multiple states. Project includes bridge inspections, road condition analysis, and recommendations for maintenance and improvements.",
        contract_value: 15000000,
        posted_date: "2024-01-22",
        response_deadline: "2024-03-20",
        contract_type: "time_and_materials",
        set_aside: "veteran_owned",
        naics_code: "541330",
        office: "Federal Highway Administration",
        link: "https://sam.gov/opp/transport-assessment",
        relevant_sectors: ["transportation", "consulting"],
        eligibility_requirements: [
          "Veteran-owned business certification",
          "Civil engineering expertise",
          "Infrastructure assessment experience",
          "Multi-state project capability"
        ]
      },
      {
        id: 5,
        contract_title: "Cloud Migration Services",
        agency: "General Services Administration",
        description: "Migration of legacy systems to cloud infrastructure for multiple federal agencies. Services include data migration, system integration, security implementation, and ongoing support.",
        contract_value: 45000000,
        posted_date: "2024-01-20",
        response_deadline: "2024-03-25",
        contract_type: "indefinite_delivery",
        set_aside: "8a",
        naics_code: "541512",
        office: "Technology Transformation Services",
        link: "https://sam.gov/opp/cloud-migration-2024",
        relevant_sectors: ["technology", "consulting"],
        eligibility_requirements: [
          "8(a) certification",
          "FedRAMP authorization",
          "Previous cloud migration experience",
          "Multi-agency project capability"
        ]
      },
      {
        id: 6,
        contract_title: "Environmental Impact Study",
        agency: "Environmental Protection Agency",
        description: "Comprehensive environmental impact assessment for proposed infrastructure projects. Study includes air quality analysis, water quality testing, and ecological impact evaluation.",
        contract_value: 2800000,
        posted_date: "2024-01-18",
        response_deadline: "2024-03-12",
        contract_type: "fixed_price",
        set_aside: "small_business",
        naics_code: "541620",
        office: "Office of Environmental Assessment",
        link: "https://sam.gov/opp/epa-impact-study",
        relevant_sectors: ["consulting"],
        eligibility_requirements: [
          "Environmental consulting experience",
          "EPA contract history",
          "Certified environmental professionals",
          "GIS mapping capabilities"
        ]
      },
      {
        id: 7,
        contract_title: "Healthcare Facility Management",
        agency: "Department of Health and Human Services",
        description: "Facility management services for federal healthcare facilities including maintenance, security, and operational support. Multi-year contract with option periods.",
        contract_value: 12000000,
        posted_date: "2024-01-15",
        response_deadline: "2024-03-08",
        contract_type: "cost_plus",
        set_aside: "woman_owned",
        naics_code: "561210",
        office: "Program Support Center",
        link: "https://sam.gov/opp/hhs-facility-mgmt",
        relevant_sectors: ["healthcare", "consulting"],
        eligibility_requirements: [
          "Woman-owned business certification",
          "Healthcare facility experience",
          "Security clearance capability",
          "24/7 operational support"
        ]
      },
      {
        id: 8,
        contract_title: "Digital Transformation Consulting",
        agency: "Department of Homeland Security",
        description: "Strategic consulting services for digital transformation initiatives across DHS components. Focus on modernizing legacy systems and improving operational efficiency.",
        contract_value: 18000000,
        posted_date: "2024-01-12",
        response_deadline: "2024-03-18",
        contract_type: "time_and_materials",
        set_aside: "small_business",
        naics_code: "541611",
        office: "Office of the Chief Information Officer",
        link: "https://sam.gov/opp/dhs-digital-transform",
        relevant_sectors: ["technology", "consulting"],
        eligibility_requirements: [
          "Secret clearance capability",
          "Digital transformation expertise",
          "Previous DHS contracts",
          "Change management experience"
        ]
      },
      {
        id: 9,
        contract_title: "Research and Development Support",
        agency: "National Science Foundation",
        description: "Research and development support for emerging technologies in renewable energy. Project includes prototype development, testing, and commercialization planning.",
        contract_value: 5500000,
        posted_date: "2024-01-10",
        response_deadline: "2024-03-22",
        contract_type: "fixed_price",
        set_aside: "hubzone",
        naics_code: "541715",
        office: "Office of Industrial Innovation",
        link: "https://sam.gov/opp/nsf-renewable-rd",
        relevant_sectors: ["technology"],
        eligibility_requirements: [
          "HUBZone certification",
          "Renewable energy expertise",
          "R&D facility capabilities",
          "Previous NSF awards"
        ]
      },
      {
        id: 10,
        contract_title: "Training and Development Program",
        agency: "Department of Labor",
        description: "Comprehensive training and development program for federal workforce. Program includes leadership development, technical skills training, and professional certification support.",
        contract_value: 4200000,
        posted_date: "2024-01-08",
        response_deadline: "2024-03-15",
        contract_type: "fixed_price",
        set_aside: "veteran_owned",
        naics_code: "611430",
        office: "Office of Human Resources",
        link: "https://sam.gov/opp/dol-training-dev",
        relevant_sectors: ["education", "consulting"],
        eligibility_requirements: [
          "Veteran-owned business certification",
          "Training program development experience",
          "Federal workforce knowledge",
          "Certified training professionals"
        ]
      },
      {
        id: 11,
        contract_title: "Data Center Modernization",
        agency: "Department of Energy",
        description: "Modernization of federal data centers to improve energy efficiency and security. Project includes hardware upgrades, software implementation, and security enhancements.",
        contract_value: 35000000,
        posted_date: "2024-01-05",
        response_deadline: "2024-03-30",
        contract_type: "indefinite_delivery",
        set_aside: "8a",
        naics_code: "541519",
        office: "Office of the Chief Information Officer",
        link: "https://sam.gov/opp/doe-datacenter-modern",
        relevant_sectors: ["technology"],
        eligibility_requirements: [
          "8(a) certification",
          "Data center experience",
          "Energy efficiency expertise",
          "Security clearance capability"
        ]
      },
      {
        id: 12,
        contract_title: "Supply Chain Optimization",
        agency: "Department of Commerce",
        description: "Supply chain optimization and logistics consulting for federal procurement operations. Focus on improving efficiency, reducing costs, and enhancing supplier diversity.",
        contract_value: 6800000,
        posted_date: "2024-01-03",
        response_deadline: "2024-03-10",
        contract_type: "cost_plus",
        set_aside: "small_business",
        naics_code: "541614",
        office: "Office of Acquisition Management",
        link: "https://sam.gov/opp/commerce-supply-chain",
        relevant_sectors: ["consulting", "transportation"],
        eligibility_requirements: [
          "Supply chain expertise",
          "Federal procurement knowledge",
          "Logistics optimization experience",
          "Supplier diversity programs"
        ]
      }
    ];
  }

  static async get(id) {
    const contracts = await this.list();
    const contract = contracts.find(c => c.id === parseInt(id));
    if (!contract) {
      throw new Error('Government contract not found');
    }
    return contract;
  }
} 
# Implementation Plan

- [x] 1. Set up project structure and core interfaces
  - Create directory structure for agents, types, utils, client components, and knowledge base
  - Define TypeScript interfaces for all agent inputs/outputs and system types
  - Set up knowledge base with 8 domain-specific markdown files
  - Configure build system with TypeScript compilation and development scripts
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1, 13.1, 14.1_

- [x] 1.1 Create comprehensive TypeScript type definitions
  - Write interfaces for TouristPersona, GuideMatch, CrowdPrediction, PriceAnalysis, SafetyResponse, and Itinerary
  - Define UserInput and OrchestratorResponse interfaces for main API
  - Create accommodation, food, transport, market, and activity data structures
  - Add conversational AI and voice interface type definitions
  - _Requirements: 1.4, 2.5, 3.1, 4.3, 5.4, 6.5, 7.2, 12.3_

- [x]* 1.2 Write property test for type structure validation
  - **Property 4: Type structure completeness**
  - **Validates: Requirements 1.4, 2.5**

- [x] 1.3 Set up multi-provider AI client utility
  - Implement callAI function with Groq API (primary), AWS Bedrock (fallback), and Demo Mode
  - Create parseAIResponse utility for JSON parsing with fallback handling
  - Configure multi-provider client with proper API key management and error handling
  - Add demo response generation with local Goan personality
  - _Requirements: 14.1, 14.2_

- [x]* 1.4 Write property test for AI client error handling
  - **Property 19: Fallback mechanism activation**
  - **Validates: Requirements 14.1**

- [x] 2. Create knowledge base system
  - Build 8 domain-specific markdown files (accommodation, food_restaurants, transport, markets, activities, safety, pricing, crowds)
  - Implement knowledge base utility (kb.ts) for unified access to all domains
  - Create getDomain function for retrieving specific domain content
  - Add data extraction utilities for parsing markdown content
  - _Requirements: 2.1, 3.1, 4.1, 8.1, 9.1, 10.1, 11.1_

- [x] 2.1 Build accommodation knowledge base
  - Create accommodation.md with Hostel, Budget, Mid-Range, Luxury categories
  - Include location data, pricing, amenities, vibes, ratings, and contact information
  - Add best_for categories and noise level information
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 2.2 Build food & restaurants knowledge base
  - Create food_restaurants.md with restaurant details and cuisine types
  - Include signature dishes, price ranges, ratings, and ambiance descriptions
  - Add local tips, cultural significance, pricing hacks, and safety warnings
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 2.3 Build transport knowledge base
  - Create transport.md with GoaMiles, auto-rickshaw, scooter rental, private taxi options
  - Include pricing, booking methods, safety considerations, and pros/cons
  - Add night surcharge information and scam warnings
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 2.4 Build markets knowledge base
  - Create markets.md with flea, night, local market types
  - Include operating schedules, specialties, price ranges, and bargaining tips
  - Add what to buy categories and crowd level information
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 2.5 Build activities knowledge base
  - Create activities.md with waterfalls, nightlife, wellness, heritage, adventure categories
  - Include entry fees, duration, difficulty levels, best times, and equipment requirements
  - Add safety guidelines and seasonal availability information
  - _Requirements: 11.1, 11.2, 11.3_

- [x] 2.6 Build safety and pricing knowledge bases
  - Create safety.md with risk assessment, emergency contacts, and women-specific guidelines
  - Create pricing.md with cost breakdowns, location premiums, and exploitation thresholds
  - Create crowds.md with historical data, seasonal multipliers, and alternative suggestions
  - _Requirements: 2.1, 2.2, 3.1, 3.2_

- [x] 3. Implement Adaptive Dispatcher
  - Create intelligent routing system that detects missing vital information
  - Implement friendly guidance system for incomplete user inputs
  - Build validation logic for budget, date, and group_type requirements
  - Add conversational messaging for information collection
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 3.1 Build information completeness detection
  - Implement missing field identification for budget, date, group_type
  - Create validation rules with appropriate error messaging
  - Build progressive information collection strategies
  - _Requirements: 1.1, 1.2_

- [x]* 3.2 Write property test for missing information detection
  - **Property 1: Missing information detection**
  - **Validates: Requirements 1.1**

- [x]* 3.3 Write property test for needs info response format
  - **Property 2: Needs info response format**
  - **Validates: Requirements 1.2**

- [x] 3.4 Implement full orchestration trigger
  - Create logic to proceed with complete information
  - Build agent coordination initiation system
  - Implement validation for complete user inputs
  - _Requirements: 1.3, 1.4_

- [x]* 3.5 Write property test for complete information orchestration
  - **Property 3: Complete information orchestration**
  - **Validates: Requirements 1.3**

- [x] 4. Implement The Shield (Price Intelligence + Safety Guardian)
  - Create combined protection system using pricing and safety knowledge bases
  - Implement fair pricing calculation with cost breakdown analysis from pricing.md
  - Build exploitation detection system using thresholds from pricing knowledge base
  - Create risk assessment system using safety.md data for location and time analysis
  - Add emergency contact provision and safety alert generation from safety knowledge base
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4.1 Build fair pricing calculation system
  - Implement cost breakdown parsing from pricing.md knowledge base
  - Create location premium factors and markup calculations from pricing data
  - Build price verification against knowledge base fair price ranges
  - _Requirements: 2.1, 2.3_

- [x]* 4.2 Write property test for fair price calculation completeness
  - **Property 4: Fair price calculation completeness**
  - **Validates: Requirements 2.1**

- [x] 4.3 Implement exploitation detection system
  - Create price comparison logic using thresholds from pricing.md
  - Build market price analysis with typical charge tracking from knowledge base
  - Implement exploitation flagging and alternative suggestions
  - _Requirements: 2.2, 2.4_

- [x]* 4.4 Write property test for exploitation detection threshold
  - **Property 5: Exploitation detection threshold**
  - **Validates: Requirements 2.2**

- [x] 4.5 Build safety assessment system
  - Implement risk level calculation using safety.md location and time data
  - Create alert generation with categorization from safety knowledge base
  - Build emergency contact provision system using safety.md contact database
  - _Requirements: 2.3, 2.4, 2.5_

- [x] 5. Implement The Scout (Crowd Manager)
  - Create crowd prediction system using crowds.md knowledge base data
  - Implement current and future crowd level predictions using historical data and seasonal factors
  - Build crowd threshold classification using capacity data from crowds knowledge base
  - Create alternative venue suggestion system using crowds.md alternative data
  - Add seasonal factor integration and weather impact analysis
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5.1 Build crowd prediction algorithm
  - Implement historical data analysis using crowds.md seasonal multipliers
  - Create prediction simulation using occupancy percentages from knowledge base
  - Build time-based and weather impact factor calculations
  - _Requirements: 3.1, 3.5_

- [x]* 5.2 Write property test for crowd prediction generation
  - **Property 6: Crowd prediction generation**
  - **Validates: Requirements 3.1**

- [x] 5.3 Implement crowd threshold classification
  - Create status classification logic using crowds.md capacity data
  - Build threshold-based decision system using knowledge base occupancy percentages
  - _Requirements: 3.2_

- [x]* 5.4 Write property test for crowd threshold classification
  - **Property 7: Crowd threshold classification**
  - **Validates: Requirements 3.2**

- [x] 5.5 Build alternative venue suggestion system
  - Create alternative ranking using crowds.md alternative venue data
  - Implement venue similarity matching using knowledge base ratings and travel times
  - _Requirements: 3.3, 3.4_

- [x] 6. Implement The Stays (Accommodation Agent)
  - Create personalized lodging recommendation system using accommodation.md knowledge base
  - Implement persona-based matching for group type, budget, and interests using accommodation data
  - Build comprehensive accommodation database integration with all categories
  - Create safety scoring and fair pricing verification using accommodation knowledge base
  - Add detailed reasoning and feature highlighting for recommendations
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6.1 Build accommodation matching algorithm
  - Implement persona analysis using accommodation.md category and best_for data
  - Create accommodation filtering and ranking system using knowledge base
  - Build safety scoring and amenity alignment logic using accommodation data
  - _Requirements: 4.1, 4.3_

- [x]* 6.2 Write property test for accommodation matching criteria
  - **Property 8: Accommodation matching criteria**
  - **Validates: Requirements 4.1**

- [x] 6.3 Implement accommodation recommendation system
  - Create detailed recommendation generation using accommodation.md data
  - Build comprehensive information display using knowledge base details
  - Implement fair pricing verification and safety score integration
  - _Requirements: 4.2, 4.4, 4.5_
- [x] 7. Implement The Navigator (Experience Curator)
  - Create master orchestration system coordinating all Core 4 and specialized agents
  - Implement budget constraint satisfaction and cost optimization using knowledge base pricing
  - Build scheduling system avoiding peak crowds with travel buffers using crowd data
  - Create safety-first decision making with itinerary modifications using safety knowledge base
  - Generate comprehensive hour-by-hour schedules with complete information and cultural context
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 7.1 Build agent orchestration system
  - Create coordination logic for Shield, Scout, Stays, and all specialist agents
  - Implement data integration combining all agent outputs using knowledge base data
  - Build constraint satisfaction algorithm balancing requirements and cultural context
  - _Requirements: 5.1_

- [x]* 7.2 Write property test for agent orchestration completeness
  - **Property 9: Agent orchestration completeness**
  - **Validates: Requirements 5.1**

- [x] 7.3 Implement budget constraint system
  - Create budget tracking and validation using pricing knowledge base
  - Build cost optimization staying within specified limits
  - Implement budget allocation across activities and services
  - _Requirements: 5.2_

- [x]* 7.4 Write property test for budget constraint satisfaction
  - **Property 10: Budget constraint satisfaction**
  - **Validates: Requirements 5.2**

- [x] 7.5 Build comprehensive itinerary generation
  - Create hour-by-hour schedule generation using all knowledge base domains
  - Implement activity information completeness validation
  - Build explanation system with cultural context and local knowledge injection
  - _Requirements: 5.3, 5.4, 5.5_

- [x] 8. Implement Conversational AI System
  - Create natural language interface with intent detection using intelligence utility
  - Implement personality detection and response adaptation system
  - Build conversation history analysis and learning system
  - Create structured response generation with metadata for frontend
  - Add cultural context injection and local knowledge integration
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 8.1 Build intent detection system
  - Implement intent classification for FOOD, SAFETY, BEACH, ACTIVITIES, GENERAL, etc.
  - Create specialized knowledge response system using knowledge base domains
  - Build context-aware response generation with cultural context
  - _Requirements: 6.1, 6.5_

- [x]* 8.2 Write property test for intent detection accuracy
  - **Property 11: Intent detection accuracy**
  - **Validates: Requirements 6.1**

- [x] 8.3 Implement personality detection and adaptation
  - Create conversation history analysis for personality types (ADVENTUROUS, SAFETY_CONSCIOUS, BUDGET_AWARE, etc.)
  - Build response style adaptation system using personality guidance
  - Implement tone and detail level adjustment based on personality
  - _Requirements: 6.2_

- [x]* 8.4 Write property test for personality adaptation
  - **Property 12: Personality adaptation**
  - **Validates: Requirements 6.2**

- [x] 8.5 Build conversation management system
  - Create structured JSON response generation with metadata
  - Implement cultural context integration and local knowledge injection
  - Build demo response system with local Goan personality for fallback
  - _Requirements: 6.3, 6.4, 6.5_

- [x] 9. Implement Voice Interface System
  - Create speech-to-text conversion with real-time feedback using Web Speech API
  - Implement text-to-speech response generation for AI responses
  - Build voice recording controls with visual indicators and volume visualization
  - Create transcript display with interim and final results
  - Add error handling and fallback to text-based interaction
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 9.1 Build speech-to-text system
  - Implement real-time voice recording with transcript generation
  - Create visual feedback for recording status and volume levels
  - Build transcript display with interim and final results
  - _Requirements: 7.1, 7.2_

- [x] 9.2 Implement text-to-speech system
  - Create voice response generation from AI text responses
  - Build appropriate tone and pacing for different content types
  - Implement voice playback controls and status indicators
  - _Requirements: 7.3_

- [x] 9.3 Build voice interface controls
  - Create intuitive start/stop/cancel voice operation controls
  - Implement error handling with graceful fallback to text
  - Build voice visualizer with recording and playback states
  - _Requirements: 7.4, 7.5_

- [x] 10. Implement Specialized Agent Network
  - Create Food Agent using food_restaurants.md knowledge base
  - Implement Transport Agent using transport.md knowledge base
  - Build Markets Agent using markets.md knowledge base
  - Create Activities Agent using activities.md knowledge base
  - Integrate all agents with main orchestration system and knowledge base
  - _Requirements: 8.1, 9.1, 10.1, 11.1_

- [x] 10.1 Build Food Agent
  - Implement restaurant recommendation system using food_restaurants.md knowledge base
  - Create budget-based filtering (budget/mid-range/premium) with price analysis
  - Build cuisine type matching and location-based recommendations
  - Add local tips, cultural significance, and insider recommendations from knowledge base
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x]* 10.2 Write property test for food recommendation analysis
  - **Property 13: Food recommendation analysis**
  - **Validates: Requirements 8.1**

- [x] 10.3 Build Transport Agent
  - Implement multi-modal transport planning using transport.md knowledge base
  - Create route optimization with GoaMiles, auto-rickshaw, scooter rental, private taxi options
  - Build fare estimation system using knowledge base pricing data
  - Add safety considerations, booking information, and scam warnings from knowledge base
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x]* 10.4 Write property test for transport planning comprehensiveness
  - **Property 14: Transport planning comprehensiveness**
  - **Validates: Requirements 9.1**

- [x] 10.5 Build Markets Agent
  - Implement shopping recommendation system using markets.md knowledge base
  - Create market type analysis (flea, night, local) with timing and specialties
  - Build bargaining tips and authenticity indicator system from knowledge base
  - Add what to buy categories and crowd level information
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x]* 10.6 Write property test for markets recommendation factors
  - **Property 15: Markets recommendation factors**
  - **Validates: Requirements 10.1**

- [x] 10.7 Build Activities Agent
  - Implement activity recommendation system using activities.md knowledge base
  - Create diverse activity type coverage (waterfalls, nightlife, wellness, heritage, adventure)
  - Build difficulty level matching and fitness requirement analysis
  - Add booking information, equipment requirements, and safety guidelines from knowledge base
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x]* 10.8 Write property test for activities matching comprehensiveness
  - **Property 16: Activities matching comprehensiveness**
  - **Validates: Requirements 11.1**

- [x] 11. Build React Frontend Application
  - Create modern chat interface with message bubbles, topic chips, and voice integration
  - Implement saved messages functionality with local storage persistence
  - Build interactive map exploration with Goa location markers using React Leaflet
  - Create voice interface integration with recording visualization and volume indicators
  - Add theme switching (light/dark) and responsive design for various screen sizes
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 11.1 Create chat interface system
  - Build MessageBubble components with proper formatting, timestamps, and action buttons
  - Implement TopicChips for quick conversation starters (beaches, food, activities, safety)
  - Create loading indicators and real-time message updates with conversation flow
  - _Requirements: 12.1, 12.2_

- [x] 11.2 Build saved messages functionality
  - Implement message saving with heart/bookmark actions for assistant responses
  - Create dedicated saved messages view with organization and removal capabilities
  - Build local storage persistence and retrieval system with JSON serialization
  - _Requirements: 12.3_

- [x] 11.3 Implement interactive map exploration
  - Create MapExplore component with Leaflet integration for Goa locations
  - Build location marker system with details and recommendations integration
  - Implement map navigation, zoom functionality, and responsive design
  - _Requirements: 12.5_

- [x] 11.4 Build voice interface integration
  - Create VoiceVisualizer component with recording visualization and volume indicators
  - Implement voice button controls with recording status and duration display
  - Build voice response playback with visual feedback and transcript display
  - Add useVoiceRecorder hook for speech recognition and audio processing
  - _Requirements: 12.2, 12.4_

- [x] 11.5 Implement theme and responsive design
  - Create light/dark theme switching with localStorage persistence
  - Build responsive design for mobile, tablet, and desktop screen sizes
  - Implement PersonalityPanel sidebar with user stats and persona information
  - _Requirements: 12.1, 12.5_

- [x] 12. Implement Express API Server
  - Create comprehensive REST API with individual agent endpoints and health monitoring
  - Implement main orchestration endpoint with request validation and error handling
  - Build conversational chat endpoint with intent detection and personality adaptation
  - Create specialized agent endpoints for food, transport, markets, activities, accommodation
  - Add CORS support, JSON formatting, and comprehensive error handling for frontend integration
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 12.1 Build individual agent endpoints
  - Create dedicated endpoints for each specialized agent with knowledge base integration
  - Implement request validation and response formatting for all agent types
  - Build proper error handling and fallback mechanisms for each endpoint
  - _Requirements: 13.1_

- [x]* 12.2 Write property test for endpoint availability
  - **Property 17: Endpoint availability**
  - **Validates: Requirements 13.1**

- [x] 12.3 Implement main orchestration endpoint
  - Create comprehensive orchestration API with full agent coordination using knowledge base
  - Build request validation for user input completeness with adaptive dispatcher
  - Implement response formatting with all required components and cultural context
  - _Requirements: 13.3_

- [x] 12.4 Build conversational chat endpoint
  - Create chat API with intent detection, personality adaptation, and cultural context
  - Implement conversation history analysis and response generation using AI client
  - Build structured JSON responses with metadata for frontend processing
  - Add database integration for conversation storage and personality tracking
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 12.5 Build health check system
  - Create health endpoint with system status, timestamp, service version, and component health
  - Implement service availability indicators and monitoring capabilities
  - Build comprehensive system status reporting
  - _Requirements: 13.2_

- [x]* 12.6 Write property test for health check completeness
  - **Property 18: Health check completeness**
  - **Validates: Requirements 13.2**

- [x] 12.7 Implement comprehensive error handling
  - Create error response formatting with descriptive messages and guidance
  - Build HTTP status code system for different error types (400, 404, 500)
  - Implement CORS headers, JSON formatting validation, and request size limits
  - _Requirements: 13.4, 13.5_

- [x] 13. Implement Error Handling and Fallback Systems
  - Create multi-tier fallback mechanisms for AI service failures (Groq → Bedrock → Demo)
  - Implement system continuity ensuring user experience during failures with knowledge base fallbacks
  - Build error logging system with appropriate context and monitoring capabilities
  - Create graceful degradation with service level indicators and automatic recovery
  - Add demo mode with local Goan personality for complete offline functionality
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 13.1 Build multi-provider AI system
  - Create Groq API integration as primary provider with error handling
  - Implement AWS Bedrock fallback with proper authentication and error handling
  - Build demo mode with local Goan personality and knowledge base responses
  - Add automatic provider switching and retry logic with exponential backoff
  - _Requirements: 14.1, 14.2_

- [x]* 13.2 Write property test for fallback mechanism activation
  - **Property 19: Fallback mechanism activation**
  - **Validates: Requirements 14.1**

- [x]* 13.3 Write property test for system continuity under failure
  - **Property 20: System continuity under failure**
  - **Validates: Requirements 14.2**

- [x] 13.4 Build agent-specific fallback systems
  - Create knowledge base fallbacks for all agents using domain-specific data
  - Implement heuristic algorithms for price calculation, crowd estimation, and safety assessment
  - Build template-based responses for accommodation, food, transport, markets, and activities
  - Add cultural context injection and local knowledge for demo responses
  - _Requirements: 14.2, 14.3, 14.4_

- [x] 13.5 Implement error logging and monitoring
  - Create comprehensive error logging with context information and stack traces
  - Build error categorization and severity classification system
  - Implement graceful error handling with user-friendly messages
  - _Requirements: 14.4, 14.5_

- [x] 14. Final integration and comprehensive testing
  - Ensure all systems work together seamlessly with knowledge base integration
  - Validate end-to-end functionality from voice input to recommendations
  - Test complete user journeys with all agent coordination and fallback mechanisms
  - Validate performance benchmarks and multi-provider AI system reliability
  - _All Requirements Validated_

- [x] 14.1 Run comprehensive system integration
  - Execute all agent coordination with knowledge base data integration
  - Test multi-provider AI system (Groq → Bedrock → Demo) with all fallback scenarios
  - Validate voice interface integration with speech recognition and synthesis
  - Test conversational AI with intent detection, personality adaptation, and cultural context

- [x] 14.2 Validate end-to-end functionality
  - Test complete user journeys from voice/text input to final recommendations using all knowledge bases
  - Verify all agent coordination and data flow across the system with cultural context
  - Validate frontend-backend integration with chat, saved messages, map, and voice features
  - Test adaptive dispatcher with missing information detection and guidance

- [x] 14.3 Verify knowledge base integration
  - Confirm all 8 knowledge base domains are properly integrated and accessible
  - Validate domain-specific agent responses using accommodation, food, transport, markets, activities, safety, pricing, and crowds data
  - Test knowledge base parsing and data extraction utilities
  - Verify cultural context injection and local knowledge integration

- [x] 14.4 Validate production readiness
  - Test voice interface accuracy with speech recognition and synthesis
  - Verify conversation persistence and saved message functionality with local storage
  - Validate map integration with Leaflet and location-based recommendations
  - Test system performance under various load conditions with multi-provider AI fallbacks
  - Verify error handling graceful degradation and recovery mechanisms across all components